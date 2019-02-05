import odoo from '@/odoo'

import React from 'react';
import { Card, Modal, Button, Form, Input, Select, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import FormItemLayout from '@/layouts/FormItemLayout';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Option } = Select;

class List extends React.Component {
  state = {
      visible: false,
      record: {},
      usersList: [],
  }


  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('project.project')

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record })
    }

    const [,adminid] = ( await odoo.ref('base.user_admin')  ) || [0,0]

    if (! adminid ){
      return
    }

    const User = await odoo.env('res.users')
    const users = await User.search([['id','!=',adminid]], {}, {order: 'name'})
    const usersList = users.look2()
    this.setState({ usersList  })


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
        const id = this.state.record.id
//        const {id, name, code, user_id} = values
        const Model = await odoo.env('project.project')
//        const vals = {name,code, user_id}
        await Model.write(id, values)
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
    const { record, visible, usersList } = this.state;

    return (
      <div>
      <PageHeaderWrapper title="项目详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="名称">{record.name}</Description>
            <Description term="编码">{record.code}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="项目经理" style={{ marginBottom: 32 }}>
            <Description term="项目经理">{(record.user_id || {}).name }</Description>
          </DescriptionList>
        </Card>


        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑项目信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem {...FormItemLayout} label="项目名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
                initialValue: record.name
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="项目编码">
              {getFieldDecorator('code', {
                rules: [{ required: true }],
                initialValue: record.code
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="项目经理">
              {getFieldDecorator('user_id', {
                rules: [{ required: true }],
                initialValue: record.user_id ? record.user_id.id : ''
              })(
                <Select placeholder="请选择项目经理">
                  {
                    usersList.map(user => {
                      return (
                        <Option value={user.id} key="id">{user.login}</Option>
                      );
                    })
                  }
                </Select>


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

