 //计算所有文件的增删行数的工具函数
 export const calculateTotalChanges = (diffResults) => {
    return diffResults.reduce((total, result) => {
        const changes = result.diff.reduce((acc, line) => {
            // 如果是单行变更
            if (typeof line === 'string') {
                if (line.startsWith('+')) acc.additions++;
                if (line.startsWith('-')) acc.deletions++;
            } 
            // 如果是对象形式的变更
            else {
                if (line.value) {
                    const lines = line.value.split('\n');
                    // 计算实际的行数（去掉最后一个空行）
                    const lineCount = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
                    if (line.added) acc.additions += lineCount;
                    if (line.removed) acc.deletions += lineCount;
                }
            }
            return acc;
        }, { additions: 0, deletions: 0 });
        
        return {
            additions: total.additions + changes.additions,
            deletions: total.deletions + changes.deletions
        };
    }, { additions: 0, deletions: 0 });
}
