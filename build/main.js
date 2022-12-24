const { app, BrowserWindow,  Menu, ipcMain} = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path');
const url = require('url');
const fs = require('fs');
const {PosPrinter} = require("electron-pos-printer"); 
// const sqlite3 = require('sqlite3');   
let mainWindow;  
// eslint-disable-next-line no-unused-vars
const server = require('./server');

app.disableHardwareAcceleration(); 

// const db = new sqlite3.Database(
//   isDev
//     ? path.join(__dirname, '../db/salon.sqlite3') 
//     : path.join(process.resourcesPath, 'db/salon.sqlite3'),
//   (err) => {
//     if (err) {
    
//     } else {
     
//     }
//   }
// );

// Menu.setApplicationMenu(null);
// var splash;

const createWindow = () => {

//   splash = new BrowserWindow({width: 600, height: 300, alwaysOnTop: true, frame: false});
//   splash.loadURL(`file://${path.join(__dirname, '../build/splash.html')}`); 
//   splash.show()

  mainWindow = new BrowserWindow({
    width: 600,
    height: 600, 
    minHeight: 800, 
    minWidth: 800, 
    show: false, 
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {    
      nodeIntegration: true,
      enableRemoteModule: true, 
      contextIsolation: true,
      preload: isDev 
        ? path.join(__dirname, './preload.js')
        : path.join(app.getAppPath(), './build/preload.js'), 
    },
  });  
  mainWindow.webContents.on('did-finish-load', function() {
    // console.log("public-did-finish-load")
    // splash.destroy();
    mainWindow.show();
  });  
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000' 
      : 'http://localhost:1919'
  ); 
  // mainWindow.setIcon(path.join(__dirname, '/icon.png'));
  mainWindow.maximize();
  // mainWindow.setSize(1024, 768);
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.setApplicationMenu(null);
    // mainWindow.removeMenu();
  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools();
    });
  } 
  /**app quit */
  mainWindow.on('quit', function(e){
    // console.log("before-quit")
  }); 
  mainWindow.once('ready-to-show', () => {
    // console.log("public-ready-to-show")
    
  }); 

  mainWindow.on('close', function(e){
    // db.close();
    // console.log("Closed event");
  })

};  

app.setPath(
  'userData',
  isDev
    ? path.join(app.getAppPath(), 'userdata/') 
    : path.join(process.resourcesPath, 'userdata/')
);

app.on('quit', ()=>{
//   db.close();
  // window.localStorage.setItem("lastClosedOn", new Date().toISOString())
})

app.whenReady().then(async () => {
  createWindow(); 
});

// Exiting the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activating the app
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});  


ipcMain.handle('getPrinters', async(event)=>{
  console.log("get printers called")
    return new Promise((resolve, reject) => {  
      let webContents = mainWindow.webContents;
      let printers = webContents.getPrinters() 
      resolve({printers:printers});
    });
}) 

var open_printer_dialog = true;
let print_window = {};   
ipcMain.handle('printData', async(event, printername)=>{
  return new Promise((resolve, reject) => { 
  let rand = Math.random();
  let current_time= Date.now();
  var final_printed_data = '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"></head><body>';
  final_printed_data += "<div style='width:300px'>Test PRINT Test PRINT Test PRINT Test PRINT Test PRINT Test PRINT Test PRINT Test PRINTTest PRINT Test PRINTTest PRINT Test PRINT Test PRINTTest PRINTTest PRINTTest PRINT</div>";
  final_printed_data += '</body></html>';
  var print_copies = 1;

  let new_file_location = path.join(app.getAppPath(), `../DB/print_${current_time}_${rand}.html`);
    current_time = current_time+'_'+rand;
    fs.writeFile(new_file_location, final_printed_data, async () => {
        console.log('file write ' +  new Date().toISOString());
      print_window[current_time] = new BrowserWindow({ show: !open_printer_dialog }); 
       
      let filePath_order = new_file_location;
      print_window[current_time].loadURL(url.format({
          pathname: path.join(filePath_order),
          protocol: 'file:',
          slashes: true
      })); 

            print_window[current_time].webContents.on('did-finish-load', async () => {
            console.log('did-finish-load ' + new Date().toISOString());
          
            let result = {"status" : false};
            for(let i = 0 ; i < print_copies ; i++ ) { // loop based on copies 
                try {
                    // result = await print_webcontents (print_window[current_time] , "EPSON_TM_T82X_S_A"); 
                    result = await print_webcontents (print_window[current_time] , printername); 
                    console.log('print finish ' + new Date().toISOString());
                } catch (ex) {
                    console.log(ex);
                }
            }
            
            print_window[current_time].close();
            
            // if(open_printer_dialog && await fs.existsSync(new_file_location)) {
            //     await fs.unlinkSync(new_file_location);
            // }
          })
    })
    resolve("PRinted") 
  });
})


ipcMain.handle('printHTML', async(event,args)=>{
  // let {html, printername} = data;
  // console.log(html, printername)
  // console.log(args.html, args.printername)
  // var obj = JSON.parse(args)
  var html = args.html
  var printername = args.printername
  // console.log(obj)
  return new Promise((resolve, reject) => { 
  let rand = Math.random();
  let current_time= Date.now();
  var final_printed_data = '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"></head><body>';
  final_printed_data += "<div style='max-width:270px'>"+html+"</div>";
  final_printed_data += '</body></html>';
  var print_copies = 1;

  let new_file_location = path.join(app.getAppPath(), `../DB/print_${current_time}_${rand}.html`);
    current_time = current_time+'_'+rand;
    fs.writeFile(new_file_location, final_printed_data, async () => {
        console.log('file write ' +  new Date().toISOString());
      print_window[current_time] = new BrowserWindow({ show: !open_printer_dialog }); 
       
      let filePath_order = new_file_location;
      print_window[current_time].loadURL(url.format({
          pathname: path.join(filePath_order),
          protocol: 'file:',
          slashes: true
      })); 
      // console.log(data, printername)
            print_window[current_time].webContents.on('did-finish-load', async () => {
            console.log('did-finish-load ' + new Date().toISOString());
          
            let result = {"status" : false};
            for(let i = 0 ; i < print_copies ; i++ ) { // loop based on copies 
                try {
                    // result = await print_webcontents (print_window[current_time] , "EPSON_TM_T82X_S_A"); 
                    // result = await print_webcontents (print_window[current_time] , printername); 
                    // console.log('print finish ' + new Date().toISOString());

                    const options = {
                      preview: false,            //  width of content body
                      margins: 'default',  
                      // copies: 1, 
                      // printerName: printername, 
                      silent: true,
                      // pageSize: { height: 301000, width: 71000 } 
                      // margin: '0 0 0 0',
                      copies: 1,
                      printerName: printername,
                      timeOutPerLine: 400,
                      pageSize: '80mm' // page size
                      // pageSize: { height: 301000, width: 71000 } 
                  }
                  
                  const data = [ {
                          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
                          value: html,
                          style: {fontWeight: "300", textAlign: 'center', fontSize: "10px"}
                      } 
                  ]
                  
                  PosPrinter.print(data, options)
                   .then(console.log)
                   .catch((error) => {
                      console.error(error);
                    });

                } catch (ex) {
                    console.log(ex);
                }
            }
            
            print_window[current_time].close();
            
            // if(open_printer_dialog && await fs.existsSync(new_file_location)) {
            //     await fs.unlinkSync(new_file_location);
            // }
          })
    })
    resolve("PRinted") 
  });
})

// callback of window printing success
function print_webcontents(browser_window,printer_name) {
  return new Promise(async (resolve,reject) =>{
      try {
          browser_window.webContents.print({silent : open_printer_dialog , deviceName : printer_name},function (success, errorType) {
              if (success) {
                  resolve({'status' : true});
              } else {
                  console.log("Error in print command");
                  console.log(printer_name);
                  console.log(errorType);
                  resolve({"status" : false});
              }
          });
      } catch (ex) {
          console.log("Error in print command 111"); 
          resolve({"status" : false});
      }
  });
}
