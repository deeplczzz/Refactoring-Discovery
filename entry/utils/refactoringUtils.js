    // 计算重构类别及每个类别的数量
    export const getRefactoringTypeData = (refactorings) => {
        if (refactorings.length === 0) return [];
        const typeMap = new Map();
        refactorings.forEach(({ type }) => {
            typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        
        return Array.from(typeMap, ([type, value]) => ({ type, value }));
    }

    // 计算重构列表里包含的文件及其涉及的重构数量
    export const fileCount = (refactorings) => {
        const fileCountMap = {};
        
        refactorings.forEach(refactoring => {
            const uniqueFiles = new Set();
            refactoring.leftSideLocation.forEach(location => {
                uniqueFiles.add(location.filePath);
            });
            refactoring.rightSideLocation.forEach(location => {
                uniqueFiles.add(location.filePath);
            });
            uniqueFiles.forEach(filePath => {
                fileCountMap[filePath] = (fileCountMap[filePath] || 0) + 1;
            });
        });
    
        return fileCountMap;
    };