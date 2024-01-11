import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },

    password: {
        type: String,
        require: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },

    token: {
        type: String
    },

    confirmado: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

usuarioSchema.pre('save', async function(next) { //MIddleware: función que se ejecuta despues de la ejecución de una función asyncrona, en este caso antes de crear un nuevo Usuario en la BD.
    
    if(!this.isModified('password')) { //Si el password ya esta hasheado
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;