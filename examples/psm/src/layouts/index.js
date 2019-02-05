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
              <Menu.Item key="12"><Link to="/BackCompany/User">个人信息</Link></Menu.Item>
            </SubMenu>

            <SubMenu
              key="subPlatformManagement"
              title={<span><Icon type="dashboard" /><span>平台管理</span></span>}
            >
              <Menu.Item key="22"><Link to="/BackPlatform/Companys">公司</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="subCompanyManagement"
              title={<span><Icon type="dashboard" /><span>公司管理</span></span>}
            >
              <Menu.Item key="31"><Link to="/BackPlatform/Company">我的公司</Link></Menu.Item>
              <Menu.Item key="32"><Link to="/BackCompany/DimDates">时间维度设置</Link></Menu.Item>
              <Menu.Item key="33"><Link to="/BackCompany/Users">用户</Link></Menu.Item>
              <Menu.Item key="34"><Link to="/BackCompany/Projects">项目</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="subProjectManagement"
              title={<span><Icon type="dashboard" /><span>项目管理</span></span>}
            >
              <Menu.Item key="41"><Link to="/BackProject/Works">工程节点</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="subApp"
              title={<span><Icon type="dashboard" /><span>App移动端</span></span>}
            >
              <Menu.Item key="51"><Link to="/BackProject/Worksheets">工单</Link></Menu.Item>
              <Menu.Item key="52"><Link to="/BackProject/Workfacts">报表</Link></Menu.Item>
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
