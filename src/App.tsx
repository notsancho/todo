import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Row, Col, Drawer, Button } from 'antd';
import Aside from './components/Aside/Aside.module';
import TasksList from './components/TasksList/TasksList.module';
import ModalCategory from './components/ModalCategory/ModalCategory.module';
import localforage from "localforage";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {
  BrowserView,
  MobileView
} from "react-device-detect";


const App: (React.FC) = props => {
  const [asideVisible, setAsideVisible] = useState(false);

  const [showModalCategory, setShowModalCategory] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any>([]);

  const [categoryModalTitle, setCategoryModalTitle] = useState<string>('');
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    localforage.getItem('categoriesList').then((list: any) => {
      const categoriesList = list || [];
      setCategoriesList(categoriesList);
    });

  }, []);

  const showCategoryForm = (id: number | null) => {
    if (id === null) {
      setCategoryModalTitle("");
    } else {
      setCategoryModalTitle(categoryTitle);
    }
    setCategoryId(id);
    setShowModalCategory(!showModalCategory);
  }


  return (
    <div className="wrap-todo">
      <Router>
        <Row>
          <BrowserView>
            <Col span={18} push={6}>
              <Switch>
                <Route exact path="/category/:categoryIdParam">
                  {() => {
                    if (categoriesList.length) {
                      return <TasksList
                        categoryTitle={categoryTitle}
                        setCategoryTitle={setCategoryTitle}
                        categoriesList={categoriesList}
                        setCategoriesList={setCategoriesList}
                        showCategoryForm={showCategoryForm}
                      />
                    }
                  }}
                </Route>
              </Switch>
            </Col>
            <Col span={6} pull={18} className="wrap-aside">
              <Aside
                categoriesList={categoriesList}
                setCategoriesList={setCategoriesList}
                showCategoryForm={showCategoryForm}
              />
            </Col>
          </BrowserView>
          <MobileView>

            <Button type="primary" onClick={() => setAsideVisible(!asideVisible)}>
              Show categories
            </Button>

            <Switch>
              <Route exact path="/category/:categoryIdParam">
                {() => {
                  if (categoriesList.length) {
                    return <TasksList
                      categoryTitle={categoryTitle}
                      setCategoryTitle={setCategoryTitle}
                      categoriesList={categoriesList}
                      setCategoriesList={setCategoriesList}
                      showCategoryForm={showCategoryForm}
                    />
                  }
                }}
              </Route>
            </Switch>

            <Drawer
              placement="left"
              onClose={() => setAsideVisible(!asideVisible)}
              visible={asideVisible}
            >
              <Aside
                categoriesList={categoriesList}
                setCategoriesList={setCategoriesList}
                showCategoryForm={showCategoryForm}
              />
            </Drawer>
          </MobileView>
        </Row>
      </Router>

      {showModalCategory && (
        <ModalCategory
          categoryModalTitle={categoryModalTitle}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          showModalCategory={showModalCategory}
          setShowModalCategory={setShowModalCategory}
          categoriesList={categoriesList}
          setCategoriesList={setCategoriesList}
          categoryTitle={categoryTitle}
          setCategoryTitle={setCategoryTitle}
        />
      )}

    </div>
  );
};

export default App;