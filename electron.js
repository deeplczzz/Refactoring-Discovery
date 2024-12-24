// electron.js
const { app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const { Worker } = require('worker_threads');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const path = require('path');
const kill = require('tree-kill');
const Store = require('electron-store');
const store = new Store();
const languages = { // 加载语言文件
  en: require('./locales/en.json'),
  zh: require('./locales/zh.json'),
  zhHK: require('./locales/zh-HK.json'),
};

let mainWindow;
let jsDiff;
let childProcess;
let springBootProcess;
let jarPath;
let loadingWindow = null;
let currentLang = store.get('language', 'en'); //当前语言,从存储中读取，默认是 'en'

//设置语言
function setLanguage(lang) {
  currentLang = lang;
  store.set('language', lang); // 保存用户选择的语言
  createMenu(); // 更新菜单
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('language-changed', lang); // 通知渲染进程语言切换
  });
}

//获取翻译
function getTranslation(key) {
  return languages[currentLang][key] || key;
}

// 创建菜单
function createMenu() {
  const menuTemplate = [
    {
      label: getTranslation('menu_file'),
      submenu: [
        // { label: getTranslation('menu_exit'), role: 'quit' }
      ]
    },
    {
      label: getTranslation('menu_language'),
      submenu: [
        {
          label: 'English',
          type: 'radio',
          checked: currentLang === 'en',
          click: () => setLanguage('en')
        },
        {
          label: '简体中文',
          type: 'radio',
          checked: currentLang === 'zh',
          click: () => setLanguage('zh')
        },
        {
          label: '繁體中文',
          type: 'radio',
          checked: currentLang === 'zhHK',
          click: () => setLanguage('zhHK')
        }
      ]
    },
    {
      label: 'View', // 添加 View 菜单
      submenu: [
        {
          label: 'Reload',
          role: 'reload' // 快速重载窗口
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Ctrl+Shift+I', // 添加快捷键
          click: (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.toggleDevTools();
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// 创建主程序窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 768,
    minWidth: 768,
    minHeight: 576,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, //禁用node整合
      contextIsolation: true,//隔离渲染进程和主进程的上下文
    },
  });
  mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
}

//创建加载窗口
function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false, // 无边框窗口
    resizable: false,
    alwaysOnTop: true, // 始终置顶
    transparent: true, // 窗口透明
    webPreferences: {
      nodeIntegration: false, // 如果需要加载本地 JS，则开启
    },
  });

  loadingWindow.loadFile('dist/loading.html');

  loadingWindow.on('closed', () => {
    loadingWindow = null;
  });
}

// 懒加载模块
const lazyModules = {
  loadDiff: () => {
    if (!jsDiff) {
      jsDiff = require('diff');
    }
    return jsDiff;
  },
  
  loadChildProcess: () => {
    if (!childProcess) {
      childProcess = require('child_process');
    }
    return childProcess;
  }
};

//启动 Spring Boot 服务器
function startSpringBootServer() {
  const { spawn } = lazyModules.loadChildProcess(); 
  if (app.isPackaged) {
    jarPath = path.join(process.resourcesPath, 'server', 'RefactoringDiscovery-1.0.2.jar'); // 打包后的路径
  } else {
    jarPath = path.join(app.getAppPath(), 'server', 'RefactoringDiscovery-1.0.2.jar'); // 开发模式下的路径
  }
  
  // 检查 JAR 文件是否存在
  if (!fs.existsSync(jarPath)) {
    console.error(`JAR 文件不存在: ${jarPath}`);
    return;
  }

  springBootProcess = spawn('java', ['-jar', jarPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });

  springBootProcess.stderr.on('data', (data) => {
    console.error(`Spring Boot error: ${data}`);
  });
}

async function waitForBackendReady() {
  const healthCheckUrl = 'http://localhost:8080/api/health';

  const checkStatus = async () => {
    try {
      const response = await fetch(healthCheckUrl);
      if (response.ok) {
        console.log('SpringBoot backend started');
        clearInterval(intervalId); // 停止轮询
        if (loadingWindow) {
          loadingWindow.close(); // 关闭加载窗口
        }
        createWindow(); // 创建主窗口
      }
    } catch (error) {
      console.log('The backend is not started, continue checking...');
    }
  };

  const intervalId = setInterval(checkStatus, 1000); // 每秒检查一次
}

// 提供当前语言给渲染进程
ipcMain.handle('get-language', () => currentLang);

// 监听渲染进程发送的选择目录请求
ipcMain.on('dialog:selectDirectory', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
      event.reply('directory:selected', result.filePaths[0]); // 返回选择的目录路径
  }
});

ipcMain.handle('perform-diff', (event, oldCode, newCode) => {
  return new Promise((resolve, reject) => {
    // 将任务委托给 Worker 线程
    const workerPath = path.join(__dirname, 'worker', 'diffWorker.js');
    const worker = new Worker(workerPath, {
      workerData: { oldCode, newCode },
    });

    worker.on('message', (result) => resolve(result)); // 返回结果
    worker.on('error', (error) => reject(error)); // 处理错误
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
});

//关闭后端进程
async function terminateSpringBoot() {
  if (springBootProcess) {
    return new Promise((resolve) => {
      kill(springBootProcess.pid, 'SIGTERM', (err) => {
        if (err) {
          console.error('Unable to terminate Spring Boot process:', err);
          resolve();
        } else {
          console.log('Spring Boot server has been successfully shut down.');
          resolve();
        }
      });
    });
  } else {
    console.log('Spring Boot process does not exist.');
    return Promise.resolve();
  }
}

//删除数据库文件
function deleteDatabase() {
  let dbPath;
  if (app.isPackaged) {
    dbPath = path.join(process.resourcesPath, 'refactoring.db'); // 打包后的路径
  } else {
    dbPath = path.join(app.getAppPath(), 'refactoring.db'); // 开发模式下的路径
  }

  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath);
      console.log('Database file deleted successfully');
    } catch (err) {
      console.error('Error while deleting database file:', err);
    }
  } else {
    console.log('The database file does not exist and does not need to be deleted.');
  }
}

app.on('ready', () => {
  createLoadingWindow();
  startSpringBootServer(); // 启动 Spring Boot 服务器
  createMenu(); //创建菜单，会基于当前语言创建
  waitForBackendReady();
  //console.log('GPU Feature Status:', app.getGPUFeatureStatus());
});

app.on('will-quit', async () => {
  //await terminateSpringBoot();
  //deleteDatabase();
});

app.on('window-all-closed', async() => {
  await terminateSpringBoot();
  deleteDatabase();
  app.quit();
});