import React, { FC, useState } from 'react';
import './TodoCache.scss';
import http from '@/assets/js/http';
import HightLight from '@/components/base/HightLight/HightLight';
import { Input, Button, Tag, Popconfirm, Radio } from 'antd';

const { TextArea } = Input;

const url = 'tool.todoCache';

const btns = [
    {
        key: 'getType',
        title: '获取key类型',
    },
    {
        key: 'unsetKey',
        title: '清除某个key',
        isConfirm: true,
    },
    {
        key: 'get',
        title: '获取某个string类型数据',
    },
    {
        key: 'set',
        title: '设置某个string类型数据',
        isConfirm: true,
    },
    {
        key: 'lrange',
        title: '获取list最近10条',
    },
    {
        key: 'llen',
        title: '获取list长度',
    },
    {
        key: 'countKey',
        title: '获取key的数量',
    },
    {
        key: 'push_list',
        title: '推进队列',
        isConfirm: true,
    },
    {
        key: 'set_new_ad_callback',
        title: '渠道或广告切至新版 旧版db(1) 谨慎！',
        isConfirm: true,
        type: 'danger',
    },
];

type propsType = {
    db: string;
};

const TodoCache: FC<propsType> = ({ db }) => {
    const [key, setkey] = useState('');
    const [value, setvalue] = useState('');
    const [res, setres] = useState({
        code: null,
        notice: '',
        data: '',
    });

    const action = (action: string) => {
        const params = {
            key,
            value,
            action,
            db,
        };
        http(url, params).then((res) => {
            setres({
                code: res.code,
                notice: res.notice,
                data: JSON.stringify(res.data),
            });
        });
    };

    return (
        <section className="todo-cache">
            <div className="filter">
                <span className="filter-input-wrap">
                    <span className="filter-input-name">键名: </span>
                    <Input
                        value={key}
                        className="filter-input"
                        allowClear
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            setkey(e.target.value);
                        }}></Input>
                </span>

                <span className="block">
                    <span className="filter-input-name">键值: </span>
                    <TextArea
                        value={value}
                        className="filter-textarea"
                        rows={8}
                        style={{ marginTop: '15px' }}
                        onChange={(e) => {
                            setvalue(e.target.value);
                        }}></TextArea>
                </span>

                {/* <span className="filter-input-wrap">
          <span className="filter-input-name">键值: </span><Input value={value} className="filter-input" allowClear onChange={(e) => { setvalue(e.target.value) }}></Input>
        </span> */}
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
