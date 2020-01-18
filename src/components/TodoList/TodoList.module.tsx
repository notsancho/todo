import React, { useState, useEffect, forwardRef, Ref } from 'react';
import { PageHeader, List, Card, Form, Modal, Menu, Button, Input, Slider } from 'antd';
import localforage from "localforage";
import useForm from 'rc-form-hooks';
import { isObject } from 'util';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;


const marks = {
    0: '0',
    25: '25',
    50: '50',
    75: '75',
    100: '100'
};

const data = [
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
];

const TodoList: (React.FC) = props => {
    const [showModal, setShowModal] = useState(false);

    const { getFieldDecorator, validateFields, errors, values } = useForm<{
        title: string;
        description: string;
    }>();

    const showModalAddTask = () => {
        setShowModal(!showModal);
    }

    const handleCancelModal = () => {
        setShowModal(!showModal);
    }

    const handleSubmitForm = () => {

    }

    return (
        <div>
            <PageHeader
                style={{
                    border: '1px solid rgb(235, 237, 240)',
                }}
                title="Title"
                extra={[
                    <Button type="primary" key="0" icon="edit" />,
                    <Button type="danger" key="1" icon="close" />,
                  ]}
            />

            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 3,
                    xxl: 3,
                }}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card title={item.title}>Card content dgdsghsdgsfdghfdhgfsh  f dfjas hgsdfkj hkjh</Card>
                    </List.Item>
                )}
            />

            <Button type="primary" shape="circle" size="large" onClick={showModalAddTask} style={{float: 'right'}}>Add</Button>

            <Modal
                title="Add task"
                visible={showModal}
                onCancel={handleCancelModal}
                onOk={handleSubmitForm}
            >
                <Form onSubmit={handleSubmitForm}>
                    <FormItem label="Title" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input a task title (min: 3)', min: 3, max: 40 }],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label="Description" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Please input a task description (min: 3)', min: 3, max: 40 }],
                        })(
                            <TextArea />
                        )}
                    </FormItem>

                    <FormItem label="Priority level" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Slider marks={marks} defaultValue={50} step={5} />
                    </FormItem>

                </Form>
            </Modal>

        </div>
    );
}

export default TodoList;