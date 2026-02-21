import type { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entidades/Usuarios.js";
import type { DeepPartial } from "typeorm";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import type { JwtPayload, UserRole } from "../interfaces/JwtPayload.js";
import type { CookieOptions } from "express";
import type { AuthenticatedRequest } from "../interfaces/AutenticatedRequest"; // Importación requerida para verificarSesion

declare module "express-session" {
  interface SessionData {
    user?: JwtPayload;
  }
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const isProduction = process.env.NODE_ENV === "production";

// Obtenemos el repositorio de TypeORM para interactuar con la tabla Usuario
const usuarioRepository = AppDataSource.getRepository(Usuario);

/**
 * Clase que contiene la lógica de negocio para las operaciones CRUD y autenticación de usuarios.
 */
export class UsuariosController {
  /**
   * GET /usuarios - Obtiene la lista de todos los usuarios.
   */
  async obtenerUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await usuarioRepository.find();
      return res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }
  /**
   * GET /usuarios/:id - Obtiene un usuario por su ID.
   */

  async obtenerUsuarioPorId(req: Request, res: Response) {
    const idParam = req.params.id;

    if (!idParam) {
      return res
        .status(400)
        .json({ mensaje: "El ID proporcionado no es válido." });
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ mensaje: "El ID proporcionado no es válido." });
    }

    try {
      const usuario = await usuarioRepository.findOneBy({ idUsuario: id });
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      return res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }
  /**
   * POST /usuarios/registrar - Crea un nuevo usuario (Registro).
   * RESPUESTA CONSISTENTE: Ahora devuelve { ok: true, role: ..., mensaje: ... }
   */

  async crearUsuario(req: Request, res: Response) {
    const { nombre, email, password } = req.body;
    const rol = req.body.rol || "usuario";

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false, 
        mensaje: "Faltan campos requeridos: nombre, email y password.",
      });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nuevoUsuario = usuarioRepository.create({
        nombre,
        email,
        password: hashedPassword,
        rol,
      } as DeepPartial<Usuario>);

      await usuarioRepository.save(nuevoUsuario);

      // Generar JWT (flujo de registro)
      const token = jwt.sign(
        {
          id: nuevoUsuario.idUsuario,
          email: nuevoUsuario.email,
          role: nuevoUsuario.rol, // CORREGIDO: Usar 'role' en el payload
        },
        JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: isProduction ? "none" : "lax",
      };
      res.cookie("authToken", token, cookieOptions);

      // *** RESPUESTA CONSISTENTE: Usamos 'role' ***
      return res.status(201).json({
        ok: true,
        role: nuevoUsuario.rol,
        mensaje: "Usuario registrado exitosamente",
      });
    } catch (error: any) {
      if (error.code === "23505") {
        return res.status(409).json({
          ok: false, 
          mensaje: "El email ya está registrado.",
        });
      }

      console.error("Error al crear usuario:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor" }); 
    }
  }
  /**
   * POST /usuarios/login - Inicia sesión.
   * RESPUESTA CONSISTENTE: Ahora devuelve { ok: true, role: ..., mensaje: ... }
   */

  public iniciarSesion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Se requiere email y password." });
    }

    try {
      const usuario = await usuarioRepository.findOne({
        where: { email },
        select: ["idUsuario", "nombre", "email", "password", "rol"],
      });

      if (!usuario) {
        return res
          .status(401)
          .json({ ok: false, mensaje: "Credenciales inválidas" });
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);

      if (!passwordValida) {
        return res
          .status(401)
          .json({ ok: false, mensaje: "Credenciales inválidas" });
      }

      const userPayload: JwtPayload = {
        id: usuario.idUsuario,
        email: usuario.email,
        role: usuario.rol as UserRole,
      };
      const esSesionDeServidor =
        userPayload.role === "administrador" || userPayload.role === "operador";

      if (esSesionDeServidor) {
        // A. Administradores/Operarios: Usan Sesión de Servidor
        req.session.user = userPayload;

        // *** RESPUESTA CONSISTENTE: Usamos 'role' ***
        return res.status(200).json({
          ok: true,
          role: userPayload.role,
          mensaje: "Inicio de sesión exitoso",
        });
      } else {
        // B. Usuarios Estándar: Usan JWT
        const token = jwt.sign(
          { id: usuario.idUsuario, email: usuario.email, role: usuario.rol }, // CORREGIDO: Usar 'role' en el payload
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        const cookieOptions: CookieOptions = {
          httpOnly: true, // CLAVE: No visible a JS del frontend
          secure: isProduction,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: isProduction ? "none" : "lax",
          path: "/"
        };

        res.cookie("authToken", token, cookieOptions); // 🛑 Aquí se "devuelve" el token via cookie

        // *** RESPUESTA CONSISTENTE: Usamos 'role' ***
        return res.status(200).json({
          ok: true,
          role: userPayload.role,
          mensaje: "Inicio de sesión exitoso",
        });
      }
    } catch (error) {
      console.error("Error en iniciar sesión:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor" });
    }
  };
  /**
   * POST /usuarios/logout - Cierra la sesión eliminando las cookies relevantes.
   */

  async cerrarSesion(req: Request, res: Response) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error al destruir la sesión:", err);
        }

        res.clearCookie("authToken");

        if (!err) {
          res.clearCookie(process.env.SESSION_NAME || "connect.sid");
        }
        
        // RESPUESTA MODIFICADA PARA CUMPLIR EL FORMATO SOLICITADO
        return res.status(200).json({ ok: true, mensaje: "Sesión cerrada exitosamente" });
      });
    } catch (error) {
      console.error("Error al cerrar sesión :", error);
      return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
  }

  /**
   * GET /usuarios/session - Verifica la sesión actual y devuelve los datos del usuario.
   *
   * Utiliza el tipado AuthenticatedRequest que garantiza que req.user ya está disponible.
   */
  public verificarSesion(req: AuthenticatedRequest, res: Response) {
    // Si la solicitud llega aquí, req.user está garantizado por SessionValidator.
    if (req.user) {
      return res.status(200).json({
        ok: true,
        mensaje: "Usuario autenticado.",
        user: req.user,
      });
    }

    // Esta línea es de fallback, SessionValidator ya debería haber enviado un 401 si no hay usuario.
    return res.status(401).json({
        ok: false,
        mensaje: "Usuario no autenticado."
    });
  }
}