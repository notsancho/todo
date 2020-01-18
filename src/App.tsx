import React, { useState, useEffect} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Row, Col, Drawer } from 'antd';
import Aside from './components/Aside/Aside.module';
import TodoList from './components/TodoList/TodoList.module';
import {
  BrowserView,
  MobileView
} from "react-device-detect";

const App: (React.FC) = props => {
  const [asideVisible, setAsideVisible] = useState(false);

  const onCloseAside = () => {
    setAsideVisible(!asideVisible);
  };

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
            onClose={onCloseAside}
            visible={asideVisible}
          >
            <Aside />
          </Drawer>
        </MobileView>

      </Row>
    </div>
  );
};

export default App;