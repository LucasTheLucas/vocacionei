const db = require('./db.js');

const Instituicao = db.sequelize.define('instituicao', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    rua: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    bairro: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    cidade: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    inativo: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'instituicaos',
    timestamps: true           
});

db.sequelize.sync()
module.exports = Instituicao;
