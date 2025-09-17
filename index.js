const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const Pessoa = require("./models/Pessoa");
const Imagen = require("./models/Imagens");
const Instituicao = require("./models/Instituicao");
const Rua = require("./models/Rua");
const Bairro = require("./models/Bairro");
const Cidade = require("./models/Cidade");
const nodemailer = require('nodemailer');


Bairro.belongsTo(Cidade, { foreignKey: "codcidade" });
Cidade.hasMany(Bairro, { foreignKey: "codcidade" });

Rua.belongsTo(Bairro, { foreignKey: "codbairro" });
Bairro.hasMany(Rua, { foreignKey: "codbairro" });

Instituicao.belongsTo(Rua, { foreignKey: "codrua" });
Rua.hasMany(Instituicao, { foreignKey: "codrua" });

// CONFIG
//TAMPLETE ENGINE
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      json: (context) => JSON.stringify(context),
      ifEquals: (a, b, options) => a == b ? options.fn(this) : options.inverse(this),
    },
  })
);
app.use(express.static("public"));

app.set("view engine", "handlebars");

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROTAS
app.get("/cadastrar", function (req, res) {
  res.render("formulario");
});

app.get("/termos", function (req, res) {
  res.render("termos");
});

app.get("/", function (req, res) {
  res.render("principal");
});

app.post("/addaluno", function (req, res) {
  Pessoa.create({
    nome: req.body.nome,
    sexo: req.body.genero,
    datanascimento: req.body.nasc,
    codserie: req.body.serie,
    codinstituicaoensino: req.body.ensino,
    codrua: req.body.endereco,
    numerocasa: req.body.numero,
    email: req.body.email,
    senha: req.body.senha,
    contato: req.body.contato,
    nomeresponsavel: req.body.responsavel,
    contatoresponsavel: req.body.responsavelcontato,
    termos: req.body.termos,
  })
    .then(function (pessoa) {
      res.json({ id: pessoa.id });      
    })
    .catch(function (err) {
      res.send("FALHA AO CADASTRAR: " + err);
    });
});

app.post("/updatealuno", async (req, res) =>
{
  const {id, resr, resi, resa, ress, rese, resc, totalb, totalv} = req.body
  try
  {
    Pessoa.update(
    {
      resr: resr,
      resi: resi,
      resa: resa,
      ress: ress,
      rese: rese,
      resc: resc,
      totalb: totalb,
      totalv: totalv
    },
    {
      where: { id: id }
    })

    const pessoa = await Pessoa.findOne({
      where: { id: id }
    });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "vocacioneiofficial@gmail.com",
        pass: "woiw jtdq ijib rslk"
      }
    });

    let htmlEmail = `
      <h1>Olá ${pessoa.nome}</h1>
      <p>Seus resultados:</p>
      <ul>
        <li>RESR: ${resr}</li>
        <li>RESI: ${resi}</li>
        <li>RESA: ${resa}</li>
        <li>RESS: ${ress}</li>
        <li>RESE: ${rese}</li>
        <li>RESC: ${resc}</li>
        <li>Total B: ${totalb}</li>
        <li>Total V: ${totalv}</li>
      </ul>`;


    let mailOptions = {
      from: '"CNV" <vocacioneiofficial@gmail.com>',
      to: `${pessoa.email}`,  
      subject: 'Teste de envio pelo Node.js',   
      text: 'Olá! Este é um email enviado via Node.js', 
      html: htmlEmail
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Erro ao enviar:', error);
      }
    });
  }
  catch
  {
    console.log("ERRO")
  }
});

app.get("/slides", (req, res) =>
{
  res.redirect("http://localhost:8081/slides/1");
});

app.get("/slides/:id", async (req, res) => {
  try {
    const imagemDb = await Imagen.findOne({
      where: { id: req.params.id },
    });

    const base64Limpo = imagemDb.basemq.replace(/\r?\n|\r/g, "");

    const imagem = {
      id: imagemDb.id,
      tipo: imagemDb.tipo,
      imagem: `data:image/${imagemDb.tipo};base64,${base64Limpo}`
    };

    res.render("slides", { imagem: imagem });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar imagens: " + err);
  }
});

app.get("/resultados", function (req, res) {
  res.render("resultados");
});

app.get("/administrativo", function (req, res)
{
  res.render("administrativo")
})

app.get("/cadinstituicao/:id", async (req, res) =>
{
  const id = req.params.id
  const instituicao = await Instituicao.findOne({ raw: true, where: {id:id}})
  const cidades = await Cidade.findAll({ raw: true })

  res.render("instituicao", {cidade: cidades, instituicao: instituicao});
});

app.post("/addinstituicao", function (req, res) {
  Instituicao.create(
    {
      codrua: req.body.codrua,
      nome: req.body.nome
    }).then(() =>
      {
        res.redirect("/cadinstituicao")
      })
  });

  app.get("/listainstituicao", async (req, res) =>
  {
    res.render("listaescolas");
  });
  
  app.get("/listarinstituicao", async (req, res) =>
  {
const instituicoes = await Instituicao.findAll({
  attributes: ['id','nome'],
  include: [
    {
      model: Rua,
      attributes: ['nome'],
      include: [
        {
          model: Bairro,
          attributes: ['nome'],
          include: [
            {
              model: Cidade,
              attributes: ['nome']
            }
          ]
        }
      ]
    }
  ]
});

  app.get("/excluirInstituicao/:id", async (req, res) =>
    {
      try {
      const id = req.params.id;
      const deleted = await Instituicao.destroy({ where: { id: id } });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao excluir instituição" });
    }  
    })

  app.post("/editarInstituicao/:id/:nome", async (req, res) =>
  {
    try
    {
      const id = req.params.id;
      const nome = req.params.nome;
      
      if(id > 0)
        {
          const updated = await Instituicao.update(
          {
            nome: nome
          },
          {
            where: { id: id }
          })    
        }
      else
        {
          
        }
      
    }
    catch(err)
    {
      console.log(err)
    }
  })

const resultado = instituicoes.map(inst => ({
  id: inst.id,
  instituicao: inst.nome,
  rua: inst.rua.nome,
  bairro: inst.rua.bairro.nome,
  cidade: inst.rua.bairro.cidade.nome
}));

console.log(resultado)
res.json(resultado);
});


app.listen(8081, function () {
  console.log("Servidor rodando!");
});
