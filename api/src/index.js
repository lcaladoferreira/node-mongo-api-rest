const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001

app.use(express.json())

// conectando com o banco de dados
mongoose.connect('mongodb+srv://todo:todo@cluster0.n5lef.mongodb.net/todo?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, ()=> console.log('conectado ao banco de dados'))

const UserSchema = new mongoose.Schema({ username: String})
const User = mongoose.model('User',UserSchema)

const TodoSchema = new mongoose.Schema({description: String, done: Boolean, user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}})
const todo = mongoose.model('Todo',TodoSchema)


// definindo Rotas

app.post('/session', async (req, res) => {
    const { username } = req.body
    let user = ''
    try{
       user = await User.findOne({ username })
       if (!user){
        user = await User.create({ username })
       }
       return res.status(200).send(user)
    } catch(err){
        return res.status(400).send(err)    
    }
})

// criar todo POST
app.post('/todo/:user_id', async (req, res) => {
    const { description, done } = req.body
    const { user_id } = req.params
    try{
        const newTodo = await Todo.create({ description, done, user: user_id})
        return res.status(200).send(newTodo)
    } catch(err){
        return res.status(400).send(err) 
    }
})
 

// port setup
app.listen(PORT, (req, res) => {
    console.log(`listening on port ${PORT}` )
})
