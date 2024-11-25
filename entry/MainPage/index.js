import React from 'react';
import s from './index.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {Spin, Button, Form, message, Select, DatePicker, Affix, Input, Tabs} from 'antd';
import ContentDiff from '../contentDiff';
import NewRefactoringList from '../RefactoringList/NewRefactoringList'; 
import RefactoringSummary from '../RefactoringSummary/RefactoringSummary'; 
import RefactoringDetail from '../RefactoringDetail/RefactoringDetail';
import moment from 'moment';
import {ArrowLeftOutlined, ArrowUpOutlined, FolderOpenOutlined, CopyOutlined} from '@ant-design/icons'; 
import { calculateTotalChanges } from '../utils/diffUtils';
import { getRefactoringTypeData, fileCount } from '../utils/refactoringUtils';
import PieChart from '../Pie-Chart/PieChart';
import FileTree from '../RefactoringSummary/FileTree';
import CommitInfo from '../Module/CommitInfo'

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const CACHE_SIZE = 9;

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
        commitMessage:'', //commit message
        commitAuthor:'', //提交人
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
        latestDate_dc1: null, //记录最晚时间
        earliestDate_dc1: null, //记录最早时间
        latestDate_dc2: null, //记录最晚时间
        earliestDate_dc2: null, //记录最早时间
        dateRange_dc1: null, //存储选择的日期范围
        dateRange_dc2: null,
        filteredCommits: [], //存储过滤后的 commits（选择框真正显示的commits）
        filteredCommits_dc1: [],
        filteredCommits_dc2: [],
        isScrollVisible: false, // 是否显示回到顶部按钮
        currentPage: 1, //用于存储list当前页码
        detecttype: 'defaut',
        commitMap: {}, //commit到message和author的映射
        startCommitId:'',
        endCommitId:'',
        treeFilterRefactorings:[], //被文件树过滤的重构
        isFilteredbyTree: false,
        selectedKeys: [],
        ongoingTasks: new Set(),
        loadingFromDB: false,
        refactoringCache: [],
        refactoringCurrentIndex: 0, //当前页面下的索引
        refactoringCurrentPage: 0, //当前页
        commitsCache:[],
        refactoringData: [], //给饼图的类别数据
        refactoringTotalPages: 0, //总页数
        refactoringPageSize: 0, //页面大小
    }

    isFetchingRefactoring = false; //标识是否正在进行重构挖掘
    isFetchingRefactoring_dc = false; //标识是否正在进行重构挖掘
    lastRequestParams = {}; //记录上一次请求访问的参数
    

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.connectWebSocket();
        this.updateRefactoringData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.refactorings !== this.state.refactorings || prevState.isFilteredbyTree !== this.state.isFilteredbyTree || prevState.selectedKeys !== this.state.selectedKeys) {
            this.updateRefactoringData();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    // 处理滚动事件
    handleScroll = () => {
        const { isDetect } = this.state;
        if(!isDetect){
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isVisible = scrollTop > 300;
            this.setState(prevState => {
                if (prevState.isScrollVisible !== isVisible) {
                    return { isScrollVisible: isVisible };
                }
                return null; 
            });
        }
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

    //选择仓库目录按钮的事件
    selectDirectoryDialog = async () => {
        window.electronAPI.selectDirectory();
        window.electronAPI.onDirectorySelected((path) => {
            console.log('Directory selected:', path);  // 调试日志
            this.setState({ repository: path ,
                            fileUploaded:false,
                            isFilteredByLocation: false,
                            showType:SHOW_TYPE.NORMAL,
                            commitid:'',
                            startCommitId:'',
                            endCommitId:''
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
                commitList.forEach((commit,index) => {
                    commitMap[commit.commitId] = {
                        commitMessage: commit.message,
                        commitAuthor: commit.author,
                        commitIndex: index,
                        commitTime: moment(commit.commitTime, 'YYYY-MM-DD'),
                    };
                });

                this.setState({ 
                    commits: commitList,
                    filteredCommits: commitList,
                    filteredCommits_dc1: commitList,
                    filteredCommits_dc2: commitList,
                    commitMap,
                    earliestDate,
                    latestDate,
                    latestDate_dc2: latestDate, 
                    earliestDate_dc2: earliestDate, 
                    latestDate_dc1: latestDate, 
                    earliestDate_dc1: earliestDate, 
                    dateRange: [earliestDate, latestDate],
                    dateRange_dc1: [earliestDate, latestDate],
                    dateRange_dc2: [earliestDate, latestDate],
                },() => {
                    this.filterCommits();
                    this.filterCommits_dc('dateRange_dc1', -1);
                    this.filterCommits_dc('dateRange_dc2', -1);
                });
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
        this.setState({ dateRange:dates }, () => { this.filterCommits()});
    }
    handleDateRangeChange_dc1 = (dates, dateStrings) => {
        const {commitMap,endCommitId} = this.state;
        this.setState({ dateRange_dc1:dates },  () => {
            if(endCommitId){
                this.filterCommits_dc('dateRange_dc1', commitMap[endCommitId].commitIndex)
            }
            else {this.filterCommits_dc('dateRange_dc1', -1)};
        });
    }
    handleDateRangeChange_dc2 = (dates, dateStrings) => {
        const {commitMap,startCommitId} = this.state;
        this.setState({ dateRange_dc2:dates },  () => {
            if(startCommitId){
                this.filterCommits_dc('dateRange_dc2', commitMap[startCommitId].commitIndex);
            }
            else {this.filterCommits_dc('dateRange_dc2', -1)};
        });
    }

    //根据时间过滤commits
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

    filterCommits_dc = (type, commitindex) => {
        const { commits, dateRange_dc1, dateRange_dc2, startCommitId, endCommitId} = this.state;
        const range = type === 'dateRange_dc1' ? dateRange_dc1 : dateRange_dc2;
        const filteredCommitsKey = type === 'dateRange_dc1' ? 'filteredCommits_dc1' : 'filteredCommits_dc2';

        if (!range || range.length !== 2) {
            this.setState({ [filteredCommitsKey]: commits });
            return;
        }

        const [startDate, endDate] = range;
        let pre_filteredCommits = [];
        if(commitindex === -1){
            pre_filteredCommits = commits;
        }
        else{
            pre_filteredCommits = type === 'dateRange_dc1' ? commits.slice(commitindex + 1,) : commits.slice(0 , commitindex);
        }
        const filteredCommits = pre_filteredCommits.filter(commit => {
            const commitDate = moment(commit.commitTime, 'YYYY-MM-DD');
            return commitDate.isBetween(startDate, endDate, null, '[]');
        });
        if( type === 'dateRange_dc1'){
            if (!filteredCommits.some(commit => commit.commitId === startCommitId)) {
                this.setState({ [filteredCommitsKey]: filteredCommits, startCommitId: '' });
            } else {
                this.setState({ [filteredCommitsKey]: filteredCommits });
            }
        }
        else{
            if (!filteredCommits.some(commit => commit.commitId === endCommitId)) {
                this.setState({ [filteredCommitsKey]: filteredCommits, endCommitId: '' });
            } else {
                this.setState({ [filteredCommitsKey]: filteredCommits });
            }
        }
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
                                commitMessage: selectedCommit.commitMessage,
                                commitAuthor: selectedCommit.commitAuthor
                            }, this.fetchDiffFile);
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

    renderCommitSelect_dc = (isStart) => {
        const { filteredCommits_dc1, filteredCommits_dc2, startCommitId, endCommitId, commitMap, dateRange_dc1, dateRange_dc2} = this.state;
        const filteredCommitsByDate = isStart ? filteredCommits_dc1 : filteredCommits_dc2;

        return (
            <FormItem>
                <Select
                    value={isStart ? startCommitId : endCommitId}
                    onSelect={(value) => {
                        const selectedCommit = commitMap[value];
                        this.setState({ 
                            [isStart ? 'startCommitId' : 'endCommitId']: value 
                        });
                        if(isStart){
                            const [startDate, endDate] = dateRange_dc2;
                            this.setState({
                                dateRange_dc2 : [selectedCommit.commitTime, endDate], 
                                earliestDate_dc2 : selectedCommit.commitTime,
                            },() => {
                                this.filterCommits_dc('dateRange_dc2', selectedCommit.commitIndex);
                                if(endCommitId){
                                    this.fetchDiffFile_dc();
                                }
                            });
                        }
                        else{
                            const [startDate, endDate] = dateRange_dc1;
                            this.setState({
                                dateRange_dc1 : [startDate, selectedCommit.commitTime],
                                latestDate_dc1 : selectedCommit.commitTime,
                            },() => {
                                this.filterCommits_dc('dateRange_dc1', selectedCommit.commitIndex);
                                if(startCommitId){
                                    this.fetchDiffFile_dc();
                                }
                            });
                        }
                    }}
                    style={{ width: '100%' }}
                    showSearch
                    filterOption={(input, option) => {
                        const commitInfo = option?.children?.toString().toLowerCase() || '';
                        return commitInfo.indexOf(input.toLowerCase()) >= 0;
                    }}
                >
                    {filteredCommitsByDate.map((commit, index) => (
                        <Select.Option key={index} value={commit.commitId}>
                            [{commit.commitTime}]{" "}{commit.commitId}
                        </Select.Option>
                    ))}
                </Select>
            </FormItem>
        );
    };

    //负责仅从后端获取oldode以及newcode
    fetchDiffFile = async () => {
        const { commitid, repository } = this.state;
    
        if (!commitid || !repository) {
            message.error('Please provide repository and commitid.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/getDiff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository: repository, commitId: commitid}),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const diffFiles = await response.json();
    
            if (diffFiles.length > 0) {
                const diffResults = await Promise.all(diffFiles.map(async (file) => ({
                    fileName: file.name,
                    diff: await this.actDiff(file.oldCode, file.newCode),
                })));
                this.setState({
                    diffResults,
                    fileUploaded: true ,
                    isFilteredByLocation: false ,
                    showType: SHOW_TYPE.NORMAL,
                    isDetect:false,
                });
            } else {
                message.error('No diff files found in JSON.');
            }
        } catch (error) {
            console.error('Error fetching diff files:', error);
            message.error('Error fetching diff files.');
        }
    };

    //负责仅从后端获取oldode以及newcode （两个commit版本）
    fetchDiffFile_dc = async () => {
        const { startCommitId,endCommitId, repository } = this.state;
    
        if (!startCommitId || !repository || !endCommitId) {
            message.error('Please provide repository and two commitid.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/getDiffBC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository: repository, startCommitId: startCommitId, endCommitId: endCommitId}),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const diffFiles = await response.json();
    
            if (diffFiles.length > 0) {
                const diffResults = await Promise.all(diffFiles.map(async (file) => ({
                    fileName: file.name,
                    diff: await this.actDiff(file.oldCode, file.newCode),
                })));
                this.setState({
                    diffResults,
                    fileUploaded: true ,
                    isFilteredByLocation: false ,
                    showType: SHOW_TYPE.NORMAL,
                    isDetect:false,
                });
            } else {
                message.error('No diff files found in JSON.');
            }
        } catch (error) {
            console.error('Error fetching diff files:', error);
            message.error('Error fetching diff files.');
        }
    };

    //负责仅从后端获取oldode以及newcode，不改变任何属性
    fetchDiffFile_only = async (diffFiles) => {
        try {
            if (diffFiles.length > 0) {
                const diffResults = await Promise.all(diffFiles.map(async (file) => ({
                    fileName: file.name,
                    diff: await this.actDiff(file.oldCode, file.newCode),
                })));
                this.setState({ 
                    diffResults,
                });
            } else {
                this.setState({ diffResults:[]});
            }
        } catch (error) {
            console.error('Error fetching diff files:', error);
            message.error('Error fetching diff files.');
            this.setState({ diffResults:[]});
        }
    };

    //用于从后端获取重构
    fetchRefactoring = async () => {
        const { commitid, repository } = this.state;
    
        if(!commitid || !repository) {
            message.error('Please provide repository and commitid.');
            return;
        }

        if(this.isFetchingRefactoring){
            return; //如果上一次没执行完，则不执行请求
        }

        this.isFetchingRefactoring = true;  // 设置为正在请求中

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
                this.setState({
                    refactorings: firstResult.refactorings || [],
                    showType: SHOW_TYPE.HIGHLIGHT,
                    isFilteredByLocation: false,
                    PieSelectedTypes: [], 
                    isDetect: true, 
                });
                this.isFetchingRefactoring = false;
            } else {
                message.error('Invalid JSON format: Missing results array.');
                this.isFetchingRefactoring = false;
            }
        } catch (error) {
            this.isFetchingRefactoring = false;
            console.error('Error fetching data:', error);
            message.error('Error fetching data.');
        }
    };

    //用于从后端获取重构(between two commits)
    fetchRefactoring_dc = async () => {
        const { startCommitId,endCommitId, repository } = this.state;
        
        if (!startCommitId || !repository || !endCommitId) {
            message.error('Please provide repository and two commitid.');
            return;
        }

        if(this.isFetchingRefactoring_dc){
            return; //如果上一次没执行完，则不执行请求
        }

        this.isFetchingRefactoring_dc = true;  // 设置为正在请求中

        try {
            const response = await fetch('http://localhost:8080/api/detectBC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository: repository, startCommitId: startCommitId, endCommitId: endCommitId}),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const json = await response.json();
    
            if (json.results && json.results.length > 0) {
                const firstResult = json.results[0];
                this.setState({
                    refactorings: firstResult.refactorings || [],
                    showType: SHOW_TYPE.HIGHLIGHT,
                    isFilteredByLocation: false,
                    PieSelectedTypes: [], 
                    isDetect: true, 
                });
                this.isFetchingRefactoring_dc = false;
            } else {
                this.isFetchingRefactoring_dc = false;
                message.error('Invalid JSON format: Missing results array.');
            }
        } catch (error) {
            this.isFetchingRefactoring_dc = false;
            console.error('Error fetching data:', error);
            message.error('Error fetching data.');
        }
    };

    //通知后端，开始挖掘重构并存入数据库(all between two commits)
    fetchRefactoring_dac = async () => {
        const {startCommitId, endCommitId, repository, ongoingTasks, commitMap, commits} = this.state;
    
        if (!startCommitId || !repository || !endCommitId) {
            message.error('Please provide repository and two commitid.');
            return;
        }

        const taskKey = `${repository}-${startCommitId}-${endCommitId}`;

        if (ongoingTasks.has(taskKey)) {
            message.warning('Task is already running for this repository and commit range. Please wait.');
            return;
        }

        this.setState((prevState) => ({
            ongoingTasks: new Set(prevState.ongoingTasks).add(taskKey),
        }));

        try {
            const response = await fetch('http://localhost:8080/api/detectAC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repository: repository, startCommitId: startCommitId, endCommitId: endCommitId}),
            });

            const responseMessage = await response.text();
            const commitsf = commits.slice(commitMap[endCommitId].commitIndex, commitMap[startCommitId].commitIndex);
            
            if (response.ok) {
                this.setState(
                    {
                        refactoringCurrentPage: 0, //当前页0
                        refactoringCurrentIndex: 0, //当前页面的当前id
                        refactoringCache:[], //重构缓存
                        isDetect: true, 
                        isFilteredByLocation: false,
                        PieSelectedTypes: [], 
                        showType: SHOW_TYPE.HIGHLIGHT,
                        commitsCache: commitsf.map(commit => commit.commitId).slice().reverse(), //只需要id并反转，按时间增序
                        refactoringTotalPages: Math.ceil(commitsf.length / CACHE_SIZE), //页面总数
                        refactoringPageSize: Math.min(commitsf.length, CACHE_SIZE)//页面大小
                    },
                    () => {
                        this.loadRefactoringFromDB(this.state.commitsCache.slice(0, Math.min(this.state.commitsCache.length, CACHE_SIZE)))
                            .then(() => {
                                const firstResult = this.state.refactoringCache[0].results[0];
                                const diffFiles = firstResult.files;
                                this.fetchDiffFile_only(diffFiles);
                                this.setState({ refactorings: firstResult.refactorings || [] });
                            });
                    }
                );
            } else {
                message.error(`Failed: ${responseMessage}`); // 失败信息
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Error fetching data.');
            this.resetTask(taskKey);
        }
    };

    //通知后端从数据库读取数据并展示
    loadRefactoringFromDB = async (commitIds) => {
        const { repository } = this.state;
        this.setState({ loadingFromDB: true });

        try {
            const response = await fetch('http://localhost:8080/api/getFromDB', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    repository: repository,
                    commitIds: commitIds,
                }),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg);
            }

            const data = await response.json();
            const parsedData = data.map(item => JSON.parse(item));

            this.setState({ 
                refactoringCache: parsedData,
            });
            console.log(this.state.refactoringCache);

        } catch (error) {
            message.error(`Error loading data`);
        } finally {
            this.setState({ loadingFromDB: false });
        }
    };

    //探测all between commit时候的websocket连接以及接收消息
    connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
    
        this.stompClient.connect({}, () => {
            console.log('Connected to WebSocket');
    
            this.stompClient.subscribe('/topic/task-completion', (messageOutput) => {
                const messageJson = JSON.parse(messageOutput.body);
                
                if (messageJson.status === 'success'){
                    message.success(`Task completed for ${messageJson.taskKey}`);
                    console.log(messageJson.taskKey);
                    this.resetTask(messageJson.taskKey);
                }else if (messageJson.status === 'failure') {
                    message.error(`Task failed for ${messageJson.taskKey}`);
                    this.resetTask(messageJson.taskKey);
                } else {
                    console.warn('Unknown status in WebSocket message:', messageJson);
                }
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });
    };
    
    //重置正在执行的任务
    resetTask = (taskKey) => {
        this.setState((prevState) => {
            const newOngoingTasks = new Set(prevState.ongoingTasks);
            newOngoingTasks.delete(taskKey);
            return { ongoingTasks: newOngoingTasks };
        });
    };

    //更新饼图数据的函数
    updateRefactoringData = () => {
        const { refactorings, isFilteredbyTree, treeFilterRefactorings } = this.state;
        const refactoringData = isFilteredbyTree 
            ? getRefactoringTypeData(treeFilterRefactorings) //正在被文件树过滤
            : getRefactoringTypeData(refactorings); // 没有被文件数过滤

        this.setState({ refactoringData });
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
            filteredRefactoring: [],
            PieSelectedTypes:[], //返回之后 重置饼图选中类型，因为饼图目前无法保存选中状态至重新渲染
        });
    };

    //处理饼图点击事件
    handlePieSelect = (data) => {
        const type = data.type;
        const { PieSelectedTypes } = this.state;
        if (PieSelectedTypes.includes(type)) {
            this.setState({ PieSelectedTypes: PieSelectedTypes.filter(t => t !== type) });
        } else {
            this.setState({ PieSelectedTypes: [...PieSelectedTypes, type] });
        }
    };

    //获取重构列表应该显示的重构信息
    getFilteredRefactorings = () => {
        const { refactorings, PieSelectedTypes, treeFilterRefactorings, isFilteredbyTree} = this.state;

        let r = isFilteredbyTree ? treeFilterRefactorings : refactorings

        if (PieSelectedTypes.length === 0) {
            return r;
        }
        return r.filter(refactoring => PieSelectedTypes.includes(refactoring.type));
    }

    // 禁用超出范围的日期
    disabledDate = (current) => {
        const { earliestDate, latestDate } = this.state;
        if (!current) return false;
        return current.isBefore(earliestDate, 'day') || current.isAfter(latestDate, 'day');
    };
    disabledDate_dc1 = (current) => {
        const { earliestDate_dc1, latestDate_dc1 } = this.state;
        if (!current) return false;
        return current.isBefore(earliestDate_dc1, 'day') || current.isAfter(latestDate_dc1, 'day');
    };
    disabledDate_dc2 = (current) => {
        const { earliestDate_dc2, latestDate_dc2 } = this.state;
        if (!current) return false;
        return current.isBefore(earliestDate_dc2, 'day') || current.isAfter(latestDate_dc2, 'day');
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

    //判断文件名是否匹配 尤其是在有--->的时候
    isFileMatched = (filePath, resultFileName) => {
        if (filePath === resultFileName) return true;
        const [oldPath, newPath] = resultFileName.split(" --> ").map(p => p.trim());
        return filePath === oldPath || filePath === newPath;
    };

    //选中文件数的文件
    handleTreeFilterRefactorings = (filteredRefactorings) => {
        this.setState({
            treeFilterRefactorings: filteredRefactorings,
            isFilteredbyTree : true,
            PieSelectedTypes : [],
        });
    };

    //取消选中文件数的文件
    handleCleanTreeFilterRefactorings = () => {
        this.setState({
            treeFilterRefactorings: [],
            isFilteredbyTree : false,
            PieSelectedTypes : [],
        });
    };

    //翻页按钮的函数
    handlePageChange = (direction) => {
        const { refactoringCurrentPage, refactoringPageSize, commitsCache, refactoringTotalPages, refactoringCurrentIndex} = this.state;
        
        let newPage = refactoringCurrentPage;
        let newIndex = refactoringCurrentIndex;

        if(direction === 0){ // 向前翻页
            if(refactoringCurrentIndex === 0 && refactoringCurrentPage !== 0){ //跨页
                newIndex = refactoringPageSize - 1;
                newPage = refactoringCurrentPage - 1;
                const NewcommitIds = commitsCache.slice(newPage * refactoringPageSize, (newPage + 1) * refactoringPageSize);
                this.setState(
                    {
                        refactoringCurrentIndex: newIndex,
                        refactoringCurrentPage: newPage,
                        selectedKeys:[],
                        PieSelectedTypes:[],
                        isFilteredByLocation:false,
                        isFilteredbyTree:false,
                        showType: SHOW_TYPE.NORMAL,
                    },
                    () => this.loadRefactoringFromDB(NewcommitIds)
                        .then(() => {
                            const firstResult = this.state.refactoringCache[newIndex].results[0];
                            const diffFiles = firstResult.files;
                            this.fetchDiffFile_only(diffFiles);
                            this.setState({ refactorings: firstResult.refactorings || [] });
                        })
                );
            }
            else{ //页内
                newIndex = refactoringCurrentIndex - 1;
                this.setState({
                    refactoringCurrentIndex : newIndex,
                    selectedKeys:[],
                    PieSelectedTypes:[],
                    isFilteredByLocation:false,
                    isFilteredbyTree:false,
                    showType: SHOW_TYPE.NORMAL,
                }, () => {
                        const firstResult = this.state.refactoringCache[newIndex].results[0];
                        const diffFiles = firstResult.files;
                        this.fetchDiffFile_only(diffFiles);
                        this.setState({ refactorings: firstResult.refactorings || [] });
                });
            }
        }
        else{ //向后翻页
            if(refactoringCurrentIndex === refactoringPageSize - 1 && refactoringCurrentPage !== refactoringTotalPages - 1){
                newIndex = 0;
                newPage = refactoringCurrentPage + 1;
                const NewcommitIds = commitsCache.slice(newPage * refactoringPageSize, Math.min((newPage + 1) * refactoringPageSize, commitsCache.length));
                this.setState(
                    {
                        refactoringCurrentIndex: newIndex,
                        refactoringCurrentPage: newPage,
                        selectedKeys:[],
                        PieSelectedTypes:[],
                        isFilteredByLocation:false,
                        isFilteredbyTree:false,
                        showType: SHOW_TYPE.NORMAL,
                    },
                    () => this.loadRefactoringFromDB(NewcommitIds)
                        .then(() => {
                            const firstResult = this.state.refactoringCache[newIndex].results[0];
                            const diffFiles = firstResult.files;
                            this.fetchDiffFile_only(diffFiles);
                            this.setState({ refactorings: firstResult.refactorings || [] });
                        })
                );
            }
            else{
                newIndex = refactoringCurrentIndex + 1;
                this.setState({
                    refactoringCurrentIndex : newIndex,
                    selectedKeys:[],
                    PieSelectedTypes:[],
                    isFilteredByLocation:false,
                    isFilteredbyTree:false,
                    showType: SHOW_TYPE.NORMAL,
                },() => {
                        const firstResult = this.state.refactoringCache[newIndex].results[0];
                        const diffFiles = firstResult.files;
                        this.fetchDiffFile_only(diffFiles);
                        this.setState({ refactorings: firstResult.refactorings || [] });
                });
            }
        }
        console.log(this.state.refactoringCache[newIndex]);
        console.log('New Page:', newPage, 'New Index:', newIndex);
    };

    render() {
        const { diffResults, fileUploaded, selectedKeys, commitid, commits,highlightedFiles, 
            loadingFromDB, refactoringPageSize, refactoringCurrentIndex, refactoringCurrentPage,
            commitAuthor, commitMessage, latestDate, earliestDate, refactoringData, filteredRefactoring, refactoringCache,
            isFilteredByLocation, refactorings, showType, isDetect, dateRange, currentPage, commitMap, commitsCache,
            detecttype, dateRange_dc1, dateRange_dc2, startCommitId, endCommitId, isScrollVisible} = this.state;

        const totalChanges = calculateTotalChanges(diffResults);
        const fileCountMap = fileCount(refactorings);
        const currentCommitID = commitsCache[(refactoringCurrentPage)*refactoringPageSize+refactoringCurrentIndex];
        const currentCommitInfo = commitMap[currentCommitID];
        
        //文件树的点击操作
        const onSelect = (keys, event) => {
            const { selectedKeys } = this.state;
            if (event.node.isLeaf){
                // 如果当前选中的键已经在 selectedKeys 中，则移除它
                if (selectedKeys.includes(keys[0])) {
                    this.setState({
                        selectedKeys: selectedKeys.filter(key => key !== keys[0]),
                    });
                    this.handleCleanTreeFilterRefactorings();
                } else {
                    this.setState({
                        selectedKeys: keys,
                    });
                    const selectedFilePath = event.node.fullPath; //点击文件的完整路径
                    const fileTreeRefactorings = refactorings.filter(refactoring =>
                        refactoring.leftSideLocation.some(location => this.isFileMatched(selectedFilePath, location.filePath)) ||
                        refactoring.rightSideLocation.some(location => this.isFileMatched(selectedFilePath, location.filePath))
                    );
                    this.handleTreeFilterRefactorings(fileTreeRefactorings);
                }
            }
        };
        
        const items = [
            { 
                label: 'Diff', 
                key: 'diff', 
                children: 
                <div>
                    {diffResults.map((result, index) => (
                        <div key={index}>
                            <ContentDiff
                                isFile={this.isFile}
                                diffArr={result.diff}
                                highlightedLines={[]}
                                showType={SHOW_TYPE.NORMAL}
                                fileName={result.fileName}  
                                commitId = {currentCommitID} 
                            />
                        </div>
                    ))}
                </div> 
            }, 
            {
                label: 'Refactorings', 
                key: 'refactorings', 
                children: 
                <div>
                    <div className={s.RefactoringSummary}>
                        <RefactoringSummary 
                            data={refactoringData}
                            fileCountMap={fileCountMap} 
                        />
                        <div className={s.pieandtree}>
                            <div className={s.filetree}>
                                <FileTree
                                    fileCountMap={fileCountMap}
                                    selectedKeys={selectedKeys}
                                    onTreeSelect={onSelect}
                                />
                            </div>
                            <div className={s.pie}>
                                <PieChart
                                    piedata={this.state.refactoringData} 
                                    onPieSelect={this.handlePieSelect}
                                />
                            </div>
                        </div>
                    </div>

                    <NewRefactoringList 
                        refactorings={this.getFilteredRefactorings()} 
                        onHighlightDiff={this.handleHighlightDiff} 
                        currentPage={currentPage}
                        onPageChange={(page) => this.setState({ currentPage: page })}
                    />
                </div> 
            },
        ];
        
        

        return (
            <div className={s.wrapper}>
                <div className={s.handleSubmit}>
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
                                onSelect={(value) => {
                                    this.setState({ 
                                        detecttype: value, 
                                        fileUploaded: false, 
                                        isDetect: false, 
                                        isFilteredByLocation: false,
                                        commitid: '',
                                        dateRange: [earliestDate,latestDate],
                                        dateRange_dc1: [earliestDate,latestDate], 
                                        dateRange_dc2: [earliestDate,latestDate],
                                        filteredCommits: commits,
                                        filteredCommits_dc1:commits,
                                        filteredCommits_dc2:commits,
                                        earliestDate_dc1:earliestDate,
                                        earliestDate_dc2:earliestDate,
                                        latestDate_dc1:latestDate,
                                        latestDate_dc2:latestDate,
                                        startCommitId: '',
                                        endCommitId: ''
                                    });
                                }}
                                className={s.detcttypeselectbody}
                                style={{borderRadius: '4px'}}
                                options={[
                                    {
                                      label: <span>Commit</span>,
                                      title: 'Commit',
                                      options: [
                                        { label: <span>Between the previous commit</span>, value: 'defaut' },
                                        { label: <span>Between two commits</span>, value: 'dc' },
                                        { label: <span>All between two commits</span>, value: 'dac' },
                                      ],
                                    },
                                    {
                                      label: <span>Tag</span>,
                                      title: 'Tag',
                                      options: [
                                        { label: <span>Between two tags</span>, value: 'dt' },
                                        { label: <span>All between two tags</span>, value: 'dat' },
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
                                    <Button type="primary" onClick = {this.fetchRefactoring} className={s.button} disabled={!commitid}>
                                        Detect
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 比较两个commit之间 */}
                    {(detecttype === 'dc' || detecttype === 'dac') && commits.length > 0 && (
                        <div className={s.dc}>
                            <div className={s.dataSelect}>
                                <div className={s.dataSelectlabel}>DateRange :</div>
                                <div className={s.dataSelectPicker}>
                                    <RangePicker 
                                        onChange={this.handleDateRangeChange_dc1}
                                        value={dateRange_dc1}
                                        disabledDate={this.disabledDate_dc1}
                                    />
                                </div>
                            </div>

                            <div  className={s.dc_commitselect}>
                                <div className={s.Commitlabel}>Start ID:</div>
                                <div className ={s.commitselect}>
                                    {this.renderCommitSelect_dc(true)}
                                </div>
                            </div>

                            <div className={s.dataSelect}>
                                <div className={s.dataSelectlabel}>DateRange :</div>
                                <div className={s.dataSelectPicker}>
                                    <RangePicker 
                                        onChange = {this.handleDateRangeChange_dc2}
                                        value={dateRange_dc2}
                                        disabledDate={this.disabledDate_dc2}
                                    />
                                </div>
                            </div>

                            <div  className={s.dc_commitselectandbutton}>
                                <div className={s.Commitlabel}>End ID :</div>
                                <div className ={s.commitselect}>
                                    {this.renderCommitSelect_dc(false)}
                                </div>
                                <div>
                                    <Button 
                                        type="primary" 
                                        onClick={detecttype === 'dc' ? this.fetchRefactoring_dc : this.fetchRefactoring_dac} 
                                        className={s.button} 
                                        disabled={!startCommitId || !endCommitId}
                                    >
                                        {detecttype === 'dc' ? 'Detect' : 'Detect All'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 比较两个版本之间 */}
                    {detecttype === 'dt' && commits.length > 0 && (
                        <div>

                        </div>
                    )}

                </div>


                {/* 显示diff文件 */}
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
                                {isScrollVisible && (
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

                        {detecttype === 'defaut' && (
                            <CommitInfo 
                                commitMessage={commitMessage} 
                                commitAuthor={commitAuthor} 
                                commitid={commitid} 
                                copyToClipboard={this.copyToClipboard}
                            />
                        )}

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
                {(detecttype === 'defaut' ||  detecttype === 'dc') && isDetect && !isFilteredByLocation && fileUploaded && (
                    <>
                        <div className={s.RefactoringSummary}>
                            <RefactoringSummary 
                                data={refactoringData}
                                fileCountMap={fileCountMap} 
                            />
                            <div className={s.pieandtree}>
                                <div className={s.filetree}>
                                    <FileTree
                                        fileCountMap={fileCountMap}
                                        selectedKeys={selectedKeys}
                                        onTreeSelect={onSelect}
                                    />
                                </div>
                                <div className={s.pie}>
                                    <PieChart
                                        piedata={this.state.refactoringData} 
                                        onPieSelect={this.handlePieSelect}
                                    />
                                </div>
                            </div>
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
                            refactorings={filteredRefactoring} 
                        />

                        {diffResults.map((result, index) => {
                            const matchedFiles = highlightedFiles.filter(f => this.isFileMatched(f.filePath, result.fileName));
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

                {/* 显示DAC模式 */}
                {isDetect && detecttype === 'dac' && refactoringCache.length > 0 && !isFilteredByLocation &&(
                    loadingFromDB ? 
                    (
                        <div className={s.spin}>
                            <Spin size="large" />
                        </div>
                    ):
                    (
                        <div>
                            <div className={s.pagingarea}>
                                <div className={s.pageButton}>
                                    <Button 
                                        className={currentCommitID === commitsCache[0] ? s.changepagebuttondisable : s.changepagebutton} 
                                        type="text" 
                                        onClick={() => this.handlePageChange(0)}
                                        disabled={currentCommitID === commitsCache[0]}
                                    >
                                        {"<<<<"}<br />Previous
                                    </Button>
                                </div>
                                <div className={s.commitInfoContainer}>
                                    <CommitInfo
                                        commitMessage={currentCommitInfo.commitMessage} 
                                        commitAuthor={currentCommitInfo.commitAuthor}
                                        commitid={currentCommitID}
                                        copyToClipboard={this.copyToClipboard}
                                    />
                                </div>
                                <div className={s.pageButton}>
                                    <Button 
                                        className={currentCommitID === commitsCache[commitsCache.length-1] ? s.changepagebuttondisable : s.changepagebutton} 
                                        type="text" 
                                        onClick={() => this.handlePageChange(1)}
                                        disabled={currentCommitID === commitsCache[commitsCache.length-1]}
                                    >
                                        {">>>>"}<br />Next
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Tabs 
                                    items={items} 
                                    tabBarStyle={{marginLeft: '2%', marginRight: '2%'}} 
                                    defaultActiveKey = "refactorings"
                                />
                            </div>
                        </div>
                    )
                )}
                
            </div>
        );
    }
}

export default MainPage;
