require('dotenv').config()
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const dbUrl = process.env.DATABASE_URL;
const dbName = "ocean-jornada-backend-maio-2024";

const client = new MongoClient(dbUrl);

async function main() {
  console.log("Conectando ao banco de dados...");
  await client.connect(); // Aguarda a conexão ser feita para então avançar.
  console.log("Conectado com sucesso!");

  const app = express();

  app.get('/', function (req, res) {
    res.send('Hello World');
  });

  // Desafio: criar uma rota [GET] /oi que retorna "Olá, mundo"

  app.get('/oi', function (req, res) {
    res.send('Olá, mundo!');
  });

  // Lista de itens

  const itens = ["Rick sanches", "Morty Smith", "Summer Smith"];
  //              0               1               2

  const db = client.db(dbName);
  const collection = db.collection('item');

  // Endpoint de Read All [GET] /item

  app.get('/item', async function (req, res) {
   // Acesso a lista de documentos na collection
    const documentos = await collection.find().toArray();
    // Envio os documentos como resposta
    res.send(documentos);
  });

  // Endpoint de Read By ID [GET] /item/:id/
  app.get('/item/:id', async function (req, res) {
    // Acessamos o parâmetro de roda ID
    const id = req.params.id;

    //Acessamos o item na collection usando o ID
    const item = await collection.findOne({ _id: new ObjectId(id)});

    // Enviamos o item encontrado como resposta
    res.send(item);
  });
  // Sinalizamos que todo corpo de requisição
  // Virá como JSON
  app.use(express.json());

  // Endpoint de Create [POST] / item

  app.post('/item', function (req, res) {
    // Acessamos o corpo da requisição
    const body = req.body;

    // Acessar o item no corpo da requisição
    const novoItem = body.nome;

    // Adicionar o novo item na lista
    // itens.push(novoItem);
    collection.insertOne({ nome: novoItem });

    // Enviar uma mensagem de sucesso

    res.send(`Item adicionado com sucesso: ${novoItem}`);
  });

  // Endpoint de Update [PUT] /item/:id

  app.put('/item/:id', async function (req, res) {
    // Acessar o ID do parâmetro de rota
    const id = req.params.id

    // Acessar o item a ser atualizado, a partir do 
    // Corpo da requisição

    const body = req.body;
    const atualizarItem = body.nome;

    // Atualizar na lista o item recebido
    // itens[id - 1] = atualizarItem;

    // Atualizar na collection o item  recebido

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { nome: atualizarItem } }
    );

    res.send(`Item atualizado com sucesso: ${id}, ${atualizarItem}`);

  });

  // Endpoint de Delete [DELETE] /item/:id

  app.delete('/item/:id', async function (req, res) {
    // Acessar o parametro de rota ID
    const id = req.params.id;

    // Executa a operação de exclusão desse item pelo índice
    // delete itens[id - 1];

    await collection.deleteOne({ _id: new ObjectId(id) });

    // Enviamos uma mensagem de sucesso
    res.send(`Item removido com sucesso: ${id}`);
  });

  app.listen(3000);

}

main();
