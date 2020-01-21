import React, { useState, useEffect, forwardRef, Ref } from 'react';
import { PageHeader, List, Card, Form, Modal, Menu, Button, Input, Slider, Row, Col } from 'antd';
import localforage from "localforage";
import useForm from 'rc-form-hooks';
import TextArea from 'antd/lib/input/TextArea';
import { withRouter } from "react-router";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";
import ModalTask from '../ModalTask/ModalTask.module';
const FormItem = Form.Item;

//localforage.setItem("todoList", []);

localforage.getItem('todoList').then((todoList: any) => {
    //console.log('by date:');
    console.log(todoList);
});

const TodoList: (React.FC) = (props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [todoList, setTodoList] = useState<any>([]);
    const [categoryTitle, setCategoryTitle] = useState<string>();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priorityLevel, setPriorityLevel] = useState<any>(50);
    const [taskId, setTaskId] = useState<number | null>();
    const [todosCategories, setTodosCategories] = useState<any>([]);
    const { categoryId } = useParams();

    useEffect(() => {
        localforage.getItem('todoList').then((todoC: any) => {
            setTodoList(todoC);
        });
    }, []);

    useEffect(() => {
        localforage.getItem('todosCategories').then((todoC: any) => {
            todoC.some((array: any, key: number) => {
                if (array.id == categoryId) {
                    setCategoryTitle(array.title);
                    console.log(array.title);
                }
            });
        });
    });

    const { getFieldDecorator, validateFields, errors, values } = useForm<{
        title: string;
        description: string;
    }>();

    const showModalAddTask = () => {
        setTaskId(null);
        setTitle("");
        setDescription("");
        setPriorityLevel(50);
        setShowModal(!showModal);
    }

    const handleCancelModal = () => {
        setShowModal(!showModal);
    }

    const addTask = (title: string, description: string) => {

        let ar = todoList || [];

        if (taskId !== null) {
            ar.some((array: any, key: number) => {
                if (array.id == taskId) {
                    ar[key] = {
                        id: taskId || Date.now() + Math.random(),
                        categoryId: categoryId,
                        title: title,
                        description: description,
                        priorityLevel: priorityLevel,
                        createdAt: array.createdAt,
                        updatedAt: Date.now()
                    };
                    //delete ar[key];
                }
            });
        } else {
            const nn = {
                id: taskId || Date.now() + Math.random(),
                categoryId: categoryId,
                title: title,
                description: description,
                priorityLevel: priorityLevel,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            ar.push(nn);
        }

        ar = ar.filter(function (el: any) {
            return el != null;
        });

        let byPriorityLevel = ar.slice(0);
        byPriorityLevel.sort(function (a: any, b: any) {
            return b.priorityLevel - a.priorityLevel;
        });

        setTodoList(byPriorityLevel);
        localforage.setItem("todoList", byPriorityLevel);

        setShowModal(!showModal);
    }

    const editTask = (id: number) => {
        todoList.some((array: any, key: number) => {
            if (array.id == id) {
                setTaskId(id);
                setTitle(array.title);
                setDescription(array.description);
                setPriorityLevel(array.priorityLevel);
                return array;
            }
        });

        setShowModal(!showModal);
    }

    const removeTask = (id: number): void => {
        todoList.some((array: any, key: number) => {
            if (array.id == id) {
                delete todoList[key];
            }
        });

        const todoListFilter = todoList.filter(function (el: any) {
            return el != null;
        });

        setTodoList(todoListFilter);
        localforage.setItem("todoList", todoListFilter);
        //setShowModal(!showModal);
    }

    const confirmRemoveTask = (id: number) => {
        Modal.confirm({
            title: 'Confirm',
            content: 'The task will be deleted. Are you shure?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                removeTask(id);
            },
            onCancel() {
            },
        });
    }

    const onChangeSlider = (value: any) => {

    }

    return (
        <div>
            <PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    title={categoryTitle}
                    extra={[
                        <Button type="primary" key="0" icon="edit" />,
                        <Button type="danger" key="1" icon="close" />,
                    ]}
                />


            <Row gutter={[16, 16]}>
                {(todoList !== null) && todoList.map((array: any, key: number) => {
                    if (array.categoryId == categoryId) {
                        return (<Col span={6} key={key}>
                            <Card
                                title={
                                    array.title
                                }
                                extra={[
                                    <Button type="primary" key="0" icon="edit" onClick={() => { editTask(array.id) }} />,
                                    <Button type="danger" key="1" icon="close" onClick={() => { confirmRemoveTask(array.id) }} />
                                ]}
                            >
                                priorityLevel: {array.priorityLevel}<br />
                                description: {array.description}<br />
                                createdAt: {array.createdAt}<br />
                                updatedAt: {array.updatedAt}<br />
                            </Card>
                        </Col>);
                    }
                    return false;
                })}
            </Row>

            <Button type="primary" shape="circle" size="large" onClick={showModalAddTask} style={{ float: 'right' }}>Add</Button>

            {showModal && (
                <ModalTask
                    title={title}
                    description={description}
                    priorityLevel={priorityLevel}
                    showModal={showModal}
                    handleCancelModal={handleCancelModal}
                    addTask={addTask}
                    setPriorityLevel={setPriorityLevel}
                    setTitle={setTitle}
                    setDescription={setDescription}
                />
            )}

        </div>
    );
}

export default withRouter(TodoList);