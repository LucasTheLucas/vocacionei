const sequelize = require('./Db.js');
const { Sequelize } = require('sequelize');

const Estado = sequelize.define(
  'estado',
  {
    nome: { type: Sequelize.STRING, allowNull: false, unique: true }
  },
  {
    timestamps: false
  }
);

module.exports = Estado;
