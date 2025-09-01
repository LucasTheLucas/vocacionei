const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const Pessoa = require("./models/Pessoa");
const Imagen = require("./models/Imagens");
const Cidade = require("./models/Cidade")
const Instituicao = require("./models/Instituicao")

// CONFIG
//TAMPLETE ENGINE
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      json: (context) => JSON.stringify(context),
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

app.post("/updatealuno", function (req, res)
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

app.get("/cadinstituicao", async (req, res) =>
{
  const instituicao = await Instituicao.findAll({ raw: true })
  const cidade = await Cidade.findAll({ raw: true })

  res.render("instituicao", {cidade: cidade, instituicao: instituicao});
});

app.post("/addinstituicao", function (req, res) {
  Instituicao.create(
    {
      codrua: req.body.codrua,
      nome: req.body.nome
    }).then(() =>
      {
        res.redirect("http://localhost:8081/cadinstituicao")
      })
  });

app.listen(8081, function () {
  console.log("Servidor rodando!");
});
