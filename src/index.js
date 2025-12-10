import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { User } from './user.js'
const app = express()
dotenv.config()

const connectDB = () =>{
    const{
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_PORT,
        MONGO_DB,
        MONGO_HOSTNAME
    } = process.env
    const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
    mongoose.connect(url).then(function (){
        console.log("MongoDB is Connected")
    })
        .catch(function (error) {
            console.log(error)
        })
}

const port = 3005
app.use(cors({ origin: '*' })) // cors
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.listen(port, function () {
    console.log(`Api corriendo en http://localhost:${port}!`)
})

app.listen(port, function () {
    connectDB()
    console.log(`Api corriendo en http://localhost${port}!`)
})

// GET: verificar que el servidor esté funcionando correctamente
app.get('/', (req, res) => {
    console.log('Mi primer endpoint')
    res.status(200).send('Hola, la API esta funcionando correctamente!');
});

// POST: crear nuevo usuario
app.post('/', async (req, res) => {
    try {
        var data = req.body
        var newUser = new User(data)
        await newUser.save()
        res.status(200).send({
                success: true,
            message: "Se registro el usuario",
            outcome: []
        }


        )
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error al intentar crear el usuario, por favor intente nuevamente",
            outcome:[]
        })
    }
})

// GET: obtener todos los usuarios de la base de datos
app.get('/usuarios', async (req, res) => {
    try{
        var usuarios = await User.find().exec()
        res.status(200).send({
            success: true,
            message: "Se encontraron los usuarios exitosamente",
            outcome: [usuarios]
        })

    } catch(err) {
        res.status(400).send({
            success: false,
            message: "Error al intentar obtener los usuarios",
            outcome:[]
        })
    }
})

// PATCH: actualizar un usuario dado su ID
app.patch('/usuarios/:id', async (req, res) => {
    try {
        var { id } = req.params;
        var dataToUpdate = req.body;
        const userUpdated = await User.findByIdAndUpdate(id, dataToUpdate, { new: true });
        if (!userUpdated) {
            return res.status(404).send({
                success: false,
                message: "Usuario no encontrado",
                outcome: []
            });
        }

        res.status(200).send({
            success: true,
            message: "Usuario modificado exitosamente",
            outcome: userUpdated
        });

    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error al intentar modificar el usuario",
            outcome: []
        });
    }
});