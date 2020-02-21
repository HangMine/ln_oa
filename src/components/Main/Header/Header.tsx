import React from 'react';
import { Icon, Avatar, Dropdown, Menu, Button } from 'antd';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { setMenuCollapse } from '@/redux/actions';
import { Link } from 'react-router-dom';
import { history } from '@/router';
import { cookie, cache } from '@/assets/js/common';
import http from '@/assets/js/http';
import './Header.scss';

const logout = () => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        history.push('/login');
    } else {
        http('pub.authOut').then((res) => {
            if (res.code == '0') {
                history.push('/login');
                res.data && http(res.data);
            }
        });
    }
};

const menu = (
    <Menu className="user-menu">
        <Menu.Item>
            <div onClick={logout}>
                <Icon type="logout" className="user-menu-icon" />
                退出登录
            </div>
        </Menu.Item>
    </Menu>
);

const MainHeader: React.FC = () => {
    const isMobile = useMappedState((state) => state.isMobile);
    const collapse = useMappedState((state) => state.collapse);
    const dispatch: dispatch = useDispatch();

    return (
        <div className="header">
            <Icon
                type={isMobile ? 'menu' : collapse ? 'menu-unfold' : 'menu-fold'}
                className="collapse-icon"
                onClick={() => dispatch(setMenuCollapse(!collapse))}
            />

            <Dropdown overlay={menu}>
                <span className="user">
                    <Avatar className="user-avatar" shape="square" size={24} src={require('@/assets/img/logo.png')} />
                    {decodeURIComponent(cookie.get('username') || '') || '未知用户'}
                </span>
            </Dropdown>

            <a
                className="operate-doc"
                target="_blank"
                href="http://cps.leniugame.com/upload/contract/%E5%90%88%E5%90%8C%E5%AE%A1%E6%89%B9%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97.docx">
                <Button type="link">操作指南</Button>
            </a>
        </div>
    );
};

export default MainHeader;
