import odoo from '@/odoo'

import React from 'react';
import { Card, Modal, Button, Form, Input, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';

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
        const id = this.state.record.id
        const {name, company_registry, user_id } = values
        const Model = await odoo.env('res.company')
        await Model.write(id, {name, company_registry, user_id})
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


    return (
      <div>
        <Card bordered={false}>
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="名称">{record.name}</Description>
            <Description term="编码">{record.company_registry}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="管理员" style={{ marginBottom: 32 }}>
            <Description term="名称">{(record.user_id || {}).name }</Description>
          </DescriptionList>
        </Card>

        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑公司"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem {...FormItemLayout} label="公司名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
                initialValue: record.name
              })(
                <Input />
              )}
            </FormItem>
            <p>公司编码: {record.company_registry}</p>
            <p>公司管理员: {(record.user_id || {}).name }</p>
            <p>公司管理员是 "admin@公司编码" 的格式</p>
            <p>公司管理员是 "admin@公司编码" 的格式</p>
            <p>公司的其他用户是 "用户名@公司编码" 的格式</p>
            <p>因此修改公司编码 bla bla ......</p>
            <p>因此更换公司管理员 bla bla ......</p>

          </Form>
        </Modal>

      </div>
    );
  }
}

export default Form.create()(List);

