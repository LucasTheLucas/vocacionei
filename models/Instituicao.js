const db = require('./Db.js');

const Instituicao = db.sequelize.define(
  'instituicao',
  {
    nome: { type: db.Sequelize.STRING, unique: true },
    rua: { type: db.Sequelize.STRING },
    bairro: { type: db.Sequelize.STRING },
    idcidade: { type: db.Sequelize.INTEGER },
    idestado: { type: db.Sequelize.INTEGER }, 
    inativo: { type: db.Sequelize.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'instituicoes',
    timestamps: true,
  }
);

db.sequelize.sync({ force: true });


module.exports = Instituicao;
