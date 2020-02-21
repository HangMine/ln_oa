import React, { useState, useEffect } from 'react';
import { Menu, Icon, Layout, Spin } from 'antd';
import { Link } from 'react-router-dom';
import './Aside.scss';
import AsideHeader from './AsideHeader/AsideHeader';

import { useMappedState, useDispatch } from 'redux-react-hook';
import { setTab, setMenuCollapse } from '@/redux/actions';
import { history } from '@/router';

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;

// 获取菜单路径
const getMenuPath = (flatRoutes: routes, activeTab: string) => {
    let menuPath: string[] = [];
    const setMenuPath = (id: string) => {
        const item = flatRoutes.find((item) => item.id === id);
        if (!item) return;
        const isTop = item.pid === '26690';
        if (!isTop) {
            menuPath.push(item.id);
            setMenuPath(item.pid || '');
        }
    };
    const activeTabItem = flatRoutes.find((route) => route.id === activeTab) || { id: '' };
    const id = activeTabItem.id;
    setMenuPath(id);
    return menuPath.reverse().slice(0, -1);
};

const Aside: React.FC = () => {
    const isMobile = useMappedState((state) => state.isMobile);
    const dispatch = useDispatch();

    // 菜单数据
    const menuRoutes = useMappedState((state) => state.menu).data;
    const menuLoading = useMappedState((state) => state.menu).loading;

    // 偏平菜单数据
    const flatRoutes = useMappedState((state) => state.flatRoutes);
    const [menuPath, setmenuPath]: [string[], dispatch] = useState([]);

    // 设置菜单路径(activeTab或flatRoutes改变时（需要依赖flatRoutes，只触发一次）)
    const activeTab: string = useMappedState((state) => state.tabs).activeTab;
    useEffect(() => {
        if (!flatRoutes.length) return;
        currentSetMenuPath();
    }, [activeTab, flatRoutes]);

    // 缩进改变时，设置菜单缩进（通过cuurentCollpase设置是因为：如果不设置，在缩进菜单时选中的子级菜单会悬浮，不会缩进）
    const collapse = useMappedState((state) => state.collapse);
    const [cuurentCollpase, setcuurentCollpase] = useState(false);
    useEffect(() => {
        if (isMobile) {
            setcuurentCollpase(false);
        } else {
            setcuurentCollpase(collapse);
            currentSetMenuPath();
        }
    }, [collapse]);

    // 根据缩进设置菜单路径
    const currentSetMenuPath = () => {
        const menuPath = collapse ? [] : getMenuPath(flatRoutes, activeTab);
        setmenuPath(menuPath);
    };

    // 点击没有子级的菜单
    const menuSelect = (menu: route) => {
        isMobile && dispatch(setMenuCollapse(false));
        history.push(menu.path!);
        // dispatch(setTab(menu));
    };
    // 	点击有子级的菜单
    const openChange = (openKeys: string[]) => {
        setmenuPath(openKeys);
    };
    // 菜单渲染
    const menusDom = (menus: routes) => {
        return menus.map((menu) => {
            if (!menu.children) {
                // 没有子级
                return (
                    <Menu.Item key={menu.id} onClick={() => menuSelect(menu)}>
                        <Link to={menu.path!}>
                            {menu.icon ? <Icon type={menu.icon} /> : <span className="icon-empty"></span>}
                            <span>{menu.title}</span>
                        </Link>
                    </Menu.Item>
                );
            } else {
                // 有子级
                return (
                    <SubMenu
                        key={menu.id}
                        title={
                            <>
                                {menu.icon ? <Icon type={menu.icon} /> : <span className="icon-empty"></span>}
                                <span> {menu.title} </span>
                            </>
                        }>
                        {menusDom(menu.children)}
                    </SubMenu>
                );
            }
        });
    };

    // 加载中
    const Loading = (
        <>
            <Spin tip="菜单数据加载中..." size="large" className="menu-loading" />
        </>
    );

    return (
        <Sider width={256} collapsed={cuurentCollpase} className="aside">
            <Menu selectedKeys={[activeTab]} openKeys={menuPath} mode="inline" theme="dark" onOpenChange={openChange}>
                <AsideHeader collapse={collapse}></AsideHeader>
                {/* {menusDom(testMenu)} */}
                {menuLoading ? Loading : menusDom(menuRoutes)}
            </Menu>
        </Sider>
    );
};

export default Aside;
