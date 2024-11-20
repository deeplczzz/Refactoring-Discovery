    // 计算重构类别的统计数据
    export const getRefactoringTypeData = (refactorings) => {
        if (refactorings.length === 0) return [];
        const typeMap = new Map();
        refactorings.forEach(({ type }) => {
            typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        
        return Array.from(typeMap, ([type, value]) => ({ type, value }));
    }