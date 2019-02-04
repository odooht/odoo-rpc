import odoo from '@/odoo'

import React from 'react';

import moment from 'moment';
import { Table, Modal, Button, Form, Input, InputNumber, DatePicker } from 'antd';

const FormItem = Form.Item;
//const { Option } = Select;

class List extends React.Component {
  state = {
      visible: false,
      record: {},
  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Button onClick={() => { this.showModal(); }}>编辑</Button>
        );
      },
    },

    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '节点',
      dataIndex: 'work_id.name',
    },
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: '数量',
      dataIndex: 'qty',
    },

    {
      title: '单位',
      dataIndex: 'uom_id.name',
    },
    {
      title: '用户',
      dataIndex: 'user_id.name',
    },

  ]

  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('project.worksheet')

    if (! id){
      return
    }

    const records = Model.view(Number(id))
    const record = records.look()
    this.setState({ record })
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
        const {
          id, name, code,
          date, number, qty,
        } = values

        console.log(values)

        const Model = await odoo.env('project.worksheet')

        const vals = {
          name, code,
          date:  date.year() + '-' + ( date.month() + 1) + '-' + date.date(),
          number, qty,
          set_name: 1,
          post: 1,
        }

        await Model.write(id, vals)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record })
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
        <Modal title="编辑信息"
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
            <FormItem label="编码">
              {getFieldDecorator('code', {
                rules: [{ required: true }],
                initialValue: record.code
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="日期">
              {getFieldDecorator('date', {
                rules: [{ required: true }],
                initialValue: moment(record.date, 'YYYY-MM-DD')
              })(

                <DatePicker/>
              )}
            </FormItem>

            <FormItem label="序号">
              {getFieldDecorator('number', {
                rules: [{ required: true }],
                initialValue: record.number
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="数量">
              {getFieldDecorator('qty', {
                rules: [{ required: true }],
                initialValue: record.qty
              })(
                <InputNumber />
              )}
            </FormItem>


          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(List);

