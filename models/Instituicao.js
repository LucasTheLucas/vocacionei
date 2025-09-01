const db = require('./db.js');

const Instituicao = db.sequelize.define('instituicao', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    codrua: {
        type: db.Sequelize.INTEGER
    }
}, {
    tableName: 'instituicaos',
    timestamps: true           
});

module.exports = Instituicao;
