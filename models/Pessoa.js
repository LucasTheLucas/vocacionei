const db = require('./db.js');

const Pessoa = db.sequelize.define('pessoa', {
    nome: { type: db.Sequelize.STRING },
    sexo: { type: db.Sequelize.CHAR },
    datanascimento: { type: db.Sequelize.DATEONLY },
    datateste: { type: db.Sequelize.DATEONLY },
    codserie: { type: db.Sequelize.INTEGER },
    codinstituicaoensino: { type: db.Sequelize.INTEGER },
    email: { type: db.Sequelize.STRING },
    senha: { type: db.Sequelize.STRING },
    contato: { type: db.Sequelize.STRING },
    nomeresponsavel: { type: db.Sequelize.STRING },
    contatoresponsavel: { type: db.Sequelize.STRING },
    resr: { type: db.Sequelize.FLOAT },
    resi: { type: db.Sequelize.FLOAT },
    resa: { type: db.Sequelize.FLOAT },
    ress: { type: db.Sequelize.FLOAT },
    rese: { type: db.Sequelize.FLOAT },
    resc: { type: db.Sequelize.FLOAT },
    totalv: { type: db.Sequelize.FLOAT },
    totalb: { type: db.Sequelize.FLOAT },
    numerocasa: { type: db.Sequelize.INTEGER },
    termos: { type: db.Sequelize.CHAR },
    funcionario: { type: db.Sequelize.CHAR },
    idestado: { type: db.Sequelize.INTEGER },
    rua: { type: db.Sequelize.STRING },
    bairro: { type: db.Sequelize.STRING },
    cidade: { type: db.Sequelize.STRING }
});

module.exports = Pessoa;
