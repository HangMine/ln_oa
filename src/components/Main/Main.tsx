import React, { Suspense } from 'react';
import { Layout, Card, Spin } from 'antd';
import { Switch } from 'react-router-dom';
import MainHeader from '@/components/Main/Header/Header';
import './Main.scss';
import HTabs from '@/components/Main/HTabs/HTabs';
import { PrivateRoute } from '@/router';
import { useMappedState } from 'redux-react-hook';

const { Content, Header } = Layout;

const Main: React.FC = () => {
    // 偏平菜单数据
    const flatRoutes: routes = useMappedState((state) => state.flatRoutes);
    const hasPathRoutes = flatRoutes.filter((route) => route.path);

    const loading = (
        <Card style={{ textAlign: 'center', paddingTop: '10px' }}>
            <Spin></Spin>
        </Card>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="main-header">
                <MainHeader></MainHeader>
            </Header>

            <Content className="main-content">
                <HTabs></HTabs>
                <Card className="main-card">
                    <Suspense fallback={loading}>
                        <Switch>
                            {hasPathRoutes.map((route) => (
                                <PrivateRoute
                                    path={route.path}
                                    key={route.id}
                                    component={route.component}
                                    noMenu={route.noMenu}
                                />
                            ))}
                        </Switch>
                    </Suspense>
                </Card>
            </Content>
        </Layout>
    );
};

export default Main;
