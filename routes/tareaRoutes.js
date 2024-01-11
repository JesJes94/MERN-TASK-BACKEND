import express from "express";

const router = express.Router();

import checkAuth from "../middleware/checkAuth.js";

import {
    agregarTarea, 
    obtenerTarea,
    editarTarea,
    eliminarTarea,
    cambiarEstado
} from "../controllers/tareaController.js";

router.post('/', checkAuth, agregarTarea);
router.route('/:id')
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, editarTarea)
    .delete(checkAuth, eliminarTarea);
router.post('/estado/:id', checkAuth, cambiarEstado);

export default router