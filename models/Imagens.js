const sequelize = require('./Db.js');
const { Sequelize } = require('sequelize');

const Imagen = sequelize.define(
  'imagens',
  {
    basemq: { type: Sequelize.TEXT('medium'), allowNull: false },
    tipo: { type: Sequelize.CHAR(1), allowNull: false }
  },
  {
    timestamps: false
  }
);

module.exports = Imagen;
