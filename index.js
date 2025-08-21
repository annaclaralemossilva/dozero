const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('pub'));
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// criação das tabelas
db.serialize(() =>{
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        endereco TEXT NOT NULL
      )
    `);   // Adicionado a crição da tabela clientes
    
    db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        empresa TEXT NOT NULL,
        cnpj TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        endereco TEXT NOT NULL
        )
    `);      // Adicionado a criação da tabela fornecedores

    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            quantidade_estoque INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            fornecedor_id INTEGER,
            FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
        )
    `);      // Adicionado a criação da tabela produtos

      console.log('Tabelas criadas com sucesso.');
  
});


//////////////////////////////   cliente   //////////////////////////////////////////////
//////////////////////////////   cliente   //////////////////////////////////////////////
//////////////////////////////   cliente   //////////////////////////////////////////////



//cadastrar cliente
app.post('/clientes', (req , res) => {
      const { nome, cpf, email, telefone, endereco } = req.body;

      if (!nome || !cpf) {
          return res.status(400).send('Nome e CPF são obrigatórios.');
      }

      const query = `INSERT INTO clientes (nome, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [nome, cpf, email, telefone, endereco], function (err) {
          if (err) {
              return res.status(500).send('Erro ao cadastrar cliente.');
          }
          res.status(201).send({ id: this.lastID, message: 'Cliente cadastrado com sucesso.' });
      });
});

// listar todos os clientes ou buscar por CPF
app.get('/clientes', (req , res) => {
    const { cpf } = req.query.cpf || ''; // Pega o CPF da query string, se existir

  if (cpf){
      const query = `SELECT * FROM clientes WHERE cpf = ?´;`
      db.all(query, [`%${cpf}%`], (err, rows) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ message: 'Erro ao buscar clientes.' });
                  }
                  res.json(rows);  // Retorna os clientes encontrados ou um array vazio
              });
          } else {
              // Se CPF não foi passado, retorna todos os clientes
              const query = `SELECT * FROM clientes`;

              db.all(query, (err, rows) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ message: 'Erro ao buscar clientes.' });
                  }
                  res.json(rows);  // Retorna todos os clientes
              });
          }
      });


// atualizar cliente
app.put('/clientes/cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, endereco } = req.body;

    const query = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, endereco, cpf], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar cliente.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Cliente não encontrado.');
        }
        res.send('Cliente atualizado com sucesso.');
    });
});


//////////////////////////////   fornecedor   //////////////////////////////////////////////
//////////////////////////////   fornecedor   //////////////////////////////////////////////
//////////////////////////////   fornecedor   //////////////////////////////////////////////


//cadastrar fornecedor
app.post('/fornecedores', (req , res) => {
      const { nome, cnpj, email, telefone, endereco, empresa } = req.body;

      if (!nome || !cnpj) {
          return res.status(400).send('Nome e CNPJ são obrigatórios.');
      }

      const query = `INSERT INTO fornecedores (nome, cnpj, email, telefone, endereco, empresa) VALUES (?, ?, ?, ?, ?, ?)`;
      db.run(query, [nome, cnpj, email, telefone, endereco, empresa], function (err) {
          if (err) {
              return res.status(500).send('Erro ao cadastrar fornecedor.');
          }
          res.status(201).send({ id: this.lastID, message: 'Fornecedor cadastrado com sucesso.' });
      });
});


// listar todos os fornecedores ou buscar por CNPJ
app.get('/fornecedores', (req , res) => {
    const { cnpj } = req.query.cnpj || ''; // Pega o CNPJ da query string, se existir

  if (cnpj){
      const query = `SELECT * FROM fornecedores WHERE cnpj = ?´;`
      db.all(query, [`%${cnpj}%`], (err, rows) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ message: 'Erro ao buscar fornecedores.' });
                  }
                  res.json(rows);  // Retorna os fornecedores encontrados ou um array vazio
              });
          } else {
              // Se CNPJ não foi passado, retorna todos os fornecedores
              const query = `SELECT * FROM fornecedores`;

              db.all(query, (err, rows) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ message: 'Erro ao buscar fornecedores.' });
                  }
                  res.json(rows);  // Retorna todos os fornecedores
              });
          }
      });





    //atualizar fornecedor
    app.put('/fornecedores/cnpj/:cnpj', (req, res) => {
        const { cnpj } = req.params;
        const { nome, email, telefone, endereco, empresa } = req.body;

        const query = `UPDATE fornecedores SET nome = ?, email = ?, telefone = ?, endereco = ?, empresa = ? WHERE cnpj = ?`;
        db.run(query, [nome, email, telefone, endereco, empresa, cnpj], function (err) {
            if (err) {
                return res.status(500).send('Erro ao atualizar fornecedor.');
            }
            if (this.changes === 0) {
                return res.status(404).send('Fornecedor não encontrado.');
            }
            res.send('Fornecedor atualizado com sucesso.');
        });
    }); 


/////////////////////////////  Produtos /////////////////////////////
/////////////////////////////  Produtos /////////////////////////////
/////////////////////////////  Produtos /////////////////////////////

//cadastrar produto
app.post('/produto', (req , res) => {
    const { nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id} = req.body;
    if (!nome || !preco || !quantidade_estoque || !tipo || !descricao || !fornecedor_id){
        return resizeBy.status(400).send('Todos os campos são obrigatórios.');
    }
    
     const query = `INSERT INTO produtos (nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?)`;
     db.run(query, [nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id], function (err) {
          if (err) {
              return res.status(500).send('Erro ao cadastrar produto.');
          }
          res.status(201).send({ id: this.lastID, message: 'Produto cadastrado com sucesso.' });
      });
});

// listar todos os produtos ou buscar por nome
app.get('/produtos', (req , res) => {
    const { nome } = req.query.nome || ''; 

  if (nome){
      const query = `SELECT * FROM produtos WHERE nome = ?´;`
      db.all(query, [`%${nome}%`], (err, rows) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ message: 'Erro ao buscar produto.' });
                  }
                  res.json(rows);  // Retorna os produtos encontrados ou um array vazio 
              });
          } else {
              // Se nome não foi passado, retorna todos os produtos
              const query = `SELECT * FROM produtos`;

              db.all(query, (err, rows) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ message: 'Erro ao buscar produtos.' });
                  }
                  res.json(rows);  // Retorna todos os produtos
              });
          }
      });





    //atualizar fornecedor
    app.put('/fornecedores/cnpj/:cnpj', (req, res) => {
        const { nome } = req.params;
        const { preco, quantidade_estoque, tipo, descricao, fornecedor_id } = req.body;

        const query = `UPDATE produtos SET preco = ?, quantidade_estoque = ?, tipo = ?, descricao = ?, fornecedor_id = ? WHERE nome = ?`;
        db.run(query, [ preco, quantidade_estoque, tipo, descricao, fornecedor_id, nome], function (err) {
            if (err) {
                return res.status(500).send('Erro ao atualizar produto.');
            }
            if (this.changes === 0) {
                return res.status(404).send('Produto não encontrado.');
            }
            res.send('Produto atualizado com sucesso.');
        });
    }); 



    
// Teste para verificar se o servidor está rodando
        app.get('/', (req, res) => {
            res.send('Servidor está rodando e tabelas criadas!');
        });

// Iniciando o servidor
        app.listen(port , () => {
            console.log(`Servidor rodando na porta ${port}`);
});