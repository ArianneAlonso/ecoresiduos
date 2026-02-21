import { Router } from 'express';
import { ContenedorController } from '../controllers/container.controller'; // Importa la clase

const router = Router();
const contenedorController = new ContenedorController(); // Instancia la clase

// Ruta para crear un nuevo contenedor (POST)
// Se usa .bind(contenedorController) para asegurar que 'this' dentro del método
// apunte correctamente a la instancia de la clase.
router.post('/', contenedorController.createContenedor.bind(contenedorController));

// Ruta para obtener todos los contenedores (GET /contenedores)
router.get('/', contenedorController.getContenedores.bind(contenedorController));

// Ruta para obtener un contenedor por su ID (GET /contenedores/:id)
router.get('/:id', contenedorController.getContenedorById.bind(contenedorController));

router.put('/:id', contenedorController.updateContenedor.bind(contenedorController));

router.delete('/:id', contenedorController.deleteContenedor.bind(contenedorController));

export default router;