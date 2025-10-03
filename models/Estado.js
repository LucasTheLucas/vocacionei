const db = require('./db.js');

const Estado = db.sequelize.define('estado', {
    nome: { type: db.Sequelize.STRING, allowNull: false, unique: true }
});

db.sequelize.sync({ force: true });

module.exports = Estado;
