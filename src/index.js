const CodeFlask = require('codeflask')
const {encrypt,decrypt} = require('./util/encrypt-decrypt')
const {ipcRenderer,remote} =require('electron')
const fs = require('fs');
const path = require('path')
const globalConst = require('./consts')
const flask = new CodeFlask('#my-selector', {
    language: 'txt',
  //  defaultTheme: false,
    //lineNumbers: true
});

document.title = globalConst.INITIAL_FILE_NAME;

const p= ipcRenderer.sendSync('sendProcessObj')

if(p && p.platform == 'win32' && p.argv.length >= 2 ){
    var openFilePath
    if( p.argv[1]!='.'){
        openFilePath = p.argv[1];
        fs.readFile(openFilePath, 'utf-8', (err, data) => {
            //console.log(filepath);
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }
            flask.updateCode(decrypt(globalConst.DEFAULT_PASSWORD,data));
            document.title=path.basename(openFilePath);
        });
    }
}

flask.onUpdate(code=>{
    if(code && code!=""){
        ipcRenderer.send('fileInitalized',false);
    }
});

ipcRenderer.on("openFile", (event, data,fileName) => {
    flask.updateCode(decrypt(globalConst.DEFAULT_PASSWORD,data));
    document.title=fileName;
})

ipcRenderer.on("giveFileContents",event=>{
    let code = flask.getCode();
    ipcRenderer.send('encryptedfileContents',encrypt(globalConst.DEFAULT_PASSWORD,code));
})

ipcRenderer.on("newFile",event=>{
    document.title = globalConst.INITIAL_FILE_NAME;
    flask.updateCode('');
})

