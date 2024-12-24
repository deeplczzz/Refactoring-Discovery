// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded successfully');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: () => {
        ipcRenderer.send('dialog:selectDirectory');
    },
    onDirectorySelected: (callback) => {
        ipcRenderer.on('directory:selected', (event, path) => callback(path));
    },
    performDiff: async (oldCode, newCode) => {
        return await ipcRenderer.invoke('perform-diff', oldCode, newCode);
    },
    onLanguageChanged: (callback) => {
        ipcRenderer.on('language-changed', (event, lang) => callback(lang));
    },
    getLanguage: () => ipcRenderer.invoke('get-language') // 新增方法获取语言
});

