// src/routes/entrega.routes.ts
import { Router } from 'express';
import { EntregasController } from '../controllers/entrega.controller';
import { SessionValidator } from '../middlewares/validateSession';
import { authorizeRole } from '../middlewares/validateRole';

const router = Router();
const entregasController = new EntregasController();

router.post(
    '/',
    SessionValidator.validateSession, 
    authorizeRole(['administrador']),
    entregasController.crearEntrega
);

router.get(
    '/mis-entregas',
    SessionValidator.validateSession, 
    entregasController.getEntregasByUsuario
);

router.get(
    '/', // La ruta base GET /entregas
    SessionValidator.validateSession, 
    authorizeRole(['administrador', 'operador']),
    entregasController.getAllEntregas
);

export default router;