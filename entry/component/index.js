import React from 'react';
import {Layout} from 'antd';
import MainPage from '../MainPage';
import s from './index.css';

class ShowComponent extends React.Component {

    render() {
        return <Layout>
            <div className={s.layout}><MainPage/></div>
        </Layout>
    }
}

export default ShowComponent;