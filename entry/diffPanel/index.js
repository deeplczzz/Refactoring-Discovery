import React from 'react';
import s from './index.css';
import { Pie } from '@ant-design/charts'; 
import {Button, Form, message, Select, DatePicker, Affix} from 'antd';
import ContentDiff from '../contentDiff';
import NewRefactoringList from './NewRefactoringList'; 
import RefactoringSummary from './RefactoringSummary'; 
import RefactoringDetail from './RefactoringDetail';
import moment from 'moment';
import {ArrowLeftOutlined, ArrowUpOutlined} from '@ant-design/icons'; 
import { PieConfig } from './pieChartConfig';

const { RangePicker } = DatePicker;
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
        PieSelectedTypes:[],//存储饼图的选中类
        dateRange: null, //存储选择的日期范围
        latestDate: null, //记录最晚时间
        earliestDate: null, //记录最早时间
        filteredCommits: [], //存储过滤后的 commits
        isScrollVisible: false, // 是否显示回到顶部按钮
    }
    
    //计算所有文件的增删行数
    calculateTotalChanges = () => {
        const { diffResults } = this.state;
        return diffResults.reduce((total, result) => {
            const changes = result.diff.reduce((acc, line) => {
                // 如果是单行变更
                if (typeof line === 'string') {
                    if (line.startsWith('+')) acc.additions++;
                    if (line.startsWith('-')) acc.deletions++;
                } 
                // 如果是对象形式的变更
                else {
                    if (line.value) {
                        const lines = line.value.split('\n');
                        // 计算实际的行数（去掉最后一个空行）
                        const lineCount = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
                        if (line.added) acc.additions += lineCount;
                        if (line.removed) acc.deletions += lineCount;
                    }
                }
                return acc;
            }, { additions: 0, deletions: 0 });
            
            return {
                additions: total.additions + changes.additions,
                deletions: total.deletions + changes.deletions
            };
        }, { additions: 0, deletions: 0 });
    }

    // 添加滚动监听
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    // 清理滚动监听
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    // 处理滚动事件
    handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.setState({ isScrollVisible: scrollTop > 300 });
    }

    // 滚动到顶部
    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // 平滑滚动
        });
    }

    //比较两个代码的diff
    actDiff = async (oldCode, newCode) => {
        try {
            return await window.electronAPI.performDiff(oldCode, newCode);
        } catch (error) {
            console.error('Error computing diff:', error);
            message.error('Error computing diff.');
            return [];
        }
    }

    //处理点击detect按钮的事件
    handleSubmit = async () => {
        this.setState({
            showType: SHOW_TYPE.HIGHLIGHT,
            isFilteredByLocation: false,
            isDetect: true, 
            PieSelectedTypes: [], // 重置选中的类型
        });
        
    };

    //选择仓库目录按钮的事件
    selectDirectoryDialog = async () => {
        console.log('Opening directory selection dialog');
        window.electronAPI.selectDirectory();
    
        window.electronAPI.onDirectorySelected((path) => {
            console.log('Directory selected:', path);  // 调试日志
            this.setState({ repository: path ,
                            fileUploaded:false,
                            isFilteredByLocation: false,
                            showType:SHOW_TYPE.NORMAL
            });
            this.fetchCommits(path);
        });
    };

    //获取 commit 列表
    fetchCommits = async (path) => {
        try {
            const response = await fetch('http://localhost:8080/api/commit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository: path }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch commit list.');
            }

            const commitList = await response.json();
            if (commitList.length > 0) {
                const earliestDate = moment(commitList[commitList.length - 1].commitTime, 'YYYY-MM-DD'); // 假设 commitList 按照时间顺序排列
                const latestDate = moment(commitList[0].commitTime, 'YYYY-MM-DD'); // 假设 commitList 按照时间顺序排列
                this.setState({ 
                    commits: commitList,
                    filteredCommits: commitList,
                    earliestDate,
                    latestDate,
                    dateRange: [earliestDate, latestDate],
                }, this.filterCommits);
            } else {
                message.warning('没有找到提交记录。');
            }
        } catch (error) {
            console.error('Error fetching commits:', error);
            message.error('Error fetching commits.');
        }
    };

    //处理时间范围的函数
    handleDateRangeChange = (dates, dateStrings) => {
        this.setState({ dateRange:dates }, this.filterCommits);
    }

    //根据时间范围过滤commits
    filterCommits = () => {
        const { commits, dateRange } = this.state;
        if (!dateRange || dateRange.length !== 2) {
            this.setState({ filteredCommits: commits });
            return;
        }

        const [startDate, endDate] = dateRange;
        const filteredCommits = commits.filter(commit => {
            const commitDate = moment(commit.commitTime, 'YYYY-MM-DD');
            return commitDate.isBetween(startDate, endDate, null, '[]');
        });

        this.setState({ filteredCommits, commitid: '' }); // 重置选中的 commitid
    }
    
    //commit选择框
    renderCommitSelect = () => {
        const { filteredCommits, commitid } = this.state;
        return (
            <FormItem>
                <Select
                    value={commitid}
                    onSelect={(value) => {this.setState({ commitid: value }, this.fetchData);}}
                    placeholder="Select a commit"
                    style={{ width: '100%' }}
                    showSearch
                    filterOption={(input, option) => {
                        const commitInfo = option?.children?.toString().toLowerCase() || '';
                        return commitInfo.indexOf(input.toLowerCase()) >= 0;
                    }}
                >
                    {filteredCommits.map((commit, index) => (
                        <Select.Option key={index} value={commit.commitId}>
                            {commit.commitId} ({commit.commitTime})
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
                    const diffResults = await Promise.all(files.map(async (file) => ({
                        fileName: file.name,
                        diff: await this.actDiff(file.oldCode, file.newCode),
                    })));
    
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
        if (refactorings.length === 0) return [];
        const typeMap = new Map();
        refactorings.forEach(({ type }) => {
            typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        
        return Array.from(typeMap, ([type, value]) => ({ type, value }));
    }

    //处理饼图点击事件
    handlePieSelect = (event) => {
        const { data } = event.data || {};
        if (!data || !data.type) return;

        this.setState(prevState => {
            let newSelectedTypes;
            if (prevState.PieSelectedTypes.includes(data.type)) {
                // 如果类型已被选中,则取消选择
                newSelectedTypes = prevState.PieSelectedTypes.filter(type => type !== data.type);
            } else {
                // 如果类型未被选中,则添加到选中列表
                newSelectedTypes = [...prevState.PieSelectedTypes, data.type];
            }
            console.log('New selected types:', newSelectedTypes);
            return { PieSelectedTypes: newSelectedTypes };
        });
    }

    //获取重构列表应该显示的重构信息
    getFilteredRefactorings = () => {
        const { refactorings, PieSelectedTypes, isFilteredByLocation, filteredRefactoring } = this.state;

        if (isFilteredByLocation) {
            return filteredRefactoring;
        }

        if (PieSelectedTypes.length === 0) {
            return refactorings;
        }

        return refactorings.filter(refactoring => PieSelectedTypes.includes(refactoring.type));
    }

    // 禁用超出范围的日期
    disabledDate = (current) => {
        const { earliestDate, latestDate } = this.state;
        if (!current) return false;
        return current.isBefore(earliestDate, 'day') || current.isAfter(latestDate, 'day');
    };


    render() {
        const { diffResults, fileUploaded, repository, commitid, commits,highlightedFiles, 
            isFilteredByLocation, refactorings, showType, isDetect, dateRange,} = this.state;
        const refactoringData = this.getRefactoringTypeData();
        const pieConfig = PieConfig(refactoringData, this.state.PieSelectedTypes); //饼图配置
    
        const isFileMatched = (filePath, resultFileName) => {
            if (filePath === resultFileName) return true;
            const [oldPath, newPath] = resultFileName.split(" --> ").map(p => p.trim());
            return filePath === oldPath || filePath === newPath;
        };
        const totalChanges = this.calculateTotalChanges();

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
                            <div className={s.dataSelect}>
                                <div className={s.dataSelectlabel}>DateRange :</div>
                                <div className={s.dataSelectPicker}>
                                    <RangePicker 
                                        onChange={this.handleDateRangeChange}
                                        value={dateRange}
                                        disabledDate={this.disabledDate}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        {commits.length > 0 &&(
                                <div  className={s.CommitselectAndBotton}>
                                    <div className={s.Commitlabel}>Commit ID :</div>
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

                {/* 高亮时的返回键 */}
                {isDetect && fileUploaded && isFilteredByLocation && (
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={this.resetToAllFiles}
                        style={{ 
                            marginBottom: '15px', 
                            marginLeft: '2%',
                            color: '#666',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #e8e8e8',
                            boxShadow: 'none'
                        }}
                        className={s.backButton}
                    >
                        BACK
                    </Button>
                )}

                {/* 显示未高亮文件 */}
                {!isDetect && fileUploaded && diffResults.length > 0 && (
                    <>
                        <Affix offsetTop={0}>
                            <div className={s.affixContainer}>
                                <div>
                                    <span className={s.fileCount}>
                                        {diffResults.length} files changed
                                    </span>
                                    <span className={s.additionsline}>+{totalChanges.additions}</span>
                                    <span className={s.deletionsline}>-{totalChanges.deletions}</span>
                                    <span className={s.lineschanged}>lines changed</span>
                                </div>
                                {this.state.isScrollVisible && (
                                    <Button 
                                        type="text" 
                                        icon={<ArrowUpOutlined />}
                                        className={s.backTopButton}
                                        onClick={this.scrollToTop}
                                    >
                                        Top
                                    </Button>
                                )}
                            </div>
                        </Affix>

                        {diffResults.map((result, index) => (
                            <div key={index}>
                                <ContentDiff
                                    isFile={this.isFile}
                                    diffArr={result.diff}
                                    highlightedLines={[]}  // 初始状态没有高亮
                                    showType={showType}
                                    fileName={result.fileName}  
                                    commitId = {commitid} 
                                />
                            </div>
                        ))}
                    </> 
                )}

                {/* 显示重构总结和饼图 */}
                {isDetect && !isFilteredByLocation && fileUploaded && (
                    <>
                        <div className={s.RefactoringSummary}>
                            <RefactoringSummary data={refactoringData} />
                        </div>
                        {refactorings.length > 0 && (
                            <div className={s.pie}>
                                <Pie {...pieConfig} onEvent={(chart, event) => {
                                    if (event.type === 'element:click') {
                                        this.handlePieSelect(event);
                                    }
                                }}/>
                            </div>
                        )}
                    </>
                )}

                {/* 显示重构列表 */}
                {isDetect && fileUploaded && !isFilteredByLocation &&(
                    <NewRefactoringList 
                        refactorings={this.getFilteredRefactorings()} 
                        onHighlightDiff={this.handleHighlightDiff} 
                    />
                )}

                {/* 显示location之后的重构细节 */}
                {isDetect && fileUploaded && isFilteredByLocation &&(
                    <RefactoringDetail
                        refactorings={this.getFilteredRefactorings()} 
                    />
                )}

                {/* 显示高亮文件 */}
                {isDetect && fileUploaded && isFilteredByLocation && diffResults.length > 0 && diffResults.map((result, index) => {
                    const matchedFiles = highlightedFiles.filter(f => isFileMatched(f.filePath, result.fileName));
                    const shouldRender = matchedFiles.length > 0;

                    return shouldRender && (
                        <div key={index}>
                            <ContentDiff
                                isFile={this.isFile}
                                diffArr={result.diff}
                                highlightedLines={matchedFiles}
                                showType={showType}
                                fileName={result.fileName}
                                commitId = {commitid}   
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default DiffPanel;
