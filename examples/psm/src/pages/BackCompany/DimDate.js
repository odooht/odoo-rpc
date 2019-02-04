import odoo from '@/odoo'

import React from 'react';
import moment from 'moment';

import { Table, Modal, Button, Form, InputNumber, DatePicker } from 'antd';
const FormItem = Form.Item;

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
      title: '日历日期',
      dataIndex: 'date',
    },

    {
      title: 'YYYYMMDD',
      dataIndex: 'daykey',
    },
    {
      title: 'YYYYww',
      dataIndex: 'weekkey',
    },
    {
      title: 'YYYYMM',
      dataIndex: 'monthkey',
    },

    {
      title: 'YYYY0Q',
      dataIndex: 'quarterkey',
    },

    {
      title: 'year',
      dataIndex: 'year',
    },

/*
    {
      title: 'Day',
      dataIndex: 'day',
    },
    {
      title: 'week',
      dataIndex: 'week',
    },
    {
      title: 'month',
      dataIndex: 'month',
    },

    {
      title: 'quarter',
      dataIndex: 'quarter',
    },

*/


  ]

  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('olap.dim.date')

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record })
    }

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
        const Model = await odoo.env('olap.dim.date')
        const { id, daykey, weekkey, monthkey, quarterkey, year} = values
        const vals = {daykey, weekkey, monthkey, quarterkey, year}
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
                <InputNumber />
              )}
            </FormItem>

            <FormItem label="日期">
              {getFieldDecorator('date', {
                rules: [{ required: true }],
                initialValue: moment(record.date, 'YYYY-MM-DD')
              })(

                <DatePicker showTime placeholder="Select Time"/>
              )}
            </FormItem>

            <FormItem label="YYYYMMDD">
              {getFieldDecorator('daykey', {
                rules: [{ required: true }],
                initialValue: record.daykey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="YYYYww">
              {getFieldDecorator('weekkey', {
                rules: [{ required: true }],
                initialValue: record.weekkey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="YYYYMM">
              {getFieldDecorator('monthkey', {
                rules: [{ required: true }],
                initialValue: record.monthkey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="YYYY0Q">
              {getFieldDecorator('quarterkey', {
                rules: [{ required: true }],
                initialValue: record.quarterkey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="YYYY">
              {getFieldDecorator('year', {
                rules: [{ required: true }],
                initialValue: record.year
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

