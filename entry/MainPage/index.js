import React from 'react';
import s from './index.css';
import {Button, Form, message, Select, Tooltip, DatePicker, Affix, Input} from 'antd';
import ContentDiff from '../contentDiff';
import NewRefactoringList from '../RefactoringList/NewRefactoringList'; 
import RefactoringSummary from '../RefactoringSummary/RefactoringSummary'; 
import RefactoringDetail from '../RefactoringDetail/RefactoringDetail';
import moment from 'moment';
import {ArrowLeftOutlined, ArrowUpOutlined, FolderOpenOutlined, CopyOutlined} from '@ant-design/icons'; 

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

class MainPage extends React.Component {
    state = {
        diffResults: [], // 用于存储所有文件的 diff 结果
        repository:'',
        fileUploaded: false, // 表示文件已上传
        refactorings: [], // 新增用于存储 refactorings
        commitid:'',
        commitMessage:'', //存储commit消息
        commitAuthor:'',
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
        currentPage: 1, //用于存储list当前页码
        detecttype: 'defaut',
        commitMap: {}, //commit到message和author的映射
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
            const response = await fetch('http://localhost:8080/api/commits', {
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

                const commitMap = {};
                commitList.forEach(commit => {
                    commitMap[commit.commitId] = {
                        commitMessage: commit.message,
                        commitAuthor: commit.author,
                    };
                });

                this.setState({ 
                    commits: commitList,
                    filteredCommits: commitList,
                    commitMap,
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

        this.setState({ filteredCommits, commitid: '' });
    }
    
    //commit选择框
    renderCommitSelect = () => {
        const { filteredCommits, commitid, commitMap } = this.state;
        return (
            <FormItem>
                <Select
                    value={commitid}
                    onSelect={(value) => {
                        const selectedCommit = commitMap[value];
                        if (selectedCommit) {
                            this.setState({ 
                                commitid: value, 
                                commitMessage: selectedCommit.commitMessage, // 直接使用选中的提交信息
                                commitAuthor: selectedCommit.commitAuthor // 直接使用选中的用户信息
                            }, this.fetchData);
                        }
                    }}
                    
                    style={{ width: '100%'}}
                    showSearch
                    filterOption={(input, option) => {
                        const commitInfo = option?.children?.toString().toLowerCase() || '';
                        return commitInfo.indexOf(input.toLowerCase()) >= 0;
                    }}
                >
                    {filteredCommits.map((commit, index) => (
                        <Select.Option key={index} value={commit.commitId}>
                            [{commit.commitTime}]{" "}{commit.commitId}
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
            message.error('Please provide repository and commitid.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository: repository, commitId: commitid}),
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
            startColumn: location.startColumn,
            endColumn: location.endColumn,
            description:location.description,
            side: 'left', // 标记为左侧
        }));
    
        const rightSideHighlightedFiles = rightSideLocations.map(location => ({
            filePath: location.filePath,
            startLine: location.startLine,
            endLine: location.endLine,
            startColumn: location.startColumn,
            endColumn: location.endColumn,
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

    //复制函数
    copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('Commit ID copied!'); // 提示用户已复制
        }).catch(err => {
            console.error('Failed to copy: ', err);
            message.error('Failed to copy commit ID.');
        });
    };


    render() {
        const { diffResults, fileUploaded, repository, commitid, commits,highlightedFiles, commitAuthor, commitMessage,
            isFilteredByLocation, refactorings, showType, isDetect, dateRange, currentPage, detecttype} = this.state;
        const refactoringData = this.getRefactoringTypeData();
        
        const isFileMatched = (filePath, resultFileName) => {
            if (filePath === resultFileName) return true;
            const [oldPath, newPath] = resultFileName.split(" --> ").map(p => p.trim());
            return filePath === oldPath || filePath === newPath;
        };
        const totalChanges = this.calculateTotalChanges();
        const tooltipStyle = {
            fontSize: '12px',
            whiteSpace: 'nowrap',
            maxWidth: 'none',
            lineHeight: '1',
            minHeight: 'auto',
            userSelect: 'none',
            borderRadius: '6px'   
        };

        return (
            <div className={s.wrapper}>
                <Form {...layout} onFinish={this.handleSubmit} className={s.handleSubmit}>
                    
                    <div className={s.buttonandtext}>
                        <div className={s.repositorylabel}>Repository :</div>
                        <div className={s.inputandbutton}>
                            <div>
                                <Input 
                                    value={this.state.repository} 
                                    className={s.repositoryinput} 
                                    disabled
                                    placeholder='Select a repository'
                                />
                            </div>
                            <div>
                                <Button type="default" onClick={this.selectDirectoryDialog} className={s.selectbotton} icon={<FolderOpenOutlined />}>
                                </Button>
                            </div>
                        </div>
                        <div className={s.detecttypelabel}>DetectType :</div>
                        <div className={s.detcttypeselect}>
                            <Select
                                defaultValue = 'defaut'
                                onSelect={(value) => {this.setState({ detecttype: value });}}
                                className={s.detcttypeselectbody}
                                style={{borderRadius: '4px'}}
                                options={[
                                    {
                                      label: <span>Commit</span>,
                                      title: 'Commit',
                                      options: [
                                        { label: <span>Between the previous commit</span>, value: 'defaut' },
                                        { label: <span>Between two commits</span>, value: 'dc' },
                                      ],
                                    },
                                    {
                                      label: <span>Tag</span>,
                                      title: 'Tag',
                                      options: [
                                        { label: <span>Between two tags</span>, value: 'dt' },
                                      ],
                                    },
                                  ]}
                            />
                        </div>
                    </div>
                    
                    {/* 比较连续版本 */}
                    {detecttype === 'defaut' && commits.length > 0 && (
                        <div className={s.defaut}>
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
                            <div  className={s.CommitselectAndBotton}>
                                <div className={s.Commitlabel}>Commit ID :</div>
                                <div className ={s.commitselect}>
                                    {this.renderCommitSelect()}
                                </div>
                                <div>
                                    <Button type="primary" htmlType="submit" className={s.button} disabled={!commitid}>
                                        Detect
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 比较两个commit之间 */}
                    {detecttype === 'dc' && commits.length > 0 && (
                        <div>

                        </div>
                    )}

                    {/* 比较两个版本之间 */}
                    {detecttype === 'dt' && commits.length > 0 && (
                        <div>

                        </div>
                    )}
                    
                </Form>


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

                        <div className={s.messageandauthor}>
                            <div className={s.message}>
                                {commitMessage}
                            </div>
                            <div className={s.authorandcommit}>
                                <div className={s.author}>
                                    <span style={{ color: 'gray' }}>author:</span>
                                    &nbsp;&nbsp;&nbsp;
                                    {commitAuthor}
                                </div>
                                <div className={s.commit}>
                                    <span style={{ color: 'gray', marginLeft: '20px' }}>commit</span>
                                    &nbsp;
                                    {commitid.substring(0, 7)}
                                    <Tooltip 
                                        placement="bottomRight" 
                                        title={"Copy full SHA for " + commitid.substring(0, 7)}
                                        overlayInnerStyle={tooltipStyle}  
                                        autoAdjustOverflow={true}
                                        mouseLeaveDelay={0}
                                    >
                                        <Button 
                                            type="text"
                                            onClick={() => this.copyToClipboard(commitid)} 
                                            className={s.commitbutton}
                                            icon={<CopyOutlined />}

                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

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

                {/* 显示重构总结和重构列表 */}
                {isDetect && !isFilteredByLocation && fileUploaded && (
                    <>
                        <div className={s.RefactoringSummary}>
                            <RefactoringSummary 
                                data={refactoringData} 
                                refactorings={refactorings} 
                                onPieSelect={this.handlePieSelect}
                                PieSelectedTypes={this.state.PieSelectedTypes}
                            />
                        </div>

                        <NewRefactoringList 
                            refactorings={this.getFilteredRefactorings()} 
                            onHighlightDiff={this.handleHighlightDiff} 
                            currentPage={currentPage}
                            onPageChange={(page) => this.setState({ currentPage: page })}
                        />
                    </>
                )}

                {/* 显示location之后的重构细节 */}
                {isDetect && fileUploaded && isFilteredByLocation &&(
                    <>
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

                        <RefactoringDetail
                            refactorings={this.getFilteredRefactorings()} 
                        />

                        {diffResults.map((result, index) => {
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
                    </>
                )}
                
            </div>
        );
    }
}

export default MainPage;
