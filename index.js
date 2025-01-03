const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const mongoose = require('mongoose');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;

// setting Mongo DB
mongoose.connect('mongodb://localhost:27017/blogify').then((e)=> console.log('MongoDB Connected. '))

// Setting Middlewares
app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"));

// middlleware to get form data values from FE
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))

app.get('/', (req, res)=>{
    res.render('home', {
        user: req.user
    });
})

app.use('/user', userRoute)

// Running Server
app.listen(PORT, ()=> console.log(`Server started at PORT:${PORT}`));