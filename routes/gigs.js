// jshint esversion:8
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get gig list
router.get('/', (req, res) => 
    Gig.findAll()
    .then(gigs => res.render('gigs', {
            gigs //gigs:gigs
        }))
    .catch(err => console.log(err)));

// Display add gig form
router.get('/add', (req, res) => res.render('add')); //renders a view called "add"

// Add a gig
router.post('/add', (req, res) => {
    
    let { title, technologies, budget, description, contact_email } = req.body; //using destructuring to pull data
    let errors = [];

    if (!title) {
        errors.push ({ text: 'Please add a title' });
    }
    if (!technologies) {
        errors.push ({ text: 'Please add some technologies' });
    }
    if (!description) {
        errors.push ({ text: 'Please add a description' });
    }
    if (!contact_email) {
        errors.push ({ text: 'Please add a contact email' });
    }

    // Check for errors
    if (errors.length > 0){
        res.render('add', {
            errors, 
            title, 
            technologies, 
            budget, 
            description, 
            contact_email
        });
    } else {
        if(!budget){
            budget = 'Unknown';
        } else {
            budget = `$${budget}`;
        }

        // Make lowercase and put space after a comma
        technologies = technologies.toLowerCase().replace(/, /g, ',');

        // Insert into table
        Gig.create({
            title, //same as saying 'title: title'
            technologies,
            description,
            budget,
            contact_email
        })
            .then (gig => res.redirect('/gigs'))
            .catch(err => console.log(err));
    }    

});

// Search for gigs
router.get('/search', (req, res) => {
    let { term } = req.query;

    // Make lower case
    term = term.toLowerCase();

    Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } }) //percent looks anywhere in the query
        .then(gigs => res.render('gigs', { gigs })) //gives us filtered gigs
        .catch(err => console.log(err));
});


module.exports = router;