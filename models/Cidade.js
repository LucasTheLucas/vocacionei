const db = require('./db.js');

const Cidade = db.sequelize.define('cidade', {
    nome: { type: db.Sequelize.STRING, allowNull: false, unique: true }
}, {timestamps: false});

module.exports = Cidade;
