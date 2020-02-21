import React, { FC } from 'react';
import HTable from '@/components/HTable/HTable';
import { to } from '@/assets/js/common';

import './Todo.scss';
// 接口
const url = 'info.todo.table';

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
            <HTable url={url} onRow={onRow}></HTable>
        </section>
    );
};

export default Todo;
