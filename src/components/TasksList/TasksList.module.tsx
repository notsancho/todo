import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Modal, Button, Row, Col } from 'antd';
import localforage from "localforage";
import useForm from 'rc-form-hooks';
import { withRouter } from "react-router";
import {
    useParams
} from "react-router-dom";
import ModalTask from '../ModalTask/ModalTask.module';

interface TasksListProps {
    categoryTitle: string,
    setCategoryTitle: any,
    categoriesList: any,
    setCategoriesList: any,
    showCategoryForm: any,
}

const TasksList = (props:any) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const [tasksList, setTasksList] = useState<any>([]);

    const [taskId, setTaskId] = useState<number | null>();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priorityLevel, setPriorityLevel] = useState<any>(50);

    const { categoryId } = useParams();

    localforage.getItem('tasksList').then((list: any) => {
        setTasksList(list);
    });

    useEffect(() => {
        props.categoriesList.some((array: any, key: number) => {
            if (array.id == categoryId) {
                props.setCategoryTitle(array.title);
            }
        });
    }, [categoryId, props]);
    

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

        let list = tasksList || [];

        if (taskId !== null) {
            list.some((array: any, key: number) => {
                if (array.id == taskId) {
                    list[key] = {
                        id: taskId || Date.now() + Math.random(),
                        categoryId: categoryId,
                        title: title,
                        description: description,
                        priorityLevel: priorityLevel,
                        createdAt: array.createdAt,
                        updatedAt: Date.now()
                    };
                }
            });
        } else {
            const newTask = {
                id: taskId || Date.now() + Math.random(),
                categoryId: categoryId,
                title: title,
                description: description,
                priorityLevel: priorityLevel,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            list.push(newTask);
        }

        list = list.filter(function (el: any) {
            return el != null;
        });

        let byPriorityLevel = list.slice(0);
        byPriorityLevel.sort(function (a: any, b: any) {
            return b.priorityLevel - a.priorityLevel;
        });

        setTasksList(byPriorityLevel);
        localforage.setItem("tasksList", byPriorityLevel);

        setShowModal(!showModal);
    }

    const editTask = (id: number) => {
        tasksList.some((array: any, key: number) => {
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
        tasksList.some((array: any, key: number) => {
            if (array.id == id) {
                delete tasksList[key];
            }
        });

        const tasksListFilter = tasksList.filter(function (el: any) {
            return el != null;
        });

        setTasksList(tasksListFilter);
        localforage.setItem("tasksList", tasksListFilter);
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

    const removeCategory = (): void => {
        props.categoriesList.some((array: any, key: number) => {
            if (array.id == categoryId) {
                delete props.categoriesList[key];
            }
        });
        const categoriesListFilter = props.categoriesList.filter(function (el: any) {
            return el != null;
        });
        props.setCategoriesList(categoriesListFilter);
        localforage.setItem("categoriesList", categoriesListFilter);


        tasksList.some((array: any, key: number) => {
            if (array.categoryId == categoryId) {
                delete tasksList[key];
            }
        });
        const tasksListFilter = tasksList.filter(function (el: any) {
            return el != null;
        });
        setTasksList(tasksListFilter);
        localforage.setItem("tasksList", tasksListFilter);
    }

    const confirmRemoveCategory = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'The category will be deleted. Are you shure?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                removeCategory();
            },
            onCancel() {
            },
        });
    }

    return (
        <div>
            <PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    title={props.categoryTitle}
                    extra={[
                        <Button type="primary" key="0" icon="edit" onClick={() => { props.showCategoryForm(categoryId) }} />,
                        <Button type="danger" key="1" icon="close" onClick={() => { confirmRemoveCategory() }} />
                    ]}
                />


            <Row gutter={[16, 16]}>
                {(tasksList !== null) && tasksList.map((array: any, key: number) => {
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

export default withRouter(TasksList);