const Sequelize = require('sequelize');

const sequelize = new Sequelize('vocacionei', 'root', 'Lucas@06', {
    host: "localhost",
    dialect: "mariadb"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
