import React, { useState, useEffect } from 'react';
import localforage from "localforage";
import ReactDOM from 'react-dom';
import './App.css';
import 'antd/dist/antd.css';
import { Row, Col, Drawer } from 'antd';
import Aside from './components/Aside/Aside.module';
import TodoList from './components/TodoList/TodoList.module';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const App: React.FC = props => {
  const [heightMenu, setHeightMenu] = useState(window.innerHeight - 30);

  return (
    <div className="wrap-todo">
      <Row>

        <BrowserView>
          <Col span={18} push={6}>
            <TodoList />
          </Col>
          <Col span={6} pull={18} className="wrap-aside">
            <Aside />
          </Col>
        </BrowserView>
        
        <MobileView>
          <TodoList />
          <Drawer
            title="Basic Drawer"
            placement="left"
            visible={true}
          >
            <Aside />
          </Drawer>
        </MobileView>

      </Row>
    </div>
  );
};

export default App;