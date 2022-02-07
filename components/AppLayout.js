import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, AreaChartOutlined, StockOutlined, UserSwitchOutlined, ApartmentOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// React.useLayoutEffect = React.useEffect;


const AppLayout = ({ children }) => {

    const router = useRouter();
    const selectedKeys = [router.pathname];

    console.log('selectedKeys', router.pathname);
      
    return (
        <Layout>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                style={{ height: '100vh' }}
                
                // onBreakpoint={broken => {
                //   console.log(broken);
                // }}
                // onCollapse={(collapsed, type) => {
                //   console.log(collapsed, type);
                // }}
            >
                <div className="logo" style={{ margin: '38px 10px 0' }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
                    defaultOpenKeys={[ 'customer', 'statistics' ]}
                >

                    <Menu.Item key="/warehousing" icon={<UploadOutlined />}>
                        <Link href="/warehousing">입출고</Link>
                    </Menu.Item>
                    <SubMenu key="customer" icon={<UserSwitchOutlined />} title="거래처">
                        <Menu.Item key="/customer" icon={<UserOutlined />}>
                            <Link href="/customer">거래처</Link>
                        </Menu.Item>
                        <Menu.Item key="/customerItem" icon={<ApartmentOutlined />}>
                            <Link href="/customerItem">거래처별 품목</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/item" icon={<VideoCameraOutlined />}>
                        <Link href="/item">품목</Link>
                    </Menu.Item>
                    <Menu.Item key="/storageFee" icon={<UserOutlined />}>
                        <Link href="/storageFee">보관료</Link>
                    </Menu.Item>
                    <SubMenu key="statistics" icon={<AreaChartOutlined />} title="통계">
                        <Menu.Item key="/customerItemTerm" icon={<StockOutlined />}>
                            <Link href="/customerItemTerm">거래처/품목별</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                {/* <Header className="site-layout-sub-header-background" style={{ padding: 0 }} /> */}
                <Content style={{ margin: '45px 5px 0' }}>
                    <div className="site-layout-background" style={{ minHeight: 360 }}>
                        {children}
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
            </Layout>
        </Layout>
      );
}

export default AppLayout;