const sequelize = require('./Db.js');
const { Sequelize } = require('sequelize');

const Teste = sequelize.define(
  'teste',
  {
    idpessoa: { type: Sequelize.INTEGER },
    dataInicio: { type: Sequelize.DATE, allowNull: false },
    dataFim: { type: Sequelize.DATE, allowNull: false },
    resr: { type: Sequelize.FLOAT },
    resi: { type: Sequelize.FLOAT },
    resa: { type: Sequelize.FLOAT },
    ress: { type: Sequelize.FLOAT },
    rese: { type: Sequelize.FLOAT },
    resc: { type: Sequelize.FLOAT },
    totalv: { type: Sequelize.FLOAT },
    totalb: { type: Sequelize.FLOAT }
  },
  {
    tableName: 'testes',
    timestamps: true,
  }
);

module.exports = Teste;
