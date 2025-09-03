const { BrowserWindow } = require('electron')
const path = require('path')

let janelaLogin;
let janelaPrincipal;

function createMainWindow() {
    janelaPrincipal = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    janelaPrincipal.loadFile('./src/index.html');

    janelaPrincipal.on('closed', () => {
        janelaPrincipal = null;
    });
janelaLogin.close();    

    return janelaPrincipal;
}




function getJanelaPrincipal() {
    return janelaPrincipal;
}

function createLoginWindon() {
    janelaLogin = new BrowserWindow({
        width: 500,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }

    })
    janelaLogin.loadFile('./src/login/login.html')
}

function getJanelaLogin(){
    return janelaLogin;

}

module.exports = {
    createMainWindow,
    getJanelaPrincipal,
    createLoginWindon,
    getJanelaLogin,
}