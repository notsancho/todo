import React, { useState, useEffect, forwardRef, Ref } from 'react';
import { PageHeader, List, Card, Form, Modal, Menu, Button, Input, Slider, Row, Col } from 'antd';

import useForm from 'rc-form-hooks';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;

interface HooksProps {
    title: string,
    description: string,
    priorityLevel: number,
    showModal: boolean,
    handleCancelModal: any,
    addTask: any,
    setPriorityLevel: any,
    setTitle: any,
    setDescription: any,
}

const marks = {
    0: '0',
    25: '25',
    50: '50',
    75: '75',
    100: '100'
};

const ModalTask = (props:HooksProps) => {
    const [igor, setIgor] = useState("");

    const { getFieldDecorator, validateFields, errors, values } = useForm<{
        title: string;
        description: string;
    }>();

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        validateFields()
            .then(
                (e) => {
                    props.addTask(e.title, e.description);
                }
            )
            .catch(
                e => {
                    console.error(e.message)
                }
            );
    };

    return (
        <Modal
            title={props.title}
            visible={props.showModal}
            onCancel={props.handleCancelModal}
            onOk={(e) => handleSubmitForm(e)}
        >
            <Form>
                <FormItem label="Title" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('title', {
                        initialValue: props.title,
                        rules: [{ required: true, message: 'Please input a task title (min: 3)', min: 3, max: 40 }],
                    })(
                        <Input onChange={(e)=>{props.setTitle(e.target.value)}} />
                    )}
                </FormItem>

                

                <FormItem label="Description" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('description', {
                        initialValue: props.description,
                        rules: [{ required: true, message: 'Please input a task description (min: 3)', min: 3, max: 40 }],
                    })(
                        <TextArea onChange={(e)=>{props.setDescription(e.target.value)}} />
                    )}
                </FormItem>

                <FormItem label="Priority level" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Slider marks={marks} defaultValue={props.priorityLevel} step={5} onChange={props.setPriorityLevel} />
                </FormItem>

            </Form>
        </Modal>
    );
}

export default ModalTask;