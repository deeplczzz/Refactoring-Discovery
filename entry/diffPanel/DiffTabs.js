import React, { useState } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const DiffTabs = () => {
  const [activeKey, setActiveKey] = useState('1'); // 控制活动标签页的状态

  // 处理标签页切换事件
  const onTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div>
      <Tabs activeKey={activeKey} onChange={onTabChange}>
        <TabPane tab="Tab 1" key="1">
          <div>
            <h3>Content of Tab 1</h3>
            <p>This is the content for the first tab.</p>
          </div>
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <div>
            <h3>Content of Tab 2</h3>
            <p>This is the content for the second tab.</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DiffTabs;
