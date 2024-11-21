import React, { useMemo, useCallback, useRef } from 'react';
import { Pie } from '@ant-design/charts';
import { PieConfig } from '../Pie-Chart/PieChart-Config';

const PieChart = ({ piedata, onPieSelect }) => {
    const selectedTypesRef = useRef([]);
    const pieConfig = useMemo(() => PieConfig(piedata, selectedTypesRef.current), [piedata]);

    const handleEvent = useCallback((chart, event) => {
        if (event.type === 'element:click') {
            const { data } = event.data;
            const type = data.type;
            if (selectedTypesRef.current.includes(type)) {
                selectedTypesRef.current = selectedTypesRef.current.filter(t => t !== type);
            } else {
                selectedTypesRef.current.push(type);
            }
            onPieSelect(data);
        }
    }, [onPieSelect]);

    return <Pie {...pieConfig} onEvent={handleEvent} />;
};

export default React.memo(PieChart);