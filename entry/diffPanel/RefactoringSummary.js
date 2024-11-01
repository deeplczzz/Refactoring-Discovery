import React from 'react';
import s from './summary.css';

const RefactoringSummary = ({ data }) => {
    if (data.length === 0) { //没有检测到重构 返回的值
        return(
            <div style={{ textAlign: 'left'}}>
                <div className = {s.summarytitle}>Summary</div>
                <div className = {s.totaldetected}>No refactorings detected.</div>
            </div>
        );
    }
    // 计算总的重构数量
    const totalRefactorings = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div style={{ textAlign: 'left'}}>
            <div className = {s.summarytitle}>Summary</div>
            <div className = {s.totaldetectedandvalue}>
                <span className = {s.totaldetected}>Total Refactorings Detected:{' '}</span>
                <span style={{ fontSize: '24px', color: 'red', fontWeight: 'bold' }}>
                    {totalRefactorings}
                </span>
            </div>
        
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
