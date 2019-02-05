import odoo from '@/odoo'

import React from 'react';
import { Card, Modal, Button, Form, Input, Divider } from 'antd';

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
    const Model = await odoo.env('res.users')

    if (id){
      const records = Model.view(Number(id))
      const record = records.look({company_id:{}})
      this.setState({ record  })
    }
    else{
      const me0 = await odoo.me({company_id:{}})
      if( me0.id ){
        const record = me0.look({company_id:{}})
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

        const company_registry = this.state.record.company_id.company_registry

        const {name,login } = values

        const Model = await odoo.env('res.users')
        await Model.write(id, {
          name,
          login: `${login}@${company_registry}`,
        })
        const records = Model.view(id)
        const record = records.look({company_id:{}})
        this.setState({ record   })
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false  });
 //     }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { record, visible } = this.state;

    const company_registry = (record.company_id || {}).company_registry || ''
    const login = record.login && company_registry ?
                  record.login.split("@")[0]  : ''

    return (
      <div>

      <PageHeaderWrapper title="用户详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="账号">{record.login}</Description>
            <Description term="名称">{record.name}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="其他信息" style={{ marginBottom: 32 }}>
            <Description term="头衔">总工</Description>
            <Description term="部门">技术部</Description>
          </DescriptionList>
        </Card>

        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑用户信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem {...FormItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
                initialValue: record.name
              })(
                <Input />
              )}
            </FormItem>
            <p>自己修改自己的登录账号后, 必须重新登录</p>
            <p>或者约定, 自己的登录账号, 不能自己修改</p>
            <FormItem {...FormItemLayout} label="登录账号">
              {getFieldDecorator('login', {
                rules: [{ required: true }],
                initialValue: login
              })(
                <Input />
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

