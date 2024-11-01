export const PieConfig = (refactoringData, selectedTypes) => ({
    appendPadding: 10,
    data: refactoringData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    innerRadius: 0.6,
    statistic: false,
    width: 400,
    height: 400,
    animation: false,
    label: {
        type: 'spider',
        content: '{name}({value})',
        style: {
            fontSize: 12,
        },
    },
    legend: {
        position: 'right',
        item: {
            onClick: null,
        },
    },
    interactions: [
        { type: 'element-selected' },
        { type: 'element-active' },
        { type: 'legend-filter', enable: false },
    ],
    tooltip: {
        formatter: (datum) => {
            return { name: datum.type, value: datum.value };
        },
    },
    pieStyle: (data) => {
        const isSelected = selectedTypes.includes(data.type);
        return {
            stroke: isSelected ? '#ff4d4f' : 'white',
            lineWidth: isSelected ? 3 : 1,
            shadowColor: isSelected ? '#ff4d4f' : null, // 添加阴影效果
            shadowBlur: isSelected ? 10 : 0,           // 设置阴影模糊度
        };
    },
});