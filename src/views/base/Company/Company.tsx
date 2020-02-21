import React, { FC, useState } from 'react';
import HTable from '@/components/HTable/HTable';
import { Button } from 'antd';
import HModel from '@/components/HModel/HModel';
import useFilters from '@/components/HTable/useFilters';

// 接口
const url = 'base.company.table';

// 编辑接口
const editUrl = 'base.company.operate';

// 筛选框
const tableFilters = [
    {
        key: 'keyword',
        title: '关键词',
        type: 'input',
    },
];

const editFilters = [
    {
        key: 'short_name',
        title: '主体简称',
        type: 'input',
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'name',
        title: '主体全称',
        type: 'input',
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'contract_code',
        title: '主体合同代码',
        type: 'input',
        rules: [{ required: true, message: '请埴写该字段' }],
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
                新建
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
        <section className="template">
            <HTable url={url} columns={columns} filters={filters} btns={btns}></HTable>
            {/* 新增编辑 */}
            <HModel filters={editFilters} url={url} commitUrl={editUrl} data={editData} setData={seteditData}></HModel>
        </section>
    );
};

export default User;
