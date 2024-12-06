import React,  { memo }  from 'react';
import s from './summary.css';
import { Table, Statistic} from 'antd';
const { Column } = Table;
import {AimOutlined, BarsOutlined, FileOutlined} from '@ant-design/icons'; 

const RefactoringSummary = ({ data, fileCountMap}) => {
    const fileData = Object.entries(fileCountMap).map(([fileName, count]) => ({
        fileName,
        count,
    }));

    const totalRefactorings = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div style={{ textAlign: 'left'}}>
            <div className = {s.summarytitle}>Summary</div>
            
            <div className = {s.statistic}>
                <Statistic 
                    title="Refactorings" 
                    value={totalRefactorings} 
                    prefix={<AimOutlined />}
                />
                <Statistic 
                    title="Involved Files" 
                    value={fileData.length}
                    prefix={<FileOutlined />}
                />
                <Statistic 
                    title="Refactoring Type" 
                    value={data.length} 
                    prefix={<BarsOutlined />}
                />
            </div>

            <Table
                dataSource={data}
                pagination={false}
                className={s.summarytable}
                rowKey="type"
                size="small"
            >
                <Column 
                    title="Type" 
                    dataIndex="type" 
                    key="type" 
                />
                <Column 
                    title="Numbers" 
                    dataIndex="value" 
                    key="value" 
                    sorter={(a, b) => a.value - b.value}
                    defaultSortOrder="descend" 
                />
            </Table>
        </div>
    );
};


//export default RefactoringSummary;

export default memo(RefactoringSummary, (prevProps, nextProps) => {
    return (
        prevProps.data === nextProps.data &&
        prevProps.fileCountMap === nextProps.fileCountMap
    );
});