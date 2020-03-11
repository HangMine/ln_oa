import React, { useState, useEffect } from 'react';
import { Input, Icon, Button, Checkbox, Form, message } from 'antd';
import { history } from '@/router';
import { cache, cookie } from '@/assets/js/common';
import http from '@/assets/js/http';
import { useDispatch } from 'redux-react-hook';
import { setTab } from '@/redux/actions';
import { defaultTabs } from '@/redux/reducers';
import './Login.scss';

// const isDev = process.env.NODE_ENV === 'development';
// const isAuthenticated = isDev ? true : cookie.get('oa_auth'); //判断授权（开发环境绕过验证）

// // 已经授权
// if (isAuthenticated) {
//     // 设置默认页
//     const layoutPath = '/app';
//     history.push(layoutPath);
// }

const Login: React.FC<any> = ({ form }) => {
    const dispatch = useDispatch();
    const [rememberUser, setrememberUser] = useState(false);
    const { getFieldDecorator, validateFields, setFieldsValue } = form;

    const login = () => {
        validateFields((err: any, values: any) => {
            if (err) {
                return;
            }

            http.post('pub.login', values).then((res) => {
                if (res.code !== 0) {
                    return;
                }
                history.push('/');
                if (rememberUser) {
                    cache.set('oa_user', values.username);
                } else {
                    cache.del('oa_user');
                }
            });
        });
    };

    const auth = () => {
        // 设置默认页
        dispatch(setTab(defaultTabs[0]));
        // 跳转
        http('pub.auth').then((res) => {
            window.open(res.data, '_self');
        });
    };

    useEffect(() => {
        // 删除缓存的菜单
        cache.del('tabs');
        // 是否需要设置用户名
        const rememberUser = cache.get('oa_user');
        if (rememberUser) {
            setFieldsValue({ username: rememberUser });
        }
    }, []);

    return (
        <div className="login">
            <div className="login-main">
                <div className="login-header">
                    <img className="login-logo" src={require('@/assets/img/logo.png')} alt="logo" />
                    <h2 className="login-title">合同线上审批系统</h2>
                </div>

                <Form className="login-body">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(
                            <Input
                                className="login-input"
                                placeholder="用户名"
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                autoComplete="new-password"
                                allowClear
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input.Password
                                className="login-input"
                                placeholder="密码"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                autoComplete="new-password"
                                allowClear
                            />
                        )}
                    </Form.Item>
                    <Checkbox className="auto-login" onChange={(e) => setrememberUser(e.target.checked)}>
                        记住账号
                    </Checkbox>
                    <Button className="login-btn" type="primary" block onClick={login}>
                        登录
                    </Button>
                    <Button className="login-btn" type="primary" block onClick={auth}>
                        授权
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Form.create()(Login);
