import odoo from '@/odoo'

import React from 'react';
import { Card, Divider } from 'antd';

import LoginForm from './LoginForm'

import DescriptionList from '@/components/DescriptionList';
//import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;





class List extends React.Component {
  state = {
      user: {},
  }

  async componentDidMount() {
      this.setState({user: odoo.user})
  }

  handleOk() {
    this.setState({user: odoo.user})
  }

  render() {
    const {  user } = this.state;

    return (
      <div>
        <LoginForm onOk={()=>this.handleOk()}>
        </LoginForm>

        <Card bordered={false}>
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="账号">{user.username}</Description>
            <Description term="名称">{user.name}</Description>
            <Description term="uid">{user.uid}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="sid">{user.session_id}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="公司信息" style={{ marginBottom: 32 }}>
            <Description term="公司id">{user.company_id}</Description>
          </DescriptionList>
        </Card>


      </div>
    );
  }
}

export default List;





