const db = require('./Db.js');

const Estado = db.sequelize.define('estado', {
    nome: { type: db.Sequelize.STRING, allowNull: false, unique: true }
}, {timestamps: false});

db.sequelize.sync({ force: true });

module.exports = Estado;
