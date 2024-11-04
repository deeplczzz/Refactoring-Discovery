import React from 'react';
import {Layout, Menu} from 'antd';
import DiffPanel from '../diffPanel';

const TAB = {
    MainPage: '0',
    More: '1',
}

class ShowComponent extends React.Component {
    state = {
        currentTab: TAB.MainPage
    }

    getContent = () => {
        const contentMap = {
            //不同选项卡显示的组件
            [TAB.MainPage]: () => <div><DiffPanel type='lines'/></div>, //加载DiffPanel组件
            [TAB.More]: () => <div>你好，等我更新</div>,
        };
        return contentMap[this.state.currentTab]();
    }

    //navChange 方法在用户点击菜单项时更新currentTab状态。e.key是被点击菜单项的key
    navChange = (e) => {
        this.setState({
            //按选项卡之后更新currentTab
            currentTab: e.key
        })
    }

    //渲染方法
    render() {
        return <Layout>
            {this.getContent()}
        </Layout>
    }
}

export default ShowComponent;