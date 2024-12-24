export const PieConfig = (refactoringData) => {
    return {
        appendPadding: 10,
        data: refactoringData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.7,
        innerRadius: 0.6,
        statistic: false,
        autoFit: true,
        label: {
            type: 'spider',
            content: '{name}({value})',
            style: {
                fontSize: 12,
                fill: 'black',
            },
        },
        legend: false ,
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
    };
};