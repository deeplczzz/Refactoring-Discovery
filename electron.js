// electron.js
const { app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');

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
    // 打包后的路径
    jarPath = path.join(process.resourcesPath, 'server', 'RefactoringDiscovery-1.0.2.jar');
  } else {
    // 开发模式下的路径
    jarPath = path.join(app.getAppPath(), 'server', 'RefactoringDiscovery-1.0.2.jar');
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
  try {
    const diffModule = lazyModules.loadDiff();
    const diffResult = diffModule.diffLines(oldCode, newCode);
    return diffResult;  // 将 diff 结果返回给渲染进程
  } catch (error) {
    console.error('Error computing diff:', error);
    return { error: 'Error computing diff' };
  }
});

function terminateSpringBoot() {
  return new Promise((resolve) => {
    if (springBootProcess) {
      const timeout = setTimeout(() => {
        springBootProcess.kill('SIGKILL');
        resolve();
      }, 3000);

      springBootProcess.once('exit', () => {
        clearTimeout(timeout);
        resolve();
      });

      const killed = springBootProcess.kill();
      if (!killed) {
        springBootProcess.kill('SIGKILL');
      }
    } else {
      resolve();
    }
  });
}

app.on('ready', () => {
  startSpringBootServer(); // 启动 Spring Boot 服务器
  createWindow(); // 创建 Electron 窗口
});

app.on('will-quit', () => {
  // 在应用退出前关闭 Spring Boot 服务器
  if (springBootProcess) {
    const killed = springBootProcess.kill();
    if (!killed) {
      springBootProcess.kill('SIGKILL');// 如果正常结束失败，强制结束进程
    }
  }
});

app.on('window-all-closed', async() => {
  await terminateSpringBoot();
  app.quit();
});