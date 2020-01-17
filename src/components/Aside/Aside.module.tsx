import React, { useState, useEffect } from 'react';
import { Form, Modal, Menu, Button, Input } from 'antd';
import useForm from 'rc-form-hooks';
const FormItem = Form.Item;


const Aside: (React.FC) = props => {
    const [heightMenu, setHeightMenu] = useState(window.innerHeight - 30);
    const [showModal, setShowModal] = useState(false);

    const { getFieldDecorator, validateFields, errors, values } = useForm<{
        username: string;
        note: string;
    }>();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateFields()
            .then(console.log)
            .catch(e => console.error(e.message));
    };

    const handleResize = () => {
        setHeightMenu(window.innerHeight - 20);
    }

    const showModalAddCategory = () => {
        setShowModal(!showModal);
    }

    const handleCancelModal = () => {
        setShowModal(!showModal);
    }

    window.addEventListener('resize', handleResize);

    return (
        <div className="aside">
            <Menu mode="inline" style={{ height: heightMenu }}>
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
            </Menu>

            <Button type="primary" className="add" onClick={showModalAddCategory}>
                Add
            </Button>

            <Modal
                title="Add list"
                visible={showModal}
                onCancel={handleCancelModal}
            >


                <Form onSubmit={handleSubmit}>
                    <FormItem
                        label="Note"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 8 }}
                    >
                        {getFieldDecorator('note', {
                            rules: [{ required: true, message: 'Please input your note!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>

            </Modal>

        </div>
    );
}

export default Aside;