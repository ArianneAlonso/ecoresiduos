import type { Response } from "express";
import { AppDataSource } from "../data-source";
import { EventoAmbiental } from "../entidades/EventoAmbiental";
import { Usuario } from "../entidades/Usuarios";
import { MoreThanOrEqual } from "typeorm";
import type { DeepPartial } from "typeorm";
import type { AuthenticatedRequest } from "../interfaces/AutenticatedRequest"; // Importa tu interfaz

const eventRepository = AppDataSource.getRepository(EventoAmbiental);
const usuarioRepository = AppDataSource.getRepository(Usuario);

export class EventosController {
  // 1. OBTENER TODOS LOS EVENTOS (Con estado de inscripción)
  public getEvents = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { upcoming } = req.query;

      // 1. Extraemos el ID del usuario autenticado.
      // Asegúrate de usar la propiedad exacta que definiste en tu JWT (id o idUsuario)
      const idUsuarioActual = req.user?.id;
      console.log("ID del usuario autenticado:", idUsuarioActual);

      let where: any = {};
      if (upcoming === "true") {
        where.fecha = MoreThanOrEqual(new Date());
      }

      const events = await eventRepository.find({
        where: where,
        relations: ["usuarios"], // Cargamos la relación Many-to-Many
        order: { fecha: "ASC" },
      });

      const data = events.map((event) => {
        // 2. Comparamos asegurándonos de que ambos sean números
        const estaInscrito =
          event.usuarios?.some(
            (u) => Number(u.idUsuario) === Number(idUsuarioActual),
          ) || false;

        return {
          ...event,
          inscrito: estaInscrito,
          totalAsistentes: event.usuarios?.length || 0,
          usuarios: undefined, // Limpiamos la respuesta
        };
      });

      return res.json({ ok: true, data });
    } catch (error: any) {
      console.error("Error al obtener eventos:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor." });
    }
  };
  public getEventById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(String(req.params.id));
      if (isNaN(id))
        return res.status(400).json({ ok: false, mensaje: "ID inválido" });

      const event = await eventRepository.findOneBy({ idEvento: id });

      if (!event)
        return res
          .status(404)
          .json({ ok: false, mensaje: "Evento no encontrado." });

      return res.json({ ok: true, data: event });
    } catch (error) {
      return res.status(500).json({ ok: false, mensaje: "Error interno." });
    }
  };
  // 2. INSCRIBIR USUARIO A EVENTO
  public inscribirUsuario = async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    try {
      const idEvento = parseInt(String(req.params.idEvento));
      const idUsuario = req.user?.id;

      if (!idUsuario) {
        return res
          .status(401)
          .json({ ok: false, mensaje: "Sesión no válida." });
      }

      const evento = await eventRepository.findOne({
        where: { idEvento },
        relations: ["usuarios"],
      });

      if (!evento) {
        return res
          .status(404)
          .json({ ok: false, mensaje: "Evento no encontrado." });
      }

      const yaInscrito = evento.usuarios?.some(
        (u) => u.idUsuario === idUsuario,
      );
      if (yaInscrito) {
        return res
          .status(400)
          .json({ ok: false, mensaje: "Ya estás inscrito en este evento." });
      }

      const usuario = await usuarioRepository.findOneBy({ idUsuario });
      if (!usuario) {
        return res
          .status(404)
          .json({ ok: false, mensaje: "Usuario no encontrado." });
      }

      evento.usuarios = [...(evento.usuarios || []), usuario];
      await eventRepository.save(evento);

      return res.json({ ok: true, mensaje: "Inscripción exitosa." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error al procesar inscripción." });
    }
  };

  // 3. OBTENER EVENTOS POR USUARIO (Historial)
  public getEventsByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const idUsuario = parseInt(String(req.params.id));

      if (isNaN(idUsuario)) {
        return res
          .status(400)
          .json({ ok: false, mensaje: "ID de usuario inválido." });
      }

      const eventos = await eventRepository
        .createQueryBuilder("evento")
        .innerJoin("evento.usuarios", "usuario")
        .where("usuario.id_usuario = :idUsuario", { idUsuario })
        .orderBy("evento.fecha", "DESC")
        .getMany();

      return res.json({ ok: true, data: eventos });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error al obtener eventos del usuario." });
    }
  };

  // 4. CREAR EVENTO
  public createEvent = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { nombre, fecha, puntosOtorgados, latitud, longitud } = req.body;

      if (
        !nombre ||
        !fecha ||
        latitud === undefined ||
        longitud === undefined
      ) {
        return res
          .status(400)
          .json({ ok: false, mensaje: "Faltan campos obligatorios." });
      }

      const newEvent = eventRepository.create({
        ...req.body,
        fecha: new Date(fecha),
        puntosOtorgados: Number(puntosOtorgados),
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
      } as DeepPartial<EventoAmbiental>);

      await eventRepository.save(newEvent);

      return res.status(201).json({ ok: true, data: newEvent });
    } catch (error: any) {
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error al crear evento." });
    }
  };
  public updateEvent = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(String(req.params.id));
      const updateData = req.body;

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ ok: false, mensaje: "ID de evento inválido." });
      }

      let eventToUpdate = await eventRepository.findOneBy({ idEvento: id });

      if (!eventToUpdate) {
        return res
          .status(404)
          .json({ ok: false, mensaje: "Evento no encontrado." });
      }

      eventRepository.merge(eventToUpdate, updateData);
      const updatedEvent = await eventRepository.save(eventToUpdate);

      return res.json({ ok: true, data: updatedEvent });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error al actualizar." });
    }
  };
  // 5. ACTUALIZAR Y ELIMINAR (Se mantienen como los tenías, pero con AuthenticatedRequest)
  public deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(String(req.params.id));
      const result = await eventRepository.delete(id);
      if (result.affected === 0)
        return res.status(404).json({ ok: false, mensaje: "No encontrado." });
      return res.json({ ok: true, mensaje: "Evento eliminado." });
    } catch (error: any) {
      return res.status(500).json({ ok: false, mensaje: "Error al eliminar." });
    }
  };
}
