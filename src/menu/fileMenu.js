const { dialog, BrowserWindow, ipcMain, app } = require('electron')
const fs = require('fs')
const path =require('path')



module.exports = [
    {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        enabled: false,
        id:'newFile',
        click: function(){
            global.win.webContents.send("newFile");
        }
    },
    {
        label: 'Open File...',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
            global.win.webContents.send("openFile");
        }
    },
    {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
            global.win.webContents.send("saveFile");
        }
    },/* ,
    {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click:function(){
            fun.saveAs();
        } 
    } */
    {
        label: 'Exit',
        click:function(){
             app.quit();
         } 
    }
]