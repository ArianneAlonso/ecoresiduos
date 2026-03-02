import type { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EventoAmbiental } from "../entidades/EventoAmbiental";
import { MoreThanOrEqual } from "typeorm";
import type { DeepPartial } from "typeorm";

const eventRepository = AppDataSource.getRepository(EventoAmbiental);

export class EventosController {
  // ----------------------------------------------------
  // OBTENER TODOS LOS EVENTOS
  // ----------------------------------------------------
  public getEvents = async (req: Request, res: Response) => {
    try {
      const { upcoming } = req.query;
      let where: any = {};

      if (upcoming === "true") {
        where.fecha = MoreThanOrEqual(new Date());
      }

      const events = await eventRepository.find({
        where: where,
        order: { fecha: "ASC" },
      });

      return res.json({ ok: true, data: events });
    } catch (error: any) {
      console.error("Error al obtener eventos:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor." });
    }
  };

  // ----------------------------------------------------
  // CREAR NUEVO EVENTO (Con Coordenadas)
  // ----------------------------------------------------
  public createEvent = async (req: Request, res: Response) => {
    try {
      const {
        nombre,
        descripcion,
        fecha,
        ubicacion,
        puntosOtorgados,
        latitud,
        longitud,
      } = req.body;

      // Validación extendida para incluir coordenadas si son obligatorias en tu lógica
      if (
        !nombre ||
        !fecha ||
        puntosOtorgados === undefined ||
        latitud === undefined ||
        longitud === undefined
      ) {
        return res.status(400).json({
          ok: false,
          mensaje:
            "Faltan campos obligatorios: nombre, fecha, puntosOtorgados, latitud y longitud.",
        });
      }

      const newEvent = eventRepository.create({
        nombre,
        descripcion,
        fecha: new Date(fecha),
        ubicacion,
        puntosOtorgados: Number(puntosOtorgados),
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
      } as DeepPartial<EventoAmbiental>);

      await eventRepository.save(newEvent);

      return res.status(201).json({
        ok: true,
        mensaje: "Evento creado exitosamente con coordenadas.",
        data: newEvent,
      });
    } catch (error: any) {
      console.error("Error al crear evento:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor." });
    }
  };

  // ----------------------------------------------------
  // ACTUALIZAR EVENTO (Incluyendo Coordenadas)
  // ----------------------------------------------------
  public updateEvent = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
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

      // Fusionar datos (esto cubrirá latitud y longitud si vienen en el body)
      eventRepository.merge(eventToUpdate, updateData);

      // Limpieza y formateo de datos específicos
      if (updateData.fecha) eventToUpdate.fecha = new Date(updateData.fecha);
      if (updateData.latitud)
        eventToUpdate.latitud = parseFloat(updateData.latitud);
      if (updateData.longitud)
        eventToUpdate.longitud = parseFloat(updateData.longitud);

      const updatedEvent = await eventRepository.save(eventToUpdate);

      return res.json({
        ok: true,
        mensaje: "Evento actualizado exitosamente.",
        data: updatedEvent,
      });
    } catch (error: any) {
      console.error("Error al actualizar evento:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor." });
    }
  };

  // ----------------------------------------------------
  // OBTENER DETALLE DE UN EVENTO POR ID (Público)
  // ----------------------------------------------------
  public getEventById = async (req: Request, res: Response) => {
    try {
      // ** CORRECCIÓN: Usar req.params.id as string **
      const id = parseInt(req.params.id as string);

      // La ruta ya garantiza que 'id' existe, pero verificamos que sea un número válido.
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ ok: false, mensaje: "ID de evento inválido." });
      }

      const event = await eventRepository.findOneBy({ idEvento: id });

      if (!event) {
        return res
          .status(404)
          .json({ ok: false, mensaje: "Evento no encontrado." });
      }

      return res.json({ ok: true, data: event });
    } catch (error: any) {
      console.error("Error al obtener evento por ID:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor." });
    }
  };

  // ELIMINAR EVENTO (Solo Admin/Operador)
  // ----------------------------------------------------
  public deleteEvent = async (req: Request, res: Response) => {
    try {
      // ** CORRECCIÓN: Usar req.params.id as string **
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ ok: false, mensaje: "ID de evento inválido." });
      }

      const result = await eventRepository.delete(id);

      if (result.affected === 0) {
        return res
          .status(404)
          .json({ ok: false, mensaje: "Evento no encontrado." });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "Evento ambiental eliminado exitosamente.",
      });
    } catch (error: any) {
      console.error("Error al eliminar evento:", error);
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error interno del servidor." });
    }
  };
  public getEventsByUser = async (req: Request, res: Response) => {
    try {
      const idUsuario = parseInt(String(req.params.id));

      if (isNaN(idUsuario)) {
        return res.status(400).json({ ok: false, mensaje: "ID inválido" });
      }

      const eventos = await eventRepository.find({
        where: {
          usuarios: {
            idUsuario: idUsuario, // Filtra por la propiedad ID dentro de la relación
          },
        },
        order: { fecha: "DESC" },
      });

      return res.json({ ok: true, eventos });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, mensaje: "Error de servidor" });
    }
  };
}
