import React, { useState, useEffect } from 'react';
import { Menu, Button } from 'antd';
import { Link } from "react-router-dom";

interface AsideProps {
    categoriesList: any,
    setCategoriesList: any,
    showCategoryForm: any,
}

const Aside = (props: AsideProps) => {
    const [heightMenu, setHeightMenu] = useState<number>(window.innerHeight - 30);

    useEffect(() => {
        setHeightMenu(window.innerHeight - 20);
    }, []);

    return (
        <div className="aside">

            <Menu mode="inline" style={{ height: heightMenu }}>
                {(props.categoriesList !== null) && props.categoriesList.map((array: any, key: number) => (
                    <Menu.Item key={key}>
                        <Link to={`/category/${array.id}`}>
                            {array.title}
                        </Link>
                    </Menu.Item>
                ))}
            </Menu>

            <Button type="primary" className="add" onClick={() => { props.showCategoryForm(null) }}>
                Add
            </Button>

        </div>
    );
}

export default Aside;