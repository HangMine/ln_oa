import React, { FC, useState } from 'react';
import http from '@/assets/js/http';
import { useDispatch } from 'redux-react-hook';
import { fetchTable } from '@/redux/actions';
import HTable from '@/components/HTable/HTable';
import { Button, Modal, Popconfirm } from 'antd';
import HModel from '@/components/HModel/HModel';
import useFilters from '@/components/HTable/useFilters';
import Tool from '@/components/HTable/Tool';
// 接口
const url = 'base.user.table';

// 编辑接口(设置角色)
const editUrl = 'base.user.setRole';

// 筛选框
const tableFilters = [
    {
        key: 'department_id',
        title: '部门',
        type: 'select',
        optionsUrl: 'pub.depart',
    },
    {
        key: 'role_id',
        title: '角色',
        type: 'select',
        optionsUrl: 'pub.role',
        props: {
            mode: 'multiple',
            style: { width: 300 },
        },
    },
    {
        key: 'uid',
        title: '用户',
        type: 'select',
        optionsUrl: 'pub.user',
    },
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

// 主函数
const User: FC = () => {
    const dispatch = useDispatch();

    // 筛选框
    const [filters] = useFilters(tableFilters);

    // 编辑表单
    const roleFilter = filters.find((filter) => filter.key === 'role_id');
    const editFilters = [
        {
            key: 'role_id',
            title: '角色',
            type: 'select',
            options: roleFilter && roleFilter.options,
            props: {
                mode: 'multiple',
                style: { width: 300 },
            },
            rules: [{ required: true, message: '请埴写该字段' }],
        },
    ];

    // 新增编辑数据
    const [editData, seteditData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 编辑
    const edit = (row: obj) => {
        seteditData({
            ...editData,
            show: true,
            isEdit: true,
            row: row,
        });
    };

    // 设置角色状态
    const setStatus = (row: any) => {
        const params = {
            id: row.id,
            status: row.status == 1 ? 2 : 1,
        };
        http('base.user.state', params).then((res) => {
            if (res.code == 0) {
                dispatch(fetchTable(url));
            }
        });
    };

    // 自定义的列
    const columns = [
        {
            dataIndex: 'role_name',
            render: (text: any, record: obj, index: number) => {
                return <>{(text && text.join()) || ''}</>;
            },
        },
        {
            title: '操作',
            dataIndex: 'tool',
            render: (text: any, record: obj, index: number) => {
                const disStatus = record.status == 1 ? '禁用' : '恢复';
                return (
                    <Tool>
                        <Button type="link" onClick={() => edit(record)}>
                            设置角色
                        </Button>
                        <Popconfirm title={`确定${disStatus}该用户?`} onConfirm={() => setStatus(record)}>
                            <Button type="link">{disStatus}</Button>
                        </Popconfirm>
                    </Tool>
                );
            },
        },
    ];

    return (
        <section className="user">
            <HTable url={url} columns={columns} filters={filters}></HTable>
            {/* 设置角色 */}
            <HModel
                title="设置角色"
                filters={editFilters}
                url={url}
                commitUrl={editUrl}
                data={editData}
                setData={seteditData}></HModel>
        </section>
    );
};

export default User;
