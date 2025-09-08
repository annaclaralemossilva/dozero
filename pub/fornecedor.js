// Inicialização quando o DOM é carregado
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("fornecedor-form");
    if (form) {
        form.addEventListener("submit", cadastrarFornecedor);
    }

    // Esconder o campo ID inicialmente
    const idInput = document.getElementById("id");
    if (idInput) {
        idInput.style.display = "none";
    }

    // Formatação do CNPJ
    const campoCnpj = document.getElementById("cnpj");
    if (campoCnpj) {
        campoCnpj.addEventListener("keypress", () => {
            let tamanhoCampo = campoCnpj.value.length;
            if (tamanhoCampo == 2 || tamanhoCampo == 6) {
                campoCnpj.value += ".";
            } else if (tamanhoCampo == 10) {
                campoCnpj.value += "/";
            } else if (tamanhoCampo == 15) {
                campoCnpj.value += "-";
            }
        });
    }
});

async function cadastrarFornecedor(event) {
    event.preventDefault();

    const fornecedor = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cnpj: document.getElementById("cnpj").value,
        endereco: document.getElementById("endereco").value,
    };

    try {
        const response = await fetch("/fornecedores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fornecedor),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Fornecedor cadastrado com sucesso!");
            document.getElementById("fornecedor-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar fornecedor.");
    }
}
// Função para listar todos os fornecedores ou buscar fornecedores /por CNPJ
async function listarFornecedores() {
    const cnpj = document.getElementById("cnpj").value.trim(); // Pega o valor do CNPJ digitado no input

    let url = "/fornecedores"; // URL padrão para todos os fornecedores

    if (cnpj) {
        // Se Cnpj foi digitado, adiciona o parâmetro de consulta
        url += `?cnpj=${cnpj}`;
    }

    try {
        const response = await fetch(url);
        const fornecedores = await response.json();

        const tabela = document.getElementById("tabela-fornecedores");
        tabela.innerHTML = ""; // Limpa a tabela antes de preencher

        if (fornecedores.length === 0) {
            // Caso não encontre fornecedores, exibe uma mensagem
            tabela.innerHTML =
                '<tr><td colspan="6">Nenhum fornecedor encontrado.</td></tr>';
        } else {
            fornecedores.forEach((fornecedor) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${fornecedor.id}</td>
                    <td>${fornecedor.nome}</td>
                    <td>${fornecedor.cnpj}</td>
                    <td>${fornecedor.email}</td>
                    <td>${fornecedor.telefone}</td>
                    <td>${fornecedor.endereco}</td>
                `;
                linha.addEventListener("click", () => {
                    selecionarFornecedor(
                        fornecedor.id,
                        fornecedor.nome,
                        fornecedor.telefone,
                        fornecedor.email,
                        fornecedor.cnpj,
                        fornecedor.endereco,
                    );
                });
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar fornecedores:", error);
    }
}
// Função para atualizar as informações do fornecedor
async function atualizarFornecedor() {
    const id = document.getElementById("id").value;
    const cnpj = document.getElementById("cnpj").value;

    if (!id) {
        alert(
            "Selecione um fornecedor para atualizar (clique em uma linha da tabela).",
        );
        return;
    }

    if (!cnpj) {
        alert("CNPJ é obrigatório para atualização.");
        return;
    }

    const fornecedorAtualizado = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
    };

    try {
        const response = await fetch(`/fornecedores/cnpj/${cnpj}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fornecedorAtualizado),
        });

        if (response.ok) {
            alert("Fornecedor atualizado com sucesso!");
            limparFormulario();
            listarFornecedores();
        } else {
            const errorMessage = await response.text();
            alert("Erro ao atualizar fornecedor: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        alert("Erro ao atualizar fornecedor.");
    }
}

// Função para selecionar fornecedor da tabela para edição
function selecionarFornecedor(id, nome, telefone, email, cnpj, endereco) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("telefone").value = telefone;
    document.getElementById("email").value = email;
    document.getElementById("cnpj").value = cnpj;
    document.getElementById("endereco").value = endereco;

    // Tornar o campo ID visível quando um fornecedor for selecionado
    const idInput = document.getElementById("id");
    if (idInput) {
        idInput.style.display = "block";
    }

    // Desabilitar o campo CNPJ durante edição para evitar problemas
    document.getElementById("cnpj").disabled = true;
}

// Função para limpar formulário
function limparFormulario() {
    document.getElementById("fornecedor-form").reset();
    document.getElementById("id").value = "";

    // Habilitar o campo CNPJ novamente
    document.getElementById("cnpj").disabled = false;

    // Esconder o campo ID novamente
    const idInput = document.getElementById("id");
    if (idInput) {
        idInput.style.display = "none";
    }
}

function limpaFornecedor() {
    limparFormulario();
}
