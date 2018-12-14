import React, { Component } from 'react';
// 引入odoo-rpc
import odoo from '@/odoo/odoo';
import UserList from '@/components/UserList'
import HeaderPage from '@/components/HeaderPage';



export default class userData extends Component {
  state = {
    userData: [],
    count: 0,
  }

  // 通用user
  commonUser = {
    fields: {
      parent_id: { id: null, name: null },
      id: null,
      name: null,
      image_small: null,
      email: null,
      date: null,
      create_date: null,
      phone: null,
      state_id: { id: null, name: null },
      child_ids: { id: null, name: null }
    },
    partner: odoo.env('res.partner'),
    save: (userData) => {
      this.setState({
        userData,
      })
    },
  }


  // 查询
  handlerGetUser = async (domain = [], kwargs) => {
    const { partner, fields, save } = this.commonUser;
    const count = await partner.call('search_count', [[['customer', '=', true], ...domain]])
    const ptn = await partner.search([['customer', '=', true], ...domain], fields, kwargs);
    const userData = ptn.look(fields);

    this.setState({
      count: count,
    })
    save(userData)
  }

  // 按照创建时间排序
  handlersort = () => {
    const { userData } = this.state;
    userData.sort((p, n) => {
      return p.create_date < n.create_date ? 1 : -1
      // return p.create_date > n.create_date ? 1 : -1
    })
    this.setState({
      userData,
    })
  }
  componentDidMount() {
    this.handlerGetUser([], { offset: 0, limit: 10, order: 'name desc' })
  }

  render() {
    const { userData, count } = this.state;
    const { location: { pathname } } = this.props;
    return (
      <div>
        <HeaderPage
          handlersort={this.handlersort}
          handlerGetUser={this.handlerGetUser}
        />
        <UserList
          handlerGetUser={this.handlerGetUser}
          count={count}
          pathname={pathname}
          userData={userData}
        />
      </div>
    )
  }
}
