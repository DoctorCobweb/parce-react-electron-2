import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url';
import SerialPort from 'serialport'
import log from 'electron-log'
log.transports.file.level = 'info'

// Let electron reload by itself when webpack watches changes in
if (process.env.ELECTRON_START_URL_APP_MAIN || process.env.ELECTRON_START_URL_APP_1) {
  require('electron-reload')(__dirname)
}

// checking to see if native dep. serialport is working
SerialPort.list()
.then(ports => {
  console.log('PORTS AVAILABLE: ', ports);
})
.catch(err => {
  if (err) throw err;
});

// To avoid being garbage collected
let winMain
let win1

app.on('ready', () => {

    let winMain = new BrowserWindow({
        width: 800,
        height: 600
    })
    let win1 = new BrowserWindow({
        width: 700,
        height: 500
    })

    const startUrlAppMain = process.env.ELECTRON_START_URL_APP_MAIN || url.format({
          pathname: path.join(__dirname, 'appMain/index.main.html'),
          protocol: 'file:',
          slashes: true
    });
    const startUrlApp1 = process.env.ELECTRON_START_URL_APP_1 || url.format({
          pathname: path.join(__dirname, 'app1/index.1.html'),
          protocol: 'file:',
          slashes: true
    });
    log.info('__dirname: ',__dirname)
    log.info('process.env.ELECTRON_START_URL_APP_MAIN', process.env.ELECTRON_START_URL_APP_MAIN)
    log.info('process.env.ELECTRON_START_URL_APP_1', process.env.ELECTRON_START_URL_APP_1)

    winMain.loadURL(startUrlAppMain)
    win1.loadURL(startUrlApp1)

    winMain.webContents.openDevTools()
    win1.webContents.openDevTools()

    winMain.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        winMain = null
    })
    win1.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win1 = null
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (winMain === null) {
        createWindow()
    }
    if (win1 === null) {
        createWindow()
    }
});
