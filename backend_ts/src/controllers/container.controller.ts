import type { Request, Response } from "express";
import { Contenedor } from "../entidades/Contenedor";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";

// Repositorio de Contenedores (Instanciado una vez)
const contenedorRepository: Repository<Contenedor> =
    AppDataSource.getRepository(Contenedor);

/**
 * Clase controladora para manejar todas las operaciones CRUD relacionadas con los Contenedores.
 */
export class ContenedorController {
    /**
     * @route POST /contenedores
     * @desc Crea un nuevo contenedor de reciclaje en la base de datos.
     * @access Restringido (Deberia ser 'administrador'/'operador' en un entorno real)
     */
    public async createContenedor(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const {
                nombreIdentificador,
                direccion,
                latitud,
                longitud,
                materialesAceptados,
                diasHorariosRecoleccion,
            } = req.body;

            // Validacion basica
            if (
                !nombreIdentificador ||
                latitud === undefined ||
                longitud === undefined ||
                !materialesAceptados
            ) {
                return res.status(400).json({
                    message:
                        "Faltan campos obligatorios o son invalidos: nombreIdentificador, latitud, longitud, o materialesAceptados.",
                });
            }

            // Crear una nueva instancia de Contenedor
            const nuevoContenedor = contenedorRepository.create({
                nombreIdentificador,
                direccion: direccion || "Direccion no especificada",
                // Asegurar que latitud y longitud son numeros
                latitud: parseFloat(latitud),
                longitud: parseFloat(longitud),
                materialesAceptados,
                diasHorariosRecoleccion: diasHorariosRecoleccion || null,
            });

            // Guardar en la base de datos
            await contenedorRepository.save(nuevoContenedor);

            return res.status(201).json({
                message: "Contenedor creado exitosamente.",
                contenedor: nuevoContenedor,
            });
        } catch (error: Error | any) {
            // Manejo de errores especificos (ej. nombreIdentificador duplicado)
            if (error.code === "23505") {
                // Codigo de error de PostgreSQL para UNIQUE violation
                return res.status(409).json({
                    message:
                        "Error: Ya existe un contenedor con este nombre identificador.",
                });
            }
            console.error("Error al crear contenedor:", error);
            return res.status(500).json({
                message: "Error interno del servidor al crear el contenedor.",
            });
        }
    }

    /**
     * @route GET /contenedores
     * @desc Obtiene una lista de todos los contenedores registrados.
     * @access Public
     */
    public async getContenedores(req: Request, res: Response): Promise<Response> {
        try {
            const contenedores = await contenedorRepository.find();

            return res.status(200).json({
                message: "Lista de contenedores obtenida exitosamente.",
                contenedores: contenedores,
            });
        } catch (error) {
            console.error("Error al obtener contenedores:", error);
            return res.status(500).json({
                message:
                    "Error interno del servidor al obtener la lista de contenedores.",
            });
        }
    }

    /**
     * @route GET /contenedores/:id
     * @desc Obtiene un contenedor por su ID.
     * @access Public
     */
    public async getContenedorById(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID de contenedor invalido." });
            }

            const contenedor = await contenedorRepository.findOne({
                where: { idContenedor: id },
            });

            if (!contenedor) {
                return res.status(404).json({ message: "Contenedor no encontrado." });
            }

            return res.status(200).json({
                message: "Contenedor obtenido exitosamente.",
                contenedor: contenedor,
            });
        } catch (error) {
            console.error("Error al obtener contenedor por ID:", error);
            return res.status(500).json({
                message: "Error interno del servidor al obtener el contenedor.",
            });
        }
    }

    /**
     * @route PUT /contenedores/:id
     * @desc Actualiza la informacion de un contenedor existente por su ID.
     * @access Restringido (Deberia ser 'administrador'/'operador')
     */
    public async updateContenedor(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const id = parseInt(req.params.id as string);
            const updateData = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID de contenedor invalido." });
            }

            // 1. Buscar el contenedor existente
            let contenedor = await contenedorRepository.findOne({
                where: { idContenedor: id },
            });

            if (!contenedor) {
                return res.status(404).json({ message: "Contenedor no encontrado para actualizar." });
            }

            // 2. Aplicar las actualizaciones. 
            // Esto garantiza que solo los campos proporcionados se actualicen.
            // Los campos de latitud y longitud se convierten a numero si estan presentes.
            contenedorRepository.merge(contenedor, {
                ...updateData,
                ...(updateData.latitud !== undefined && { latitud: parseFloat(updateData.latitud) }),
                ...(updateData.longitud !== undefined && { longitud: parseFloat(updateData.longitud) }),
            });

            // 3. Guardar los cambios
            const resultado = await contenedorRepository.save(contenedor);

            return res.status(200).json({
                message: "Contenedor actualizado exitosamente.",
                contenedor: resultado,
            });
        } catch (error: Error | any) {
            // Manejo de error de duplicidad si se intenta actualizar el nombreIdentificador
            if (error.code === "23505") {
                return res.status(409).json({
                    message: "Error: Ya existe un contenedor con este nombre identificador.",
                });
            }
            console.error("Error al actualizar contenedor:", error);
            return res.status(500).json({
                message: "Error interno del servidor al actualizar el contenedor.",
            });
        }
    }

    /**
     * @route DELETE /contenedores/:id
     * @desc Elimina un contenedor por su ID.
     * @access Restringido (Deberia ser 'administrador')
     */
    public async deleteContenedor(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID de contenedor invalido." });
            }

            // Eliminar el contenedor por ID
            const deleteResult = await contenedorRepository.delete(id);

            // Verificar si se elimino algun registro
            if (deleteResult.affected === 0) {
                return res.status(404).json({ message: "Contenedor no encontrado para eliminar." });
            }

            return res.status(200).json({
                message: "Contenedor eliminado exitosamente.",
                idContenedor: id,
            });
        } catch (error) {
            console.error("Error al eliminar contenedor:", error);
            return res.status(500).json({
                message: "Error interno del servidor al eliminar el contenedor.",
            });
        }
    }
}