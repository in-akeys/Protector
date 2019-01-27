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
            dialog.showOpenDialog(
                {
                    "properties": ['openFile'],
                    'filters':
                        [
                            {
                                'name': "Akeys File",
                                'extensions': ['akeys']
                            }
                        ]
                }, (fileNames) => {
                    if (fileNames === undefined) {
                        console.log("No file selected");
                        return;
                    }
                    filepath = fileNames[0];
                    // filename = fileNames[0];
                    // console.log(filepath);
                    fs.readFile(filepath, 'utf-8', (err, data) => {
                        //console.log(filepath);
                        if (err) {
                            alert("An error ocurred reading the file :" + err.message);
                            return;
                        }
                        global.fileName =path.basename(filepath);
                        global.win.webContents.send("openFile", data, fileName);
                        // mainWindow.webContents.send('openFile', data, filepath);
                        // mainWindow.webContents.send('change-mod',fileNames[0]);
                    });
                });
        }
    },
    {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
            global.win.webContents.send("giveFileContents");
            ipcMain.on("encryptedfileContents", (event, data, isModified) => {
                dialog.showSaveDialog({
                    'filters':
                        [
                            {
                                'name': "Akeys File",
                                'extensions': ['akeys']
                            }
                        ]
                }, (fileName) => {
                    if (fileName === undefined) {
                        console.log("No file selected");
                        return;
                    }

                    console.log(data);

                    fs.writeFile(fileName, data, function (error) {
                        if (error) throw error;
                    });
                }
                )
            });
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