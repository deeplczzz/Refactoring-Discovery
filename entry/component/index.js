import React from 'react';
import {Layout} from 'antd';
import MainPage from '../MainPage';

class ShowComponent extends React.Component {

    render() {
        return <Layout>
            <div><MainPage/></div>
        </Layout>
    }
}

export default ShowComponent;