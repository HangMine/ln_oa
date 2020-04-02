import React, { FC, useState } from 'react';
import HModel from '@/components/HModel/HModel';
import Code from '@/components/Code/Code';
import { Form, Input, Button, Tag, Popconfirm, Radio } from 'antd';
type DecryptProps = {};

// 解密
const editUrl = 'tool.decrypt';

const editFilters = [
    {
        key: 'secret_key',
        title: '秘钥',
    },
    {
        key: 'cipher',
        title: '密文',
        type: 'textarea',
        props: {
            rows: 6,
        },
    },
];

// 重推队列
const rePushList = 'tool.rePushList';

const rePushListFilters = [
    {
        key: 'log_path',
        title: '日志路径',
        placeholder: '请输入日志路径 如：reg_log_queue/20200319.log',
    },
];

const Decrypt: FC<DecryptProps> = () => {
    const [res, setres] = useState({});
    // 解密数据
    const [editData, seteditData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
    });

    // 解密
    const decript = () => {
        seteditData({
            ...editData,
            show: true,
            isEdit: false,
            row: {},
            title: '解密',
        });
    };

    // 重推队列数据
    const [pushData, setpushData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
    });

    // 重推队列
    const rePush = () => {
        setpushData({
            ...pushData,
            show: true,
            isEdit: false,
            row: {},
            title: '重推队列',
        });
    };

    // 提交后回调
    const commited = (res: res) => {
        setres(res);
    };
    return (
        <div className="decrypt">
            <Button onClick={decript}>解密</Button>
            <Button onClick={rePush}>重推队列</Button>
            <Code res={res} height="300px"></Code>
            {/* 解密 */}
            <HModel
                noReset
                filters={editFilters}
                commitUrl={editUrl}
                onCommited={commited}
                data={editData}
                setData={seteditData}></HModel>
            {/* 重推队列 */}
            <HModel
                noReset
                filters={rePushListFilters}
                commitUrl={rePushList}
                onCommited={commited}
                data={pushData}
                setData={setpushData}></HModel>
        </div>
    );
};

export default Decrypt;
