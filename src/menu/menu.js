const {Menu} = require('electron');
const fileMenu = require('./fileMenu.js');

const template = [
    {
        label:'File',
        submenu: fileMenu
    }/*,
    {
        label: 'Edit'
       
    } ,
    {
        label: 'Find',
        submenu: find_menu
    },
    {
        label:'Goto',
        submenu: goto_menu
    },
    {
        label:"View",
        submenu: view_menu
    },
    {
        label: 'Help',
        submenu: help_menu
    } */
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);