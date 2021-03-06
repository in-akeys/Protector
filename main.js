//require('electron-reload')(__dirname)

const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow(
        {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            },
            show:false
        })

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, '/src/index.html'))

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
    //setting main Win in global, so that it can be accessible from menu bar file
    global.win = win;
    win.once('ready-to-show', () => {
        win.show()
      })
    require('./src/menu/menu.js')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

//register listeners

ipcMain.on("fileInitalized", (event, isFileEmpty) => {
    if (!isFileEmpty) {
        const menu = Menu.getApplicationMenu()
        if (menu) {
            const newFileMenuItem = menu.getMenuItemById('newFile')
            newFileMenuItem ? newFileMenuItem.enabled = true : ""
        }
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("sendProcessObj", e => {
    e.returnValue = process;
});


ipcMain.on("informMainWindow", (event,data) => {
    win.webContents.send("informMainWindow",data);
});