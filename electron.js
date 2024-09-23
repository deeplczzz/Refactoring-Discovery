// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let springBootProcess;

function createWindow() {
  waitOn({ resources: ['http://localhost:3001'] }, (err) => {
    if (err) {
      console.log('React 应用未能成功启动', err);
      return;
    }
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    // 加载前端的入口文件
    mainWindow.loadURL('http://localhost:3001'); // 确保前端应用正确打包
    // mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

    // 打开开发者工具（可选）
    // mainWindow.webContents.openDevTools();
  });
}

function startSpringBootServer() {
  // 启动 Spring Boot 服务器
  const jarPath = path.join(__dirname, 'server', 'test-springboot-demo-1.0.0.jar'); // Spring Boot JAR 文件的路径

  springBootProcess = exec(`java -jar ${jarPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Spring Boot 服务器错误: ${error}`);
      return;
    }
    console.log(`Spring Boot 服务器输出: ${stdout}`);
  });
}

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