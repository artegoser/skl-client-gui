
  
const {
    app,
    BrowserWindow
} = require('electron');

const fs = require('fs');

const SIZE = {
    x: 695,
    y: 495
}

app.on('ready', () => {
    const win = new BrowserWindow({
        minWidth: SIZE.x,
        minHeight: SIZE.y,
		maxWidth: SIZE.x,
        maxHeight: SIZE.y,
        backgroundColor: '#404040',
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    });

    win.webContents.on('dom-ready', () => {
        win.webContents.openDevTools();
    });
	win.loadURL(`file://${__dirname}/index.html`); //сделать проверку на авторизацию
})