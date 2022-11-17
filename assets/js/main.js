var url = "http://localhost:5023/"


document.addEventListener('DOMContentLoaded', () => {
	"use strict";

	const preloader = document.querySelector('#preloader');
	if (preloader) {
		window.addEventListener('load', () => {
			preloader.remove();
		});
	}

	/**
	 * Animation 
	 */
	function aos_init() {
		AOS.init({
			duration: 1000,
			easing: 'ease-in-out',
			once: true,
			mirror: false
		});
	}
	window.addEventListener('load', () => {
		aos_init();

		let classeRef = document.getElementsByClassName("optionsCondominio")[0]
		createSelectCondominio(classeRef);
	});
});

function createSelectCondominio(ref, id, id_condominio) {
	let select = document.createElement('select')
	select.setAttribute('class', 'form-select selectCondo')
	select.setAttribute('id', id)

	

	let options = document.createElement('option')
	options.innerHTML = "Selecione..."
	select.appendChild(options)

	getAllCondominio().then((res) => {
		for (let condominios of res) {
			options = document.createElement('option')
			options.value = condominios.id
			// condominios.id = options.value
			options.innerHTML = condominios.nome_condominio
			select.appendChild(options)
		}
	})

	/**
	 * 
	 *  Select
	 * 		options
	 * 			value
	 * 			texto (visivel)
	 */	

	// console.log(select.options[select.selectedIndex].value)

	select.options[selectedOptions].selected = true
	

	// console.log(select.options[1])
	// select.options[select.selectedOptions] = 1

	// select.options[select.selectedIndex].value
	
	

	// select.selectedOptions = id_condominio

	// console.log(select.selectedOptions)

	// console.log(id_condominio)
	
	// select.options[id_condominio].selected = true



	console.log(select.selectedOptions)

	ref.appendChild(select)
}

function getAllCondominio() {
	return fetch(url + `condominio/getAll`).then((res) => res.json())
}

/** INICIO CRUD MORADOR*/

function cadastrarMorador() {
	//construcao do json que vai no body da criacao de usuario	
	let body =
	{
		'Nome': document.getElementById('morador_nome').value,
		'Email': document.getElementById('morador_email').value,
		'Cep': document.getElementById('morador_cep').value,
		'Logradouro': document.getElementById('morador_logradouro').value,
		'Numero': document.getElementById('morador_numero').value,
		'Complemento': document.getElementById('morador_complemento').value,
	};

	fetch(url + "moradores/cadastrar",
		{
			'method': 'POST',
			'redirect': 'follow',
			'headers':
			{
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			'body': JSON.stringify(body)
		})

		.then((response) => {
			if (response.ok) {
				return response.text()
			}
			else {
				return response.text().then((text) => {
					throw new Error(text)
				})
			}
		})

		//trata resposta
		.then((output) => {
			console.log(output)
			alert('Cadastro efetuado! :D')
		})

		//trata erro
		.catch((error) => {
			console.log(error)
			alert('Nao foi possivel efetuar o cadastro! :(')
		})

}

function listarMorardor() {
	//da um GET no endpoint "moradores"
	fetch(url + 'moradores/getAll')
		.then(response => response.json())
		.then((moradores) => {
			let listaMorador = document.getElementById('lista-morador')

			while (listaMorador.firstChild) {
				listaMorador.removeChild(listaMorador.firstChild)
			}

			//preenche div com moradores recebidos do GET
			for (let morador of moradores) {
				
				//cria div para as informacoes de um morador
				let divmorador = document.createElement('div')
				divmorador.setAttribute('class', 'php-email-form')



				//pega o nome do morador
				let divNome = document.createElement('input')
				divNome.placeholder = 'Nome Completo'
				divNome.value = morador.nome
				divNome.setAttribute('class', 'form-control nomeMorador')
				divmorador.appendChild(divNome)

				

				//pega o email do morador
				let divEmail = document.createElement('input')
				divEmail.placeholder = 'Email'
				divEmail.value = morador.email
				divEmail.setAttribute('class', 'form-control')
				divmorador.appendChild(divEmail)


				//pega o cep do morador
				let divCEP = document.createElement('input')
				divCEP.placeholder = 'CEP'
				divCEP.value = morador.cep
				divCEP.setAttribute('class', 'form-control inputForm')
				divmorador.appendChild(divCEP)

				let id = `${morador.cep}${morador.id}`;
				createSelectCondominio(divmorador, id, morador.id_condominio)

				
				//cria o botao para atualizar o morador
				let btnAtualizar = document.createElement('button')
				btnAtualizar.innerHTML = 'Atualizar'
				btnAtualizar.setAttribute('class', 'btn btn-success button')
				btnAtualizar.style.marginLeft = '5px'

				//cria o botao para remover o morador
				let btnRemover = document.createElement('button')
				btnRemover.innerHTML = 'Remover'
				btnRemover.setAttribute('class', 'btn btn-danger button')
				btnRemover.style.marginRight = '5px'

				btnRemover.addEventListener('click', function () {
					fetch(url + `moradores/deletar/${morador.id}`,
						{
							'method': 'DELETE'
						})
						.then((res) => {
							alert('Morador removido com sucesso!')
							listarMorardor()
						})
				})

				btnAtualizar.addEventListener('click', function () {
					let option = document.getElementById(id)

					let json = {
						'id_condominio': option.value,
						'nome': divNome.value,
						'email': divEmail.value,
						'cep': divCEP.value
					}

					console.log(json)

					fetch(url + `moradores/atualizar/${morador.id}`,
						{
							'method': 'PUT',
							'headers':
							{
								'Content-Type': 'application/json'
							},
							'body': JSON.stringify(json)
						})
						.then()
						.then((res) => {
							console.log(res)
						})
				})

				
				//cria a div com os dois botoes
				let divBotoes = document.createElement('div')
				divBotoes.style.display = 'flex'
				divBotoes.appendChild(btnAtualizar)
				divBotoes.appendChild(btnRemover)
				divmorador.appendChild(divBotoes)

				//insere a div do morador na div com a lista de moradores
				listaMorador.appendChild(divmorador)

				
			}
		})
}

//consultar morador 

/** FIM CRUD MORADOR*/

//lista-condominio


function listarCondominio() {
	//da um GET no endpoint "condominio"
	fetch(url + 'condominio/getAll')
		.then(response => response.json())
		.then((condominios) => {
			//pega div que vai conter a lista de condominio
			let listarCondominio = document.getElementById('lista-condominio')

			/*limpa div
			while(listarCondominio.firstChild)
			{
				listarCondominio.removeChild(listarCondominio.firstChild)
			}
		*/

			//preenche div com condominio recebidos do GET
			for (let condominio of condominios) {
				//cria div para as informacoes de um condominio
				let divcondominio = document.createElement('div')
				divcondominio.setAttribute('class', 'php-email-form')

				//pega o nome do condominio
				let divNomeC = document.createElement('input')
				divNomeC.placeholder = 'Nome Condominio'
				divNomeC.value = condominio.nome_condominio
				divNomeC.setAttribute('class', 'form-control')
				divcondominio.appendChild(divNomeC)

				//pega o cidade do condominio
				let divCidade = document.createElement('input')
				divCidade.placeholder = 'Cidade'
				divCidade.value = condominio.cidade_condominio
				divCidade.setAttribute('class', 'form-control')
				divcondominio.appendChild(divCidade)


				//cria o botao para remover o condominio
				let btnRemover = document.createElement('button')
				btnRemover.innerHTML = 'Remover'
				btnRemover.onclick = u => remover(condominio.id)
				divNomeC.setAttribute('class', 'btn',)
				btnRemover.style.marginRight = '5px'

				//cria o botao para atualizar o morador
				let btnAtualizar = document.createElement('button')
				btnAtualizar.innerHTML = 'Atualizar'
				btnAtualizar.onclick = u => atualizar(condominio.id, divNomeC, divCidade,)
				btnAtualizar.style.marginLeft = '5px'

				//cria a div com os dois botoes
				let divBotoes = document.createElement('div')
				divBotoes.style.display = 'flex'
				divBotoes.appendChild(btnRemover)
				divBotoes.appendChild(btnAtualizar)
				divcondominio.appendChild(divBotoes)

				//insere a div do morador na div com a lista de moradores
				listarCondominio.appendChild(divcondominio)
			}
		})
}

//consultar condominio 

/** FIM CRUD CONDOMINIO*/



function listarCobranca() {
	//da um GET no endpoint "cobranca"
	fetch(url + 'cobranca/getAll')
		.then(response => response.json())
		.then((cobrancas) => {
			//pega div que vai conter a lista de cobranca
			let listarCobranca = document.getElementById('lista-cobranca')


			//preenche div com cobranca recebidos do GET
			for (let cobranca of cobrancas) {
				//cria div para as informacoes de um condominio
				let divcobranca = document.createElement('div')
				divcobranca.setAttribute('class', 'php-email-form')

				//pega o nome do cobranca
				let divNome = document.createElement('input')
				divNome.placeholder = 'Nome Completo'
				divNome.value = cobranca.nome
				divNome.setAttribute('class', 'form-control')
				divcobranca.appendChild(divNome)

				//insere a div do morador na div com a lista de moradores
				listarCobranca.appendChild(divcobranca)
			}
		})
}
/** FIM CRUD COBRANCA*/