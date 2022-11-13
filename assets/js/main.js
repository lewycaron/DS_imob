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
  });

});


  /** INICIO CODIGO DE VALIDAÇAO */

   //verifica campo com tamanho muito pequeno
   function muitoCurto(campo, nome, tamanho) {
    if (campo.value.length >= tamanho) return false;
    alert("O conteúdo do campo '" + nome
      + "' deve ter pelo menos " + tamanho + " caracteres."
      + " Por favor, preencha-o corretamente.");
    return true;
  }

  //verifica campo com tamanho muito grande
  function tamanhoErrado(campo, nome, tamanho) {
    if (campo.value.length <= 50) return false;
    alert("O conteúdo do campo '" + nome
      + "' possui mais de " + tamanho + " caracteres. "
      + "Por favor, preencha-o corretamente.");
    return true;
  }

  //verifica campo para ser apenas numerico
  function naoNumerico(campo, nome) {
    if (!isNaN(campo.value)) return false;
    alert("Digite somente números no campo '" + nome + "', por favor.");
    return true;
  }

  //verifica campo para nao ser numerico
  function Numerico(campo, nome) {
    if (isNaN(campo.value)) return false;
    alert("Digite somente números no campo '" + nome + "', por favor.");
    return true;
  }

  //verifica campo com caracter 'errado'
  function validarstring($string) {
    return !!preg_match('|^[\pL\s]+$|u', $string);
  }

  //validador - THAIS
  function validarFormulario() {
    
    var cad = document.getElementById('cad');
    if (muitoCurto(cad.nome_condominio, 'Nome Condominio', 2)) return;
    cad.submit();
    if (muitoCurto(cad.cidade_codominio, 'Cidade', 2)) return;
    cad.submit();


    if (tamanhoErrado(cad.nome_condominio, 'Nome', 50)) return;
    cad.submit();
    if (tamanhoErrado(cad.cidade_codominio, 'Cidade', 50)) return;
    cad.submit();


    if (Numerico(cad.nome_condominio, 'Nome', 50)) return;
    cad.submit();
    if (Numerico(cad.cidade_codominio, 'Cidade', 50)) return;
    cad.submit();


    if (validarstring(cad.nome_condominio, 'Nome', 50)) return;
    cad.submit();
    if (validarstring(cad.cidade_codominio, 'Cidade', 50)) return;
    cad.submit();

  }

  //validador - THAIS
  function validarFormulario2() {
    var id_morador = document.getElementById("id_morador").value;
    if (id_morador == '') {
      alert("Campo ID Morador é Obrigatorio")
    }

    var nome = document.getElementById("nome_morador").value;
    var padrao = /[^a-zà-ú]/gi;
    var valida_nome = nome.match(padrao);
    
    if (valida_nome || !nome) {
      alert("Nome possui caracteres inválidos ou é vazio")
    }
    
  }

  //validador - THAIS
  function validarFormulario3() {
    var tipo_pagamento = document.getElementById("tipo_pagamento").value;
    if (tipo_pagamento == '') {
      alert("Campo tipo pagamento Obrigatorio")
    }

    var valor_pagamento = document.getElementById("valor_pagamento").value;
    if (valor_pagamento == '') {
      alert("Campo valor pagamento Obrigatorio")
    }
  }

  //valida cep
  function getLogradouro() {
    
    fetch('https://viacep.com.br/ws/' + document.getElementById('morador_cep').value + '/json')
    .then(response => response.json())
    .then((output) => {
      document.getElementById('morador_logradouro').value = output.logradouro
    })
    
  }
  
  /* EXEMPLO KAUAN


  fetch(url).then(res => {
    res.json().then(data => {
      localStorage.setItem('data', data)
      console.log(data.data.nome_condominio)
    })
  })

  */

  //https://pt.stackoverflow.com/questions/300205/validar-nome-e-sobrenome-no-javascript
  
/** FIM CODIGO DE VALIDAÇAO */


/** INICIO CRUD MORADOR*/

function cadastrarMorador()
{
	//validacao de alguns dos inputs

  
  /* *****************************TODO: AJUSTAR CONFORME NOSSO PROJETO


	if(!validaNome('nome-completo'))
	{
		return
	}
	
	if(!validaData('data-nascimento'))
	{
		return
	}
	
	if(!validaSenha('senha'))
	{
		return
	}
	
	if(!confirmaSenha('confirma-senha'))
	{
		return
	}
  
  */
	

	//construcao do json que vai no body da criacao de usuario	
	
  
	let body =
	{
	  'Nome':        document.getElementById('morador_nome').value,
		'Email':       document.getElementById('morador_email').value,
		'Cep':         document.getElementById('morador_cep').value,
		'Logradouro':  document.getElementById('morador_logradouro').value,
		'Numero':      document.getElementById('morador_numero').value,
		'Complemento': document.getElementById('morador_complemento').value,
	};
	


	//envio da requisicao usando a FETCH API


	
	//configuracao e realizacao do POST no endpoint "moradores"
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



	//checa se requisicao deu certo
	.then((response) =>
	{
		if(response.ok)
		{
			return response.text()
		}
		else
		{
			return response.text().then((text) =>
			{
				throw new Error(text)
			})
		}
	})


	//trata resposta
	.then((output) =>
	{
		console.log(output)
		alert('Cadastro efetuado! :D')
	})
	
	//trata erro
	.catch((error) =>
	{
		console.log(error)
		alert('Nao foi possivel efetuar o cadastro! :(')
	})
	
}

///lista-morador

function listarMorardor()
{
	//da um GET no endpoint "moradores"
	fetch(url + 'moradores/getAll')
	.then(response => response.json())
	.then((moradores) =>
	{
		//pega div que vai conter a lista de moradores
		let listaMorador = document.getElementById('lista-morador')
		
		/*limpa div
		while(listaMorador.firstChild)
		{
			listaMorador.removeChild(listaMorador.firstChild)
		}
    */
		
		//preenche div com moradores recebidos do GET
		for(let morador of moradores)
		{
			//cria div para as informacoes de um morador
			let divmorador = document.createElement('div')
			divmorador.setAttribute('class', 'php-email-form')
			
			//pega o nome do morador
			let divNome = document.createElement('input')
			divNome.placeholder = 'Nome Completo'
			divNome.value = morador.nome
      divNome.setAttribute('class', 'form-control')
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
			divCEP.value = morador.Cep
      divCEP.setAttribute('class', 'form-control')
			divmorador.appendChild(divCEP)
			
      //pega o logradouro do morador
			let divLogradouro = document.createElement('input')
			divLogradouro.placeholder = 'Logradouro'
			divLogradouro.value = morador.logradouro
      divLogradouro.setAttribute('class', 'form-control')
			divmorador.appendChild(divLogradouro)
			

      //pega o numero do morador
			let divNumero = document.createElement('input')
			divNumero.placeholder = 'Numero'
			divNumero.value = morador.Numero
      divNumero.setAttribute('class', 'form-control')
			divmorador.appendChild(divNumero)

      //pega o complemento do morador
			let divcomplemento = document.createElement('input')
			divcomplemento.placeholder = 'complemento'
			divcomplemento.value = morador.complemento
      divcomplemento.setAttribute('class', 'form-control')
			divmorador.appendChild(divcomplemento)
			

			//cria o botao para remover o morador
			let btnRemover = document.createElement('button')
			btnRemover.innerHTML = 'Remover'
			btnRemover.onclick = u => remover(morador.id)
      divNome.setAttribute('class', 'btn' , )
			btnRemover.style.marginRight = '5px'
			
			//cria o botao para atualizar o morador
			let btnAtualizar = document.createElement('button')
			btnAtualizar.innerHTML = 'Atualizar'
			btnAtualizar.onclick = u => atualizar(morador.id, divNome, divEmail, divCEP, divLogradouro, divNumero, divcomplemento)
			btnAtualizar.style.marginLeft = '5px'
			
			//cria a div com os dois botoes
			let divBotoes = document.createElement('div')
			divBotoes.style.display = 'flex'
			divBotoes.appendChild(btnRemover)
			divBotoes.appendChild(btnAtualizar)
			divmorador.appendChild(divBotoes)
			
			//insere a div do morador na div com a lista de moradores
			listaMorador.appendChild(divmorador)
		}
	})
}
//consultar morador 
var btn = document.getElementById('btn-morador');
var listaM = document.querySelector('.listaM');
var PrincipalM = document.querySelector('.PrincipalM');
btn.addEventListener('click', function () {
  
  PrincipalM.style.display = 'none';
  listaM.style.display = 'block';

});

var btnVM = document.getElementById('btn-voltarM');
btnVM.addEventListener('click', function () {

  listaM.style.display = 'none';
  PrincipalM.style.display = 'block';

});
/** FIM CRUD MORADOR*/

//lista-condominio

function listarCondominio()
{
	//da um GET no endpoint "condominio"
	fetch(url + 'condominio/getAll')
	.then(response => response.json())
	.then((condominios) =>
	{
		//pega div que vai conter a lista de condominio
		let listarCondominio = document.getElementById('lista-condominio')
		
		/*limpa div
		while(listarCondominio.firstChild)
		{
			listarCondominio.removeChild(listarCondominio.firstChild)
		}
    */
		
		//preenche div com condominio recebidos do GET
		for(let condominio of condominios)
		{
			//cria div para as informacoes de um condominio
			let divcondominio = document.createElement('div')
			divcondominio.setAttribute('class', 'php-condominio-form')
			
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
      divNomeC.setAttribute('class', 'btn' , )
			btnRemover.style.marginRight = '5px'
			
			//cria o botao para atualizar o morador
			let btnAtualizar = document.createElement('button')
			btnAtualizar.innerHTML = 'Atualizar'
			btnAtualizar.onclick = u => atualizar(condominio.id, divNomeC,  divCidade,)
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
var btnC = document.getElementById('btn-condominio');
var listaC = document.querySelector('.listaC');
var PrincipalC = document.querySelector('.PrincipalC');
btnC.addEventListener('click', function() {

  PrincipalC.style.display = 'none';
  listaC.style.display = 'block';

});

var btnVC = document.getElementById('btn-voltarC');
btnVC.addEventListener('click', function() {

  listaC.style.display = 'none';
  PrincipalC.style.display = 'block';
  
});
/** FIM CRUD CONDOMINIO*/

function listarCobranca()
{
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