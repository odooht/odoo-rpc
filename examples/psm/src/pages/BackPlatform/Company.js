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
      title: '管理员',
      dataIndex: 'user_id.name',
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
    const Model = await odoo.env('res.company')

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record })
    }
    else{
      const me0 = await odoo.me({company_id:{name:1, company_registry: 1, user_id:1, user_ids: 1 }})
      if( me0.id ){
        const me = me0.look({company_id:{id:1,name:1, company_registry: 1, user_id:1, user_ids: 1 }})
        const record = me.company_id
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
        const {id, name } = values
        const Model = await odoo.env('res.company')
        await Model.write(id, {name})
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
        <Modal title="编辑公司"
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
            <FormItem label="公司名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
                initialValue: record.name
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

