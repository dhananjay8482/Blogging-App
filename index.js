const path = require('path');
const express = require('express');

const app = express();
const PORT = 8000;

// Setting Middlewares
app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"));

app.get('/', (req, res)=>{
    res.render('home');
})

// Running Server
app.listen(PORT, ()=> console.log(`Server started at PORT:${PORT}`));