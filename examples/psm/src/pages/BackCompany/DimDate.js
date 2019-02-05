import odoo from '@/odoo'

import React from 'react';
import moment from 'moment';

import { Card, Modal, Button, Form, InputNumber, DatePicker, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import FormItemLayout from '@/layouts/FormItemLayout';

const { Description } = DescriptionList;

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
        const id = this.state.record.id
        const { date } = values
        const vals = {...values, date: `${date.year()}-${date.month()+1}-${date.date()}`}
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
      <PageHeaderWrapper title="详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="日历日期" style={{ marginBottom: 32 }}>
            <Description term="日历日期">{record.date}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="年季月周天" style={{ marginBottom: 32 }}>
            <Description term="YYYYMMDD">{record.daykey}</Description>
            <Description term="YYYYww">{record.weekkey}</Description>
            <Description term="YYYYMM">{record.monthkey}</Description>
            <Description term="YYYY0Q">{record.quarterkey}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="年季月周天" style={{ marginBottom: 32 }}>
            <Description term="年">{record.year}</Description>
            <Description term="季">{record.quarter}</Description>
            <Description term="月">{record.month}</Description>
            <Description term="周">{record.week}</Description>
            <Description term="日">{record.day}</Description>
          </DescriptionList>

        </Card>
        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem {...FormItemLayout} label="日期">
              {getFieldDecorator('date', {
                rules: [{ required: true }],
                initialValue: moment(record.date, 'YYYY-MM-DD')
              })(

                <DatePicker />
              )}
            </FormItem>
            <div>时间维度的其他字段是计算而得, 目前支持日历约定的年季月周日规定</div>
            <div>自定义报表的年季月周日的时间段, 需要在公司层面设置参数, 根据参数计算而得</div>
            <div>现在演示手工编辑</div>

            <div>日历日期: {record.date}</div>
            <FormItem {...FormItemLayout} label="YYYYMMDD">
              {getFieldDecorator('daykey', {
                rules: [{ required: true }],
                initialValue: record.daykey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="YYYYww">
              {getFieldDecorator('weekkey', {
                rules: [{ required: true }],
                initialValue: record.weekkey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="YYYYMM">
              {getFieldDecorator('monthkey', {
                rules: [{ required: true }],
                initialValue: record.monthkey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="YYYY0Q">
              {getFieldDecorator('quarterkey', {
                rules: [{ required: true }],
                initialValue: record.quarterkey
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="年">
              {getFieldDecorator('year', {
                rules: [{ required: true }],
                initialValue: record.year
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="季">
              {getFieldDecorator('quarter', {
                rules: [{ required: true }],
                initialValue: record.quarter
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="月">
              {getFieldDecorator('month', {
                rules: [{ required: true }],
                initialValue: record.month
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="周">
              {getFieldDecorator('week', {
                rules: [{ required: true }],
                initialValue: record.week
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="日">
              {getFieldDecorator('day', {
                rules: [{ required: true }],
                initialValue: record.day
              })(
                <InputNumber />
              )}
            </FormItem>

          </Form>
        </Modal>

      </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create()(List);

