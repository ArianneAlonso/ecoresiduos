import { Router } from "express";
import { EntregasController } from "../controllers/entrega.controller";
import { SessionValidator } from "../middlewares/validateSession";
import { authorizeRole } from "../middlewares/validateRole";

const router = Router();
const entregasController = new EntregasController();

router.post(
  "/",
  SessionValidator.validateSession,
  authorizeRole(["administrador", "usuario"]),
  entregasController.crearEntrega,
);
router.get(
  "/mis-entregas",
  SessionValidator.validateSession,
  entregasController.getEntregasByUsuario,
);

router.get(
  "/",
  SessionValidator.validateSession,
  authorizeRole(["administrador", "operador"]),
  entregasController.getAllEntregas,
);

router.patch(
  "/:id/confirmar",
  SessionValidator.validateSession,
  authorizeRole(["administrador"]),
  entregasController.confirmarEntrega,
);

export default router;
