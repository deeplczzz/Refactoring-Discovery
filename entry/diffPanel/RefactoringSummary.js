import React from 'react';

const RefactoringSummary = ({ data }) => {
    if (data.length === 0) { //没有检测到重构 返回的值
        return(
            <div style={{ textAlign: 'left', padding: '20px' }}>
                <h2>Refactoring Summary</h2>
                <p>No refactorings detected.</p>
            </div>
        );
    }
    // 计算总的重构数量
    const totalRefactorings = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div style={{ textAlign: 'left', padding: '20px' }}>
        <h2>Refactoring Summary</h2>
        <p>Total Refactorings Detected:
            <span style={{ fontSize: '24px', color: 'red', fontWeight: 'bold' }}>
                {totalRefactorings}
            </span>
        </p>
        
        <ul>
            {data.map((item) => (
            <li key={item.type}>
                {item.type}: {item.value}
            </li>
            ))}
        </ul>
        </div>
    );
};

export default RefactoringSummary;
