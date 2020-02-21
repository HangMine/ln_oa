import React, { FC, useState } from 'react';
import http from '@/assets/js/http';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { fetchTable } from '@/redux/actions';
import HTable from '@/components/HTable/HTable';
import { Button, Modal, Popconfirm } from 'antd';
import HModel from '@/components/HModel/HModel';
import useFilters from '@/components/HTable/useFilters';
import Tool from '@/components/HTable/Tool';
// 接口
const url = 'base.role.table';

// 筛选框
const tableFilters = [
    {
        key: 'status',
        title: '状态',
        type: 'select',
        options: [
            {
                id: '1',
                name: '正常',
            },
            {
                id: '2',
                name: '禁用',
            },
        ],
    },
];

// 分配权限接口
const accessUrl = 'base.role.access';

// 分配权限表单
const accessFilters = [
    {
        key: 'role_id',
        title: '角色',
        type: 'select',
        optionsUrl: 'pub.role',
        rules: [{ required: true, message: '请埴写该字段' }],
        props: {
            disabled: true,
        },
    },
    {
        key: 'event_id',
        title: '权限',
        type: 'select',
        optionsUrl: 'pub.access',
        props: {
            mode: 'multiple',
            style: { width: '100%' },
        },
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'status',
        title: '是否启用',
        type: 'select',
        options: [
            {
                id: '1',
                name: '是',
            },
            {
                id: '2',
                name: '否',
            },
        ],
        initValue: '1',
        rules: [{ required: true, message: '请埴写该字段' }],
    },
];

// 新增角色接口
const editUrl = 'base.role.operate';

// 新增角色表单
const editFilters = [
    {
        key: 'name',
        title: '角色',
        type: 'input',
        rules: [{ required: true, message: '请埴写该字段' }],
    },
];

// 批量设置权限接口
const moreAccessUrl = 'base.role.moreAccess';

// 绑定用户接口
const bindUrl = 'base.role.bind';

// 绑定用户表单
const _bindFilters = [
    {
        key: 'name',
        title: '角色',
        props: {
            disabled: true,
        },
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'uid',
        title: '用户',
        type: 'select',
        optionsUrl: 'pub.user',
        props: {
            mode: 'multiple',
            style: { width: '300px' },
        },
        rules: [{ required: true, message: '请埴写该字段' }],
    },
];

// 主函数
const User: FC = () => {
    const isMobile = useMappedState((state) => state.isMobile);

    const dispatch = useDispatch();

    // 分配权限表单
    const [_accessFilters] = useFilters(accessFilters);

    // 批量设置权限表单
    const roleFilter = _accessFilters.find((filter) => filter.key === 'role_id');
    const accessFilter = _accessFilters.find((filter) => filter.key === 'event_id');
    const moreAccessFilters = [
        {
            key: 'role_id',
            title: '角色',
            type: 'select',
            options: roleFilter && roleFilter.options,
            props: {
                mode: 'multiple',
                style: { width: '100%' },
            },
            rules: [{ required: true, message: '请埴写该字段' }],
        },
        {
            key: 'event_id',
            title: '权限',
            type: 'select',
            options: accessFilter && accessFilter.options,
            props: {
                mode: 'multiple',
                style: { width: '100%' },
            },
            rules: [{ required: true, message: '请埴写该字段' }],
        },
        {
            key: 'status',
            title: '是否启用',
            type: 'select',
            options: [
                {
                    id: '1',
                    name: '是',
                },
                {
                    id: '2',
                    name: '否',
                },
            ],
            initValue: '1',
            rules: [{ required: true, message: '请埴写该字段' }],
        },
    ];

    // 绑定用户表单
    const [bindFilters] = useFilters(_bindFilters);

    // 分配权限数据
    const [accessData, setaccessData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 分配权限
    const access = (row: obj) => {
        setaccessData({
            ...accessData,
            show: true,
            isEdit: true,
            row: row,
        });
    };

    // 新增修改数据
    const [editData, seteditData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 新增
    const add = () => {
        seteditData({
            ...editData,
            show: true,
            isEdit: false,
            row: {},
            title: '新增',
        });
    };

    // 修改
    const edit = (row: obj) => {
        seteditData({
            ...editData,
            show: true,
            isEdit: true,
            row: row,
            title: '修改',
        });
    };

    // 批量设置权限数据
    const [moreAccessData, setmoreAccessData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 批量设置权限
    const moreAccess = () => {
        setmoreAccessData({
            ...moreAccessData,
            show: true,
            isEdit: false,
            row: {},
        });
    };

    // 设置角色状态
    const setStatus = (row: any) => {
        const params = {
            id: row.id,
            status: row.status == 1 ? 2 : 1,
        };
        http('base.role.operate', params).then((res) => {
            if (res.code == 0) {
                dispatch(fetchTable(url));
            }
        });
    };

    // 新增修改数据
    const [bindData, setbindData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 修改
    const bind = (row: obj) => {
        setbindData({
            ...bindData,
            show: true,
            isEdit: true,
            row: row,
        });
    };

    // 按钮
    const btns = (
        <>
            <Button type="primary" icon="plus" onClick={add}>
                新建
            </Button>
            <Button type="primary" icon="edit" onClick={moreAccess}>
                批量设置权限
            </Button>
        </>
    );

    // 自定义的列
    const columns = [
        {
            dataIndex: 'event_name',
            render: (text: any, record: obj, index: number) => {
                return <>{Array.isArray(text) && text.join()}</>;
            },
        },
        {
            title: '操作',
            dataIndex: 'tool',
            render: (text: any, record: obj, index: number) => {
                return getTool(record);
            },
        },
    ];

    // 获取操作列
    const getTool = (record: obj) => {
        const disStatus = record.status == 1 ? '禁用' : '恢复';
        return (
            <Tool>
                <Button type="link" onClick={() => edit(record)}>
                    修改
                </Button>
                <Button type="link" onClick={() => access(record)}>
                    分配权限
                </Button>
                <Popconfirm title={`确定${disStatus}该角色?`} onConfirm={() => setStatus(record)}>
                    <Button type="link">{disStatus}</Button>
                </Popconfirm>
                <Button type="link" onClick={() => bind(record)}>
                    用户绑定
                </Button>
            </Tool>
        );
    };

    return (
        <section className="role">
            <HTable url={url} columns={columns} filters={tableFilters} btns={btns}></HTable>
            {/* 新增、修改角色 */}
            <HModel filters={editFilters} url={url} commitUrl={editUrl} data={editData} setData={seteditData}></HModel>
            {/* 批量设置权限 */}
            <HModel
                title="批量设置权限"
                filters={moreAccessFilters}
                url={url}
                commitUrl={moreAccessUrl}
                data={moreAccessData}
                setData={setmoreAccessData}></HModel>
            {/* 分配权限 */}
            <HModel
                title="分配权限"
                filters={accessFilters}
                url={url}
                commitUrl={accessUrl}
                data={accessData}
                setData={setaccessData}></HModel>
            {/* 用户绑定 */}
            <HModel
                title="用户绑定"
                rowKey="role_id"
                filters={bindFilters}
                url={url}
                commitUrl={bindUrl}
                data={bindData}
                setData={setbindData}></HModel>
        </section>
    );
};

export default User;
