import React from 'react';
import { Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import s from './commitinfo.css'; 

const CommitInfo = ({ commitMessage, commitAuthor, commitid, copyToClipboard}) => {
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
                            onClick={() => copyToClipboard(commitid)} 
                            className={s.commitbutton}
                            icon={<CopyOutlined />}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default CommitInfo;