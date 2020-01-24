import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, Card, Modal, Button, Row, Col, Icon } from 'antd';
import localforage from "localforage";
import { withRouter } from "react-router";
import { useParams } from "react-router-dom";
import ModalTask from '../ModalTask/ModalTask.module';

interface TasksListProps {
    categoryTitle: any,
    setCategoryTitle: any,
    categoriesList: any,
    setCategoriesList: any,
    showCategoryForm: any,
}

const TasksList = (props: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const [tasksList, setTasksList] = useState<any>([]);
    const [currentTasksList, setCurrentTasksList] = useState<any>([]);
    const [tasksListPart, setTasksListPart] = useState<any>([]);
    const [startLoadTasks, setStartLoadTasks] = useState<number>(16);
    const [limitLoadTasks, setLimitLoadTasks] = useState<number>(4);

    const [taskId, setTaskId] = useState<number | null>();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priorityLevel, setPriorityLevel] = useState<any>(50);

    const [heightWrapList, setHeightWrapList] = useState<number>(0);
    const [heightWindow, setHeightWindow] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number|null>(null);

    const ref = useRef<any>(null);

    const { categoryIdParam } = useParams();

    useEffect(() => {
        if (categoryIdParam) {
            setCategoryId(parseFloat(categoryIdParam));
        }
        setHeightWrapList(ref.current.clientHeight);
        setHeightWindow(document.body.clientHeight);
    })

    useEffect(() => {
        localforage.getItem('tasksList').then((list: any) => {
            setTasksList(list);
        });
    }, [])

    useEffect(() => {
        let currentTasksList = tasksList.map((array: any, key: number) => {
            if (Number(array.categoryId) === categoryId) {
                return array;
            }
        })

        currentTasksList = currentTasksList.filter(function (el: any) {
            return el != null;
        });

        let byPriorityLevel = currentTasksList.slice(0);

        byPriorityLevel.sort(function (a: any, b: any) {
            return b.priorityLevel - a.priorityLevel;
        });

        setCurrentTasksList(byPriorityLevel);
        setStartLoadTasks(16);
        setTasksListPart(currentTasksList.slice(0, 16));
        

    }, [props.categoryTitle, tasksList]);

    const onWheelList = (event: object) => {
        if ((window.scrollY + heightWindow) > heightWrapList - 200) {
            const tasksListPart = currentTasksList.slice(0, startLoadTasks + limitLoadTasks);
            setTasksListPart(tasksListPart);
            setStartLoadTasks(startLoadTasks + limitLoadTasks);
        }
    }

    useEffect(() => {
        props.categoriesList.some((array: any, key: number) => {
            if (array.id === categoryId) {
                props.setCategoryTitle(array.title);
            }
        });
    }, [categoryId, props]);

    const showModalSaveTask = (): void => {
        setTaskId(null);
        setTitle("");
        setDescription("");
        setPriorityLevel(50);
        setShowModal(!showModal);
    }

    const handleCancelModal = (): void => {
        setShowModal(!showModal);
    }

    const createTask = (list: any, title: string, description: string = ''): object => {
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

        return list;
    }

    const updateTask = (list: any, title: string, description: string): object => {
        list.some((array: any, key: number) => {
            if (array.id === taskId) {
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

        return list;
    }

    const saveTask = (title: string, description: string) => {

        let list = tasksList || [];

        if (taskId !== null) {
            list = updateTask(list, title, description);
        } else {
            list = createTask(list, title, description);
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

    const editTask = (id: number): void => {
        tasksList.some((array: any, key: number) => {
            if (array.id === id) {
                setTaskId(id);
                setTitle(array.title);
                setDescription(array.description);
                setPriorityLevel(array.priorityLevel);
                return array;
            }
        });

        setShowModal(!showModal);
    }

    const deleteTask = (id: number): void => {
        tasksList.some((array: any, key: number) => {
            if (array.id === id) {
                delete tasksList[key];
            }
        });

        const tasksListFilter = tasksList.filter(function (el: any) {
            return el != null;
        });

        setTasksList(tasksListFilter);
        localforage.setItem("tasksList", tasksListFilter);
    }

    const confirmDeleteTask = (id: number): void => {
        Modal.confirm({
            title: 'Confirm',
            content: 'The task will be deleted. Are you shure?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                deleteTask(id);
            },
            onCancel() {
            },
        });
    }

    const deleteCategory = (): void => {
        props.categoriesList.some((array: any, key: number) => {
            if (array.id === categoryId) {
                delete props.categoriesList[key];
            }
        });
        const categoriesListFilter = props.categoriesList.filter(function (el: any) {
            return el != null;
        });
        props.setCategoriesList(categoriesListFilter);
        localforage.setItem("categoriesList", categoriesListFilter);


        tasksList.some((array: any, key: number) => {
            if (array.categoryId === categoryId) {
                delete tasksList[key];
            }
        });
        const tasksListFilter = tasksList.filter(function (el: any) {
            return el != null;
        });
        setTasksList(tasksListFilter);
        localforage.setItem("tasksList", tasksListFilter);
    }

    const confirmDeleteCategory = (): void => {
        Modal.confirm({
            title: 'Confirm',
            content: 'The category will be deleted. Are you shure?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                deleteCategory();
            },
            onCancel() {
            },
        });
    }

    return (
        <div className="wrap-right" ref={ref} onWheel={event => onWheelList(event)}>
            <PageHeader
                style={{
                    border: '1px solid rgb(235, 237, 240)',
                }}
                title={props.categoryTitle}
                extra={[
                    <Button type="primary" key="0" icon="edit" onClick={() => { props.showCategoryForm(categoryId) }} />,
                    <Button type="danger" key="1" icon="close" onClick={() => { confirmDeleteCategory() }} />
                ]}
            />

            <Button type="primary" shape="circle" size="large" onClick={showModalSaveTask} className="add-task-button">
                <Icon type="plus" />
            </Button>

            <Row gutter={[16, 16]}>
                {(tasksListPart !== null) && tasksListPart.map((array: any, key: number) => {
                    return (<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 24 }} key={key}>
                        <Card
                            title={
                                array.title
                            }
                            extra={[
                                <Button type="primary" key="0" icon="edit" onClick={() => { editTask(array.id) }} size="small" />,
                                <Button className="delete-task" type="danger" key="1" onClick={() => { confirmDeleteTask(array.id) }} size="small">
                                    <Icon type="check-circle" />
                                </Button>
                            ]}
                            className="item-task"
                        >
                            {array.description && (
                                <div className="task-description">{array.description}</div>
                            )}
                            {/* priorityLevel: {array.priorityLevel}<br />
                            description: {array.description}<br />
                            createdAt: {array.createdAt}<br />
                            updatedAt: {array.updatedAt}<br /> */}
                        </Card>
                    </Col>);
                })}
            </Row>

            {showModal && (
                <ModalTask
                    title={title}
                    description={description}
                    priorityLevel={priorityLevel}
                    showModal={showModal}
                    handleCancelModal={handleCancelModal}
                    saveTask={saveTask}
                    setPriorityLevel={setPriorityLevel}
                    setTitle={setTitle}
                    setDescription={setDescription}
                />
            )}

        </div>
    );
}

export default withRouter(TasksList);