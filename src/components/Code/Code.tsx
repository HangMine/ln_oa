import React, { FC } from 'react';
import { Input, Button, Tag, Popconfirm } from 'antd';
import HightLight from '@/components/base/HightLight/HightLight';
import './Code.scss';
type CodeProps = {
    res: res;
    height?: string;
};

const Code: FC<CodeProps> = ({ res: { code, data, msg, notice } }, height) => {
    const tip = notice || msg;
    return (
        <div className="code">
            {(code || code === 0) && <>{code == 0 ? <Tag color="green">{tip}</Tag> : <Tag color="red">{tip}</Tag>}</>}
            <HightLight content={data} style={{ marginTop: '10px', height: height || '150px' }}></HightLight>
        </div>
    );
};

export default Code;
