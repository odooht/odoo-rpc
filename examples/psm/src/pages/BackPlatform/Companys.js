import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, Input } from 'antd';
const FormItem = Form.Item;

class List extends React.Component {
  state = {
      visible: false,
      ids: [],
      recordsList: [],
  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Link to={`/BackPlatform/Company?id=${id}`} >查看</Link>
        );
      },
    },

    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'company_registry',
    },


    {
      title: '管理员',
      dataIndex: 'user_id.name',
    },
  ]

  async componentDidMount() {
    const Model = await odoo.env('res.company')
    const records = await Model.search([['id','!=',1]], [], {order: 'name'})
    const data = records.look2()
    this.setState({ recordsList: data, ids: records.ids  })
  }

  showModal = () => {
      this.setState({ visible: true });
  };

  handleCancel = () => {
      this.setState({ visible: false });
  }

  handleOk = () => {
    const { form: { validateFields } } = this.props;

    validateFields( async  (err, values) => {
 //     if (!err) {

        const {name, company_registry, email, password} = values

        const Model = await odoo.env('res.company')
        const vals = {name, company_registry}
        const user_vals = {
            login: `admin@${company_registry}`,
            name: `admin@${company_registry}`,
            email,
            password,
        }

        console.log(vals, user_vals)

        const new_rec = await Model.create_with_user(vals, user_vals)
        if(new_rec){
            //TBD
            const { ids } = this.state;
            this.setState({
              ids: [...ids, new_rec.id],
            });
        }

        const { ids } = this.state;

        const records = Model.view(ids)
        const data = records.look2()
        this.setState({ recordsList: data  })

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
 //     }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const {  visible, recordsList } = this.state;

    return (
      <div>
        <Table columns={this.columns} dataSource={recordsList} rowKey="id" />
        <Button onClick={()=>this.showModal()}>新建</Button>

        <Modal title="新建公司"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem label="公司名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="公司编码">
              {getFieldDecorator('company_registry', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="email">
              {getFieldDecorator('email', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="密码">
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

