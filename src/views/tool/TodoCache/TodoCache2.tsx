import React, { FC, useState } from 'react';
import './TodoCache.scss';
import http from '@/assets/js/http';
import HightLight from '@/components/base/HightLight/HightLight';
import { Input, Button, Tag, Popconfirm } from 'antd';
import { copy } from '@/assets/js/common';

const { TextArea } = Input;

const url = 'tool.todoCache';

const btns = [
    {
        isConfirm: true,
        key: 'push_db_nine',
        title: '新版db(9) ad_channel_callback_queue_v',
    },
    {
        isConfirm: true,
        key: 'push_db_one',
        title: '旧版db(1) ad_channel_callback_queue 谨慎!',
        type: 'danger',
    },
    {
        key: 'get_device_by_data',
        title: '获取device_id',
    },
];

type propsType = {
    db: string;
};

const TodoCache: FC<propsType> = ({ db }) => {
    const [push_data, setpush_data] = useState('');
    const [res, setres] = useState({
        code: null,
        notice: '',
        data: '',
    });

    const action = (action: string) => {
        const params = {
            push_data,
            action,
            db,
        };
        http(url, params).then((res) => {
            const data = JSON.stringify(res.data);
            setres({
                code: res.code,
                notice: res.notice,
                data,
            });
            if (action === 'get_device_by_data') {
                copy(res.data.toString());
            }
        });
    };

    const resetFilter = () => {
        setpush_data('');
        setres({
            code: null,
            notice: '',
            data: '',
        });
    };

    return (
        <section className="todo-cache">
            <div className="filter">
                <span className="filter-input-wrap">
                    <span className="filter-input-name">推送回调队列: </span>
                    <TextArea
                        value={push_data}
                        className="filter-textarea"
                        rows={8}
                        style={{ marginTop: '15px' }}
                        onChange={(e) => {
                            setpush_data(e.target.value);
                        }}></TextArea>
                </span>
            </div>
            <div className="btn-group">
                {btns.map((btn) => {
                    return btn.isConfirm ? (
                        <Popconfirm key={btn.key} title="确定执行该操作?" onConfirm={() => action(btn.key)}>
                            <Button type={btn.type || ('primary' as any)}>{btn.title}</Button>
                        </Popconfirm>
                    ) : (
                        <Button key={btn.key} type={btn.type || ('primary' as any)} onClick={() => action(btn.key)}>
                            {btn.title}
                        </Button>
                    );
                })}
            </div>
            <div className="content">
                {(res.code || res.code === 0) && (
                    <>{res.code == '0' ? <Tag color="green">{res.notice}</Tag> : <Tag color="red">{res.notice}</Tag>}</>
                )}
                <HightLight content={res.data} style={{ marginTop: '10px', height: '150px' }}></HightLight>
            </div>
        </section>
    );
};

export default TodoCache;
