import React from 'react';
const jsDiff = require('diff');
import s from './index.css';
import { Input, Button, Form, message, Collapse, Select} from 'antd';
import ContentDiff from '../contentDiff';
import RefactoringList from './RefactoringList'; // 导入新的 RefactoringList 组件
import cx from 'classnames';

const { Panel } = Collapse;
const FormItem = Form.Item;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

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
    }

    //计算oldcode和newcode的diff，使用外部库
    /*
    diff 库提供了多种方法来比较文本，例如：
    jsDiff.diffChars(oldStr, newStr)：比较两个字符串的字符差异。
    jsDiff.diffWords(oldStr, newStr)：比较两个字符串的单词差异。
    jsDiff.diffLines(oldStr, newStr)：比较两个字符串的行差异。
    */
    actDiff = (oldCode, newCode) => {
        try {
            return jsDiff.diffLines(oldCode, newCode);
        } catch (error) {
            console.error('Error computing diff:', error);
            message.error('Error computing diff.');
            return [];
        }
    }

    getCharDiff = (diffArr) => {
        //暂时没用
        /*
        const charColorMap = {
            'add': s.charAdd,
            'removed': s.charRemoved,
        }
        return <div className={s.result}>
            {diffArr.map((item, index) => {
                const { value, added, removed } = item;
                const type = added ? 'add' : (removed ? 'removed' : '')
                return <span key={index} className={cx(charColorMap[type], s.charPreWrap)}>{value}</span>
                })
            }
        </div>
        */
    }

    handleSubmit = async () => {
        const { commitid, repository} = this.state;

        if (!commitid || !repository) {
            message.error('Please provide repository_path and commentid.');
            return;
        }

        try {
            // 发送 POST 请求到后端
            const response = await fetch('http://localhost:8080/api/diff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({repository, commitid }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const json = await response.json();

            // 处理返回的 JSON 数据
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
                        fileUploaded: true,
                        isFilteredByLocation: false
                    });
                } else {
                    message.error('No files found in JSON.');
                }
            } else {
                message.error('Invalid JSON format: Missing results array.');
            }
        } catch (error) {
            console.error('Error fetching diff:', error);
            message.error('Error fetching diff.');
        }
    };


    selectDirectoryDialog = async () => {
        const { ipcRenderer } = window.require('electron');
    
        // 发送请求到主进程打开选择目录对话框
        ipcRenderer.send('dialog:selectDirectory');
    
        // 等待主进程返回选择的目录路径
        ipcRenderer.on('directory:selected', async (event, path) => {
            this.setState({ repository: path ,
                            fileUploaded:false,
                            isFilteredByLocation: false
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
    
    renderCommitSelect = () => {
        const { commits, commitid } = this.state;
    
        return (
            <FormItem label="Commit">
                <Select
                    value={commitid}
                    onChange={(value) => this.setState({ commitid: value })}
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

    handleHighlightDiff = (locations) => {
        const { highlightedFiles , isFilteredByLocation} = this.state;
    
        // 检查当前点击的 locations 中的所有文件是否已经高亮
        const areAllLocationsHighlighted = locations.every(location =>
            highlightedFiles.some(
                file => file.filePath === location.filePath && file.startLine === location.startLine && file.endLine === location.endLine
            )
        );
    
        if (areAllLocationsHighlighted) {
            // 如果所有 locations 已经高亮，则取消它们的高亮
            this.setState({
                highlightedFiles: highlightedFiles.filter(
                    file => !locations.some(
                        location => location.filePath === file.filePath && location.startLine === file.startLine && location.endLine === file.endLine
                    )
                ),
                isFilteredByLocation: false,  // 取消高亮时重置过滤状态
            });
        } else {
            // 如果 locations 中有文件未被高亮，则高亮所有这些文件
            this.setState({
                highlightedFiles: [
                    ...highlightedFiles,
                    ...locations.filter(location =>
                        !highlightedFiles.some(
                            file => file.filePath === location.filePath && file.startLine === location.startLine && file.endLine === location.endLine
                        )
                    ),
                ],
                isFilteredByLocation: true,  // 取消高亮时重置过滤状态
            });
        }
    };

    resetToAllFiles = () => {
        this.setState({
            highlightedFiles: [],
            isFilteredByLocation: false,
        });
    };
    

    render() {
        const { diffResults, fileUploaded, repository, commitid, commits,highlightedFiles, isFilteredByLocation,refactorings} = this.state;
    
        return (
            <div className={s.wrapper}>
                <Form {...layout} onFinish={this.handleSubmit} className={s.handleSubmit}>
                    <div className={s.bottonandtext}>
                        <div>
                            <FormItem label="Repository:" >
                                <Button type="default" onClick={this.selectDirectoryDialog} className={s.selectbotton}>
                                    Select Repository Path
                                </Button>
                                <span>{repository}</span>
                            </FormItem>
    
                            {/* 如果有 commits 列表，展示 commit 选择框 */}
                            {commits.length > 0 && this.renderCommitSelect()}
                        </div>
                        <div>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className={s.botton} disabled={!commitid}>
                                    Detect
                                </Button>
                            </FormItem>
                        </div>
                    </div>
                </Form>

                {/* 显示 "Back to all files" 的超链接 */}
                {fileUploaded && isFilteredByLocation && (
                    <a
                        onClick={this.resetToAllFiles}
                        style={{ 
                            textDecoration: 'underline', 
                            color: 'blue', 
                            cursor: 'pointer', 
                            background: 'transparent', 
                            border: 'none', 
                            padding: 0, 
                            marginBottom: '20px' 
                        }}
                    >
                        Back to all files
                    </a>
                )}

                {fileUploaded && !isFilteredByLocation && diffResults.length > 0 && diffResults.map((result, index) => (
                    <div key={index}>
                        <div className={s.filename}>
                            <strong>filePath:&nbsp;&nbsp;</strong> {result.fileName}
                        </div>
                        <ContentDiff
                            isFile={this.isFile}
                            diffArr={result.diff}
                            highlightedLines={[]}  // 初始状态没有高亮
                        />
                    </div>
                ))}

                {fileUploaded && isFilteredByLocation && diffResults.length > 0 && diffResults.map((result, index) => (
                    <div key={index}>
                        {highlightedFiles.some(f => f.filePath === result.fileName) && (
                            <div className={s.filename}>
                                <strong>filePath:&nbsp;&nbsp;</strong> {result.fileName}
                            </div>
                        )}
                        
                        {highlightedFiles.some(f => f.filePath === result.fileName) && (
                            <ContentDiff
                                isFile={this.isFile}
                                diffArr={result.diff}
                                highlightedLines={highlightedFiles.filter(f => f.filePath === result.fileName)}
                            />
                        )}
                        
                    </div>
                ))}

                {/* 使用 RefactoringList 来显示重构列表 */}
                {fileUploaded && <RefactoringList refactorings={refactorings} onHighlightDiff={this.handleHighlightDiff} />}
            </div>
        );
    }
    
}

export default DiffPanel;