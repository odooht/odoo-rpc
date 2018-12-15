import React from 'react';
import styles from './index.css';
import { Input, Button } from 'antd';
import { Link } from 'dva/router';

const { Search } = Input;

const HeaderPage = ({ handlerGetUser, handlersort }) => {
    const searchValue = (value) => {
        handlerGetUser(value ? [['name', 'like', value]] : [])
    }
    return (
        <div className={styles.headers} >
            <Button
                onClick={() => handlersort()}
                style={{ marginRight: 20 }}
                type="primary">
                排序
         </Button>
            <Search
                placeholder="input search text"
                onSearch={value => searchValue(value)}
                enterButton
                style={{ width: 200 }}
            />
            <Link to="/usercon">
                <Button
                    style={{ float: 'right' }}
                    type="primary">
                    创建
            </Button>
            </Link>
        </div>
    )
}

export default HeaderPage;