const sequelize = require('./Db.js');
const { Sequelize } = require('sequelize');

const Imagen = sequelize.define(
  'imagens',
  {
    url: { type: Sequelize.STRING(500), allowNull: false },
    tipo: { type: Sequelize.CHAR(1), allowNull: false }
  },
  {
    timestamps: false
  }
);

module.exports = Imagen;
