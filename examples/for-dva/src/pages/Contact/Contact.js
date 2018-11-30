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


@connect(({ model1 }) => ({ model1 }))
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
      type: 'model1/login',
      payload: { login: user, password, type: 'account' }
    }).then(res => {
      console.log('login: res:', this.props.model1 )

    })
  };

/*
  query = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/queryBySmallId', payload: { id } });
  };

  view = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/view', payload: { id } });
  };

  add = value => {
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/nameCreate', payload: { name: value } });
  };

  findOrCreate = value => {
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/findOrCreate', payload: { email: value } });
  };

  rename = value => {
    const name = value;
    const { id } = this.props[ActionModel];
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/rename', payload: { id, name } });
    //dispatch({ type: ActionModel + '/write', payload: { id, vals: { name } } });
  };

  del = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/unlink', payload: { id } });
  };
*/

  render() {
    const login = this.props.model1;

    return (
      <div>
        <Search
          placeholder="user, password"
          enterButton="Login"
          //size="large"
          onSearch={value => this.login(value)}
        />

        <div>
          login:
          {JSON.stringify(login)}
        </div>

      </div>
    );
  }
}
