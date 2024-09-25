import React from 'react';
const jsDiff = require('diff');
import s from './index.css';
import { Input, Button, Form, message, Collapse} from 'antd';
import ContentDiff from '../contentDiff';
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

    renderRefactorings = () => {
        const { refactorings } = this.state;
        if (refactorings.length === 0) {
            return <p>No refactorings found.</p>;
        }

        return (
            <div className={s.description}>
                <h3>Refactorings:</h3>
                {refactorings.map((refactoring, index) => (
                    <div key={index} className={s.refactoringItem}>
                        <div className={s.bottom}>
                            <strong>Type:</strong> {refactoring.type}
                            <br />
                        </div>
                        <div className={s.bottom}>
                            <strong>Description:</strong> {refactoring.description}
                            <br />
                        </div>
                        <Collapse>
                            <Panel header={"details"} key={index}>
                                <strong>leftSideLocation:</strong>
                                    <ul type="none">
                                        {refactoring.leftSideLocation.map((location, locIndex) => (
                                            <li key={locIndex}>
                                                <div><strong>filePath:</strong> {location.filePath}</div> 
                                                <div><strong> startLine:</strong> {location.startLine}</div>  
                                                <div><strong> endLine:</strong> {location.endLine}</div> 
                                                <div><strong> codeEntity:</strong> {location.codeElement}</div> 
                                            </li>
                                        ))}
                                    </ul>
                                <strong>rightSideLocation:</strong>
                                    <ul type="none">
                                        {refactoring.rightSideLocation.map((location, locIndex) => (
                                            <li>
                                                <div><strong>filePath:</strong> {location.filePath}</div>
                                                <div><strong> startLine:</strong> {location.startLine}</div>
                                                <div><strong> endLine:</strong> {location.endLine}</div>
                                                <div><strong> codeEntity:</strong> {location.codeElement}</div>
                                            </li>
                                        ))}
                                    </ul>
                            </Panel>
                        </Collapse>
                    </div>
                ))}
            </div>
        );
    };

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
        const { commitid, repository } = this.state;

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
        ipcRenderer.on('directory:selected', (event, path) => {
            this.setState({ repository: path });
        });
    };

    render() {
        const { diffResults, fileUploaded, repository, commitid} = this.state;

        return (
            <div className={s.wrapper}>
                <Form {...layout} onFinish={this.handleSubmit} className={s.handleSubmit}>
                    <div className={s.bottonandtext}>
                        <div>
                            <FormItem label="Repository:" >
                                <Button type="default" onClick={this.selectDirectoryDialog} className={s.selectbotton}>
                                    Select Repository Path
                                </Button>
                                {/* 显示选择的路径 */}
                                <span>{repository}</span>
                            </FormItem>
                            <FormItem label="commitid">
                                <Input.TextArea
                                    rows={1}
                                    value={commitid}
                                    onChange={(e) => this.setState({ commitid: e.target.value })}
                                    className={s.textarea}
                                    spellcheck="false"
                                />
                            </FormItem>
                        </div>
                        <div>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className = {s.botton} >
                                    Detect
                                </Button>
                            </FormItem>
                        </div>
                    </div>
                </Form>

                {fileUploaded && diffResults.length > 0 && diffResults.map((result, index) => (
                    <div key={index}>
                        <div className={s.filename}>
                            <strong>filePath:&nbsp;&nbsp;</strong> {result.fileName}
                        </div>
                        {this.isDirectPatch ? 
                            <div className={s.preWrap}>{typeof result.diff === 'string' ? result.diff : ''}</div> 
                            : this.isWordType ? 
                                this.getCharDiff(result.diff) 
                                : <ContentDiff isFile={this.isFile} diffArr={result.diff}/>
                        }
                    </div>
                ))}

                {fileUploaded && this.renderRefactorings()}
            </div>
        )
    }
}

export default DiffPanel;