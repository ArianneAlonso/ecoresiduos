import type { Request, Response } from "express";
import { Usuario } from "../entidades/Usuarios";
import { AppDataSource } from "../data-source";
import { EntregaMaterial } from "../entidades/EntregaMaterial";
import { PuntoEcologico, TipoTransaccion } from "../entidades/PuntoEcologico"; // Se importa TipoTransaccion para el filtro
import { Repository } from "typeorm";

// Definición de Interfaz para el Request autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: number; // Propiedad que contiene el ID del usuario autenticado
    rol: string; // Propiedad que contiene el rol del usuario autenticado
  };
}

// ----------------------------------------------------
// OBTENER PERFIL DEL USUARIO AUTENTICADO
// ----------------------------------------------------

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "No autenticado. Por favor, inicie sesión." });
    }

    const userRepository: Repository<Usuario> =
      AppDataSource.getRepository(Usuario);
    const entregaRepository: Repository<EntregaMaterial> =
      AppDataSource.getRepository(EntregaMaterial);
    const puntosEcologicosRepository: Repository<PuntoEcologico> =
      AppDataSource.getRepository(PuntoEcologico); // A. Buscar al usuario (excluyendo la contraseña)

    const user = await userRepository.findOne({
      where: { idUsuario: userId },
      select: [
        "idUsuario",
        "nombre",
        "email",
        "rol",
        "fechaRegistro",
        "puntosAcumulados",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // --- B. OBTENER HISTORIAL DE ENTREGAS ---
    // Incluye relaciones con Material y Contenedor para mostrar detalles
    const historialEntregas = await entregaRepository.find({
      where: { idUsuario: userId },
      order: { fechaEntrega: "DESC" },
      relations: ["material", "contenedor"],
    });

    // --- C. OBTENER PARTICIPACIÓN EN EVENTOS (VÍA PUNTOS_ECOLOGICOS) ---
    // Filtra las transacciones por el tipo 'evento'
    const participacionEventos = await puntosEcologicosRepository.find({
      where: {
        idUsuario: userId,
        tipoTransaccion: TipoTransaccion.EVENTO, // Usa el enum correcto
      },
      order: { fecha: "DESC" },
      // Si hay una relación definida con 'eventoAmbiental', se puede añadir aquí: relations: ["eventoAmbiental"]
    });

    // Mapear los datos de las entregas
    const entregasDetalladas = historialEntregas.map((entrega) => ({
      id: entrega.idEntrega,
      material: entrega.material ? entrega.material.nombre : "Desconocido", // Verifica si la relación material existe
      pesoKg: entrega.pesoKg,
      puntosGanados: entrega.puntosGanados,
      fecha: entrega.fechaEntrega,
      estado: (entrega as any).estadoPuntos, // Accede al nuevo campo de estado
      contenedor: entrega.contenedor
        ? entrega.contenedor.nombreIdentificador
        : "A domicilio",
    }));

    // Mapear los datos de eventos
    const eventosParticipados = participacionEventos.map((evento) => ({
      idTransaccion: evento.idTransaccion,
      puntosGanados: evento.puntos,
      fecha: evento.fecha,
      // Si usaste relations: ["eventoAmbiental"], podrías acceder aquí:
      // nombreEvento: evento.eventoAmbiental.nombre
      idReferenciaEvento: evento.idReferencia, // Muestra el ID de referencia para consulta manual
    }));

    return res.json({
      ...user,
      historialEntregas: entregasDetalladas,
      participacionEventos: eventosParticipados,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// ----------------------------------------------------
// ACTUALIZAR PERFIL DEL USUARIO AUTENTICADO
// ----------------------------------------------------

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { nombre, email, contraseña } = req.body;

    // 1. Validar autenticación
    if (!userId) {
      return res.status(401).json({ message: "No autenticado." });
    }

    // 2. Bloquear actualización de contraseña (requiere endpoint dedicado y hashing)
    if (contraseña) {
      // Si deseas implementarlo aquí, tendrías que usar: user.password = await bcrypt.hash(contraseña, 10);
      return res.status(400).json({
        message:
          "La contraseña debe ser actualizada mediante un endpoint seguro dedicado.",
      });
    }

    const userRepository: Repository<Usuario> =
      AppDataSource.getRepository(Usuario);
    let user = await userRepository.findOneBy({ idUsuario: userId });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    } // 3. Aplicar actualizaciones

    if (nombre) user.nombre = nombre;
    if (email) user.email = email;

    await userRepository.save(user); // 4. Devolver el perfil actualizado (sin contraseña)

    const updatedUser = await userRepository.findOne({
      where: { idUsuario: userId },
      select: [
        "idUsuario",
        "nombre",
        "email",
        "rol",
        "fechaRegistro",
        "puntosAcumulados",
      ],
    });

    return res.json({
      message: "Perfil actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error); // Manejo de error de duplicidad de email (código 23505 de PostgreSQL)
    const err = error as any;

    if (err.code === "23505") {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está en uso." });
    }
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
