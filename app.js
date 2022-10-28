const express = require('express');
require('dotenv').config();
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
const Secret = process.env.Secret

module.exports.directoryname = __dirname

//SESSION 
app.use(session({
    secret: Secret,
    resave: true,
    saveUninitialized: true
}));

//MiddleWares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// set Public Folder To Static
app.use("/", express.static(path.join(__dirname, 'public')));

// Routes
app.use("/",require('./routes/dashboard'));
app.use("/api",require('./routes/api'));

//Start Server
var port = process.env.PORT || 8080
app.listen(port);
console.log(`Server is listening on port ${port}`);

