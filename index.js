const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static("pub"));
app.use(bodyParser.json());

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

// criação das tabelas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    cpf TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL,
                    telefone TEXT NOT NULL,
                    endereco TEXT NOT NULL
                  )
                `); // Adicionado a crição da tabela clientes

    db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    cnpj TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL,
                    telefone TEXT NOT NULL,
                    endereco TEXT NOT NULL
                    )
                `); // Adicionado a criação da tabela fornecedores

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
                    `); // Adicionado a criação da tabela produtos

    db.run(`
                        CREATE TABLE IF NOT EXISTS funcao(
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            nomefun TEXT NOT NULL,
                            descricao TEXT NOT NULL,
                            salario REAL NOT NULL,
                            carga_horaria INTEGER NOT NULL
                        )
                    `); // Adicionado a criação da tabela funcao

    db.run(`
                        CREATE TABLE IF NOT EXISTS funcionarios (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            nome TEXT NOT NULL,
                            cpf TEXT NOT NULL UNIQUE,
                            rg TEXT NOT NULL,
                            email TEXT NOT NULL,
                            telefone TEXT NOT NULL,
                            data_nascimento TEXT NOT NULL,
                            data_contratacao TEXT NOT NULL,
                            endereco TEXT NOT NULL,
                            funcao_id INTEGER,
                            FOREIGN KEY (funcao_id) REFERENCES funcao(id)
                        )
                    `); // Adicionado a criação da tabela funcionarios

    db.run(`
                        CREATE TABLE IF NOT EXISTS vendas (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            cliente_cpf TEXT NOT NULL,
                            produto_id INTEGER NOT NULL,
                            quantidade INTEGER NOT NULL,
                            data TEXT NOT NULL,
                            FOREIGN KEY (cliente_cpf) REFERENCES clientes(cpf),
                            FOREIGN KEY (produto_id) REFERENCES produtos(id)
                            )
                    `); // Adicionado a criação da tabela vendas

    db.run(`
                        CREATE TABLE IF NOT EXISTS carrinho (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            cliente_cpf TEXT NOT NULL,
                            produto_id INTEGER NOT NULL,
                            quantidade INTEGER NOT NULL,
                            data_adicao TEXT NOT NULL,
                            FOREIGN KEY (cliente_cpf) REFERENCES clientes(cpf),
                            FOREIGN KEY (produto_id) REFERENCES produtos(id)
                        )
                    `);
    // Adicionado a criação da tabela carrinho

    console.log("Tabelas criadas com sucesso.");
});

//////////////////////////////   cliente //////////////////////////////////////////////
//////////////////////////////   cliente   //////////////////////////////////////////////
//////////////////////////////   cliente   //////////////////////////////////////////////

//cadastrar cliente
app.post("/clientes", (req, res) => {
    const { nome, cpf, email, telefone, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send("Nome e CPF são obrigatórios.");
    }

    const query = `INSERT INTO clientes (nome, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, email, telefone, endereco], function (err) {
        if (err) {
            return res.status(500).send("Erro ao cadastrar cliente.");
        }
        res.status(201).send({
            id: this.lastID,
            message: "Cliente cadastrado com sucesso.",
        });
    });
});

// buscar cliente por CPF específico
app.get("/clientes/:cpf", (req, res) => {
    const { cpf } = req.params;

    const query = `SELECT * FROM clientes WHERE cpf = ?`;
    db.get(query, [cpf], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao buscar cliente." });
        }
        if (!row) {
            return res.status(404).json({ message: "Cliente não encontrado." });
        }
        res.json(row);
    });
});

// listar todos os clientes ou buscar por CPF
app.get("/clientes", (req, res) => {
    const cpf = req.query.cpf || ""; // Pega o CPF da query string, se existir

    if (cpf) {
        const query = `SELECT * FROM clientes WHERE cpf = ?`;
        db.all(query, [cpf], (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna todos os clientes
        });
    }
});

// atualizar cliente
app.put("/clientes/cpf/:cpf", (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, endereco } = req.body;

    const query = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, endereco, cpf], function (err) {
        if (err) {
            return res.status(500).send("Erro ao atualizar cliente.");
        }
        if (this.changes === 0) {
            return res.status(404).send("Cliente não encontrado.");
        }
        res.send("Cliente atualizado com sucesso.");
    });
});

//////////////////////////////   fornecedor   //////////////////////////////////////////////
//////////////////////////////   fornecedor   //////////////////////////////////////////////
//////////////////////////////   fornecedor   //////////////////////////////////////////////

//cadastrar fornecedor
app.post("/fornecedores", (req, res) => {
    const { nome, cnpj, email, telefone, endereco } = req.body;

    if (!nome || !cnpj) {
        return res
            .status(400)
            .json({ message: "Nome e CNPJ são obrigatórios." });
    }

    const query = `INSERT INTO fornecedores (nome, cnpj, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, cnpj, email, telefone, endereco], function (err) {
        if (err) {
            return res
                .status(500)
                .json({ message: "Erro ao cadastrar fornecedor." });
        }
        res.status(201).json({
            id: this.lastID,
            message: "Fornecedor cadastrado com sucesso.",
        });
    });
});

// listar todos os fornecedores ou buscar por CNPJ
app.get("/fornecedores", (req, res) => {
    const query = `SELECT * FROM fornecedores`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Erro ao listar fornecedores." });
        }
        res.json(rows);
    });
});

//atualizar fornecedor
app.put("/fornecedores/cnpj/:cnpj", (req, res) => {
    const { cnpj } = req.params;
    const { nome, email, telefone, endereco } = req.body;

    const query = `UPDATE fornecedores SET nome = ?, email = ?, telefone = ?, endereco = ?  WHERE cnpj = ?`;
    db.run(query, [nome, email, telefone, endereco, cnpj], function (err) {
        if (err) {
            return res
                .status(500)
                .json({ message: "Erro ao atualizar fornecedor." });
        }
        if (this.changes === 0) {
            return res
                .status(404)
                .json({ message: "Fornecedor não encontrado." });
        }
        res.json({ message: "Fornecedor atualizado com sucesso." });
    });
});

/////////////////////////////  Produtos /////////////////////////////
/////////////////////////////  Produtos /////////////////////////////
/////////////////////////////  Produtos /////////////////////////////

//cadastrar produto
app.post("/produto", (req, res) => {
    const { nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id } =
        req.body;
    if (
        !nome ||
        !preco ||
        !quantidade_estoque ||
        !tipo ||
        !descricao ||
        !fornecedor_id
    ) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const query = `INSERT INTO produtos (nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
        query,
        [nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id],
        function (err) {
            if (err) {
                return res.status(500).send("Erro ao cadastrar produto.");
            }
            res.status(201).send({
                id: this.lastID,
                message: "Produto cadastrado com sucesso.",
            });
        },
    );
});

// listar todos os produtos

app.get("/produto", (req, res) => {
    const query = `SELECT * FROM produtos`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Erro ao listar produtos." });
        }
        res.json(rows);
    });
});

// buscar produtos para carrinho
app.get("/produtos_carrinho/:id", (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM produtos WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao buscar produto." });
        }
        if (!row) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }
        res.json(row);
    });
});

// atualizar produto
app.put("/produto/:id", (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao, tipo, quantidade_estoque, fornecedor_id } =
        req.body;

    const query = `UPDATE produtos SET nome = ?, preco = ?, quantidade_estoque = ?, tipo = ?, descricao = ?, fornecedor_id = ? WHERE id = ?`;
    db.run(
        query,
        [nome, preco, quantidade_estoque, tipo, descricao, fornecedor_id, id],
        function (err) {
            if (err) {
                console.error("Erro ao atualizar produto:", err);
                return res
                    .status(500)
                    .json({ message: "Erro ao atualizar produto." });
            }
            if (this.changes === 0) {
                return res
                    .status(404)
                    .json({ message: "Produto não encontrado." });
            }
            res.json({ message: "Produto atualizado com sucesso." });
        },
    );
});

// ROTA PARA BUSCAR TODOS OS FORNECEDORES PARA CADASTRAR O PRODUTO
app.get("/buscar-fornecedores", (req, res) => {
    db.all("SELECT id, nome FROM fornecedores", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar serviços:", err);
            res.status(500).send("Erro ao buscar serviços");
        } else {
            res.json(rows); // Retorna os serviços em formato JSON
        }
    });
});

// ROTA PARA BUSCAR TODOS OS PRODUTOS PARA VENDAS
app.get("/buscar-produtos", (req, res) => {
    db.all(
        "SELECT id, nome, quantidade_estoque FROM produtos",
        [],
        (err, rows) => {
            if (err) {
                console.error("Erro ao buscar produtos:", err);
                res.status(500).send("Erro ao buscar produtos");
            } else {
                res.json(rows);
            }
        },
    );
});

///////////////////////////////  funçao /////////////////////////////
///////////////////////////////  funçao /////////////////////////////
///////////////////////////////  funçao /////////////////////////////

//cadastrar funcao
app.post("/funcao", (req, res) => {
    const { nome, descricao, salario, carga_horaria } = req.body;
    if (!nome || !descricao || !salario || !carga_horaria) {
        return res
            .status(400)
            .json({ message: "Todos os campos são obrigatórios." });
    }
    const query = `INSERT INTO funcao (nomefun, descricao, salario, carga_horaria) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, descricao, salario, carga_horaria], function (err) {
        if (err) {
            return res
                .status(500)
                .json({ message: "Erro ao cadastrar funcao." });
        }
        res.status(201).json({
            id: this.lastID,
            message: "Funcao cadastrada com sucesso.",
        });
    });
});

// listar todos as funcoes
app.get("/funcao", (req, res) => {
    const query = `SELECT * FROM funcao`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao listar funcoes." });
        }
        res.json(rows);
    });
});

// atualizar funcao

app.put("/funcao/:id", (req, res) => {
    const { id } = req.params;
    const { nome, descricao, salario, carga_horaria } = req.body;
    const query = `UPDATE funcao SET nomefun = ?, descricao = ?, salario = ?, carga_horaria = ? WHERE id = ?`;
    db.run(
        query,
        [nome, descricao, salario, carga_horaria, id],
        function (err) {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Erro ao atualizar funcao." });
            }
            if (this.changes === 0) {
                return res
                    .status(404)
                    .json({ message: "Funcao não encontrada." });
            }
            res.json({ message: "Funcao atualizada com sucesso." });
        }
    );
});

///////////////////////////////  Funcionario /////////////////////////////
///////////////////////////////  Funcionario /////////////////////////////
///////////////////////////////  Funcionario /////////////////////////////

    //cadastrar funcionario
    app.post("/funcionarios", (req, res) =>{
        const { nome, cpf, rg, email, telefone, data_nascimento, data_contratacao, endereco, funcao_id } = req.body;
        if (!nome || !cpf || !rg || !email || !telefone || !data_nascimento || !data_contratacao || !endereco || !funcao_id) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }
        const query = `INSERT INTO funcionarios (nome, cpf, rg, email, telefone, data_nascimento, data_contratacao, endereco, funcao_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [nome, cpf, rg, email, telefone, data_nascimento, data_contratacao, endereco, funcao_id], function (err) {
            if (err) {
                return res.status(500).json({ message: "Erro ao cadastrar funcionario." });
            }
            res.status(201).json({
                id: this.lastID,
                message: "Funcionario cadastrado com sucesso."
            });
        });
    });

  //listar todos os funcionarios

    app.get("/funcionarios", (req, res) => {
        const query = `SELECT f.*, fun.nomefun as funcao_nome FROM funcionarios f LEFT JOIN funcao fun ON f.funcao_id = fun.id`;
        db.all(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao listar funcionarios." });
            }
            res.json(rows);
        });
    });

 // atualizar funcionario
    app.put("/funcionarios/cpf/:cpf", (req, res) => {
        const { cpf } = req.params;
        const { nome, rg, email, telefone, data_nascimento, data_contratacao, endereco, funcao_id } = req.body;
        const query = `UPDATE funcionarios SET nome = ?, rg = ?, email = ?, telefone = ?, data_nascimento = ?, data_contratacao = ?, endereco = ?, funcao_id = ? WHERE cpf = ?`;
        db.run(query, [nome, rg, email, telefone, data_nascimento, data_contratacao, endereco, funcao_id, cpf], function (err) {
            if (err) {
                return res.status(500).json({ message: "Erro ao atualizar funcionario." });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Funcionario não encontrado." });
            }
            res.json({ message: "Funcionario atualizado com sucesso." });
        });
    });



///////////////////////////////  Vendas /////////////////////////////
///////////////////////////////  Vendas /////////////////////////////
///////////////////////////////  Vendas /////////////////////////////

app.post("/vendas", (req, res) => {
    const { cliente_cpf, itens } = req.body;

    if (!cliente_cpf || !itens || itens.length === 0) {
        return res.status(400).send("Dados de venda incompletos.");
    }
    const dataVenda = new Date().toISOString();

    db.serialize(() => {
        const insertSaleQuery = `INSERT INTO vendas (cliente_cpf, produto_id, quantidade, data) VALUES (?, ?, ?, ?)`;
        const updateStockQuery = `UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?`;

        let erroOcorrido = false;

        itens.forEach(({ idProduto, quantidade }) => {
            if (!idProduto || !quantidade || quantidade <= 0) {
                console.error(
                    `Dados inválidos para o produto ID: ${idProduto}, quantidade: ${quantidade}`,
                );
                erroOcorrido = true;
                return;
            }

            // Registrar a venda
            db.run(
                insertSaleQuery,
                [cliente_cpf, idProduto, quantidade, dataVenda],
                function (err) {
                    if (err) {
                        console.error("Erro ao registrar venda:", err.message);
                        erroOcorrido = true;
                    }
                },
            );

            // Atualizar o estoque
            db.run(updateStockQuery, [quantidade, idProduto], function (err) {
                if (err) {
                    console.error("Erro ao atualizar estoque:", err.message);
                    erroOcorrido = true;
                }
            });
        });

        if (erroOcorrido) {
            res.status(500).send("Erro ao processar a venda.");
        } else {
            res.status(201).send({ message: "Venda registrada com sucesso." });
        }
    });
});

///////////////////////////// consulta /////////////////////////////
///////////////////////////// consulta /////////////////////////////
///////////////////////////// consulta /////////////////////////////

// Rota para buscar relatórios de vendas com filtros
app.get("/relatorios", (req, res) => {
    const { cpf, produto, dataInicio, dataFim } = req.query;

    let query = `SELECT 
                        v.id, 
                        c.nome AS cliente_nome,
                        p.nome AS produto_nome, 
                        v.quantidade, 
                        v.data
                    FROM vendas v
                    JOIN clientes c ON v.cliente_cpf = c.cpf
                    JOIN produtos p ON v.produto_id = p.id
                    WHERE 1=1`; // 1=1 é uma técnica para facilitar a adição de condições

    const params = []; // Array para armazenar os parâmetros

    if (cpf) {
        query += ` AND c.cpf = ?`;
        params.push(cpf);
    }

    if (produto) {
        query += ` AND p.nome LIKE ?`;
        params.push(`%${produto}%`);
    }

    if (dataInicio) {
        query += ` AND v.data >= ?`;
        params.push(dataInicio);
    }

    if (dataFim) {
        query += ` AND v.data <= ?`;
        params.push(dataFim);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Erro ao buscar relatórios:", err);
            res.status(500).send("Erro ao buscar relatórios");
        } else {
            res.json(rows);
        }
    });
});

// Teste para verificar se o servidor está rodando
app.get("/", (req, res) => {
    res.send("Servidor está rodando e tabelas criadas!");
});

// Iniciando o servidor
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});
