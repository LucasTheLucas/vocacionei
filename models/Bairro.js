const db = require('./db.js')
const Cidade = require('./Cidade.js')

const Bairro = db.sequelize.define('bairro', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true        
    },
    codcidade:
    {
        type: db.Sequelize.INTEGER,
        references: {
            model: Cidade,
            key: 'id'        
        }
    }
})

Bairro.belongsTo(Cidade, { foreignKey: 'codcidade' })
Cidade.hasMany(Bairro, { foreignKey: 'codcidade' })

module.exports = Bairro