import React, { FC, useState } from 'react';
import HTable from '@/components/HTable/HTable';
import { Button } from 'antd';
import HModel from '@/components/HModel/HModel';
import useFilters from '@/components/HTable/useFilters';

// 接口
const url = 'base.access.table';

// 编辑接口
const editUrl = 'base.access.operate';

// 筛选框
const tableFilters = [
    {
        key: 'controller',
        title: '控制器',
        type: 'input',
    },
    {
        key: 'action',
        title: '方法',
        type: 'input',
    },
    {
        key: 'name',
        title: '名称',
        type: 'input',
    },
    {
        key: 'alias_name',
        title: '别名',
        type: 'input',
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
    },
];

const editFilters = [
    {
        key: 'name',
        title: '名称',
        type: 'input',
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'alias_name',
        title: '别名',
        type: 'input',
    },
    {
        key: 'controller',
        title: '控制器',
        type: 'input',
    },
    {
        key: 'action',
        title: '方法',
        type: 'input',
    },
    {
        key: 'type',
        title: '类型',
        type: 'select',
        options: [
            {
                id: '1',
                name: '菜单',
            },
            {
                id: '2',
                name: '按钮',
            },
        ],
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
    },
];

// 主函数
const User: FC = () => {
    // 筛选框
    const [filters] = useFilters(tableFilters);

    // 新增编辑数据
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
        });
    };

    // 编辑
    const edit = (row: obj) => {
        seteditData({
            ...editData,
            show: true,
            isEdit: true,
            row: row,
        });
    };

    // 按钮
    const btns = (
        <>
            <Button type="primary" icon="plus" onClick={add}>
                新增
            </Button>
        </>
    );

    // 自定义的列
    const columns = [
        {
            title: '操作',
            dataIndex: 'tool',
            buttons: [
                {
                    title: '编辑',
                    fn: edit,
                },
            ],
        },
    ];

    return (
        <section className="access">
            <HTable url={url} columns={columns} filters={filters} btns={btns}></HTable>
            {/* 新增编辑 */}
            <HModel filters={editFilters} url={url} commitUrl={editUrl} data={editData} setData={seteditData}></HModel>
        </section>
    );
};

export default User;
