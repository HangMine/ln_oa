// rest请求
import http from "@/assets/js/http"

// 设置菜单是否缩进状态
export const setMenuCollapse = (collapse: boolean) => {
  return { type: 'SET_MENU_COLLAPSE', collapse }
}

// 设置标签页数据和当前标签页
export const setTab = (tab: route) => {
  return { type: "SET_TAB", tab }
}

// 删除其他标签页
export const delOtherTab = (tab: route) => {
  return { type: "DEL_OTHER_TAB", tab }
}

// 删除右侧标签页
export const delRigthTab = (tab: route) => {
  return { type: "DEL_RIGHT_TAB", tab }
}

// 删除所有标签页
export const delAllTab = () => {
  return { type: "DEL_ALL_TAB" }
}

// 删除标签页数据
export const delTab = (tabId: string) => {
  return { type: "DEL_TAB", tabId }
}

// 请求表格数据
export const tableRequest = () => {
  return { type: 'TABLE_REQUEST' }
}

// 接收表格数据
export const tableReceive = () => {
  return { type: "TABLE_RECEIVE" }
}

// 请求表格数据
export const fetchTable = (url: string, params?: obj) => {
  return (dispatch: dispatch) => {
    dispatch(tableRequest());
    dispatch(setFilterParams(params || {}));
    return http(url, params).then(res => {
      dispatch(tableReceive());
      dispatch(setTable(res));
    });
  }
}

// 设置筛选框数据
export const setFilterParams = (params: obj) => {
  return { type: "SET_FILTER_PARAMS", params }
}

// 设置表格数据
export const setTable = (res: res) => {
  return { type: "SET_TABLE", res }
}

// 清空表格数据
export const clearTable = () => {
  return { type: 'CLEAR_TABLE' }
}

// 请求菜单数据
export const menuRequest = () => {
  return { type: 'MENU_REQUEST' }
}

// 接收菜单数据
export const menuReceive = () => {
  return { type: "MENU_RECEIVE" }
}

// 请求菜单数据
export const fetchMenu = () => {
  return (dispatch: dispatch) => {
    dispatch(menuRequest());
    return http('pub.menu').then(res => {
      dispatch(menuReceive());
      dispatch(setMenu(res));
      dispatch(setRoutes(res));
      dispatch(setFlatRoutes(res));
    });
  }
}

// 设置菜单路由数据
export const setMenu = (res: res) => {
  return { type: "SET_MENU", res }
}


// 设置所有路由数据
export const setRoutes = (res: res) => {
  return { type: "SET_ROUTES", res }
}

// 设置扁平路由数据
export const setFlatRoutes = (res: res) => {
  return { type: "SET_FLATROUTES", res }
}

