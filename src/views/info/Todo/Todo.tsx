import React, { FC } from 'react';
import HTable from '@/components/HTable/HTable';
import { to } from '@/assets/js/common';

import './Todo.scss';
// 接口
const url = 'info.todo.table';

// 筛选框
const tableFilters = [
    {
        key: 'order',
        title: '排序规则',
        type: 'select',
        options: [
            {
                id: 'm_time',
                name: '流程发起时间',
            },
            {
                id: 'o_time',
                name: '节点发起时间',
            },
        ],
    },
];

// 主函数
const Todo: FC = () => {
    const onRow = (recode: obj) => {
        return {
            onClick: (e: any) => {
                const url = '/app/contract/manage';
                to(url, { number: recode.number });
            },
        };
    };

    return (
        <section className="todo">
            <HTable url={url} filters={tableFilters} onRow={onRow}></HTable>
        </section>
    );
};

export default Todo;
