// jshint esversion:8
const { Sequelize } = require('sequelize');

module.exports = new Sequelize('codegig', 'postgres', 'rolaNd_9584', {
    host: 'localhost',
    dialect: 'postgres'
  });