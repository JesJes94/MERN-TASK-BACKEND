import express from "express";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

import { registrarUsuario, 
        autenticarUsuario, 
        confirmarUsuario,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        perfil
} from "../controllers/usuarioController.js";

//Autenticación, registro y confirmación de usuarios.

router.post('/', registrarUsuario) //Crea un nuevo usuario
router.post('/login', autenticarUsuario); 
router.get('/confirmar/:token', confirmarUsuario);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token')
        .get(comprobarToken)
        .post(nuevoPassword);
router.get('/perfil', checkAuth, perfil)

export default router