import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js"

const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = await Usuario.findById(decoded.id).select('-password -confirmado -token -updatedAt -createdAt -__v');
            
        } catch (error) {
            return res.status(400).json({msg: 'Hubo un error'});
        }
    }

    if(!token) {
        const error = new Error('Token no válido');
        return res.status(401).json({msg: error.message});
    }

    next();
}

export default checkAuth;