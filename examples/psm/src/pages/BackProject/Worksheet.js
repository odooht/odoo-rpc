import odoo from '@/odoo'

import React from 'react';

import moment from 'moment';
import { Card, Modal, Button, Form, Input, InputNumber, DatePicker } from 'antd';

const FormItem = Form.Item;
//const { Option } = Select;

class List extends React.Component {
  state = {
      visiblePost: false,
      visible: false,
      record: {},
  }

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

  showPost= () => {
    this.setState({ visiblePost: true });
  };

  handleCancel = () => {
    this.setState({ visible: false, });
  }

  handleCancelPost = () => {
    this.setState({ visiblePost: false, });
  }

  handleOkPost = async () => {
    const Model = await odoo.env('project.worksheet')
    const obj = Model.view(this.state.record.id)
    await obj.post()
    const record = obj.look()
    this.setState({ record })
    this.setState({ visiblePost: false  });
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
    const { record, visible, visiblePost } = this.state;

    const work_name = record.work_id ? record.work_id.name : ''
    const uom_name = record.uom_id ? record.uom_id.name : ''
    const user_name = record.user_id ? record.user_id.name : ''


    return (
      <div>
        <Card title="工单信息">
          <p>状态: {record.state}</p>
          <p>日期: {record.date}</p>
          <p>节点: {work_name}</p>
          <p>序号: {record.number}</p>
          <p>数量: {record.qty}</p>
          <p>单位: {uom_name}</p>
          <p>单价: {record.price}</p>
          <p>用户: {user_name}</p>
        </Card>

        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Button onClick={()=>this.showPost()}>过账</Button>
        <Modal title="提交"
          visible={visiblePost}
          onOk={()=>this.handleOkPost()}
          onCancel={()=>this.handleCancelPost()}
        >
          <p>确认要提交?</p>
        </Modal>
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

