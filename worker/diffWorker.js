const { parentPort, workerData } = require('worker_threads');
const { diffLines } = require('diff'); // 引入 diff 库

try {
    const { oldCode, newCode } = workerData;
    const result = diffLines(oldCode, newCode); // 执行差异比较
    parentPort.postMessage(result); // 将结果发送回主线程
} catch (error) {
    parentPort.postMessage({ error: 'Error computing diff' });
}