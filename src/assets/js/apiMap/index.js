// 通用接口
const pub = {
    // 登录
    login: '/oa/login/login_check',
    // 授权
    auth: '/oa/Login/getLoginUrl',
    // 退出登录
    authOut: '/oa/login/unSign',
    // 菜单
    menu: '/oa/base/getmenulist',
    // 用户
    user: '/oa/base/getUserList',
    // 角色
    role: '/oa/base/getRoleList',
    // 部门
    depart: '/oa/base/getDepartmentList',
    // 权限
    access: '/oa/base/getEventList',
    // 模版
    tempalte: '/oa/contract/getTemplate',
    // 合同节点
    event: '/oa/contract/getEvent',
    // 流程事件
    flowEvent: '/oa/event/getFlowEvent',
    // 自定义表头
    tableHeader: {
        tags: '/oa/base/getTableColsList',
        cols: '/oa/TableHeader/getHeaderList',
        commit: '/oa/TableHeader/EditCols',
    },
    // 主体
    company: '/oa/company/getCompany',
    // 打包下载
    moreDown: '/oa/contract/packDownload',
};

// 信息中心
const info = {
    // 待办列表
    todo: {
        // 表格
        table: '/oa/Untreated/index',
    },
};

// 通用配置
const config = {
    // 模版相关
    template: {
        // 表格
        index: '/oa/template/index',
        // 编辑
        operate: '/oa/template/operate',
    },
    // 模版相关参数配置（子页面）
    templateConfig: {
        index: '/oa/template/paramsList',
        operate: '/oa/template/setParams',
        get: '/oa/template/getParams',
    },
    // 下拉框管理
    select: {
        // 表格
        table: '/oa/droplist/index',
        // 新增编辑
        operate: '/oa/droplist/operate',
    },
};

// 基础管理
const base = {
    // 用户管理
    user: {
        // 表格
        table: '/oa/user/index',
        // 账号禁用与恢复
        state: '/oa/user/UserState',
        // 设置角色
        setRole: '/oa/user/setUserRoles',
    },
    // 角色管理
    role: {
        // 表格
        table: '/oa/role/index',
        // 新增、修改、禁用
        operate: '/oa/role/operate',
        // 分配权限
        access: '/oa/role/setRoleEvents',
        // 批量设置权限
        moreAccess: '/oa/role/addRoleEvents',
        // 用户绑定
        bind: '/oa/role/BindUserByRole',
    },
    // 权限管理
    access: {
        // 表格
        table: '/oa/event/index',
        // 编辑
        operate: '/oa/event/operate',
    },
    // 主体管理
    company: {
        // 表格
        table: '/oa/company/index',
        // 编辑
        operate: '/oa/company/operate',
    },
};

// 合同中心
const contract = {
    // 合同管理
    manage: {
        table: '/oa/contract/index',
        add: '/oa/contract/contractStart',
        operate: '/oa/contract/operate',
        upload: '/oa/contract/upload',
        // 补充协议
        supply: '/oa/contract/supplement',
        // 获取流信息
        info: '/oa/contract/info',
        // 提交流
        action: '/oa/contract/action',
        // 美术合同乙方列表
        artCompanys: '/oa/contract/getArtCompanyList',
        // 表单缓存
        formsave: '/oa/contract/RecordForm',
        // 复制审批单
        formCopy: '/oa/contract/copy',
        // 预览文档
        preview: '/oa/contract/preview',
        // 获取审批单数据
        checkFormData: '/oa/contract/getApprovalForm',
        // 批量操作
        moreHandle: '/oa/contract/batchOperate',
        // 批量下载
        moreDown: '/oa/contract/bachDownload',
        // 全局节点
        step: '/oa/contract/getStepName',
        // 续签
        renewal: '/oa/contract/renewal',
        // 修改合同编号
        number: '/oa/contract/alterNumber',
    },
    // 基础信息
    base: {
        table: '/oa/ContractBase/index',
        operate: '/oa/ContractBase/operate',
        // 搜索键列表
        keys: '/oa/ContractBase/getConlumns',
    },
    // 法务合同台账
    legal: {
        table: '/oa/LegalInfo/index',
        operate: '/oa/LegalInfo/operate',
        // 所有下拉列表
        options: '/oa/LegalInfo/getLegalDrop',
        // 搜索键列表
        keys: '/oa/LegalInfo/getConlumns',
    },
};

// 流程管理
const flow = {
    // 流程列表
    index: {
        table: '/oa/approvalFlow/index',
        add: '/oa/approvalFlow/add',
    },
};

// 工具
const tool = {
    // redis小工具
    todoCache: '/oa/todoCache/index',
    // 解密小工具
    decrypt: '/oa/tool/decrypt',
    // 重推队列
    rePushList: '/oa/tool/rePushList',
};

export default { pub, info, config, base, contract, flow, tool };
