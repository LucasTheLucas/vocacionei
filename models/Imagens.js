const db = require('./Db.js');

const Imagen = db.sequelize.define('imagens', {
    basemq: { type: db.Sequelize.TEXT('medium'), allowNull: false },
    tipo: { type: db.Sequelize.CHAR(1), allowNull: false }
},
{
    timestamps: false
});


db.sequelize.sync({ force: true });


module.exports = Imagen;
