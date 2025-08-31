const email = document.getElementById('email');
const senha = document.getElementById('senha');
const btn_acessar = document.getElementById('acessar');
const msg = document.getElementById('msg');

btn_acessar.addEventListener('click', validarLogin);

async function validarLogin() {
  const retorno = await window.api.validarLogin(email.value.toLowerCase(), senha.value);

  if (retorno && retorno.perfil) {
    localStorage.setItem('perfil', retorno.perfil);
    msg.textContent = 'Login realizado com sucesso';
    msg.style.color = 'green';
    await window.api.abrirJanelaPrincipal();
  } else {
    msg.textContent = 'Email ou senha incorretos';
    msg.style.color = 'red';
  }
}