const db = require('./db.js')
const Estado = require('./Estado.js')

const Cidade = db.sequelize.define('cidade', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true        
    },
    codestado:
    {
        type: db.Sequelize.INTEGER,
        references: {
            model: Estado,
            key: 'id'        
        }
    }
})

Cidade.belongsTo(Estado, { foreignKey: 'codestado' })
Estado.hasMany(Cidade, { foreignKey: 'codestado' })

module.exports = Cidade