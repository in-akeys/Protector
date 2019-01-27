const CodeFlask = require('codeflask')
const {encrypt,decrypt} = require('./util/encrypt-decrypt')
const {ipcRenderer,remote} =require('electron')
const fs = require('fs');
const path = require('path')
const flask = new CodeFlask('#my-selector', {
    language: 'txt',
  //  defaultTheme: false,
    //lineNumbers: true
});
const initialFileName = 'Untitled File'
document.title = initialFileName;

const p= ipcRenderer.sendSync('sendProcessObj')
console.log(p.argv);
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
            flask.updateCode(decrypt("Akhil",data));
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
    flask.updateCode(decrypt("Akhil",data));
    document.title=fileName;
})

ipcRenderer.on("giveFileContents",event=>{
    let code = flask.getCode();
    console.log(code)
    ipcRenderer.send('encryptedfileContents',encrypt("Akhil",code));
})

ipcRenderer.on("newFile",event=>{
    document.title = initialFileName;
    flask.updateCode('');
})

