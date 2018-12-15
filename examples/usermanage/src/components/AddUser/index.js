import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import styles from './index.css';
import UserPhone from '../UserForm/UserPhone';
import { Link } from 'dva/router';
const FormItem = Form.Item;

@Form.create()
class AddUser extends React.Component {
    state = ({
        image_small: ""
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
                    const { saveUserChild } = this.props;
                    const image_small = this.state.image_small? this.state.image_small.split(',')[1] :'';
                    saveUserChild( { ...values, image_small: image_small })
                }
            });
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        }
        const { getFieldDecorator } = this.props.form;
        const {submitUserChild} =this.props;
        return (
            <div className={styles.userfrom}>
                <div className={styles.userExit}>
                    <Button style={{marginRight:20}} onClick={() => this.changeEdit()} type="primary">提交</Button>
                    <Button  onClick={()=>submitUserChild()} type="primary">保存</Button>
                </div>
                <Form layout='horizontal' >
                    <Row gutter={24} >
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                            <FormItem
                                label="头像"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('image_small', {
                                })(
                                    <UserPhone  handlerGetImage={this.handlerGetImage} />
                                )}
                            </FormItem>
                            <FormItem
                                label="姓名"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('name', {
                                })(
                                    <Input />
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
                                    rules: [{ required: true, message: '请输入手机号!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="邮箱"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('email', {
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                            <FormItem
                                label="地址"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('address', {
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default AddUser;