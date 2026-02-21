import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller';
import { body } from 'express-validator';
import { ValidationsErrors } from '../middlewares/handleValidationErrors';
import { SessionValidator } from '../middlewares/validateSession';
import { authorizeRole } from '../middlewares/validateRole';
const router = Router();
const controller = new UsuariosController();

// Validaciones para el registro de usuarios
const registroValidation = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
  body('email')
  .notEmpty().withMessage('El email es obligatorio.')
  .bail()
  .isEmail().withMessage('El formato del email no es válido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  ValidationsErrors.handleValidationErrors

];

// Validaciones para el inicio de sesión
const loginValidation = [
  body('email')
  .notEmpty().withMessage('El email es obligatorio.')
  .bail()
  .isEmail().withMessage('El formato del email no es válido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
  ValidationsErrors.handleValidationErrors
];

// Rutas para el recurso '/usuarios'
router.post('/register', registroValidation, controller.crearUsuario);
router.post('/login', loginValidation, controller.iniciarSesion);
router.get(
    '/session',
    SessionValidator.validateSession, // El middleware se usa como método estático
    controller.verificarSesion 
);
router.get('/', SessionValidator.validateSession,authorizeRole(['administrador']),controller.obtenerUsuarios);
router.get('/:id', SessionValidator.validateSession, controller.obtenerUsuarioPorId);
router.post('/logout', controller.cerrarSesion);

export default router;