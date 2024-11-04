import React, { memo } from 'react';
import {Layout, Button, message, Tooltip} from 'antd';
import  SyntaxHighlighter  from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CaretRightOutlined, CaretDownOutlined, CopyOutlined, VerticalAlignMiddleOutlined, ColumnHeightOutlined, SwapOutlined} from '@ant-design/icons'; 
import s from './index.css';
import cx from 'classnames';
const { Content } = Layout;

const SHOW_TYPE = {
    HIGHLIGHT: 0,
    NORMAL: 1,
    UNIFIED: 2
}

const BLOCK_LENGTH = 3;

class ContentDiff extends React.Component {
    state = {
        lineGroup: [],
        originalLineGroup: [], // 新增：保存原始的行组数据
        showType: this.props.showType,
        selectedText: '',
        isExpanded: true,
        isHiddenVisible: false,
        stats: {
            additions: 0,
            deletions: 0
        },
    }

    generateBlocks = (count, type) => {
        return Array.from({ length: count }, (_, i) => (
            <span key={`${type}-${i}`} className={type === 'add' ? s.additionBlock : s.deletionBlock} />
        ));
    };

    // 渲染文件统计信息的方法
    renderFileStats = () => {
        const { stats } = this.state;
        const total = stats.additions + stats.deletions;
        const additionBlocks = Math.round((stats.additions / total) * 5) || 0;
        const deletionBlocks = 5 - additionBlocks;
        const tooltipText = `${total} changes; ${stats.additions} additions & ${stats.deletions} deletions`;
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
            <div className={s.fileStats}>
                <span className={s.statsText}>
                    {stats.additions > 0 && <span className={s.additions}>+{stats.additions}</span>}
                    {stats.deletions > 0 && <span className={s.deletions}>-{stats.deletions}</span>}
                </span>
                <Tooltip 
                    title={tooltipText} 
                    placement="bottomLeft" 
                    overlayInnerStyle={tooltipStyle}  
                    autoAdjustOverflow={true}
                    mouseLeaveDelay={0}
                >
                    <div className={s.statsBlocks}>
                        {this.generateBlocks(additionBlocks, 'add')}
                        {this.generateBlocks(deletionBlocks, 'del')}
                    </div>
                </Tooltip>
            </div>
        );
    }

    checkAllContentExpanded = (lineGroup = this.state.lineGroup) => {
        return lineGroup.every(line => 
            line.content.hidden.length === 0 && line.content.tail.length === 0
        );
    }

    toggleHiddenCode = () => {
        this.setState(prevState => {
            if (prevState.isHiddenVisible) {
                // 如果当前是显示状态，恢复到原始状态
                return {
                    lineGroup: JSON.parse(JSON.stringify(prevState.originalLineGroup)),
                    isHiddenVisible: false
                };
            } else {
                // 如果当前是隐藏状态，展开所有内容
                const newLineGroup = prevState.lineGroup.map(line => {
                    if (line.content.hidden.length > 0) {
                        return {
                            ...line,
                            content: {
                                ...line.content,
                                head: [...line.content.head, ...line.content.hidden, ...line.content.tail],
                                hidden: [],
                                tail: []
                            }
                        };
                    }
                    return line;
                });
    
                return {
                    lineGroup: newLineGroup,
                    isHiddenVisible: true
                };
            }
        });
    }

    //复制文件名
    copyFileName = () => {
        const { fileName } = this.props;
        navigator.clipboard.writeText(fileName).then(() => {
            message.success('File name copied');
        }).catch(() => {
            message.error('Copy failed');
        });
    }

    // 切换展开/折叠的方法
    toggleExpand = () => {
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded
        }));
    }

    //选中文本高亮
    handleTextSelection = (e) => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText) {
            this.setState({ selectedText });
        }
        else {
            this.setState({ selectedText: '' });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.commitId !== this.props.commitId) {
            this.setState({
                isExpanded: true
            });
        }
        if (prevProps.showType !== this.props.showType) {
            // 当 showType props 改变时，更新 state
            this.setState({ showType: this.props.showType });
        }
    }

    flashContent = (newArr) => {
        if (typeof (newArr || this.props.diffArr) === 'string') return;
        const initLineGroup = (newArr || this.props.diffArr).map((item, index, originArr) => {
            let added, removed, value, count;
            if (this.props.isFile) {
                added = item[0] === '+';
                removed = item[0] === '-';
                value = item.slice(1);
                count = 1;
            } else {
                added = item.added;
                removed = item.removed;
                value = item.value;
                count = item.count;
            }
            const strArr = value?.split('\n')|| [];
            if (strArr[strArr.length - 1] === '') {
                strArr.pop();
            }
            const type = (added && '+') || (removed && '-') || ' ';
            let head, hidden, tail;
            if (type !== ' ') {
                hidden = [];
                tail = [];
                head = strArr;
            } else {
                const strLength = strArr.length;
                if (strLength <= BLOCK_LENGTH * 2) {
                    hidden = [];
                    tail = [];
                    head = strArr;
                } else {
                    head = strArr.slice(0, BLOCK_LENGTH)
                    hidden = strArr.slice(BLOCK_LENGTH, strLength - BLOCK_LENGTH);
                    tail = strArr.slice(strLength - BLOCK_LENGTH);
                }
            }
            return {
                type,
                count,
                content: {
                    hidden,
                    head,
                    tail
                }
            }
        });
        let lStartNum = 1;
        let rStartNum = 1;
        initLineGroup.forEach(item => {
            const { type, count } = item;
            item.leftPos = lStartNum;
            item.rightPos = rStartNum;
            lStartNum += type === '+' ? 0 : count;
            rStartNum += type === '-' ? 0 : count;
        })

        const stats = initLineGroup.reduce((acc, item) => {
            if (item.type === '+') {
                acc.additions += item.content.head.length + item.content.hidden.length + item.content.tail.length;
            } else if (item.type === '-') {
                acc.deletions += item.content.head.length + item.content.hidden.length + item.content.tail.length;
            }
            return acc;
        }, { additions: 0, deletions: 0 });

        this.setState({
            lineGroup: initLineGroup,
            originalLineGroup: JSON.parse(JSON.stringify(initLineGroup)), // 深拷贝保存原始数据
            stats
        });
    }
    
    componentDidMount() {
        this.flashContent();
    }

    componentWillReceiveProps(nextProps) {
        this.flashContent(nextProps.diffArr);
    }

    openBlock = (type, index) => {
        const copyOfLG = this.state.lineGroup.slice();
        const targetGroup = copyOfLG[index];
        const { head, tail, hidden } = targetGroup.content;

        if (type === 'head') {
            targetGroup.content.head = head.concat(hidden.slice(0, BLOCK_LENGTH));
            targetGroup.content.hidden = hidden.slice(BLOCK_LENGTH);
        } else if (type === 'tail') {
            const hLength = hidden.length;
            targetGroup.content.tail = hidden.slice(hLength - BLOCK_LENGTH).concat(tail);
            targetGroup.content.hidden = hidden.slice(0, hLength - BLOCK_LENGTH);
        } else {
            targetGroup.content.head = head.concat(hidden, tail);
            targetGroup.content.hidden = [];
            targetGroup.content.tail = [];
        }
        copyOfLG[index] = targetGroup;

        const isAllExpanded = this.checkAllContentExpanded(copyOfLG);
        this.setState({
            lineGroup: copyOfLG,
            isHiddenVisible: isAllExpanded
        });
    }
    
    get isSplit() {
        return this.state.showType === SHOW_TYPE.SPLITED;
    }

    getHiddenBtn = (hidden, index) => {
        const isSingle = true;
        return <div key='collapse' className={s.cutWrapper}>
            <div className={cx(s.colLeft, this.isSplit ? s.splitWidth : '')}>
                {isSingle ? <div className={s.arrow} onClick={this.openBlock.bind(this, 'all', index)}>
                    <svg className={s.octicon} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fillRule="evenodd" d="M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                </div>
                    : <React.Fragment>
                        <div className={s.arrow} onClick={this.openBlock.bind(this, 'head', index)}>
                            <svg className={s.octicon} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fillRule="evenodd" d="M8.177 14.323l2.896-2.896a.25.25 0 00-.177-.427H8.75V7.764a.75.75 0 10-1.5 0V11H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0zM2.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zM8.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                        </div>
                        <div className={s.arrow} onClick={this.openBlock.bind(this, 'tail', index)}>
                            <svg className={s.octicon} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fillRule="evenodd" d="M7.823 1.677L4.927 4.573A.25.25 0 005.104 5H7.25v3.236a.75.75 0 101.5 0V5h2.146a.25.25 0 00.177-.427L8.177 1.677a.25.25 0 00-.354 0zM13.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zm-3.75.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM7.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM4 11.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM1.75 11a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z"></path></svg>
                        </div>
                    </React.Fragment>
                }
            </div>
            <div className={cx(s.collRight, this.isSplit ? s.collRightSplit : '')}><div className={cx(s.colRContent, isSingle ? '' : s.cRHeight)}></div></div>
        </div>
    }

    getLineNum = (number) => {
        return ('     ' + number).slice(-5);
    }

    // 获取split下的页码
    getLNPadding = (origin) => {
        const item = ('     ' + origin).slice(-5);
        return <div className={cx(s.splitLN)} style={{ userSelect: 'none' }}>{item}</div>
    }

    // 获取split下的内容
    getPaddingContent = (item) => {
        const { selectedText } = this.state;
        let prefix = null;
        let taborspace = null;



        // if (!prefix) {
        //     item = item.replace(/^ {4}/gm, ''); // 移除每行开头的四个空格
        // }

        //const parts = selectedText ? item.split(new RegExp(`(${this.escapeRegExp(selectedText)})`, 'gi')) : [item];

        // <span className={cx(s.splitCon)} onMouseUp={this.handleTextSelection}>
        //     {prefix && <span key="prefix">{prefix}</span>}
        //     {parts.map((part, index) => 
        //         part.toLowerCase() === selectedText.toLowerCase() ? 
        //         <span key={index} className={s.textHighlight}>
        //             <SyntaxHighlighter language="java" style={prism} className={s.customsyntax}>{part}</SyntaxHighlighter>
        //         </span> : 
        //         <span key={index}>
        //             <SyntaxHighlighter language="java" style={prism} className={s.customsyntax}>{part}</SyntaxHighlighter>
        //         </span>
        //     )}
        // </span>
    
        return (
            <span className={cx(s.splitCon)} onMouseUp={this.handleTextSelection}>
                {prefix && <span key="prefix">{prefix}</span>}
                <SyntaxHighlighter language="java" style={githubGist} className={s.customsyntax}>{item}</SyntaxHighlighter>
            </span>
        );
    }
    
    escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    paintCode = (item, isHead = true) => {
        const { type, content: { head, tail, hidden }, leftPos, rightPos} = item;
        const isNormal = type === ' ';
        const cls = cx(s.normal, type === '+' ? s.add : '', type === '-' ? s.removed : '');
        const space = "     ";
        return (isHead ? head : tail).map((sitem, sindex) => {
            let posMark = '';
            if (isNormal) {
                const shift = isHead ? 0: (head.length + hidden.length);
                posMark = (space + (leftPos + shift + sindex)).slice(-5)
                    + (space + (rightPos + shift + sindex)).slice(-5);
            } else {
                posMark = type === '-' ? this.getLineNum(leftPos + sindex) + space
                    : space + this.getLineNum(rightPos + sindex);
            }
            return <div key={(isHead ? 'h-' : 't-') + sindex} className={cls}>
                <pre className={cx(s.pre, s.line)}>{posMark}</pre>
                <div className={s.outerPre}><div className={s.splitCon}><div className={s.spanWidth}>{' ' + type + ' '}</div>{this.getPaddingContent(sitem, true)}</div></div>
            </div>
        })
    }

    getUnifiedRenderContent = () => {
        return this.state.lineGroup.map((item, index) => {
            const { type, content: { hidden }} = item;
            const isNormal = type === ' ';
            return <div key={index}>
                {this.paintCode(item)}
                {hidden.length && isNormal && this.getHiddenBtn(hidden, index) || null}
                {this.paintCode(item, false)}
            </div>
        })
    }

    getSplitCode = (targetBlock, isHead = true) => {
        const { type, content: { head, hidden, tail }, leftPos, rightPos} = targetBlock;
        return (isHead ? head : tail).map((item, index) => {
            const shift = isHead ? 0: (head.length + hidden.length);
            return <div key={(isHead ? 'h-' : 't-') + index}>

                <div className={cx(s.iBlock, s.lBorder)}>
                    {this.getLNPadding(leftPos + shift + index)}
                    {this.getPaddingContent('    ' + item)}
                </div>

                <div className={s.iBlock}>
                    {this.getLNPadding(rightPos + shift +index)}
                    {this.getPaddingContent('    ' + item)}
                </div>

            </div>
        })
    }

    getCombinePart = (leftPart = {}, rightPart = {}) => {
        const { type: lType, content: lContent, leftPos: lLeftPos, rightPos: lRightPos } = leftPart;
        const { type: rType, content: rContent, leftPos: rLeftPos, rightPos: rRightPos } = rightPart;
        const lArr = lContent?.head || [];
        const rArr = rContent?.head || [];
        const lClass = lType === '+' ? s.add : s.removed;
        const rClass = rType === '+' ? s.add : s.removed;
        return <React.Fragment>

                <div className={cx(s.iBlock, s.lBorder)}>{lArr.map((item, index) => {
                    return <div className={cx(s.prBlock, lClass)} key={index}>
                        {this.getLNPadding(lLeftPos + index)}
                        {this.getPaddingContent('-  ' + item)}
                    </div>
                })}</div>

                <div className={cx(s.iBlock, lArr.length ? '' : s.rBorder)}>{rArr.map((item, index) => {
                    return <div className={cx(s.prBlock, rClass)} key={index}>
                        {this.getLNPadding(rRightPos + index)}
                        {this.getPaddingContent('+  ' + item)}
                    </div>
                })}</div>

            </React.Fragment>
    }

    getSplitContent = () => {
        const length = this.state.lineGroup.length;
        const contentList = [];
        for (let i = 0; i < length; i++) {
            const targetBlock = this.state.lineGroup[i];
            const { type, content: { hidden } } = targetBlock;
            if (type === ' ') {
                contentList.push(<div key={i}>
                    {this.getSplitCode(targetBlock)}
                    {hidden.length && this.getHiddenBtn(hidden, i) || null}
                    {this.getSplitCode(targetBlock, false)}
                </div>)
            } else if (type === '-') {
                const nextTarget = this.state.lineGroup[i + 1] || { content: {}};
                const nextIsPlus = nextTarget.type === '+';
                contentList.push(<div key={i}>
                    {this.getCombinePart(targetBlock, nextIsPlus ? nextTarget : {})}
                </div>)
                nextIsPlus ? i = i + 1 : void 0;
            } else if (type === '+') {
                contentList.push(<div key={i}>
                    {this.getCombinePart({}, targetBlock)}
                </div>)
            }
        }
        return <div>
            {contentList}
        </div>
    }

    getHighlightSpiltContent = () => {
        const length = this.state.lineGroup.length;
        const contentList = [];
        for (let i = 0; i < length; i++) {
            const targetBlock = this.state.lineGroup[i];
            const { type, content: { hidden } } = targetBlock;
            if (type === ' ') {
                contentList.push(<div key={i}>
                    {this.getHighlghtSplitCode(targetBlock)}
                    {hidden.length && this.getHiddenBtn(hidden, i) || null}
                    {this.getHighlghtSplitCode(targetBlock, false)}
                </div>)
            } else if (type === '-') {
                const nextTarget = this.state.lineGroup[i + 1] || { content: {}};
                const nextIsPlus = nextTarget.type === '+'; //如果下一个是+，则合并显示
                contentList.push(<div key={i}>
                    {this.getHighlightCombinePart(targetBlock, nextIsPlus ? nextTarget : {})}
                </div>)
                nextIsPlus ? i = i + 1 : void 0;
            } else if (type === '+') {  //+的只在右边显示
                contentList.push(<div key={i}>
                    {this.getHighlightCombinePart({}, targetBlock)}
                </div>)
            }
        }
        return <div>
            {contentList}
        </div>
    }

    getHighlightCombinePart = (leftPart = {}, rightPart = {}) => {
        const { type: lType, content: lContent, leftPos: lLeftPos, rightPos: lRightPos } = leftPart;
        const { type: rType, content: rContent, leftPos: rLeftPos, rightPos: rRightPos } = rightPart;
        const lArr = lContent?.head || [];
        const rArr = rContent?.head || [];
        return <React.Fragment>

                <div className={cx(s.iBlock, s.lBorder)}>{lArr.map((item, index) => {
                    return <div className={cx(s.prBlock, this.shouldHighlightLine(lLeftPos + index, 'left') ? s.removed : '')} key={index}>
                        {this.getLNPadding(lLeftPos + index)}
                        {this.getPaddingContent('-  ' + item)}
                    </div>
                })}</div>

                <div className={cx(s.iBlock, lArr.length ? '' : s.rBorder)}>{rArr.map((item, index) => {
                    return <div className={cx(s.prBlock, this.shouldHighlightLine(rRightPos + index, 'right') ? s.add : '')} key={index}>
                        {this.getLNPadding(rRightPos + index)}
                        {this.getPaddingContent('+  ' + item)}
                    </div>
                })}</div>

            </React.Fragment>
    }

    getHighlghtSplitCode = (targetBlock, isHead = true) => {
        const { highlightedLines } = this.props; // 从 props 中获取高亮行数组
        const { type, content: { head, hidden, tail }, leftPos, rightPos} = targetBlock;

        return (isHead ? head : tail).map((item, index) => {
            const shift = isHead ? 0: (head.length + hidden.length);

            // 判断是否需要高亮左侧和右侧的行号
            const isHighlightedLeft = highlightedLines.some(line =>
                line.side === 'left' && (leftPos + shift + index) >= line.startLine && (leftPos + shift + index) <= line.endLine
            );
            const isHighlightedRight = highlightedLines.some(line =>
                line.side === 'right' && (rightPos + shift + index) >= line.startLine && (rightPos + shift + index) <= line.endLine
            );

            // 根据是否高亮设置样式
            const leftHighlightClass = isHighlightedLeft ? s.removed : '';
            const rightHighlightClass = isHighlightedRight ? s.add : '';

            return <div key={(isHead ? 'h-' : 't-') + index}>
                
                <div className={cx(s.iBlock, s.lBorder, leftHighlightClass)}>
                    {this.getLNPadding(leftPos + shift + index)}
                    {this.getPaddingContent('    ' + item)}
                </div>

                <div className={cx(s.iBlock, rightHighlightClass)}>
                    {this.getLNPadding(rightPos + shift +index)}
                    {this.getPaddingContent('    ' + item)}
                </div>

            </div>
        })
    }

    handleShowTypeChange = (e) => {
        this.setState({
            showType: e.target.value
        })
    }

    shouldHighlightLine = (lineNumber, side) => {
        const { highlightedLines } = this.props;
        
        return highlightedLines.some(({ startLine, endLine, side: lineSide }) => {
            return lineSide === side && lineNumber >= startLine && lineNumber <= endLine;
        });
    }
    

    render() {
        const { showType, isExpanded, isHiddenVisible} = this.state;
        const { fileName } = this.props;
        return (
            <React.Fragment>
                <div className={cx(s.filename, {[s.expanded]: isExpanded})}>
                    <div className={s.fileHeader}>
                        <Button 
                            type="text"
                            icon={isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
                            onClick={this.toggleExpand}
                            className={s.expandButton}
                        />
                        {fileName}
                        <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={this.copyFileName}
                            className={s.copyButton}
                        />
                        <Button
                            type="text"
                            icon={isHiddenVisible ? <VerticalAlignMiddleOutlined /> : <ColumnHeightOutlined />}
                            onClick={this.toggleHiddenCode}
                            className={s.showHiddenButton}
                        />
                        {showType !== SHOW_TYPE.HIGHLIGHT && this.renderFileStats()}
                        {showType !== SHOW_TYPE.HIGHLIGHT && (
                            <Button
                                type="text"
                                icon={<SwapOutlined />}
                                onClick={() => this.setState({ showType: showType === SHOW_TYPE.NORMAL ? SHOW_TYPE.UNIFIED : SHOW_TYPE.NORMAL })}
                                className={s.ShowTypeButton}
                            >
                            </Button>
                        )}
                    </div>
                </div>
                {isExpanded && (
                    <Content className={s.content}>
                        <div className={s.color}>
                            {showType === SHOW_TYPE.NORMAL
                                ? this.getSplitContent()
                                : showType === SHOW_TYPE.HIGHLIGHT 
                                ? this.getHighlightSpiltContent()
                                :this.getUnifiedRenderContent()
                            }
                        </div>
                    </Content>
                )}
            </React.Fragment>
        )
    }
}

export default memo(ContentDiff, (prevProps, nextProps) => {
    return (
        prevProps.diffArr === nextProps.diffArr &&
        prevProps.fileName === nextProps.fileName &&
        prevProps.commitId === nextProps.commitId &&
        prevProps.showType === nextProps.showType &&
        JSON.stringify(prevProps.highlightedLines) === JSON.stringify(nextProps.highlightedLines)
    );
});