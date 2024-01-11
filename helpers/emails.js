import nodemailer from "nodemailer"

const emailRegistro = async datos => {
    const {email, nombre, token} = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Confirma tu Cuenta",
        text: "Comprueba tu cuenta en Uptask",
        html: `<p>Hola, ${nombre}, comprueba tu cuenta en UpTask</p>
               <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
               <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
               </p> 
               <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })


}

const emailOlvidePassword = async datos => {
    const {email, nombre, token} = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu password",
        text: "Reestablece tu password",
        html: ` <p>Hola, ${nombre}, has solicitado establecer tu password</p>
                <p>Da clic en en el siguiente enlace para generar el password: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
                </p> 
                <p>Si tu no solicitaste este cambio, puedes ignorar el mensaje</p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}