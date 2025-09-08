async function cadastrarFuncao(event) {
    event.preventDefault();

    const funcao = {
        nome: document.getElementById("nomefun").value,
        descricao: document.getElementById("descricao").value,
        salario: document.getElementById("salario").value,
        carga_horaria: document.getElementById("carga_horaria").value
    };

    try {
        const response = await fetch('/funcao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcao)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Função cadastrada com sucesso!");
            document.getElementById("funcao-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar função.");
    }
}

// Função para listagem
async function listarFuncao() {
    try {
        const response = await fetch('/funcao');
        const funcoes = await response.json();

        const tabela = document.getElementById('tabela-funcao');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (funcoes.length === 0) {
            tabela.innerHTML = '<tr><td colspan="4">Nenhuma função encontrada.</td></tr>';
        } else {
            funcoes.forEach(funcao => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcao.id}</td>
                    <td>${funcao.nomefun}</td>
                    <td>R$ ${funcao.salario.toFixed(2)}</td>
                    <td>${funcao.carga_horaria}h</td>
                `;
                linha.addEventListener('click', () => {
                    // Preencher os campos
                    document.getElementById('id').value = funcao.id;
                    document.getElementById('nomefun').value = funcao.nomefun;
                    document.getElementById('descricao').value = funcao.descricao;
                    document.getElementById('salario').value = funcao.salario;
                    document.getElementById('carga_horaria').value = funcao.carga_horaria;
                });
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar função:', error);
        alert('Erro ao carregar funções.');
    }
}

// Função para atualizar as informações
async function atualizarFuncao() {
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nomefun').value;
    const descricao = document.getElementById('descricao').value;
    const salario = document.getElementById('salario').value;
    const carga_horaria = document.getElementById('carga_horaria').value;

    if (!id) {
        alert('Selecione uma função para atualizar.');
        return;
    }

    const funcaoAtualizada = {
        nome,
        descricao,
        salario,
        carga_horaria
    };

    try {
        const response = await fetch(`/funcao/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcaoAtualizada)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Função atualizada com sucesso!');
            limpaFuncao();
            listarFuncao(); // Refresh the list
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar função:', error);
        alert('Erro ao atualizar função.');
    }
}

// Função para limpar o formulário
function limpaFuncao() {
    document.getElementById('id').value = '';
    document.getElementById('nomefun').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('salario').value = '';
    document.getElementById('carga_horaria').value = '';
}
