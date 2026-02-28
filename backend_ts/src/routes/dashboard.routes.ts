import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { SessionValidator } from '../middlewares/validateSession';
import { authorizeRole } from '../middlewares/validateRole';

const router = Router();
const dashboardController = new DashboardController();

// Ruta principal para obtener todos los datos del dashboard (KPIs y Gráficos)
router.get(
    '/',
    SessionValidator.validateSession,
    // Solo Administradores y Operadores deberían ver estos datos
    authorizeRole(['administrador']),
    dashboardController.getKpis
);

export default router;