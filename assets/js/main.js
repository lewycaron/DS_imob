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

function createSelectCondominio(id = null) {
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
			options.innerHTML = condominios.nome_condominio
			select.appendChild(options)
		}
	})

	return select
}

function getAllCondominio() {
	return fetch(url + `condominio/getAll`).then((res) => res.json())
}

function getCondominioById(id) {
	var request = new XMLHttpRequest();
	request.open('GET', url + `condominio/get/${id}`, false);  // `false` makes the request synchronous
	request.send(null);

	return JSON.parse(request.response);

}

/** INICIO CRUD MORADOR*/

function cadastrarMorador() {
	let select = document.getElementsByClassName('selectCondo')[0]
	let nome = document.getElementById('morador_nome')
	let email = document.getElementById('morador_email')
	let cep = document.getElementById('morador_cep')

	if (select.value == "Selecione...") {
		alert("Selecione uma opção de condominio!")
		return;
	}

	let json = {
		'id_condominio': select.value,
		'nome': nome.value,
		'email': email.value,
		'cep': cep.value
	}

	create('moradores/cadastrar', json).then((res) => {
		alert("Morador salvo com sucesso!")

		nome.value = ""
		email.value = ""
		cep.value = ""
		select.value = "Selecione..."
	})

}

function cadastrarCondominio() {
	let nome = document.getElementById('nome_condominio')
	let cidade = document.getElementById('cidade_condominio')

	let json = {
		'nome_condominio': nome.value,
		'cidade_condominio': cidade.value
	}

	create('condominio/cadastrar', json).then((res) => {
		alert("Condominio cadastrado com sucesso!")

		nome.value = '',
		cidade.value = ''
	})
}

function update(path, json) {
	return fetch(url + path,
		{
			'method': 'PUT',
			'headers':
			{
				'Content-Type': 'application/json'
			},
			'body': JSON.stringify(json)
		})
}

function deletar(path) {
	return fetch(url + path,
		{
			'method': 'DELETE'
		})
}

function create(path, json) {
	return fetch(url + path, {
		'method': 'POST',
		'headers':
		{
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(json)
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

			for (let morador of moradores) {
				let divmorador = document.createElement('div')
				divmorador.setAttribute('class', 'php-email-form')

				let nomeP = createParagrafo("Morador -> " + morador.nome)
				let divNome = createInput()
				divmorador.appendChild(nomeP)
				divmorador.appendChild(divNome)


				let emailP = createParagrafo("Email -> " + morador.email)
				let divEmail = createInput()
				divmorador.appendChild(emailP)
				divmorador.appendChild(divEmail)


				let cepP = createParagrafo("Cep -> " + morador.cep)
				let divCEP = createInput()
				divmorador.appendChild(cepP)
				divmorador.appendChild(divCEP)

				let rep = getCondominioById(morador.id_condominio);
				let condominioP = createParagrafo("Condominio -> " + rep.data.nome_condominio)
				divmorador.appendChild(condominioP)

				let id = `${morador.cep}${morador.id}`;
				divmorador.appendChild(createSelectCondominio(divmorador, id))



				let btnRemover = createButtonRemove()
				let btnAtualizar = createButtonAtualizar();

				btnRemover.addEventListener('click', function () {

					deletar(`moradores/deletar/${morador.id}`).then(() => {
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

					update(`moradores/atualizar/${morador.id}`, json)
						.then((res) => alert('Morador atualizado com sucesso!'))
				})

				let divBotoes = document.createElement('div')
				divBotoes.style.display = 'flex'
				divBotoes.appendChild(btnAtualizar)
				divBotoes.appendChild(btnRemover)
				divmorador.appendChild(divBotoes)

				listaMorador.appendChild(divmorador)


			}
		})

}


function listarCondominio() {
	//da um GET no endpoint "condominio"
	fetch(url + 'condominio/getAll')
		.then(response => response.json())
		.then((condominios) => {
			let listarCondominio = document.getElementById('lista-condominio')

			while (listarCondominio.firstChild) {
				listarCondominio.removeChild(listarCondominio.firstChild)
			}

			for (let condominio of condominios) {
				let divcondominio = document.createElement('div')
				divcondominio.setAttribute('class', 'php-email-form')

				let paragrafoNome = createParagrafo("Condominio ->  " + condominio.nome_condominio)
				let paragrafoCidade = createParagrafo("Cidade -> " + condominio.cidade_condominio)

				let divNomeC = createInput()
				let divCidade = createInput()

				divcondominio.appendChild(paragrafoNome)
				divcondominio.appendChild(divNomeC)

				divcondominio.appendChild(paragrafoCidade)
				divcondominio.appendChild(divCidade)

				let btnRemover = createButtonRemove()
				let btnAtualizar = createButtonAtualizar();

				btnAtualizar.addEventListener('click', function () {

					let json = {
						'nome_condominio': divNomeC.value,
						'cidade_condominio': divCidade.value
					}

					update(`condominio/atualizar/${condominio.id}`, json)
					.then((res) => alert('Condominio atualizado com sucesso!'))
				})

				let divBotoes = document.createElement('div')
				divBotoes.style.display = 'flex'
				divBotoes.appendChild(btnRemover)
				divBotoes.appendChild(btnAtualizar)
				divcondominio.appendChild(divBotoes)

				let linha = document.createElement('hr')
				divcondominio.appendChild(linha)

				//insere a div do morador na div com a lista de moradores
				listarCondominio.appendChild(divcondominio)
			}
		})
}

//consultar condominio 


function createParagrafo(value) {
	let paragrafo = document.createElement('p')
	paragrafo.setAttribute('class', 'paragrafoForm')

	paragrafo.innerHTML = value

	return paragrafo
}

function createInput() {
	let input = document.createElement('input')
	input.placeholder = 'Alterar'
	input.style.fontSize = "13px";
	input.setAttribute('class', 'form-control')

	return input
}


function createButtonRemove() {
	let btnRemover = document.createElement('button')
	btnRemover.innerHTML = 'Remover'
	btnRemover.setAttribute('class', 'btn btn-danger button')
	btnRemover.style.marginRight = '5px'

	return btnRemover
}

function createButtonAtualizar() {
	let btnAtualizar = document.createElement('button')
	btnAtualizar.innerHTML = 'Atualizar'
	btnAtualizar.setAttribute('class', 'btn btn-success button')
	btnAtualizar.style.marginLeft = '5px'

	return btnAtualizar
}

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