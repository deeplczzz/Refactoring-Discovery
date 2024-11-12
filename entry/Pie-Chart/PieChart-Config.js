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
            fill: 'black',
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
            stroke: isSelected ? 'gray' : 'white',
            lineWidth: isSelected ? 3 : 1,
            shadowColor: isSelected ? 'gray' : null,
            shadowBlur: isSelected ? 10 : 0,         
        };
    },
});