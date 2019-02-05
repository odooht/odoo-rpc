import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, Input } from 'antd';
import FormItemLayout from '@/layouts/FormItemLayout';

const FormItem = Form.Item;


class List extends React.Component {
  state = {
      visible: false,
//      id: null,
      ids: [],
      recordsList: [],
      user: null,
  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Link to={`/BackCompany/User?id=${id}`} >查看</Link>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '账号',
      dataIndex: 'login',
    },
  ]

  async componentDidMount() {
    const me0 = await odoo.me({company_id:{name:1, company_registry: 1, user_id:1, user_ids: 1 }})
    if( me0.id ){
      this.setState({ user: me0 })
    }

    const Model = await odoo.env('res.users')
    const [,adminid] = ( await odoo.ref('base.user_admin')  ) || [0,0]

    if (! adminid ){
      return
    }

    const records = await Model.search(
      [['id','!=',adminid]],
      {company_id:{name:1, company_registry: 1}},
      {order: 'name'},
    )
    const data = records.look2()
    this.setState({ recordsList: data, ids: records.ids  })

  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const { form: { validateFields } } = this.props;

    validateFields( async  (err, values) => {
 //     if (!err) {
        const { user } = this.state

        if(!user){
          return
        }

        const company_registry = user.attr('company_id').attr('company_registry')

        const {name, login, email, password} = values

        const vals = {
          login: `${login}@${company_registry}`,
          name,
          email,
          password,
        }

        console.log(vals)

        const Model = await odoo.env('res.users')

        const new_rec = await Model.create(vals)
        if(new_rec){
          //TBD
          const { ids } = this.state;
          this.setState({
            ids: [...ids, new_rec.id]
          });

        }

        const { ids } = this.state;

        const records = Model.view(ids)
        const data = records.look2()
        console.log( data)
        this.setState({ recordsList: data  })

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
 //     }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible,recordsList } = this.state;

    return (
      <div>
        <Table columns={this.columns} dataSource={recordsList} rowKey="id" />
        <Button onClick={this.showModal}>新建</Button>
        <Modal title="新建用户"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...FormItemLayout} label="用户名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="登录账号">
              {getFieldDecorator('login', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="email">
              {getFieldDecorator('email', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(List);

