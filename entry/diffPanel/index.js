import React from 'react';
const jsDiff = require('diff');
import s from './index.css';
import { Pie } from '@ant-design/charts'; 
import { Input, Button, Form, message, Collapse, Select} from 'antd';
import ContentDiff from '../contentDiff';
import RefactoringList from './RefactoringList'; 
import cx from 'classnames';
import RefactoringSummary from './RefactoringSummary'; 
import DiffTabs from './DiffTabs';

const { Panel } = Collapse;
const FormItem = Form.Item;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const SHOW_TYPE = {
    HIGHLIGHT: 0,
    NORMAL: 1
}

class DiffPanel extends React.Component {
    state = {
        diffResults: [], // 用于存储所有文件的 diff 结果
        method: this.props.type === 'words' ? 'diffChars' : 'diffLines',
        repository:'',
        fileUploaded: false, // 表示文件已上传
        refactorings: [], // 新增用于存储 refactorings
        commitid:'',
        commits: [],  // 存储从后端获取到的 commit 列表
        highlightedFiles: [], // 用于存储点击 Location 后的文件和行号信息
        isFilteredByLocation: false, // 标记是否正在根据 Location 过滤文件
        showType: SHOW_TYPE.NORMAL,
        isDetect: false, //表示有没有点击detect按钮
        filteredRefactoring:[],
    }

    //比较两个代码的diff
    actDiff = (oldCode, newCode) => {
        try {
            return jsDiff.diffLines(oldCode, newCode);
        } catch (error) {
            console.error('Error computing diff:', error);
            message.error('Error computing diff.');
            return [];
        }
    }


    handleSubmit = async () => {
        const { refactorings } = this.state;
        this.setState({
            showType: SHOW_TYPE.HIGHLIGHT,
            isFilteredByLocation: false,
            isDetect: true, 
        });
        
    };

    //选择仓库目录
    selectDirectoryDialog = async () => {
        const { ipcRenderer } = window.require('electron');
    
        // 发送请求到主进程打开选择目录对话框
        ipcRenderer.send('dialog:selectDirectory');
    
        // 等待主进程返回选择的目录路径
        ipcRenderer.on('directory:selected', async (event, path) => {
            this.setState({ repository: path ,
                            fileUploaded:false,
                            isFilteredByLocation: false,
                            showType:SHOW_TYPE.SPLITED
            });
    
            // 选择目录后，发送请求到后端获取 commit 列表
            try {
                const response = await fetch('http://localhost:8080/api/commit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ repository: path }),
                });
                console.log(path);
                if (!response.ok) {
                    throw new Error('Failed to fetch commit list.');
                }
    
                const commitList = await response.json();
                if (commitList.length > 0) {
                    this.setState({ commits: commitList }); // 将 commit 列表保存到 state
                } else {
                    message.error('No commits found.');
                }
            } catch (error) {
                console.error('Error fetching commits:', error);
                message.error('Error fetching commits.');
            }
        });
    };
    
    //commit选择框
    renderCommitSelect = () => {
        const { commits, commitid } = this.state;
        return (
            <FormItem>
                <Select
                    value={commitid}
                    onSelect={(value) => {this.setState({ commitid: value }, this.fetchData);}}
                    placeholder="Select a commit"
                    style={{ width: '100%' }}
                >
                    {commits.map((commit, index) => (
                        <Select.Option key={index} value={commit}>
                            {commit}
                        </Select.Option>
                    ))}
                </Select>
            </FormItem>
        );
    };

    // 负责从后端获取数据
    fetchData = async () => {
        const { commitid, repository } = this.state;
    
        if (!commitid || !repository) {
            message.error('Please provide repository_path and commitid.');
            return;
        }
    
        try {
            // 发送 POST 请求到后端获取文件 diff 和 refactorings
            const response = await fetch('http://localhost:8080/api/diff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository, commitid }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const json = await response.json();
    
            if (json.results && json.results.length > 0) {
                const firstResult = json.results[0];
                const files = firstResult.files;
    
                if (files && files.length > 0) {
                    const diffResults = files.map((file) => ({
                        fileName: file.name,
                        diff: this.actDiff(file.oldCode, file.newCode),
                    }));
    
                    this.setState({
                        diffResults,
                        refactorings: firstResult.refactorings || [],
                        fileUploaded: true ,
                        isFilteredByLocation: false ,
                        showType: SHOW_TYPE.NORMAL,
                        isDetect:false,
                    });
                } else {
                    message.error('No files found in JSON.');
                }
            } else {
                message.error('Invalid JSON format: Missing results array.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Error fetching data.');
        }
    };

    

    handleHighlightDiff = (leftSideLocations, rightSideLocations, Description) => {
        const { highlightedFiles, refactorings } = this.state;
        //console.log(Description);
    
        const leftSideHighlightedFiles = leftSideLocations.map(location => ({
            filePath: location.filePath,
            startLine: location.startLine,
            endLine: location.endLine,
            description:location.description,
            side: 'left', // 标记为左侧
        }));
    
        const rightSideHighlightedFiles = rightSideLocations.map(location => ({
            filePath: location.filePath,
            startLine: location.startLine,
            endLine: location.endLine,
            description:location.description,
            side: 'right', // 标记为右侧
        }));
    
        // 合并左右侧的高亮信息
        const newHighlightedFiles = [...leftSideHighlightedFiles, ...rightSideHighlightedFiles];
    
        // 检查当前点击的 locations 中的所有文件是否已经高亮
        const areAllLocationsHighlighted = newHighlightedFiles.every(location =>
            highlightedFiles.some(
                file => file.filePath === location.filePath && file.startLine === location.startLine && file.endLine === location.endLine && file.description === location.description
            )
        );

        if (areAllLocationsHighlighted) {
            this.setState({
                highlightedFiles: [], 
                isFilteredByLocation: false, 
                filteredRefactoring: [],

            });
        } else {
            const matchRefactoring = refactorings.find(ref => ref.description === Description);
            const HighlightRefactoring = matchRefactoring ? [matchRefactoring] : [];
            this.setState({
                highlightedFiles: newHighlightedFiles,
                isFilteredByLocation: true, 
                filteredRefactoring : HighlightRefactoring,
            });
        }
    };

    //返回所有文件
    resetToAllFiles = () => {
        this.setState({
            highlightedFiles: [],
            isFilteredByLocation: false,
            filteredRefactoring: [], //根据location过滤的重构信息
        });
    };


    // 计算重构类别的统计数据
    getRefactoringTypeData = () => {
        const { refactorings } = this.state;
        // 如果没有探测到任何重构，返回空数组
        if (refactorings.length === 0) {
            return [];
        }
        const typeCounts = refactorings.reduce((acc, refactoring) => {
            const { type } = refactoring;
            if (acc[type]) {
                acc[type]++;
            } else {
                acc[type] = 1;
            }
            return acc;
        }, {});

        return Object.entries(typeCounts).map(([type, count]) => ({
            type,
            value: count,
        }));
    }

    render() {
        const { diffResults, fileUploaded, repository, commitid, commits,highlightedFiles, isFilteredByLocation,refactorings,showType,isDetect,filteredRefactoring} = this.state;
        const refactoringData = this.getRefactoringTypeData();
        // 饼图配置
        const pieConfig = {
            appendPadding: 10,
            data: refactoringData, // 获取重构类型数据
            angleField: 'value',
            colorField: 'type',
            radius: 0.7, // 调整半径来缩小饼图
            width: 500, // 设置饼图的宽度
            height: 500, // 设置饼图的高度
            label: {
                type: 'spider',
                content: '{name}({value})', 
                style: {
                    fontSize: 12,     // 标签字体大小
                },
            },
            legend: {
                position: 'right',
                item: {
                    onClick: null,
                },
            },
            interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
            // 配置 tooltip 自定义内容
            tooltip: {
                formatter: (datum) => {
                    return { name: datum.type, value: datum.value }; // 显示类别名称和其数量
                },
            },
        };
    
        const isFileMatched = (filePath, resultFileName) => {
            if (filePath === resultFileName) return true;
            const [oldPath, newPath] = resultFileName.split(" --> ").map(p => p.trim());
            return filePath === oldPath || filePath === newPath;
        };

        return (
            <div className={s.wrapper}>
                <Form {...layout} onFinish={this.handleSubmit} className={s.handleSubmit}>
                    <div>
                        <div className={s.bottonandtext}>
                            <div className={s.Repositorylabel}>Repository :</div>
                            <div>
                                <Button type="default" onClick={this.selectDirectoryDialog} className={s.selectbotton}>
                                    Select Repository Path
                                </Button>
                            </div>
                            <div>
                                <span style={{ marginLeft: '10px' }}>{repository}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        {commits.length > 0 &&(
                                <div  className={s.CommitselectAndBotton}>
                                    <div className={s.Commitlabel}>Commit_id :</div>
                                    <div className ={s.commitselect}>
                                        {this.renderCommitSelect()}
                                    </div>
                                    <div>
                                        <Button type="primary" htmlType="submit" className={s.botton} disabled={!commitid}>
                                            Detect
                                        </Button>
                                    </div>
                                </div>
   
                        )}
                    </div>
                </Form>

                {isDetect && fileUploaded && isFilteredByLocation && (
                    <a
                        onClick={this.resetToAllFiles}
                        style={{ 
                            textDecoration: 'underline', 
                            color: 'blue', 
                            cursor: 'pointer', 
                            background: 'transparent', 
                            border: 'none', 
                            padding: 0, 
                            marginBottom: '20px', 
                            marginLeft: '30px' 
                        }}
                    >
                        ← Back to all refactorings
                    </a>
                )}

                {!isDetect && fileUploaded && diffResults.length > 0 && diffResults.map((result, index) => (
                    <div key={index}>
                        <div className={s.filename}>
                            <strong>filePath:&nbsp;&nbsp;</strong> {result.fileName}
                        </div>
                        <ContentDiff
                            isFile={this.isFile}
                            diffArr={result.diff}
                            highlightedLines={[]}  // 初始状态没有高亮
                            showType={showType}
                        />
                    </div>
                ))}

                {isDetect && fileUploaded && isFilteredByLocation && diffResults.length > 0 && diffResults.map((result, index) => {
                    const matchedFiles = highlightedFiles.filter(f => isFileMatched(f.filePath, result.fileName));
                    const shouldRender = matchedFiles.length > 0;

                    return shouldRender && (
                        <div key={index}>
                            <div className={s.filename}>
                                <strong>filePath:&nbsp;&nbsp;</strong> {result.fileName}
                            </div>
                            <ContentDiff
                                isFile={this.isFile}
                                diffArr={result.diff}
                                highlightedLines={matchedFiles}
                                showType={showType}
                            />
                        </div>
                    );
                })}

                {isDetect && !isFilteredByLocation && fileUploaded && (
                    <>
                        <div className={s.RefactoringSummary}>
                            <RefactoringSummary data={refactoringData} />
                        </div>
                        {refactorings.length > 0 && (
                            <div className={s.pie}>
                                <Pie {...pieConfig} />
                            </div>
                        )}
                    </>
                )}

                {isDetect && !isFilteredByLocation && fileUploaded && <RefactoringList refactorings={refactorings} onHighlightDiff={this.handleHighlightDiff} />}
                {isDetect && isFilteredByLocation && fileUploaded && <RefactoringList refactorings={filteredRefactoring} onHighlightDiff={this.handleHighlightDiff} />}
                
            </div>
        );
    }
    
}

export default DiffPanel;
