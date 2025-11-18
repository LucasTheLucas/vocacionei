const db = require('./Db.js');

const Teste = db.sequelize.define(
  'teste',
  {
    idpessoa: { type: db.Sequelize.INTEGER },
    datahora: { type: db.Sequelize.DATE },
    resr: { type: db.Sequelize.FLOAT },
    resi: { type: db.Sequelize.FLOAT },
    resa: { type: db.Sequelize.FLOAT },
    ress: { type: db.Sequelize.FLOAT },
    rese: { type: db.Sequelize.FLOAT },
    resc: { type: db.Sequelize.FLOAT },
    totalv: { type: db.Sequelize.FLOAT },
    totalb: { type: db.Sequelize.FLOAT }
  },
  {
    tableName: 'testes',
    timestamps: true,
  }
);


module.exports = Teste;
