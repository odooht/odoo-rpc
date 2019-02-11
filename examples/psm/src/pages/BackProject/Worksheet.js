import odoo from '@/odoo'

import React from 'react';

import { Card, Modal, Button, Form,  InputNumber, Divider } from 'antd';

import DescriptionList from '@/components/DescriptionList';

import FormItemLayout from '@/layouts/FormItemLayout';

const { Description } = DescriptionList;



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
      if (!err) {
        const Model = await odoo.env('project.worksheet')

        const id = this.state.record.id
        const { date } = values
        const vals = {
          ...values,
          date:  date.year() + '-' + ( date.month() + 1) + '-' + date.date(),
          set_name: 1,
        }

        await Model.write(id, vals)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record })
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false  });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { record, visible, visiblePost } = this.state;


    return (
      <div>
        <Card bordered={false}>
          <DescriptionList size="large" title="节点信息" style={{ marginBottom: 32 }}>
            <Description term="节点名称">{(record.work_id || {}).name}</Description>
            <Description term="单价">{record.price}</Description>
            <Description term="单位">{(record.uom_id || {}).name}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="工程技术员" style={{ marginBottom: 32 }}>
            <Description term="用户">{(record.user_id || {}).name}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="施工进度" style={{ marginBottom: 32 }}>
            <Description term="日期">{record.date}</Description>
            <Description term="序号">{record.number}</Description>
            <Description term="本次施工量">{record.qty}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="提交信息" style={{ marginBottom: 32 }}>
            <Description term="状态">{record.state}</Description>
          </DescriptionList>
        </Card>


        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Button onClick={()=>this.showPost()}>过账</Button>
        <Modal title="进度提交"
          visible={visiblePost}
          onOk={()=>this.handleOkPost()}
          onCancel={()=>this.handleCancelPost()}
        >
          <p>确认要提交?</p>
          <p>节点: {(record.work_id || {}).name}</p>
          <p>日期: {record.date}</p>
          <p>序号: {record.number}</p>
          <p>确认要提交?</p>
        </Modal>
        <Modal title="编辑信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <div> 节点: {(record.work_id || {}).name}</div>
            <div> 日期: {record.date}</div>
            <FormItem {...FormItemLayout} label="序号">
              {getFieldDecorator('number', {
                rules: [{ required: true }],
                initialValue: record.number
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="数量">
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

