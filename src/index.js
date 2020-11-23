const { app, BrowserWindow } = require("electron");

const localStorage = require("./modules/localStorage");

const fs = require("fs");

const SIZE = {
  x: 695,
  y: 495,
};

app.on("ready", () => {
  const win = new BrowserWindow({
    minWidth: SIZE.x,
    minHeight: SIZE.y,
    maxWidth: SIZE.x,
    maxHeight: SIZE.y,
    //backgroundColor: '#404040',
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
  });

  win.webContents.on("dom-ready", () => {
    win.webContents.openDevTools();
  });
  if (localStorage.getItem("autorisation")) {
    win.loadURL(`file://${__dirname}/mainwindow/index.html`);
  } else {
    win.loadURL(`file://${__dirname}/autorisation.reg/index.html`);
  }
});
