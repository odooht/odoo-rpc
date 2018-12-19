import React from 'react';
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import styles from './index.css'
const FormItem = Form.Item;

@Form.create()
class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.formbox}>
        <Form onSubmit={this.handleSubmit} className={styles.loginform}>
          <FormItem>
            {getFieldDecorator('login', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className={styles.loginformbutton}>
              Log in
          </Button>
            Or <a href="">register now!</a>
          </FormItem>
        </Form >
      </div>
    );
  }
}

export default LoginForm;