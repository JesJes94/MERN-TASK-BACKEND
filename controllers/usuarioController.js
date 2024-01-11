import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";

const registrarUsuario = async (req, res) => {
    //Evitar registros duplicados

    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
        res.json({msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta'});
    } catch (error) {
        console.log(error)
    } 
}

const autenticarUsuario = async (req, res) => {

    const {email, password} = req.body;

    const usuario = await Usuario.findOne({email});

    //Comprobar si el usuario existe

    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message})
    }

    //Comprobar si esta confirmado

    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta aún no ha sido confirmada');
        return res.status(403).json({msg: error.message})
    }
    
    //Comprobar el password

    if(await usuario.comprobarPassword(password)) {
        return res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email, 
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message})
    }
}

const confirmarUsuario = async (req, res) => {
    
    const {token} = req.params
    const usuarioToken = await Usuario.findOne({token})

    if(!usuarioToken) {
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message})
    }

    try {
        usuarioToken.confirmado = true;
        usuarioToken.token = '';
        await usuarioToken.save();
        res.json({msg: 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const usuario = await Usuario.findOne({email});

    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message})
    }

    try {
        usuario.token = generarJWT();
        await usuario.save();
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({msg: 'Hemos enviado un correo con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) =>  {
    const {token} = req.params

    const tokenValido = await Usuario.findOne({token});

    if(tokenValido) {
        res.json({msg: 'Token válido y el usuario existe'})
    } else {
        const error = new Error('El token no es válido');
        return res.status(404).json({msg: error.message})
    }

}

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token});

    if(usuario) {
        usuario.password = password;
        usuario.token = "";

        try {
            await usuario.save();
            res.json({msg: 'Password modificado correctamente'})
        } catch (error) {
            console.log(error);
        }

    } else {
        const error = new Error('El token no es válido');
        return res.status(404).json({msg: error.message})
    }
}

const perfil = (req, res) => {
    const {usuario} = req;

    res.json(usuario);
}

export {
    registrarUsuario,
    autenticarUsuario,
    confirmarUsuario,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}