import odoo from '@/odoo'

import React from 'react';
import moment from 'moment';

import { Card, Modal, Button, Form, InputNumber, DatePicker } from 'antd';
const FormItem = Form.Item;

class List extends React.Component {
  state = {
      visible: false,
      record: {},
  }

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


    return (
      <div>
        <Card title="工程节点信息">
          <p>日历日期: {record.date}</p>
          <p>YYYYMMDD: {record.daykey}</p>
          <p>YYYYww: {record.weekkey}</p>
          <p>YYYYMM: {record.monthkey}</p>
          <p>YYYY0Q: {record.quarterkey}</p>
          <p>年: {record.year}</p>
          <p>日: {record.day}</p>
          <p>周: {record.week}</p>
          <p>月: {record.month}</p>
          <p>季: {record.quarter}</p>
        </Card>

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

                <DatePicker />
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

