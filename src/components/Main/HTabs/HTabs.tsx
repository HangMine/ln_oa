import React, { FC, useEffect, useState, useRef, useMemo } from 'react';
import { Tabs, Divider } from 'antd';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { setTab, delTab, delOtherTab, delRigthTab, delAllTab } from '@/redux/actions';
import { defaultTabs } from '@/redux/reducers';
import { history } from '@/router';
import { ContextMenu, ContextMenuItem } from '../../base/ContextMenu/ContextMenu';
import './HTabs.scss';
const { TabPane } = Tabs;

const HTabs: FC = () => {
    const dispatch = useDispatch();
    // 偏平菜单数据
    const flatRoutes: routes = useMappedState((state) => state.flatRoutes);
    const tabsData = useMappedState((state) => state.tabs);
    const tabs: routes = tabsData.list;
    const activeTab: string = tabsData.activeTab;
    const [tabDom, settabDom]: [any, any] = useState(null);

    // 跳转路由(activeTab或flatRoutes改变时（需要依赖flatRoutes，只触发一次）)
    // useEffect(() => {
    //     if (!flatRoutes.length) return;
    //     const activeTabItem = flatRoutes.find((route) => route.id === activeTab)!;
    //     const activePath = activeTabItem ? activeTabItem.path! : `/app/${defaultTabs[0].path}`;
    //     const currentPath = history.location.pathname;
    //     if (activePath !== currentPath) history.push(activePath);
    // }, [activeTab, flatRoutes]);

    // 删除
    const remove = (targetKey: string | React.MouseEvent<HTMLElement, MouseEvent>) => {
        dispatch(delTab(targetKey as string));
    };

    // 选中
    const onChange = (activeKey: string) => {
        const activeTab = flatRoutes.find((route) => route.id === activeKey)!;
        // dispatch(setTab(activeTab));
        history.push(activeTab.path!);
    };

    // 编辑（实际上只用到删除）
    const onEdit = (targetKey: string | React.MouseEvent<HTMLElement, MouseEvent>, action: 'add' | 'remove') => {
        if (action === 'add') {
            return;
        } else {
            remove(targetKey);
        }
    };
    const [menuEvent, setmenuEvent] = useState(null);
    // 右键菜单
    const showContextmenu = (e: any) => {
        e.preventDefault();
        settabDom(getTabDom(e.target));
        setmenuEvent(e.nativeEvent);
    };

    // 关闭其它
    const delOther = () => {
        const chooseTab = flatRoutes.find((route) => route.title === tabDom.textContent)!;
        dispatch(delOtherTab(chooseTab));
    };

    // 关闭右侧
    const delRight = () => {
        const chooseTab = flatRoutes.find((route) => route.title === tabDom.textContent)!;
        dispatch(delRigthTab(chooseTab));
    };

    // 关闭所有
    const delAll = () => {
        dispatch(delAllTab());
    };

    return (
        <div className="h-tabs" onContextMenu={showContextmenu}>
            <Tabs hideAdd onChange={onChange} activeKey={activeTab} type="editable-card" onEdit={onEdit}>
                {tabs.map((pane, i) => (
                    // 只展示标签页，不展示标签内容
                    <TabPane tab={pane.title} key={pane.id}></TabPane>
                ))}
            </Tabs>
            {/* 右键菜单 */}
            <ContextMenu event={menuEvent}>
                <ContextMenuItem onClick={delOther}>关闭其他标签页</ContextMenuItem>
                <ContextMenuItem onClick={delRight}>关闭右侧标签页</ContextMenuItem>
                <ContextMenuItem onClick={delAll}>关闭所有标签页</ContextMenuItem>
            </ContextMenu>
        </div>
    );
};

// 获取tab的DOM元素
const getTabDom = (dom: HTMLElement): any => {
    if (dom.nodeName === 'HTML') return;
    const isTabDom = dom.getAttribute('role') === 'tab';
    if (isTabDom) {
        return dom;
    } else {
        return getTabDom(dom.parentElement!);
    }
};

export default HTabs;
