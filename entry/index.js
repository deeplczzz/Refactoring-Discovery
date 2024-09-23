import React from 'react';
import ReactDom from 'react-dom';
//引入菜单选项组件
import ShowComponent from './component/index.js';

//  挂载组件
const mountNode = document.getElementById('main');

//  原始前端渲染 在html的节点上挂载组件
ReactDom.render((
    <ShowComponent />
),mountNode);