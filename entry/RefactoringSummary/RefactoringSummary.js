import React,  { memo, useState, useEffect }  from 'react';
import s from './summary.css';
import { Table, Statistic} from 'antd';
const { Column } = Table;
import {AimOutlined, BarsOutlined, FileOutlined} from '@ant-design/icons'; 
import { t, setLanguage } from '../../i18n';

const RefactoringSummary = ({ data, fileCountMap}) => {
    const [language, setLangState] = useState("en");

    useEffect(() => {
        window.electronAPI.getLanguage().then((lang) => { // 初始化语言
            setLanguage(lang);
            setLangState(lang);
        });
    
        window.electronAPI.onLanguageChanged((lang) => { // 监听语言切换事件
            setLanguage(lang);
            setLangState(lang);
        });
    }, []);

    const fileData = Object.entries(fileCountMap).map(([fileName, count]) => ({
        fileName,
        count,
    }));

    const totalRefactorings = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div style={{ textAlign: 'left'}}>
            <div className = {s.summarytitle}>{t('summary')}</div>
            
            <div className = {s.statistic}>
                <Statistic 
                    title={t('refactorings')}
                    value={totalRefactorings} 
                    prefix={<AimOutlined />}
                />
                <Statistic 
                    title={t('involved_files')}
                    value={fileData.length}
                    prefix={<FileOutlined />}
                />
                <Statistic 
                    title={t('refactoring_type')} 
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
                    title= {t('table_type')}
                    dataIndex="type" 
                    key="type" 
                />
                <Column 
                    title={t('amount')}  
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