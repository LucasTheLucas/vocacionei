const sequelize = require('./Db.js');
const { Sequelize } = require('sequelize');

const Cidade = sequelize.define(
  'cidade',
  {
    nome: { type: Sequelize.STRING, allowNull: false, unique: true }
  },
  {
    timestamps: false
  }
);

module.exports = Cidade;
