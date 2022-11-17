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

		let classeRef1 = document.getElementsByClassName("optionsCondominio")[0]
		createSelectCondominio(null, classeRef1);
		let classeRef2 = document.getElementsByClassName("optionsCondominio")[1]
		createSelectCondominio(null, classeRef2)
		let classRef3 = document.getElementsByClassName("optionsMoradores")[0]
		createSelectMorador(null, classRef3)
	});
});

function createSelectCondominio(id = null, ref) {
	let select = document.createElement('select')
	select.setAttribute('class', 'form-select selectCondo')
	if(id != null)
	{
		select.setAttribute('id', id)
	}

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

	if(ref != null)
	{
		ref.appendChild(select)
	}

	return select
}

function createSelectMorador(id = null, ref) {
	let select = document.createElement('select')
	select.setAttribute('class', 'form-select selectMorador')
	if(id != null)
	{
		select.setAttribute('id', id)
	}

	let options = document.createElement('option')
	options.innerHTML = "Selecione..."
	select.appendChild(options)

	getAllMoradores().then((res) => {
		for (let moradores of res) {
			options = document.createElement('option')
			options.value = moradores.id
			options.innerHTML = moradores.nome
			select.appendChild(options)
		}
	})

	if(ref != null)
	{
		ref.appendChild(select)
	}

	return select
}

function getAllCondominio() {
	return fetch(url + `condominio/getAll`).then((res) => res.json())
}

function getAllMoradores() {
	return fetch(url + `moradores/getAll`).then((res) => res.json())
}

function getCondominioById(id) {
	var request = new XMLHttpRequest();
	request.open('GET', url + `condominio/get/${id}`, false);  // `false` makes the request synchronous
	request.send(null);

	return JSON.parse(request.response);
}

function getMoradorById(id) {
	var request = new XMLHttpRequest();
	request.open('GET', url + `moradores/get/${id}`, false);  // `false` makes the request synchronous
	request.send(null);

	return JSON.parse(request.response);

}

function isEmpty(campo)
{
	if(campo == null || campo == "")
	{
		return true
	}
	return false
}

function cadastrarCobranca()
{
	let id_morador = document.getElementsByClassName('selectMorador')[0]
	let id_condominio = document.getElementsByClassName('selectCondo')[1]
	let tipo_pagamento = document.getElementById('tipo_pagamento')
	let vencimento = document.getElementById('data_pagamento')

	if(id_morador.value == "Selecione...")
	{
		alert("Preencha um morador!")
		return;
	}

	if(id_condominio.value == "Selecione...")
	{
		alert("Preencha um condominio!")
		return;
	}

	if(isEmpty(tipo_pagamento.value))
	{
		alert("Preencha um tipo do pagamento!")
		return;
	}

	if(isEmpty(vencimento.value))
	{
		alert("Escolha uma data de vencimento!")
		return;
	}

	let json = {
		'id_morador': id_morador.value,
		'id_condominio': id_condominio.value,
		'tipo_pagamento': tipo_pagamento.value,
		'vencimento': vencimento.value
	}
	console.log(json)
	create('cobranca/adicionar', json)

	console.log()

	let sec = document.getElementById('lista-cobranca')

	let info = createParagrafo((tipo_pagamento.value + " - " + vencimento.value + " - " + getCondominioById(id_condominio.value).data.nome_condominio + " - " + getMoradorById(id_morador.value).nome))
	sec.appendChild(info)

}

function cadastrarMorador() {
	let select = document.getElementsByClassName('selectCondo')[0]
	let nome = document.getElementById('morador_nome')
	let email = document.getElementById('morador_email')
	let cep = document.getElementById('morador_cep')

	if(isEmpty(nome.value))
	{
		alert("Digite um nome pro morador")
		return;
	}

	if(isEmpty(email.value))
	{
		alert("Digite um email pro morador")
		return;
	}

	if(isEmpty(cep.value))
	{
		alert("Digite um cep pro morador")
		return;
	}

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

	if(isEmpty(nome.value))
	{
		alert("Digite o nome do condominio")
		return
	}

	if(isEmpty(cidade.value))
	{
		alert("Digite uma cidade para o condominio")
		return
	}

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
				console.log(rep)
				let condominioP = createParagrafo("Condominio -> " + rep.data.nome_condominio)
				divmorador.appendChild(condominioP)

				let id = `${morador.cep}${morador.id}`;
				divmorador.appendChild(createSelectCondominio(id, divmorador))



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
					let nomeMorador;
					let emailMorador;
					let cepMorador;

					if(divNome.value == null || divNome.value == "")
					{
						nomeMorador = morador.nome
					}else {
						nomeMorador = divNome.value
					}

					if(divEmail.value == null || divEmail.value == "")
					{
						emailMorador = morador.email
					}else {
						emailMorador = divEmail.value
					}

					if(divCEP.value == null || divCEP.value == "")
					{
						cepMorador = morador.cep
					}else {
						cepMorador = divCEP.value
					}

					let json = {
						'id_condominio': option.value,
						'nome': nomeMorador,
						'email': emailMorador,
						'cep': cepMorador
					}

					console.log(json)

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
			let listaCondominio = document.getElementById('lista-condominio')

			while (listaCondominio.firstChild) {
				listaCondominio.removeChild(listaCondominio.firstChild)
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
					let nomeCondominio;
					let cidadeCondominio;

					if(divNomeC.value == null || divNomeC.value == "")
					{
						nomeCondominio = condominio.nome_condominio
					}else {
						nomeCondominio = divNomeC.value
					}

					if(divCidade.value == null || divCidade.value == "")
					{
						cidadeCondominio = condominio.cidade_condominio
					}else {
						cidadeCondominio = divCidade.value
					}

					let json = {
						'nome_condominio': nomeCondominio,
						'cidade_condominio': cidadeCondominio
					}

					update(`condominio/atualizar/${condominio.id}`, json)
					.then((res) => alert('Condominio atualizado com sucesso!'))
				})

				btnRemover.addEventListener('click', function (){
					deletar(`condominio/deletar/${condominio.id}`).then(() => {
						alert('Condominio deletado com sucesso!')
						listarCondominio()
					})
				})

				let divBotoes = document.createElement('div')
				divBotoes.style.display = 'flex'
				divBotoes.appendChild(btnRemover)
				divBotoes.appendChild(btnAtualizar)
				divcondominio.appendChild(divBotoes)

				let linha = document.createElement('hr')
				divcondominio.appendChild(linha)

				//insere a div do morador na div com a lista de moradores
				listaCondominio.appendChild(divcondominio)
			}
		})
}

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