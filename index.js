const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

const Pessoa = require("./models/Pessoa");
const Imagen = require("./models/Imagens");
const Instituicao = require("./models/Instituicao");
const Rua = require("./models/Rua");
const Bairro = require("./models/Bairro");
const Cidade = require("./models/Cidade");

const PDFDocument = require("pdfkit");
require("pdfkit-table");
// RELACIONAMENTOS
Bairro.belongsTo(Cidade, { foreignKey: "codcidade" });
Cidade.hasMany(Bairro, { foreignKey: "codcidade" });

Rua.belongsTo(Bairro, { foreignKey: "codbairro" });
Bairro.hasMany(Rua, { foreignKey: "codbairro" });

Instituicao.belongsTo(Rua, { foreignKey: "codrua" });
Rua.hasMany(Instituicao, { foreignKey: "codrua" });

// CONFIGURAÇÕES
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      json: (context) => JSON.stringify(context),
      ifEquals: (a, b, options) => (a == b ? options.fn(this) : options.inverse(this)),
    },
  })
);
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROTAS - PÁGINAS
app.get("/", (req, res) => res.render("principal"));
app.get("/cadastrar", (req, res) => res.render("formulario"));
app.get("/termos", (req, res) => res.render("termos"));
app.get("/resultados", (req, res) => res.render("resultados"));
app.get("/administrativo", (req, res) => res.render("administrativo"));

app.get("/slides", (req, res) => {
  res.redirect("http://localhost:8081/slides/1");
});

app.get("/slides/:id", async (req, res) => {
  try {
    const imagemDb = await Imagen.findOne({ where: { id: req.params.id } });
    const base64Limpo = imagemDb.basemq.replace(/\r?\n|\r/g, "");
    const imagem = {
      id: imagemDb.id,
      tipo: imagemDb.tipo,
      imagem: `data:image/${imagemDb.tipo};base64,${base64Limpo}`,
    };
    res.render("slides", { imagem });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar imagens: " + err);
  }
});

app.get("/cadinstituicao/:id", async (req, res) => {
  const id = req.params.id;
  const instituicao = await Instituicao.findOne({ raw: true, where: { id } });
  const cidades = await Cidade.findAll({ raw: true });
  res.render("instituicao", { cidade: cidades, instituicao });
});

app.get("/cadinstituicao", async (req, res) => {
  const cidades = await Cidade.findAll({ raw: true });
  res.render("instituicao", { cidade: cidades, instituicao: null });
});

app.post("/addinstituicao", async (req, res) => {
  const { nome, codrua } = req.body;
  if (!nome || !codrua || codrua == 0) return res.send("Preencha todos os campos.");
  await Instituicao.create({ nome, codrua });
  res.redirect("/listainstituicao");
});

app.post("/editarInstituicao/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, codrua } = req.body;
  if (!nome || !codrua || codrua == 0) return res.send("Preencha todos os campos.");
  await Instituicao.update({ nome, codrua }, { where: { id } });
  res.redirect("/listainstituicao");
});


// ROTAS - PESSOAS
app.post("/addaluno", (req, res) => {
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
    .then((pessoa) => res.json({ id: pessoa.id }))
    .catch((err) => res.send("FALHA AO CADASTRAR: " + err));
});

app.post("/updatealuno", async (req, res) => {
  const { id, resr, resi, resa, ress, rese, resc, totalb, totalv } = req.body;
  try {
    await Pessoa.update(
      { resr, resi, resa, ress, rese, resc, totalb, totalv },
      { where: { id } }
    );

    const pessoa = await Pessoa.findOne({ where: { id } });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "vocacioneiofficial@gmail.com",
        pass: "woiw jtdq ijib rslk",
      },
    });

    let htmlEmail = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Resultados do Aluno</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      padding: 20px;
    }
    h1 {
      color: #333;
      text-align: center;
    }
    p {
      font-size: 16px;
      color: #555;
    }
    .resultado {
      margin: 20px 0;
    }
    .tipo {
      margin-bottom: 15px;
    }
    .tipo-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .progress-bar {
      background-color: #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
      height: 20px;
    }
    .progress {
      height: 100%;
      text-align: right;
      padding-right: 5px;
      color: #fff;
      line-height: 20px;
      border-radius: 5px;
    }
    .resr { background-color: #4caf50; }
    .resi { background-color: #2196f3; }
    .resa { background-color: #ff9800; }
    .ress { background-color: #9c27b0; }
    .rese { background-color: #f44336; }
    .resc { background-color: #00bcd4; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Olá ${pessoa.nome}</h1>
    <p>Seus resultados:</p>
    <div class="resultado">
      <div class="tipo">
        <div class="tipo-name">REALISTA: ${resr} (${((resr/75)*100).toFixed(1)}%)</div>
        <div class="progress-bar"><div class="progress resr" style="width: ${(resr/75)*100}%"></div></div>
      </div>
      <div class="tipo">
        <div class="tipo-name">INVESTIGADOR: ${resi} (${((resi/75)*100).toFixed(1)}%)</div>
        <div class="progress-bar"><div class="progress resi" style="width: ${(resi/75)*100}%"></div></div>
      </div>
      <div class="tipo">
        <div class="tipo-name">ARTISTICO: ${resa} (${((resa/75)*100).toFixed(1)}%)</div>
        <div class="progress-bar"><div class="progress resa" style="width: ${(resa/75)*100}%"></div></div>
      </div>
      <div class="tipo">
        <div class="tipo-name">SOCIAL: ${ress} (${((ress/75)*100).toFixed(1)}%)</div>
        <div class="progress-bar"><div class="progress ress" style="width: ${(ress/75)*100}%"></div></div>
      </div>
      <div class="tipo">
        <div class="tipo-name">EMPREENDEDOR: ${rese} (${((rese/75)*100).toFixed(1)}%)</div>
        <div class="progress-bar"><div class="progress rese" style="width: ${(rese/75)*100}%"></div></div>
      </div>
      <div class="tipo">
        <div class="tipo-name">CONVENCIONAL: ${resc} (${((resc/75)*100).toFixed(1)}%)</div>
        <div class="progress-bar"><div class="progress resc" style="width: ${(resc/75)*100}%"></div></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

    let mailOptions = {
      from: '"CNV" <vocacioneiofficial@gmail.com>',
      to: pessoa.email,
      subject: 'RESULTADO DO TESTE VOCACIONAL',
      text: '',
      html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log('Erro ao enviar:', error);
    });
  } catch {
    console.log("ERRO");
  }
});

// ROTAS - INSTITUIÇÕES
app.post("/addinstituicao", (req, res) => {
  Instituicao.create({ codrua: req.body.codrua, nome: req.body.nome }).then(() => {
    res.redirect("/cadinstituicao");
  });
});

app.post("/editarInstituicao/:id/:nome", async (req, res) => {
  try {
    const { id, nome } = req.params;
    if (id > 0) {
      await Instituicao.update({ nome }, { where: { id } });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/excluirInstituicao/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Instituicao.update({ inativo: true }, { where: { id } });
    console.log("TESTE")
    res.send("Instituição inativada com sucesso");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao inativar instituição" });
  }
});

// ROTAS - LISTAGEM
app.get("/listainstituicao", async (req, res) => {
  res.render("listaescolas");
});

app.get("/listarinstituicao", async (req, res) => {
  try {
    const instituicoes = await Instituicao.findAll({
      attributes: ['id', 'nome'],
      where: { inativo: false },
      include: [
        {
          model: Rua,
          attributes: ['nome'],
          include: [
            {
              model: Bairro,
              attributes: ['nome'],
              include: [{ model: Cidade, attributes: ['nome'] }],
            },
          ],
        },
      ],
    });

    const resultado = instituicoes.map(inst => ({
      id: inst.id,
      instituicao: inst.nome,
      rua: inst.rua.nome,
      bairro: inst.rua.bairro.nome,
      cidade: inst.rua.bairro.cidade.nome,
    }));

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar instituições");
  }
});

// RELATORIOS
app.get("/relatorios", (req, res) => {
  res.render("relatorios");
});

app.get("/relatorio/alunos", async (req, res) => {
  try {
    const pessoas = await Pessoa.findAll({ raw: true });

    // PDF em paisagem (horizontal)
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    let filename = "relatorio_alunos.pdf";
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    doc.fontSize(18).text("Relatório de Alunos", { align: "center" });
    doc.moveDown(1);

    // Cabeçalho da tabela
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("#", 50, doc.y, { continued: true });
    doc.text("Nome", 80, doc.y, { continued: true });
    doc.text("Email", 300, doc.y, { continued: true });
    doc.text("Contato", 550, doc.y); // ajustei para caber na horizontal
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);

    // Conteúdo da tabela
    pessoas.forEach((p, i) => {
      doc.text(i + 1, 50, doc.y, { continued: true });
      doc.text(p.nome || "-", 80, doc.y, { continued: true });
      doc.text(p.email || "-", 300, doc.y, { continued: true });
      doc.text(p.contato || "-", 550, doc.y);
      doc.moveDown(0.5);
    });

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar relatório de alunos");
  }
});

app.get("/relatorio/instituicoes", async (req, res) => {
  try {
    const instituicoes = await Instituicao.findAll({ raw: true });

    // PDF em paisagem (horizontal)
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    let filename = "relatorio_instituicoes.pdf";
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    doc.fontSize(18).text("Relatório de Instituições", { align: "center" });
    doc.moveDown(1);

    // Cabeçalho da tabela
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("#", 50, doc.y, { continued: true });
    doc.text("Nome", 80, doc.y);
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);

    // Conteúdo da tabela
    instituicoes.forEach((i, index) => {
      doc.text(index + 1, 50, doc.y, { continued: true });
      doc.text(i.nome || "-", 80, doc.y);
      doc.moveDown(0.5);
    });

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar relatório de instituições");
  }
});


// SERVIDOR
app.listen(8081, () => console.log("Servidor rodando!"));
