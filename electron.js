// electron.js
const { app, BrowserWindow, dialog, ipcMain} = require('electron');
const { Worker } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const kill = require('tree-kill');

//console写入文件
// const logFile = fs.createWriteStream('./electron-main.log', { flags: 'a' });
// const errorFile = fs.createWriteStream('./electron-error.log', { flags: 'a' });

// process.stdout.write = logFile.write.bind(logFile);
// process.stderr.write = errorFile.write.bind(errorFile);

let mainWindow;
let jsDiff;
let childProcess;
let springBootProcess;
let jarPath;

function createWindow() {
  // 创建浏览器窗口
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
  startSpringBootServer(); // 启动 Spring Boot 服务器
  createWindow(); // 创建 Electron 窗口
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