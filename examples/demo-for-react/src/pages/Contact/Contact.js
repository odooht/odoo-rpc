import router from 'umi/router';
import styles from './Contact.css';
import odoo from '@/odoo/odoo'

import React, { Component } from 'react';

import { Input } from 'antd';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page Contact</h1>
      <button
        onClick={() => {
          router.goBack();
        }}
      >
        go back
      </button>

      <Bridge />
    </div>
  );
}
const Search = Input.Search;


const fields = {
    name:null,
    company_id:{name:null,email:null},
    category_id:{name:null}
}

const fields_ref = {
    company_id:{},
    category_id:{}
}


class Bridge extends Component {
  state = {
      session_id: null,
      contacts: [],
      contact: {},
  };

  componentDidMount() {}

  login = async ( value ) => {
    //const v = 'A23,123'
    const v = 'admin,123'
    const v2 = value ? value : v;
    const [user, password] = v2.split(',');
    console.log('login: params:', { login: user, password, type: 'account' })
    const session_id = await odoo.login({login:'admin', password:'123'})
    this.setState({session_id})

  };

  query = async value => {
      const id = parseInt(value);
      const Partner = odoo.env('res.partner')
      const ptns = await Partner.search([['id','>',id]], fields_ref)
      const contacts = ptns.look(fields)
      this.setState({contacts})
  };

  view = value => {
      const id = parseInt(value);
      const Partner = odoo.env('res.partner')
      const ptn = Partner.view(id)
      const contact = ptn.look(fields)
      this.setState({contact})

  };

  add = async value => {
      const Partner = odoo.env('res.partner')
      const ptn = await Partner.create({ name: value })
      const contact = ptn.look(fields)
      const {contacts} = this.state
      this.setState( {contacts: [...contacts, contact ]})
  };

  rename = async value => {
      const name = value;
      const {id } = this.state.contact;
      const Partner = odoo.env('res.partner')
      const ptn = await Partner.write(id, { name: value })
      const contact = ptn.look(fields)
      this.setState({contact})
  };

  del = async value => {
      const id = parseInt(value);
      const Partner = odoo.env('res.partner')
      const ret = await Partner.unlink(id )
      const {contacts} = this.state
      this.setState( {contacts:contacts.filter(item=>item.id != id) })
  };


  render() {
    const session_id = this.state.session_id;
    const contacts = this.state.contacts;
    const contact = this.state.contact;

    return (
      <div>
        <Search
          placeholder="user, password"
          enterButton="Login"
          //size="large"
          onSearch={value => this.login(value)}
        />
        <Search
          placeholder=""
          enterButton="Query"
          onSearch={value => this.query(value)}
        />

        <Search
          placeholder="id to view"
          enterButton="View"
          //size="large"
          onSearch={value => this.view(value)}
        />

        <Search
          placeholder="new name"
          enterButton="rename"
          //size="large"
          onSearch={value => this.rename(value)}
        />
        <Search
          placeholder="name to add"
          enterButton="Add"
          //size="large"
          onSearch={value => this.add(value)}
        />
        <Search
          placeholder="id to del"
          enterButton="Del"
          //size="large"
          onSearch={value => this.del(value)}
        />



        <div>
          login: {JSON.stringify(session_id)}
        </div>

        <div>
          查看一条: {JSON.stringify(contact)}
        </div>

        列表显示:
        <ul>
          {contacts.map((contact, i) => (
            <li key={i}>
                <p>name: {contact.id},{contact.name}</p>
                <span>company: {contact.company_id.name}</span>
                <span>, {contact.company_id.email}</span>
                <p>categorys: {JSON.stringify(contact.category_id)}</p>
            </li>
          ))}
        </ul>

      </div>
    );
  }
}

