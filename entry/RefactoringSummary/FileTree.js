import React from 'react';
import { Tree } from 'antd';
const { DirectoryTree } = Tree;

const FileTree = ({ fileCountMap, selectedKeys, onTreeSelect }) => {
    
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
            });
        };
        return convertToTreeData(tree);
    };

    const treeData = buildTreeData(fileCountMap);

    return (
        <DirectoryTree
            treeData={treeData}
            defaultExpandAll
            selectedKeys={selectedKeys}
            onSelect={(keys, event) => onTreeSelect(keys, event)}
        />
    );
};

export default React.memo(FileTree, (prevProps, nextProps) => {
    return prevProps.fileCountMap === nextProps.fileCountMap &&
           prevProps.selectedKeys === nextProps.selectedKeys;
});
