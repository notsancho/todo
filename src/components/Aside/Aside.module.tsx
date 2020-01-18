import React, { useState, useEffect, forwardRef, Ref } from 'react';
import { Form, Modal, Menu, Button, Input } from 'antd';
import localforage from "localforage";
import useForm from 'rc-form-hooks';
import { isObject } from 'util';
const FormItem = Form.Item;

localforage.getItem('todosCategories').then((todosCategories) => {
    console.log(todosCategories);
});

const Aside: (React.FC) = props => {
    const [heightMenu, setHeightMenu] = useState(window.innerHeight - 30);
    const [showModal, setShowModal] = useState(false);
    const [todosCategories, setTodosCategories] = useState((Array || Object));

    useEffect(() => {
        localforage.getItem('todosCategories').then((todoC: any) => {
            setTodosCategories(todoC);
        });
    });

    const { getFieldDecorator, validateFields, errors, values } = useForm<{
        categoryTitle: string;
    }>();

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        validateFields()
            .then(
                (e) => addCategory(e.categoryTitle)
            )
            .catch(
                e => console.error(e.message)
            );
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

    const checkCategory = (title: string) => {
        const titleTrim = title.trim();
        return todosCategories.some((obj: any) => {
            return obj.title === titleTrim;
        });
    }

    const addCategory = (categoryTitle: string) => {

        if (categoryTitle !== "") {
            if (checkCategory(categoryTitle)) {
                Modal.error({
                    title: 'Error',
                    content: 'A category with the same title already exists.',
                });
            }else{
                let a = todosCategories;
                const nn = {
                    id: Date.now() + Math.random(),
                    title: categoryTitle,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
                a.push(nn);

                setTodosCategories(a);
                localforage.setItem("todosCategories", a);

                setShowModal(!showModal);
            }
        }

    }

    window.addEventListener('resize', handleResize);

    return (
        <div className="aside">
            <Menu mode="inline" style={{ height: heightMenu }}>
                {todosCategories.map((array: any, key: number) => (
                    <Menu.Item key={key}>{array.title}</Menu.Item>
                ))}
            </Menu>

            <Button type="primary" className="add" onClick={showModalAddCategory}>
                Add
            </Button>

            <Modal
                title="Add list"
                visible={showModal}
                onCancel={handleCancelModal}
                onOk={handleSubmitForm}
            >
                <Form onSubmit={handleSubmitForm}>
                    <FormItem label="Category title" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('categoryTitle', {
                            rules: [{ required: true, message: 'Please input a category title (min: 3)', min: 3, max: 40 }],
                        })(
                            <Input name="title" />
                        )}
                    </FormItem>
                </Form>
            </Modal>

        </div>
    );
}

export default Aside;