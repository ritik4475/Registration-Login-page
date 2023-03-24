const express = require('express')
const app = express()
const hbs = require('hbs')
const port = process.env.PORT || 5000
const Register = require('./models/registers')
require("./db/conn")
const path = require('path')
const {json} = require('express')


const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

app.get('/', (req, res)=>{
    res.render("index")
})

app.get('/register', (req, res) =>{
    res.render("register")
})
app.get('/login', (req, res) =>{
    res.render("login")
})

//create new user in our database
app.post('/register', async (req, res) =>{
    try{
        const password = req.body.psw
        const cpassword = req.body.pswrepeat

        if(password === cpassword){
            const registeremployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.psw
            })

            const registered = await registeremployee.save()
            res.status(201).render("index")
            
        }
        else{
            res.send('password are not matched!')
        }
    }catch(error){
        res.status(400).send(error)
    }
})

//login check
app.post('/login',async (req, res) =>{
    try{
        const email = req.body.email
        const password = req.body.psw

       const uemail = await Register.findOne({email:email})
       if(uemail.password === password){
        res.status(201).render("index")
       }
       else{
        res.send("Invalid data!")
       }
    }catch(error){
        res.status(400).send('Invalid data!')
    }
})

app.listen(port, ()=>console.log(`Server is listening at ${port}`))