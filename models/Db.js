//CONEXAO BANCO DE DADOS MYSQL
const Sequelize = require('sequelize')
const sequelize = new Sequelize('vocacioneiprincipal', 'root', '123456789', 
    {
        host: "localhost",
        dialect: "mysql"
    })

    module.exports = 
    {
        Sequelize: Sequelize,
        sequelize: sequelize
    }