import { combineReducers } from 'redux';
import { platform } from '@/assets/js/check';
import { cache } from '@/assets/js/common';
import { unShowRoutes } from '@/router';
import { lazy } from 'react';
import { firstUpperCase } from '@/assets/js/common';

interface action {
    type: string;
    [key: string]: any;
}

type tabs = {
    list: routes;
    activeTab: string;
};

type menu = {
    loading: boolean;
    data: routes;
};

type table = {
    loading: boolean;
    columns: any[];
    data: any[];
    button: any[];
    total: number | string;
};

interface initialProp {
    isMobile: boolean;
    collapse: boolean;
    tabs: tabs;
    menu: menu;
    routes: routes;
    flatRoutes: routes;
    table: table;
    filterParams: obj;
}

// 默认显示
const defaultTabs = [
    {
        id: '43438',
        path: 'info/todo',
        pid: '43384',
        title: '待办事项',
    },
];
const defaultTabId = defaultTabs[0].id;

const initialState: initialProp = {
    // 是否手机端
    isMobile: platform.isMobile,
    // 菜单是否缩进
    collapse: false,
    // 标签页数据(默认首页)
    tabs: cache.get('tabs') || { list: defaultTabs, activeTab: defaultTabId },
    // 菜单
    menu: {
        loading: false,
        data: [],
    },
    // 路由(菜单路由+非菜单路由)
    routes: [],
    // 扁平化路由（方便获取嵌套路由数据）
    flatRoutes: [],
    // 表格
    table: {
        loading: false,
        columns: [],
        data: [],
        button: [],
        total: 0,
    },
    // 筛选框数据
    filterParams: {},
};

const isMobile = (state = initialState.isMobile) => {
    return state;
};

const collapse = (state = initialState.collapse, action: action) => {
    switch (action.type) {
        case 'SET_MENU_COLLAPSE':
            return action.collapse;

        default:
            return state;
    }
};

const tabs = (state = initialState.tabs, action: action) => {
    const tabs = state.list;
    const activeTab = state.activeTab;
    let filterTabs;
    let resTabs;
    switch (action.type) {
        case 'SET_TAB':
            if (tabs.some((tab) => tab.id === action.tab.id)) {
                // 标签页已经存在
                filterTabs = tabs;
            } else {
                // 新增标签页
                filterTabs = tabs.filter((item) => item.id !== action.tab.id);
                filterTabs.push(action.tab);
            }

            resTabs = {
                list: filterTabs,
                activeTab: action.tab.id,
            };

            // 设置到缓存
            cache.set('tabs', resTabs);
            return resTabs;

        case 'DEL_TAB':
            filterTabs = tabs.filter((item) => item.id !== action.tabId);
            let newActiveTab;
            if (action.tabId === activeTab) {
                // 当删除选中选项卡时，跳到最后一个选项卡
                newActiveTab = (filterTabs.length && filterTabs[filterTabs.length - 1].id) || defaultTabId;
            } else if (!filterTabs.length) {
                // 当删除最后一个时，保留首页
                newActiveTab = defaultTabId;
            } else {
                // 正常情况不处理
                newActiveTab = activeTab;
            }
            resTabs = {
                list: (filterTabs.length && filterTabs) || defaultTabs,
                activeTab: newActiveTab,
            };

            // 设置到缓存
            cache.set('tabs', resTabs);
            return resTabs;

        case 'DEL_OTHER_TAB':
            // 关闭其它
            resTabs = {
                list: [action.tab],
                activeTab: action.tab.id,
            };
            // 设置到缓存
            cache.set('tabs', resTabs);
            return resTabs;

        case 'DEL_RIGHT_TAB':
            // 关闭右侧
            const tabIndex = tabs.findIndex((tab) => tab.id === action.tab.id);

            filterTabs = tabs.filter((item, i) => {
                return i <= tabIndex;
            });
            resTabs = {
                list: filterTabs,
                activeTab: action.tab.id,
            };
            // 设置到缓存
            cache.set('tabs', resTabs);
            return resTabs;

        case 'DEL_ALL_TAB':
            // 关闭所有
            resTabs = {
                list: defaultTabs,
                activeTab: defaultTabId,
            };
            // 设置到缓存
            cache.set('tabs', resTabs);
            return resTabs;

        default:
            return state;
    }
};

const menu = (state = initialState.menu, action: action) => {
    switch (action.type) {
        case 'MENU_REQUEST': {
            return {
                ...state,
                loading: true,
            };
        }
        case 'MENU_RECEIVE': {
            return {
                ...state,
                loading: false,
            };
        }
        case 'SET_MENU':
            const getComponentPath = (apiMenuPath: string) => {
                //切掉'/app'
                const pathArr = apiMenuPath.split('/').slice(2);
                const path = pathArr.length === 1 ? '' : `/${pathArr.slice(0, -1).join('/')}`;
                const componentName = pathArr.slice(-1)[0];
                const upcaseComponentName = firstUpperCase(componentName);
                return `${path}/${upcaseComponentName}/${upcaseComponentName}`;
            };

            const getMenus = (apiMenus: routes) => {
                return apiMenus.map((menu) => {
                    if (menu.path) {
                        //先修改路径，组件是动态加载，获取到的路径肯定是修改后的
                        menu.path = `/app/${menu.path}`;
                        menu.component = lazy(() => import(`@/views${getComponentPath(menu.path!)}`));
                    }
                    if (menu.children) menu.children = getMenus(menu.children);
                    return menu;
                });
            };

            const menuRoutes = getMenus(action.res.data || []);
            return { ...state, data: menuRoutes };

        default:
            return state;
    }
};

const routes = (state = initialState.routes, action: action) => {
    switch (action.type) {
        case 'SET_ROUTES':
            return [...action.res.data, ...unShowRoutes];
        default:
            return state;
    }
};

const flatRoutes = (state = initialState.flatRoutes, action: action) => {
    switch (action.type) {
        case 'SET_FLATROUTES':
            const allRoutes: routes = [];
            const flat = (_routes: routes) => {
                for (const route of _routes) {
                    allRoutes.push(route);
                    route.children && flat(route.children);
                }
            };
            flat([...action.res.data, ...unShowRoutes]);
            return allRoutes;

        default:
            return state;
    }
};

const table = (state = initialState.table, action: action) => {
    switch (action.type) {
        case 'TABLE_REQUEST': {
            return {
                ...state,
                loading: true,
            };
        }
        case 'TABLE_RECEIVE': {
            return {
                ...state,
                loading: false,
            };
        }
        case 'SET_TABLE':
            if (action.res.data.header) {
                type headerItem = {
                    id: string;
                    name: string;
                    [any: string]: any;
                };
                const getColumns = (headers: headerItem[]) => {
                    return headers.map(({ id, name, ...other }) => ({
                        title: name,
                        dataIndex: id,
                        ...other,
                    }));
                };
                return {
                    ...state,
                    columns: getColumns(action.res.data.header),
                    data: action.res.data.rows,
                    button: action.res.data.button || [],
                    total: +action.res.data.total || 0,
                };
            } else {
                return {
                    ...state,
                    columns: [],
                    data: [],
                    button: [],
                    total: 0,
                };
            }
        case 'CLEAR_TABLE': {
            return {
                loading: false,
                columns: [],
                data: [],
                button: [],
                total: 0,
            };
        }
        default:
            return state;
    }
};

const filterParams = (state = initialState.filterParams, action: action) => {
    switch (action.type) {
        case 'SET_FILTER_PARAMS':
            return action.params;
        default:
            return state;
    }
};

const app = combineReducers({
    isMobile,
    collapse,
    tabs,
    menu,
    routes,
    flatRoutes,
    table,
    filterParams,
});

export { defaultTabs, defaultTabId };
export default app;
