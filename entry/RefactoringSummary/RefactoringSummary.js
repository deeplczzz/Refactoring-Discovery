import React,  { useMemo, memo ,useCallback}  from 'react';
import s from './summary.css';
import { Table, Statistic, Tree} from 'antd';
const { DirectoryTree } = Tree;
const { Column } = Table;
import {AimOutlined, BarsOutlined, FileOutlined} from '@ant-design/icons'; 
import { Pie } from '@ant-design/charts'; 
import { PieConfig } from '../Pie-Chart/PieChart-Config';

const RefactoringSummary = ({ data, piedata, refactorings, onPieSelect, PieSelectedTypes, selectedKeys, onTreeSelect}) => {
    const fileCountMap = {};
    
    refactorings.forEach(refactoring => {
        const uniqueFiles = new Set();
        refactoring.leftSideLocation.forEach(location => {
            uniqueFiles.add(location.filePath);
        });
        refactoring.rightSideLocation.forEach(location => {
            uniqueFiles.add(location.filePath);
        });
        uniqueFiles.forEach(filePath => {
            fileCountMap[filePath] = (fileCountMap[filePath] || 0) + 1;
        });
    });

    const fileData = Object.entries(fileCountMap).map(([fileName, count]) => ({
        fileName,
        count,
    }));

    const totalRefactorings = data.reduce((acc, item) => acc + item.value, 0);
    //const pieConfig = PieConfig(piedata, PieSelectedTypes);
    const pieConfig = useMemo(() => PieConfig(piedata, PieSelectedTypes), [piedata, PieSelectedTypes]);

    const onEvent = useCallback((chart, event) => {
        if (event.type === 'element:click') {
            onPieSelect(event); // 传递点击事件处理函数
        }
    }, [onPieSelect]);

    //生成树形结构
    const buildTreeData = (fileCountMap) => {
        const tree = {};

        Object.entries(fileCountMap).forEach(([filePath, count]) => {
            const parts = filePath.split('/');
            let currentLevel = tree;

            parts.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = { children: {}, isLeaf: false, fullPath: filePath };
                }
                if (index === parts.length - 1) {
                    currentLevel[part].count = count;
                    currentLevel[part].isLeaf = true; 
                }
                currentLevel = currentLevel[part].children;
            });
        });

        const convertToTreeData = (node, parentKey = '') => {
            if (!node || typeof node !== 'object' || Object.keys(node).length === 0) return [];
            return Object.entries(node).map(([key, value]) => {
                const uniqueKey = `${parentKey}/${key}`;
                const children = convertToTreeData(value.children, uniqueKey);
                const isLeaf = value.isLeaf;
                const title = isLeaf ? `${key} (${value.count || 0})` : key;

                return {
                    title: title,
                    key: uniqueKey,
                    children: children,
                    isLeaf: isLeaf,
                    fullPath: value.fullPath,
                };
            }).sort((a, b) => a.title.localeCompare(b.title));;
        };
        return convertToTreeData(tree);
    };

    const treeData = buildTreeData(fileCountMap);

    return (
        <div style={{ textAlign: 'left'}}>
            <div className = {s.summarytitle}>Summary</div>
            
            <div className = {s.statistic}>
                <Statistic 
                    title="Refactoring Count" 
                    value={totalRefactorings} 
                    prefix={<AimOutlined />}
                />
                <Statistic 
                    title="Files Count" 
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
            >
                <Column 
                    title="TYPE" 
                    dataIndex="type" 
                    key="type" 
                />
                <Column 
                    title="COUNT" 
                    dataIndex="value" 
                    key="value" 
                    sorter={(a, b) => a.value - b.value}
                    defaultSortOrder="descend" 
                />
            </Table>

            {refactorings.length > 0 && <div className={s.pieandtree}>
                <div className={s.directorytree}>
                        <DirectoryTree
                            treeData={treeData}
                            defaultExpandAll
                            selectedKeys={selectedKeys} 
                            onSelect={(keys, event) => onTreeSelect(keys, event)}
                        />
                </div>
                <div className={s.pie}>
                    <Pie 
                        {...pieConfig} 
                        onEvent={onEvent}  
                    />
                </div>
            </div>}
        </div>
    );
};


//export default RefactoringSummary;

export default memo(RefactoringSummary, (prevProps, nextProps) => {
    return (
        prevProps.data === nextProps.data &&
        prevProps.piedata === nextProps.piedata &&
        prevProps.refactorings === nextProps.refactorings &&
        prevProps.PieSelectedTypes === nextProps.PieSelectedTypes &&
        prevProps.selectedKeys === nextProps.selectedKeys
    );
});