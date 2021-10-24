import React, { useState } from 'react';

import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

React.useLayoutEffect = React.useEffect;


const AppLayout = ({ children }) => {    
      
    return (
        <Layout>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                // onBreakpoint={broken => {
                //   console.log(broken);
                // }}
                // onCollapse={(collapsed, type) => {
                //   console.log(collapsed, type);
                // }}
            >
                <div className="logo" style={{ margin: '38px 10px 0' }} />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        고객
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        입출고
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        품목
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}>
                        단가
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                {/* <Header className="site-layout-sub-header-background" style={{ padding: 0 }} /> */}
                <Content style={{ margin: '45px 5px 0' }}>
                    <div className="site-layout-background" style={{ minHeight: 360 }}>
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
      );
}

export default AppLayout;