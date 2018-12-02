import router from 'umi/router';
import styles from './Contact.css';

import React, { Component } from 'react';

import { connect } from 'dva';

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


@connect(({ login, contact }) => ({ login, contact }))
class Bridge extends Component {
  state = {
  };

  componentDidMount() {}

  login = value => {
    //const v = 'A23,123'
    const v = 'admin,123'
    const v2 = value ? value : v;
    const [user, password] = v2.split(',');

    const { dispatch } = this.props;

    console.log('login: params:', { login: user, password, type: 'account' })

    dispatch({
      type: 'login/login',
      payload: { login: user, password, type: 'account' }
    }).then(res => {
      console.log('login: res:', this.props.login )

    })
  };

  query = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: 'contact/query', payload: { id } });
  };

  view = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type:  'contact/view', payload: { id } });
  };

  add = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'contact/create', payload: { name: value } });
  };
  rename = value => {
    const name = value;
    const { id } = this.props.contact.contact;
    const { dispatch } = this.props;
    dispatch({ type: 'contact/write', payload: { id, vals: { name } } });
  };

  del = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: 'contact/unlink', payload: { id } });
  };


  render() {
    const login = this.props.login;
    const {contacts, contact} = this.props.contact;

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
          login: {JSON.stringify(login)}
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


/*

        <ul>
          {contacts.map((contact, i) => (
            <li key={i}>{JSON.stringify(contact)}</li>
          ))}
        </ul>


*/
