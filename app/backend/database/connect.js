

const { Sequelize} = require('sequelize')

const sequelize = new Sequelize('devdb',process.env.DB_USER,process.env.DB_PASSgit,{
    host: 'database-2.cv06umom2foy.eu-west-1.rds.amazonaws.com',
    dialect: "postgres"
})

module.exports = sequelize