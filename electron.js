// electron.js
const { app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let springBootProcess;
let jarPath;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // 确保启用 nodeIntegration
      contextIsolation: false, // 确保禁用 contextIsolation
    },
  });
  // 加载前端的入口文件
  //mainWindow.loadURL('http://localhost:3001'); // 确保前端应用正确打包
  mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));

  // 打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();

}

function startSpringBootServer() {
  // // 启动 Spring Boot 服务器
  // const jarPath = path.join(app.getAppPath(), 'server/test-springboot-demo-1.0.0.jar'); // Spring Boot JAR 文件的路径
  if (app.isPackaged) {
    // 打包后的路径
    jarPath = path.join(process.resourcesPath, 'server', 'test-springboot-demo-1.0.0.jar');
  } else {
    // 开发模式下的路径
    jarPath = path.join(app.getAppPath(), 'server', 'test-springboot-demo-1.0.0.jar');
  }

  springBootProcess = exec(`java -jar ${jarPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Spring Boot 服务器错误: ${error}`);
      return;
    }
    console.log(`Spring Boot 服务器输出: ${stdout}`);
  });
}


// 监听渲染进程发送的选择目录请求
ipcMain.on('dialog:selectDirectory', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
      event.reply('directory:selected', result.filePaths[0]); // 返回选择的目录路径
  }
});


app.on('ready', () => {
  startSpringBootServer(); // 启动 Spring Boot 服务器
  createWindow(); // 创建 Electron 窗口
});

app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户按下 Cmd + Q，否则应用与菜单栏始终处于活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，重新创建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  // 在应用退出前关闭 Spring Boot 服务器
  if (springBootProcess) {
    springBootProcess.kill();
  }
});