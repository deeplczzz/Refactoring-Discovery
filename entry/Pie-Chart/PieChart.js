import React, { useMemo, useCallback, useRef } from 'react';
import { Pie } from '@ant-design/charts';
import { PieConfig } from '../Pie-Chart/PieChart-Config';

const PieChart = React.memo(({ piedata, onPieSelect }) => {
    const pieConfig = useMemo(() => PieConfig(piedata), [piedata]);

    const handleEvent = useCallback((chart, event) => {
        if (event.type === 'element:click') {
            const { data } = event.data;
            onPieSelect(data);
        }
    }, [onPieSelect]);

    return <Pie {...pieConfig} onEvent={handleEvent} />;
});

export default React.memo(PieChart);