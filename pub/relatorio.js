document.addEventListener('DOMContentLoaded', function() {

    // Formatação do CPF
    const campoCpf = document.getElementById("cpf");
    if (campoCpf) {
        campoCpf.addEventListener("keypress", () => {    
            let tamanhoCampo = campoCpf.value.length;
            if(tamanhoCampo == 3 || tamanhoCampo == 7){
                campoCpf.value += ".";
            }else if(tamanhoCampo == 11){
                campoCpf.value += "-";
            }
        });
    }

    // Carregar produtos no dropdown
    carregarProdutos();
});


// Função para buscar o relatório com filtros
function buscarRelatorio() {
    console.log("Função buscarRelatorio() foi chamada");
    const cpf = document.getElementById("cpf").value;
    const produto = document.getElementById("produto-nome").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    
    console.log("Valores dos campos:", {cpf, produto, dataInicio, dataFim});
    
    // Construir a URL com os parâmetros de filtro
    let url = `/relatorios?`;
    if (cpf) url += `cpf=${cpf}&`;
    if (produto) url += `produto=${produto}&`;
    if (dataInicio) url += `dataInicio=${dataInicio}&`;
    if (dataFim) url += `dataFim=${dataFim}&`;

    // Remover o último "&" se presente
    url = url.slice(0, -1);

    // Fazer a requisição para o servidor
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpar a tabela
            const tabelaVendas = document.getElementById("tabela-vendas");
            
            if (!tabelaVendas) {
                console.error("Elemento tabela-vendas não encontrado!");
                return;
            }
            
            tabelaVendas.innerHTML = '';

            // Preencher a tabela com os dados
            if (data.length === 0) {
                const tr = document.createElement("tr");
                tr.innerHTML = '<td colspan="5">Nenhuma venda encontrada</td>';
                tabelaVendas.appendChild(tr);
            } else {
                data.forEach(venda => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${venda.id}</td>
                        <td>${venda.cliente_nome}</td>
                        <td>${venda.produto_nome}</td>
                        <td>${venda.quantidade}</td>
                        <td>${new Date(venda.data).toLocaleString()}</td>
                    `;
                    tabelaVendas.appendChild(tr);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
            alert('Erro ao buscar relatórios: ' + error.message);
        });
}

// Função para carregar produtos no dropdown
async function carregarProdutos() {
    try {
        const response = await fetch('/produto');
        const produtos = await response.json();
        
        const selectProduto = document.getElementById('produto-nome');
        
        // Limpa o select (mantém apenas a opção padrão)
        selectProduto.innerHTML = '<option value="">Selecione o produto</option>';
        
        // Adiciona cada produto como uma opção
        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.nome;
            option.textContent = produto.nome;
            selectProduto.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar a lista de produtos.');
    }
}
