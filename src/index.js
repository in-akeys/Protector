const CodeFlask = require('codeflask')
const {encrypt,decrypt} = require('./util/encrypt-decrypt')
const {ipcRenderer,remote} =require('electron')
const fs = require('fs');
const path = require('path')
const globalConst = require('./consts')
const { dialog } = require('electron').remote
const flask = new CodeFlask('#editor', {
    language: 'txt',
  //  defaultTheme: false,
    //lineNumbers: true
});

const fileFilter = [
    {
        'name': "Akeys File",
        'extensions': ['akeys']
    }
]

//Default file name during launch from shortcut
document.title = globalConst.INITIAL_FILE_NAME;

//For opening a file directly in protector
const p= ipcRenderer.sendSync('sendProcessObj')
if(p && p.platform == 'win32' && p.argv.length >= 2 ){
    var openFilePath
    if( p.argv[1]!='.'){
        openFilePath = p.argv[1];
        readFileAskPassword(openFilePath);
    }
}
//For opening a file directly in protector ends

//Handling disabling of new button when code is fresh
flask.onUpdate(code=>{
    if(code && code!=""){
        ipcRenderer.send('fileInitalized',false);
    }
});

/**
 * Will return 0 if user confirms to discard changes.
 * else 1.
 */
function confirmDiscardChanges() {
    return dialog.showMessageBox({
        type: 'question',
        title: 'Confirm',
        message: 'Do you want to discard current text without saving?',
        buttons: ['Ok', 'Cancel'],
    }
        /*, (indexOfBtnPressed)=>{
            if(indexOfBtnPressed==0){
                openFile();
            }}*/
    );
}

ipcRenderer.on("newFile", event => {
    if (!flask.getCode()) {
        openFile({'fileName':globalConst.INITIAL_FILE_NAME, 'password':null, contents:''});
    } else {
        if (confirmDiscardChanges() == 0)
            openFile({'fileName':globalConst.INITIAL_FILE_NAME, 'password':null, contents:''});
    }
});

ipcRenderer.on("openFile", event => {
    if (!flask.getCode() || confirmDiscardChanges()== 0) {
        dialog.showOpenDialog(
            {
                "properties": ['openFile'],
                'filters': fileFilter
                    
            }, (fileNames) => {
                if (fileNames === undefined) {
                    console.log("No file selected");
                    return;
                }
                filepath = fileNames[0];
                readFileAskPassword(filepath)
            });
    }
});
        
ipcRenderer.on("saveFile", event => {
    if (flask.getCode()) {
        askPassword().then((password) => {
            let encryptedData = encrypt(password, flask.getCode());
            dialog.showSaveDialog({
                'filters':fileFilter
            }, (fileName) => {
                if (fileName === undefined) {
                    console.log("No file selected");
                    return;
                }
                fs.writeFile(fileName, encryptedData, function (error) {
                    if (error) throw error;
                });
            }
            )
        })
    }
});


function openFile(fileData) {
    if (fileData) {
        document.title = fileData.fileName;
        let decryptedData =decrypt(fileData.password, fileData.contents)
        if (fileData.password) {
            if(decryptedData)
                flask.updateCode(decryptedData);
            else
                console.log("Password Incorrect")
        } else {
            flask.updateCode(fileData.contents);
        }
    }
}

//will return a promise
function askPassword() {
    let win = new remote.BrowserWindow({ show:false,width: 300, height: 100, minimizable: false, alwaysOnTop: true, maximizable: false, parent : remote.getCurrentWindow()});
    win.on('close', () => win = null)
    win.loadFile(path.join(__dirname, '/password.html'))
    //win.webContents.openDevTools()
    win.setMenu(null);
    win.once('ready-to-show', () => {
        win.show()
      })
    return new Promise(function (resolve, reject) {
        ipcRenderer.on("informMainWindow", (event, { type, data }) => {
            if (type && type === 'password') {
                resolve(data);
            }
        })
    })
}

function readFileAskPassword(filePath){
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        let fileName = path.basename(filepath);
        askPassword().then((password) => {
            openFile({ 'fileName': fileName, 'password': password, contents: data });
        })
    })
}