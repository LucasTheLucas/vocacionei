const { DataTypes } = require("sequelize");
const sequelize = require("./Db.js");

const Pessoa = sequelize.define(
  "pessoa",
  {
    nome: { type: DataTypes.STRING },
    sexo: { type: DataTypes.CHAR },
    datanascimento: { type: DataTypes.DATEONLY },
    datateste: { type: DataTypes.DATEONLY },
    codserie: { type: DataTypes.INTEGER },
    codinstituicaoensino: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING },
    senha: { type: DataTypes.STRING },
    contato: { type: DataTypes.STRING },
    nomeresponsavel: { type: DataTypes.STRING },
    contatoresponsavel: { type: DataTypes.STRING },
    resr: { type: DataTypes.FLOAT },
    resi: { type: DataTypes.FLOAT },
    resa: { type: DataTypes.FLOAT },
    ress: { type: DataTypes.FLOAT },
    rese: { type: DataTypes.FLOAT },
    resc: { type: DataTypes.FLOAT },
    totalv: { type: DataTypes.FLOAT },
    totalb: { type: DataTypes.FLOAT },
    numerocasa: { type: DataTypes.INTEGER },
    termos: { type: DataTypes.CHAR },
    funcionario: { type: DataTypes.CHAR },
    idestado: { type: DataTypes.INTEGER },
    rua: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    idcidade: { type: DataTypes.INTEGER },
  },
  {
    tableName: "pessoas",
    timestamps: true,
  }
);

module.exports = Pessoa;
