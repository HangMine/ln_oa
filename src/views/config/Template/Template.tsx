import React, { FC, useState } from 'react';
import HTable from '@/components/HTable/HTable';
import HModel from '@/components/HModel/HModel';
import { to } from '@/assets/js/common';
import { Button, Modal } from 'antd';
// 表格接口
const url = 'config.template.index';

// 新增编辑接口
const editUrl = 'config.template.operate';

// 筛选框
const filters = [
    {
        key: 'name',
        title: '模板名称',
        type: 'input',
    },
    {
        key: 'category',
        title: '类别',
        type: 'select',
        options: [
            {
                key: '1',
                title: '合同模板',
            },
        ],
    },
];

// 编辑表单
const editFilters = [
    {
        key: 'name',
        title: '模板名称',
        type: 'input',
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'category',
        title: '类别',
        type: 'select',
        options: [
            {
                key: '1',
                title: '合同模板',
            },
        ],
        rules: [{ required: true, message: '请埴写该字段' }],
    },
    {
        key: 'describe',
        title: '描述',
        type: 'textarea',
    },
];

// 主函数
const Template: FC = () => {
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

    // 配置
    const config = (row: obj) => {
        to('/app/config/templateConfig', { template_id: row.id });
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
            dataIndex: 'describe',
        },
        {
            title: '操作',
            dataIndex: 'tool',
            buttons: [
                {
                    title: '配置',
                    fn: config,
                },
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
            <HModel
                cols={2}
                filters={editFilters}
                url={url}
                commitUrl={editUrl}
                data={editData}
                setData={seteditData}></HModel>
        </section>
    );
};

export default Template;
