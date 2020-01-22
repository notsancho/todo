import React from 'react';
import { Form, Modal, Input } from 'antd';

import localforage from "localforage";
import useForm from 'rc-form-hooks';
const FormItem = Form.Item;

interface ModalCategoryProps {
    categoryId: number|null,
    setCategoryId: any,
    categoriesList: any,
    setCategoriesList: any,
    showModalCategory: boolean,
    setShowModalCategory: any,
    categoryTitle: string,
    setCategoryTitle: any,
    categoryModalTitle: string,
}

const ModalCategory = (props: ModalCategoryProps) => {

    const { getFieldDecorator, validateFields, errors, values } = useForm<{
        title: string;
    }>();

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        validateFields()
            .then(
                (e) => addCategory(e.title)
            )
            .catch(
                e => console.error(e.message)
            );
    };

    const checkCategory = (title: string) => {
        if (props.categoriesList === null) {
            return false;
        }
        const titleTrim = title.trim();
        return props.categoriesList.some((obj: any) => {
            return obj.title === titleTrim;
        });
    }

    const addCategory = (title: string) => {

        if (title !== "") {
            if (checkCategory(title)) {
                Modal.error({
                    title: 'Error',
                    content: 'A category with the same title already exists.',
                });
            } else {
                let list = props.categoriesList || [];

                if (props.categoryId !== null) {
                    list.some((array: any, key: number) => {
                        if (array.id == props.categoryId) {
                            list[key] = {
                                id: props.categoryId,
                                title: title,
                                updatedAt: Date.now()
                            };
                        }
                    });
                } else {
                    
                    const newCategory = {
                        id: Date.now() + Math.random(),
                        title: title,
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    };
                    list.push(newCategory);
                }
                
                list = list.filter(function (el: any) {
                    return el != null;
                });

                props.setCategoriesList(list);
                localforage.setItem("categoriesList", list);

                props.setShowModalCategory(!props.showModalCategory);
            }
        }

    }

    return (
        <Modal
            title="Category"
            visible={props.showModalCategory}
            onCancel={() => props.setShowModalCategory(!props.showModalCategory)}
            onOk={handleSubmitForm}
        >
            <Form>
                <FormItem label="Category title" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    {getFieldDecorator('title', {
                        initialValue: props.categoryModalTitle,
                        rules: [{ required: true, message: 'Please input a category title (min: 3)', min: 3, max: 40 }],
                    })(
                        <Input name="title" />
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
}

export default ModalCategory;