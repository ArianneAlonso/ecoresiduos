import type { Response } from "express";
import { AppDataSource } from "../data-source";
import { EntregaMaterial, EstadoPuntos } from "../entidades/EntregaMaterial";
import { Usuario } from "../entidades/Usuarios";
import type { AuthenticatedRequest } from "../interfaces/AutenticatedRequest";
import { Repository } from "typeorm";

export class EntregasController {
  private readonly entregaRepository: Repository<EntregaMaterial> =
    AppDataSource.getRepository(EntregaMaterial);
  private readonly usuarioRepository: Repository<Usuario> =
    AppDataSource.getRepository(Usuario);

  /**
   * POST /entregas
   * Crea una solicitud de retiro desde la App Mobile
   */
  public crearEntrega = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const idUsuario = req.user!.id;
      const {
        materiales, // Array: ["Plástico", "Vidrio"]
        tipoEnvase, // String: "bolsa-consorcio"
        direccion, // String: "Av. Principal 123"
        horarioPreferencia, // String: "lunes-mañana"
        latitud,
        longitud,
      } = req.body;

      // 1. Validaciones básicas de la solicitud
      if (!materiales || materiales.length === 0) {
        res
          .status(400)
          .json({ message: "Debe seleccionar al menos un material." });
        return;
      }

      if (!direccion || !horarioPreferencia) {
        res
          .status(400)
          .json({ message: "Dirección y horario son obligatorios." });
        return;
      }

      // 2. Creamos el registro en la base de datos
      // Nota: pesoKg y puntosGanados inician en 0 hasta que el recolector los valide
      const nuevaSolicitud = this.entregaRepository.create({
        idUsuario,
        detalleMateriales: materiales.join(", "), // Guardamos la lista como texto
        tipoEnvase,
        direccion,
        horarioPreferencia,
        latitud: latitud || null,
        longitud: longitud || null,
        estadoPuntos: EstadoPuntos.PENDIENTE,
        pesoKg: 0,
        puntosGanados: 0,
        fechaSolicitud: new Date(),
      });

      const solicitudGuardada =
        await this.entregaRepository.save(nuevaSolicitud);

      res.status(201).json({
        ok: true,
        message:
          "¡Solicitud de retiro creada! Pronto un recolector pasará por tu domicilio.",
        data: solicitudGuardada,
      });
    } catch (error) {
      console.error("Error al crear solicitud de entrega:", error);
      res
        .status(500)
        .json({ message: "Error interno al procesar la solicitud." });
    }
  };

  /**
   * GET /entregas/mis-entregas
   * Lista el historial de solicitudes del usuario logueado
   */
  public getEntregasByUsuario = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const idUsuario = req.user!.id;

      const entregas = await this.entregaRepository.find({
        where: { idUsuario: idUsuario },
        order: { fechaSolicitud: "DESC" },
      });

      res.status(200).json({
        ok: true,
        entregas,
      });
    } catch (error) {
      console.error("Error al obtener entregas del usuario:", error);
      res.status(500).json({ message: "Error al obtener tu historial." });
    }
  };

  /**
   * PATCH /entregas/:id/validar (PARA EL ADMINISTRADOR)
   * El recolector pesa la bolsa y asigna los puntos reales
   */
  public validarEntrega = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const { pesoReal, puntosCalculados } = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entrega = await queryRunner.manager.findOne(EntregaMaterial, {
        where: { idEntrega: Number(id) },
      });

      if (!entrega || entrega.estadoPuntos !== "pendiente") {
        res
          .status(404)
          .json({ message: "Solicitud no encontrada o ya procesada." });
        return;
      }

      // 1. Actualizar la entrega
      entrega.pesoKg = pesoReal;
      entrega.puntosGanados = puntosCalculados;
      entrega.estadoPuntos = EstadoPuntos.CONFIRMADO;
      entrega.fechaEntrega = new Date();
      await queryRunner.manager.save(entrega);

      // 2. Sumar puntos al perfil del usuario
      await queryRunner.manager.increment(
        Usuario,
        { idUsuario: entrega.idUsuario },
        "puntosAcumulados",
        puntosCalculados,
      );

      await queryRunner.commitTransaction();
      res
        .status(200)
        .json({ message: "Entrega completada y puntos asignados." });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      res.status(500).json({ message: "Error al validar la entrega." });
    } finally {
      await queryRunner.release();
    }
  };
  public getAllEntregas = async (
    req: any, // Puedes usar Request de express
    res: Response,
  ): Promise<void> => {
    try {
      const entregas = await this.entregaRepository.find({
        order: { fechaSolicitud: "DESC" },
        // Traemos los datos del usuario para que el admin sepa de quién es
        relations: ["usuario"],
      });

      res.status(200).json({
        ok: true,
        entregas,
      });
    } catch (error) {
      console.error("Error al obtener todas las entregas:", error);
      res.status(500).json({ message: "Error al obtener el listado global." });
    }
  };
  public confirmarEntrega = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const { pesoReal, puntosAOtorgar } = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entrega = await queryRunner.manager.findOne(EntregaMaterial, {
        where: { idEntrega: Number(id) },
      });

      if (!entrega || entrega.estadoPuntos !== EstadoPuntos.PENDIENTE) {
        res
          .status(404)
          .json({ message: "Solicitud no encontrada o ya procesada." });
        return;
      }

      // 1. Actualizamos la solicitud
      entrega.pesoKg = pesoReal;
      entrega.puntosGanados = puntosAOtorgar;
      entrega.estadoPuntos = EstadoPuntos.CONFIRMADO;
      entrega.fechaEntrega = new Date();
      await queryRunner.manager.save(entrega);

      // 2. Acreditamos los puntos al usuario
      await queryRunner.manager.increment(
        Usuario,
        { idUsuario: entrega.idUsuario },
        "puntosAcumulados",
        puntosAOtorgar,
      );

      await queryRunner.commitTransaction();
      res
        .status(200)
        .json({
          ok: true,
          message: "Entrega confirmada y puntos acreditados.",
        });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      res.status(500).json({ message: "Error al confirmar la entrega." });
    } finally {
      await queryRunner.release();
    }
  };
}
