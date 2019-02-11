
import { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Link from 'umi/link';


// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;

class BasicLayout extends Component {
  render() {
    return (

        <Layout>
        <Sider width={256} style={{ minHeight: '100vh', color: 'white' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <SubMenu
              key="subMe"
              title={<span><Icon type="dashboard" /><span>账号</span></span>}
            >
              <Menu.Item key="11"><Link to="/Login/Login">登录</Link></Menu.Item>
              <Menu.Item key="12"><Link to="/Login/User">个人信息</Link></Menu.Item>
            </SubMenu>

            <SubMenu
              key="Contact"
              title={<span><Icon type="dashboard" /><span>联系人</span></span>}
            >
              <Menu.Item key="21"><Link to="/Contacts/Contacts">联系人</Link></Menu.Item>
            </SubMenu>


            <SubMenu
              key="subDashboard"
              title={<span><Icon type="dashboard" /><span>图表</span></span>}
            >
              <Menu.Item key="61"><Link to="/Dashboard/Dashboards1">ChartCard</Link></Menu.Item>
              <Menu.Item key="62"><Link to="/Dashboard/Dashboards2">ChartDemo</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout >
          <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>Header</Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>



    )
  }
}

export default BasicLayout;



/*
import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to umi!</h1>
      { props.children }
    </div>
  );
}

export default BasicLayout;

*/
