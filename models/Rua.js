const db = require('./db.js')
const Bairro = require('./Bairro.js')

const Rua = db.sequelize.define('rua', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true        
    },
    codbairro:
    {
        type: db.Sequelize.INTEGER,
        references: {
            model: Bairro,
            key: 'id'        
        }
    }
})

Rua.belongsTo(Bairro, { foreignKey: 'codbairro' })
Bairro.hasMany(Rua, { foreignKey: 'codbairro' })

module.exports = Rua