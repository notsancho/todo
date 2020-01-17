import React, { useState, useEffect } from 'react';
import localforage from "localforage";
import ReactDOM from 'react-dom';
import './App.css';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';
import Aside from './components/Aside/Aside.module';
import TodoList from './components/TodoList/TodoList.module';

const App: React.FC = props => {
  
  return (
    <div className="wrap-todo">
      <Row>
        <Col span={18} push={6}>
          <TodoList />
        </Col>
        <Col span={6} pull={18} className="wrap-aside">
          <Aside />
        </Col>
      </Row>
    </div>
  );
};

export default App;