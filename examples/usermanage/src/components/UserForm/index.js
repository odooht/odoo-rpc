import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import styles from './index.css';
import UserPhone from './UserPhone';
import { Link } from 'dva/router';
const FormItem = Form.Item;

@Form.create()
class UserForm extends React.Component {
    state = ({
        isedit: this.props.user_id ? true : false,
        image_small: this.props.image_small
    })
    handlerGetImage = (image_small) => {
        this.setState({
            image_small,
        })
    }
    changeEdit = (isedit) => {
        if (!isedit) {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const { handlerCreateUser, user_id } = this.props;
                    handlerCreateUser(user_id, { ...values, image_small: this.state.image_small })
                }
            });
        }
        this.setState({
            isedit: !this.state.isedit
        })
    }
    unEdit = () => {
        this.setState({
            isedit: true,
        })
    }

    //判断是否有联系人
    handlerDelete = (user_id) => {
        const {
            userData: { child_ids },
        } = this.props;
        if (child_ids.length <= 0) {
            this.props.handlerDeleteUser(user_id);
        } else {
            alert('请先删除完联系人')
        }

    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        }
        const { getFieldDecorator } = this.props.form;
        const {
            userData: { name, phone, email, address, image_small },
            user_id,
        } = this.props;
        const src64 = `data:image/jpeg;base64,${encodeURIComponent(image_small)}`
        const { isedit } = this.state;
        return (
            <div className={styles.userfrom}>
                <div className={styles.userExit}>
                    <Button onClick={() => this.changeEdit(isedit)} type="primary">{isedit ? '修改' : '保存'}</Button>
                    {isedit ? "" : <Button onClick={() => this.unEdit()} type="primary" style={{ marginLeft: 10 }}>取消</Button>}
                    {!isedit && user_id ?
                        <div style={{ float: 'right' }}>
                            <Button onClick={() => this.handlerDelete(user_id)} style={{ float: 'right', marginLeft: 20 }} type="primary"> 删除</Button>
                            <Link to={{
                                pathname: "/addchild",
                                search: `?user_id=${user_id}`
                            }}>
                                <Button style={{ float: 'right' }} type="primary">添加联系人</Button>
                            </Link>
                        </div>
                        : ""}
                </div>
                <Form layout='horizontal' >
                    <Row gutter={24} >
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                            <FormItem
                                label="头像"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('image_small', {
                                    initialValue: src64
                                })(
                                    <UserPhone isedit={isedit} image_small={src64} handlerGetImage={this.handlerGetImage} />
                                )}
                            </FormItem>
                            <FormItem
                                label="姓名"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('name', {
                                    initialValue: name || ''
                                })(
                                    <Input disabled={isedit} />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={0} sm={0} md={4} lg={4} xl={4}></Col>
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                            <FormItem
                                label="电话"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('phone', {
                                    initialValue: phone || ''
                                })(
                                    <Input disabled={isedit} />
                                )}
                            </FormItem>
                            <FormItem
                                label="邮箱"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('email', {
                                    initialValue: email || ''
                                })(
                                    <Input disabled={isedit} />
                                )}
                            </FormItem>
                            <FormItem
                                label="地址"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('address', {
                                    initialValue: address || ''
                                })(
                                    <Input disabled={isedit} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default UserForm;