const db = require('./Db.js');

const Cidade = db.sequelize.define('cidade', {
    nome: { type: db.Sequelize.STRING, allowNull: false, unique: true }
}, {timestamps: false});

db.sequelize.sync({ force: true });


module.exports = Cidade;
