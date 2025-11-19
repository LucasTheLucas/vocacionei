const sequelize = require('./Db.js');
const { Sequelize } = require('sequelize');

const Instituicao = sequelize.define(
  'instituicao',
  {
    nome: { type: Sequelize.STRING, unique: true },
    rua: { type: Sequelize.STRING },
    bairro: { type: Sequelize.STRING },
    idcidade: { type: Sequelize.INTEGER },
    idestado: { type: Sequelize.INTEGER },
    inativo: { type: Sequelize.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'instituicoes',
    timestamps: true,
  }
);

module.exports = Instituicao;
