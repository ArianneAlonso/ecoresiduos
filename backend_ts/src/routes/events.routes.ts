import { Router } from "express";
import { EventosController } from "../controllers/events.controller";
import { SessionValidator } from "../middlewares/validateSession";
import { authorizeRole } from "../middlewares/validateRole";

const router = Router();
const controller = new EventosController();

// --------------------------------------------------------------------------
// 1. RUTAS PÚBLICAS
// --------------------------------------------------------------------------
router.get("/", controller.getEvents);
router.get("/:id", controller.getEventById);

// --------------------------------------------------------------------------
// 2. RUTAS PARA CUALQUIER USUARIO LOGUEADO (Rol: usuario, administrador, operador)
// --------------------------------------------------------------------------
router.use(SessionValidator.validateSession);

/**
 * POST /events/:idEvento/inscribir
 * Permite que un usuario se anote a un evento.
 */
router.post("/:idEvento/inscribir", controller.inscribirUsuario);

/**
 * GET /events/user/:id
 * Ver historial propio o de otros (según tu lógica de negocio).
 */
router.get("/user/:id", controller.getEventsByUser);

// --------------------------------------------------------------------------
// 3. RUTAS SOLO PARA ADMIN / OPERADOR
// --------------------------------------------------------------------------
router.use(authorizeRole(["administrador", "operador"]));

router.post("/", controller.createEvent);
router.put("/:id", controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

export default router;
