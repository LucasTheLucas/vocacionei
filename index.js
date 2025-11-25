const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const path = require("path");

const Pessoa = require("./models/Pessoa");
const Imagen = require("./models/Imagens");
const Instituicao = require("./models/Instituicao");
const Estado = require("./models/Estado");
const Cidade = require("./models/Cidade");
const Teste = require("./models/Teste")
const sequelize = require("./models/Db.js");


const PDFDocument = require("pdfkit");
const PORT = process.env.PORT || 3000;

const bcrypt = require("bcrypt");

require("pdfkit-table");

// --- FAVICON ---
app.use("/assets", express.static(path.join(__dirname, "assets")));

// --- CONFIGURAÇÕES DO HANDLEBARS ---
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      json: (context) => JSON.stringify(context),
      ifEquals: (a, b, options) => (a == b ? options.fn(this) : options.inverse(this)),
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- ASSOCIAÇÕES (Sequelize) ---
Instituicao.belongsTo(Cidade, { foreignKey: 'idcidade', as: 'cidadeData' });
Instituicao.belongsTo(Estado, { foreignKey: 'idestado', as: 'estadoData' });

// --- ROTAS - PÁGINAS ---

// --LOGIN
app.get("/login", (req,res) => res.render("login", {layout: false}))

app.post("/logar", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const pessoa = await Pessoa.findOne({ where: { email } });

    if (!pessoa) {
      return res.json({ success: false, message: "E-mail ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, pessoa.senha);

    if (!senhaValida) {
      return res.json({ success: false, message: "E-mail ou senha incorretos" });
    }

    return res.json({ success: true, id: pessoa.id, nome: pessoa.nome });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Erro no servidor" });
  }
});


app.get("/", (req, res) => {
  console.log("aqui!" + req);
  console.log("aqui2!" + res);
  res.render("principal")
});
app.get("/cadastrar", async (req, res) => {
  const estado = await Estado.findAll({ raw: true });
  const instituicao = await Instituicao.findAll(
    {
      where: { inativo: 0 }, 
      raw: true 
    });
  const cidade = await Cidade.findAll({ raw: true });
  res.render("formulario", { estado, instituicao, cidade });
});
app.get("/termos", (req, res) => res.render("termos"));
app.get("/obrigado", (req, res) => res.render("obrigado"))
app.get("/resultados", (req, res) => res.render("resultados"));
app.get("/resultados/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const teste = await Teste.findOne({
      where: { idpessoa: id }, 
      order: [['dataInicio', 'DESC']], 
      raw: true
    });

    if (!teste) {
      return res.render("testesumiu");
    }

    res.render("resultadosprincipal", { teste });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar resultados.");
  }
});

app.get("/listartestes/:id", async (req, res) => 
  {
    const pessoaId = req.params.id;

    const todosExcetoUltimo = await Teste.findAll({
      where: { idpessoa: pessoaId },
      order: [['id', 'DESC']],
      offset: 1,               
      raw: true
    });

    res.json(todosExcetoUltimo)
  })

app.get("/resultadoindividual/:id", async (req, res) =>
  {
    const testeId = req.params.id;

    const teste = await Teste.findOne({
      where: { id: testeId },
      order: [['id', 'DESC']],
      raw: true
    });

    res.render("resultadosindividual", {teste})
  })

app.get("/administrativo", (req, res) => res.render("administrativo"));

app.get("/slides", (req, res) => {
  res.redirect("/slides/1");
});

app.get("/slides/:id", async (req, res) => {
  try {
    const imagemDb = await Imagen.findOne({
      where: { id: req.params.id }
    });

    // Se a imagem não existir
    if (!imagemDb) {
      return res.status(404).send("Imagem não encontrada.");
    }

    // Se não tiver URL
    if (!imagemDb.url) {
      return res.status(400).send("Imagem sem URL cadastrada.");
    }

    const imagem = {
      id: imagemDb.id,
      tipo: imagemDb.tipo,
      url: imagemDb.url
    };

    res.render("slides", { imagem });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar imagem.");
  }
});



// --- ROTAS - INSTITUIÇÃO ---
app.get("/cadinstituicao", async (req, res) => {
  const cidade = await Cidade.findAll({ raw: true });
  const estado = await Estado.findAll({ raw: true });

  res.set('Cache-Control', 'no-store');
  res.render("instituicao", { instituicao: null, cidade, estado });
});

// Com ID (editar)
app.get("/cadinstituicao/:id", async (req, res) => {
  const cidade = await Cidade.findAll({ raw: true });
  const estado = await Estado.findAll({ raw: true });
  const instituicao = await Instituicao.findByPk(req.params.id, { raw: true });

  res.set('Cache-Control', 'no-store');
  res.render("instituicao", { instituicao, cidade, estado });
});

app.post("/addinstituicao", async (req, res) => {
  const { nome, rua, bairro, idestado, idcidade } = req.body;
  if (!nome || !idestado) return res.send("Preencha todos os campos obrigatórios.");
  await Instituicao.create({ nome, rua, bairro, idestado, idcidade });
  res.set('Cache-Control', 'no-store');
  res.redirect("/listainstituicao");
});

app.post("/editarInstituicao/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, rua, bairro, idestado, idcidade } = req.body;
  if (!nome || !idestado) return res.send("Preencha todos os campos obrigatórios.");
  await Instituicao.update({ nome, rua, bairro, idestado, idcidade }, { where: { id } });
  res.redirect("/listainstituicao");
});

app.get("/excluirInstituicao/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Instituicao.update({ inativo: 1 }, { where: { id } });
    res.redirect("/listainstituicao")
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao inativar instituição" });
  }
});

app.get("/listainstituicao", async (req, res) => {
  res.render("listaescolas");
});

app.get("/links", async (req, res) =>
  {
    const instituicoes = await Instituicao.findAll({
      where: { inativo: 0 },
      include: [
        { model: Cidade, attributes: ['nome'], as: 'cidadeData' },
        { model: Estado, attributes: ['nome'], as: 'estadoData' }
      ],
      raw: true,
      nest: true
    });

    res.render("links", {instituicoes});
  })

app.get("/listarinstituicao", async (req, res) => {
  try {
    const instituicoes = await Instituicao.findAll({
      where: { inativo: 0 },
      include: [
        { model: Cidade, attributes: ['nome'], as: 'cidadeData' },
        { model: Estado, attributes: ['nome'], as: 'estadoData' }
      ],
      raw: true,
      nest: true
    });

    const resultado = instituicoes.map(inst => ({
      id: inst.id,
      instituicao: inst.nome,
      rua: inst.rua,
      bairro: inst.bairro,
      cidade: inst.cidadeData?.nome || '-',
      estado: inst.estadoData?.nome || '-'
    }));

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar instituições");
  }
});

// --- ROTAS - PESSOAS ---
app.post("/addaluno", async (req, res) => {

  const hash = await bcrypt.hash(req.body.senha, 10);

  Pessoa.create({
    nome: req.body.nome,
    sexo: req.body.genero,
    datanascimento: req.body.nasc,
    codserie: req.body.serie,
    codinstituicaoensino: req.body.ensino,
    numerocasa: req.body.numero,
    rua: req.body.rua,
    bairro: req.body.bairro,
    idestado: req.body.estado,
    idcidade: req.body.idcidade,
    email: req.body.email,
    senha: hash,
    contato: req.body.contato,
    nomeresponsavel: req.body.responsavel,
    contatoresponsavel: req.body.responsavelcontato,
    termos: req.body.termos,
  })
    .then((pessoa) => res.json({ id: pessoa.id }))
    .catch((err) => res.send("FALHA AO CADASTRAR: " + err));
});

app.post("/updatealuno", async (req, res) => {
  const { id, dataInicio, dataFim, resr, resi, resa, ress, rese, resc, totalb, totalv } = req.body;
  const idpessoa = id;
  try {
    await Teste.create(
      { idpessoa, dataInicio, dataFim, resr, resi, resa, ress, rese, resc, totalb, totalv }
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
<head><meta charset="UTF-8"><title>Resultados do Aluno</title>
<style>
body { font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 30px auto; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; }
h1 { color: #333; text-align: center; }
p { font-size: 16px; color: #555; }
.tipo-name { font-weight: bold; margin-bottom: 5px; }
.progress-bar { background-color: #e0e0e0; border-radius: 5px; overflow: hidden; height: 20px; }
.progress { height: 100%; text-align: right; padding-right: 5px; color: #fff; border-radius: 5px; }
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
<div class="tipo"><div class="tipo-name">REALISTA: ${resr} (${((resr/75)*100).toFixed(1)}%)</div><div class="progress-bar"><div class="progress resr" style="width: ${(resr/75)*100}%"></div></div></div>
<div class="tipo"><div class="tipo-name">INVESTIGADOR: ${resi} (${((resi/75)*100).toFixed(1)}%)</div><div class="progress-bar"><div class="progress resi" style="width: ${(resi/75)*100}%"></div></div></div>
<div class="tipo"><div class="tipo-name">ARTISTICO: ${resa} (${((resa/75)*100).toFixed(1)}%)</div><div class="progress-bar"><div class="progress resa" style="width: ${(resa/75)*100}%"></div></div></div>
<div class="tipo"><div class="tipo-name">SOCIAL: ${ress} (${((ress/75)*100).toFixed(1)}%)</div><div class="progress-bar"><div class="progress ress" style="width: ${(ress/75)*100}%"></div></div></div>
<div class="tipo"><div class="tipo-name">EMPREENDEDOR: ${rese} (${((rese/75)*100).toFixed(1)}%)</div><div class="progress-bar"><div class="progress rese" style="width: ${(rese/75)*100}%"></div></div></div>
<div class="tipo"><div class="tipo-name">CONVENCIONAL: ${resc} (${((resc/75)*100).toFixed(1)}%)</div><div class="progress-bar"><div class="progress resc" style="width: ${(resc/75)*100}%"></div></div></div>
</div>
</body></html>`;

    let mailOptions = {
      from: '"CNV" <vocacioneiofficial@gmail.com>',
      to: pessoa.email,
      subject: 'RESULTADO DO TESTE VOCACIONAL',
      text: '',
      html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.log('Erro ao enviar:', error);
    });
  } catch (err) {
    console.log("ERRO:", err);
  }
});

// --- RELATÓRIOS ---
app.get("/relatorios", (req, res) => res.render("relatorios"));

app.get("/relatorio/alunos", async (req, res) => {
  try {
    const pessoas = await Pessoa.findAll({ raw: true });
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    let filename = "relatorio_alunos.pdf";
    filename = encodeURIComponent(filename);
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    doc.fontSize(18).text("Relatório de Alunos", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("#", 50, doc.y, { continued: true });
    doc.text("Nome", 80, doc.y, { continued: true });
    doc.text("Email", 300, doc.y, { continued: true });
    doc.text("Contato", 550, doc.y);
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);
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
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    let filename = "relatorio_instituicoes.pdf";
    filename = encodeURIComponent(filename);
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    doc.fontSize(18).text("Relatório de Instituições", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("#", 50, doc.y, { continued: true });
    doc.text("Nome", 80, doc.y);
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);
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

// --- SERVIDOR ---
sequelize.authenticate()
  .then(() => {
    console.log("🔥 Conectado ao MySQL Railway!");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT,'0.0.0.0', () => {
      console.log("PORT env " + process.env.PORT);
      console.log("Servidor rodando na porta " + PORT);
    });
  })
  .catch(err => {
    console.error("💥 Erro ao iniciar aplicativo:", err);
  });


