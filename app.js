// jshint esversion:8

const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const bodyParser = require('body-parser');
const path = require('path');
const { port } = require('pg/lib/defaults');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

// database
const db = require('./config/database');

// Test db
db.authenticate()
    .then( () => console.log('Database connected...') )
    .catch( (err) => {console.log('Error ' + err);} );

const app = express();

// Handlebars
app.engine('handlebars', exphbs.engine({ handlebars: allowInsecurePrototypeAccess(Handlebars),  defaultLayout: 'main'  })); //expbhs takes an options object.. we're saying we want this to be called main.handlebars
// .engine(extension, callback)
app.set('view engine', 'handlebars'); //template engine to use

// Body parser
app.use(bodyParser.urlencoded({ extended: false })); //this is the configuration for the form

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

// Gig routes
app.use('/gigs', require('./routes/gigs'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));