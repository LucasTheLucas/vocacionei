const db = require('./db.js');
const Rua = require('./Rua.js');

const Instituicao = db.sequelize.define('instituicao', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    codrua: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Rua,
            key: 'id'        
        }
    },
    inativo: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'instituicaos',
    timestamps: true           
});

module.exports = Instituicao;
