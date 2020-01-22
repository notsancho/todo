import React, { useState } from 'react';
import { Form, Menu, Button, Input } from 'antd';
import {
    Link
} from "react-router-dom";

interface HooksProps {
    categoriesList: any,
    setCategoriesList: any,
    showCategoryForm: any,
}

const Aside = (props: HooksProps) => {
    const [heightMenu, setHeightMenu] = useState(window.innerHeight - 30);

    const handleResize = () => {
        setHeightMenu(window.innerHeight - 20);
    }

    window.addEventListener('resize', handleResize);

    return (
        <div className="aside">

            <Menu mode="inline" style={{ height: heightMenu }}>
                {(props.categoriesList !== null) && props.categoriesList.map((array: any, key: number) => (
                    <Menu.Item key={key}>
                        <Link to={`/tasklist/${array.id}`}>
                            {array.title}
                        </Link>
                    </Menu.Item>
                ))}
            </Menu>

            <Button type="primary" className="add" onClick={() => {props.showCategoryForm(null)}}>
                Add
            </Button>

        </div>
    );
}

export default Aside;