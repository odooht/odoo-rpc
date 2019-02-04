import odoo from '@/odoo'

import React from 'react';
import { Table, Modal, Button, Form, Input } from 'antd';
const FormItem = Form.Item;

class List extends React.Component {
  state = {
      visible: false,
      record: {},
  }

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '账号',
      dataIndex: 'login',
    },


    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Button onClick={() => { this.showModal(); }}>编辑</Button>
        );
      },
    },

  ]

  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('res.users')

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record })
    }
    else{
      const me0 = await odoo.me()
      if( me0.id ){
        const record = me0.look()
        this.setState({ record })
      }

    }
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
        const {id, name,login } = values
        const Model = await odoo.env('res.users')
        await Model.write(id, {name,login})
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record   })
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false  });
 //     }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { record, visible } = this.state;
    const records  = Object.keys(record).length ?  [record] : [];

    return (
      <div>
        <Table columns={this.columns} dataSource={records} rowKey="id" />
        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑用户信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem label="ID">
              {getFieldDecorator('id', {
                rules: [{ required: true }],
                initialValue: record.id
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
                initialValue: record.name
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="登录账号">
              {getFieldDecorator('login', {
                rules: [{ required: true }],
                initialValue: record.login
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

