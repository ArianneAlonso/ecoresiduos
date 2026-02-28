import { Router } from 'express';
import { EventosController } from '../controllers/events.controller';
import { SessionValidator } from '../middlewares/validateSession';
import { authorizeRole } from '../middlewares/validateRole';
// Opcional: Importar validaciones si se usan para POST/PUT de eventos
// import { body } from 'express-validator';
// import { ValidationsErrors } from '../middlewares/handleValidationErrors'; 

const router = Router();
const controller = new EventosController();

// Roles permitidos para crear, actualizar y eliminar eventos.
// Solo los administradores y operadores deberían modificar el catálogo de eventos.
const ADMIN_OPERATOR = ['administrador', 'operador'];


// --------------------------------------------------------------------------
// RUTAS PÚBLICAS (LECTURA)
// Estas rutas son accesibles sin necesidad de iniciar sesión, ya que son informativas.
// --------------------------------------------------------------------------

/**
 * GET /events
 * Obtener todos los eventos (se puede filtrar por 'upcoming=true' en query params).
 */
router.get('/', controller.getEvents);

/**
 * GET /events/:id
 * Obtener detalles de un evento específico por ID.
 */
router.get('/:id', controller.getEventById);


// --------------------------------------------------------------------------
// RUTAS PROTEGIDAS (ESCRITURA)
// Todos los accesos de escritura requieren autenticación y un rol elevado.
// --------------------------------------------------------------------------

// Middleware que se aplica a todas las rutas que siguen a este punto.
// 1. Verifica la sesión/JWT. 2. Autoriza solo a administradores u operadores.
router.use(SessionValidator.validateSession, authorizeRole(['administrador', 'operador']));


/**
 * POST /events
 * Crea un nuevo evento. (Protegido)
 */
router.post(
    '/', 
    // Opcional: Aquí irían validaciones como body('nombre').notEmpty()
    controller.createEvent
);

/**
 * PUT /events/:id
 * Actualiza un evento existente. (Protegido)
 */
router.put(
    '/:id', 
    controller.updateEvent
);

/**
 * DELETE /events/:id
 * Elimina un evento. (Protegido)
 */
router.delete(
    '/:id', 
    controller.deleteEvent
);


export default router;