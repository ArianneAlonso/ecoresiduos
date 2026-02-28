// src/routes/profile.routes.ts

import { Router } from 'express';
// Asegúrate de que las rutas de importación son correctas:
import { getProfile, updateProfile } from '../controllers/profile.controller'; 
import { SessionValidator } from '../middlewares/validateSession';

const router = Router();

// Ruta para obtener el perfil del usuario autenticado
router.get('/', SessionValidator.validateSession, getProfile);

// Ruta para actualizar los datos básicos del perfil (sin contraseña)
router.put('/', SessionValidator.validateSession, updateProfile);

export default router;