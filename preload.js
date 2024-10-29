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
    }
});

