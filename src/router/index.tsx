import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { lazy } from 'react';
import { cookie } from '@/assets/js/common';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { setTab } from '@/redux/actions';
import { defaultTabs } from '@/redux/reducers';

// 路由器（使用hash，broswer需要服务端配置）
const history = createHashHistory();

// 非菜单路由
const unShowRoutes = [
    {
        id: 'templateConfig',
        title: '模版配置',
        icon: 'home',
        noMenu: true,
        component: lazy(() => import('@/views/config/TemplateConfig/TemplateConfig')),
        path: '/app/config/templateConfig',
    },
];

const isDev = process.env.NODE_ENV === 'development';

// 路由高阶组件（权限验证）
const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const dispatch = useDispatch();
    const flatRoutes: routes = useMappedState((state) => state.flatRoutes);

    const redirect = (props: any) => {
        const isAuthenticated = isDev ? true : cookie.get('oa_auth'); //判断登录（开发环境绕过验证）
        // 首页判断是否授权
        if (rest.path === '/') {
            const defaultPath = defaultTabs[0].path;
            const redirect = isAuthenticated ? `/app/${defaultPath}` : '/login';
            return <Redirect to={{ pathname: redirect }} />;
        } else if (rest.path === '/login') {
            return <Component {...props} />;
        } else {
            return isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />;
        }
    };

    // 在这里监听路由变化，统一在这里设置tab
    useEffect(() => {
        // 如果不是菜单则不设置标签页
        if (rest.noMenu) return;
        // 设置标签页
        const tab = flatRoutes.find((route) => route.path === rest.path) || defaultTabs[0];
        tab && dispatch(setTab(tab));
    }, [rest]);

    return <Route {...rest} render={redirect} />;
};

export { history, unShowRoutes, PrivateRoute };
