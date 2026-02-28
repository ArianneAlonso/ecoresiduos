import type { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { EventoAmbiental } from '../entidades/EventoAmbiental'; 
import { MoreThanOrEqual } from 'typeorm';
import type { DeepPartial } from "typeorm";

const eventRepository = AppDataSource.getRepository(EventoAmbiental);

export class EventosController {
    
    // ----------------------------------------------------
    // OBTENER TODOS LOS EVENTOS (Público)
    // ----------------------------------------------------
    public getEvents = async (req: Request, res: Response) => {
        try {
            // upcoming es de tipo string | string[] | undefined.
            const { upcoming } = req.query; 
            let where: any = {};

            // Filtro para próximos eventos (upcoming=true)
            if (upcoming === 'true') {
                where.fecha = MoreThanOrEqual(new Date());
            }

            const events = await eventRepository.find({
                where: where,
                order: {
                    fecha: 'ASC' // Ordenar por fecha, los más próximos primero
                }
            });

            return res.json({ ok: true, data: events });
        } catch (error: any) {
            console.error('Error al obtener eventos:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
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
                return res.status(400).json({ ok: false, mensaje: 'ID de evento inválido.' });
            }
            
            const event = await eventRepository.findOneBy({ idEvento: id });

            if (!event) {
                return res.status(404).json({ ok: false, mensaje: 'Evento no encontrado.' });
            }

            return res.json({ ok: true, data: event });
        } catch (error: any) {
            console.error('Error al obtener evento por ID:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
        }
    };

    // ----------------------------------------------------
    // CREAR NUEVO EVENTO (Solo Admin/Operador)
    // ----------------------------------------------------
    public createEvent = async (req: Request, res: Response) => {
        try {
            const { nombre, descripcion, fecha, ubicacion, puntosOtorgados, latitud, longitud } = req.body;

            if (!nombre || !fecha || puntosOtorgados === undefined) { // Revisar puntosOtorgados
                return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios: nombre, fecha y puntosOtorgados.' });
            }

            const newEvent = eventRepository.create({
                nombre,
                descripcion,
                fecha: new Date(fecha), // Asegurarse de que sea un objeto Date
                ubicacion,
                puntosOtorgados,
                latitud,
                longitud
            } as DeepPartial<EventoAmbiental>);

            await eventRepository.save(newEvent);

            return res.status(201).json({ 
                ok: true, 
                mensaje: 'Evento ambiental creado exitosamente.',
                data: newEvent
            });
        } catch (error: any) {
            console.error('Error al crear evento:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
        }
    };

    // ----------------------------------------------------
    // ACTUALIZAR EVENTO (Solo Admin/Operador)
    // ----------------------------------------------------
    public updateEvent = async (req: Request, res: Response) => {
        try {
            // ** CORRECCIÓN: Usar req.params.id as string **
            const id = parseInt(req.params.id as string);
            const updateData = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ ok: false, mensaje: 'ID de evento inválido.' });
            }

            let eventToUpdate = await eventRepository.findOneBy({ idEvento: id });

            if (!eventToUpdate) {
                return res.status(404).json({ ok: false, mensaje: 'Evento no encontrado.' });
            }

            // Aplicar las actualizaciones. TypeORM maneja la sobrescritura.
            eventRepository.merge(eventToUpdate, updateData);
            
            // Asegurar que la fecha se convierta a Date si se proporciona
            if (updateData.fecha) {
                eventToUpdate.fecha = new Date(updateData.fecha);
            }

            const updatedEvent = await eventRepository.save(eventToUpdate);

            return res.json({ 
                ok: true, 
                mensaje: 'Evento ambiental actualizado exitosamente.',
                data: updatedEvent
            });
        } catch (error: any) {
            console.error('Error al actualizar evento:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
        }
    };

    // ----------------------------------------------------
    // ELIMINAR EVENTO (Solo Admin/Operador)
    // ----------------------------------------------------
    public deleteEvent = async (req: Request, res: Response) => {
        try {
            // ** CORRECCIÓN: Usar req.params.id as string **
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ ok: false, mensaje: 'ID de evento inválido.' });
            }

            const result = await eventRepository.delete(id);

            if (result.affected === 0) {
                return res.status(404).json({ ok: false, mensaje: 'Evento no encontrado.' });
            }

            return res.status(200).json({ ok: true, mensaje: 'Evento ambiental eliminado exitosamente.' });
        } catch (error: any) {
            console.error('Error al eliminar evento:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
        }
    };
}