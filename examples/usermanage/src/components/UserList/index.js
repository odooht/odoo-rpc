import React from 'react';
import { List, Card, Avatar, Row, Col } from 'antd';
import { Link } from 'dva/router';
import styles from './index.css';

export default class UserList extends React.Component {
    state = {
        pageSize: 10
    }
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize,
        })
        const kwargs = { offset: (current - 1) * pageSize, limit: pageSize, order: 'name desc' }
        this.props.handlerGetUser([], kwargs)
    }
    onChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize,
        })
        const kwargs = { offset: (current - 1) * pageSize, limit: pageSize, order: 'name desc' }
        this.props.handlerGetUser([], kwargs)
    }
    render() {
        const { userData, count } = this.props;
        const { pageSize } = this.state;
        return (
            <List
                grid={{
                    gutter: 4, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4,
                }}
                pagination={{
                    pageSize: pageSize,
                    onChange: this.onChange,
                    showSizeChanger: true,
                    onShowSizeChange: this.onShowSizeChange,
                    total: count,
                }}
                dataSource={userData}
                renderItem={item => {
                    const src64 = `data:image/jpeg;base64,${escape(item.image_small)}`
                    return (
                        <List.Item
                            className={styles.listItem}
                        >

                            <Link to={{ pathname: 'usercon', query: { user_id: item.id } }} >
                                <Card title={item.name}>
                                    <Row gutter={24} justify="center" style={{ textAlign: 'left' }}>
                                        <Col className="gutter-row" span={5}>
                                            <Avatar size="large" src={src64} />
                                        </Col>
                                        <Col className="gutter-row" span={19}>
                                            <p >邮箱：{item.email}</p>
                                            <p >电话：{item.phone}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Link>

                        </List.Item>
                    )
                }
                }
            />
        )
    }
}

// export default React.memo = ({
//     userData,
//     pathname,
//     handlerGetUser,
//     handlerDeleteUserLianxi,
//     count }) => {
//     const onShowSizeChange = (current, pageSize) => {
//         const kwargs = { offset: (current - 1) * pageSize, limit: pageSize, order: 'name desc' }
//         handlerGetUser([], kwargs)
//     }
//     const onChange = (current, pageSize) => {
//         const kwargs = { offset: (current - 1) * pageSize, limit: pageSize, order: 'name desc' }
//         handlerGetUser([], kwargs)
//     }
//     console.log(count)
//     return (
//         <div className={styles.listbox}>
//             <List
//                 grid={{
//                     gutter: 4, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4,
//                 }}
//                 pagination={{
//                     onChange,
//                     showSizeChanger: true,
//                     onShowSizeChange: onShowSizeChange,
//                     total: count,
//                 }}
//                 dataSource={userData}
//                 renderItem={item => {
//                     const src64 = `data:image/jpeg;base64,${escape(item.image_small)}`
//                     return (
//                         <List.Item
//                             className={styles.listItem}
//                         >
//                             {pathname !== '/usercon' ?
//                                 <Link to={{ pathname: 'usercon', query: { user_id: item.id } }} >
//                                     <Card title={item.name}>
//                                         <Row gutter={24} justify="center" style={{ textAlign: 'left' }}>
//                                             <Col className="gutter-row" span={5}>
//                                                 <Avatar size="large" src={src64} />
//                                             </Col>
//                                             <Col className="gutter-row" span={19}>
//                                                 <p >邮箱：{item.email}</p>
//                                                 <p >电话：{item.phone}</p>
//                                             </Col>
//                                         </Row>
//                                     </Card>
//                                 </Link>
//                                 :
//                                 <Card title={item.name}>
//                                     <Row gutter={24} justify="center" style={{ textAlign: 'left' }}>
//                                         <Col className="gutter-row" span={5}>
//                                             <Avatar size="large" src={src64} />
//                                         </Col>
//                                         <Col className="gutter-row" span={19}>
//                                             <p >邮箱：{item.email}</p>
//                                             <p >电话：{item.phone}</p>
//                                         </Col>
//                                         <Button onClick={() => handlerDeleteUserLianxi(item.id, { parent_id: null })}>删除</Button>
//                                         <Button onClick={() => handlerGetUser(item.id)}  >修改</Button>
//                                     </Row>
//                                 </Card>
//                             }
//                         </List.Item>
//                     )
//                 }
//                 }
//             />
//         </div>
//     )
// }
