const CodeFlask = require('codeflask')
const {encrypt,decrypt} = require('./util/encrypt-decrypt')
const {ipcRenderer,remote} =require('electron')
const flask = new CodeFlask('#my-selector', {
    language: 'txt',
  //  defaultTheme: false,
    //lineNumbers: true
});
const initialFileName = 'Untitled File'
document.title = initialFileName;

flask.onUpdate(code=>{
    console.log("file updated ->" + code);
    if(code && code!=""){
        console.log("file updated");
        ipcRenderer.send('fileInitalized',false);

    }
});

ipcRenderer.on("openFile", (event, data,fileName) => {
    flask.updateCode(decrypt("Akhil",data));
    document.title=fileName;
    //encrypt("Akhil",data);

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


ipcRenderer.on("showLineNo",event=>{
    
})

