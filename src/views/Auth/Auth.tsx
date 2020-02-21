import React, { FC, useEffect } from 'react';
import http from '@/assets/js/http';
import { Button } from 'antd';
import { history } from '@/router';
import { cookie, cache } from '@/assets/js/common';
import { useDispatch } from 'redux-react-hook';
import { setTab } from '@/redux/actions';
import { defaultTabs } from '@/redux/reducers';
import './Auth.scss';

const isDev = process.env.NODE_ENV === 'development';
const isAuthenticated = isDev ? true : cookie.get('oa_auth'); //判断授权（开发环境绕过验证）

// 已经授权
if (isAuthenticated) {
    const layoutPath = '/app';
    history.push(layoutPath);
}

const Auth: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 删除缓存的菜单
        cache.del('tabs');
    }, []);

    const auth = () => {
        // 设置默认页
        dispatch(setTab(defaultTabs[0]));
        // 跳转
        http('pub.auth').then((res) => {
            window.open(res.data, '_self');
        });
    };

    return (
        <section className="auth">
            <div className="auth-main">
                <div className="auth-header">
                    <img className="auth-logo" src={require('@/assets/img/logo.png')} alt="logo" />
                    <h2 className="auth-title">合同线上审批系统</h2>
                </div>

                <div className="auth-body">
                    <Button type="primary" block onClick={auth}>
                        点击授权
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Auth;
