import React, { FC, memo, forwardRef, useState, useEffect } from 'react';
import { Input, Button, Table } from 'antd';
import DotNumber from '@/components/DotNumber/DotNumber';
import moment from 'moment';
import { formatMap } from '@/assets/js/common';

type GamesProps = {
    value?: any[];
    onChange?: (value: any[]) => void;
    disabled?: boolean;
};

// 这里虽然没用到ref的转发，但必须加上，否则会警告
const Channels: FC<GamesProps> = forwardRef(({ value, onChange, disabled = false }, ref) => {
    const row = { channel: '' };

    const getValue = (value: any) => (Array.isArray(value) && value) || [row];

    const [tableData, settableData] = useState(getValue(value));
    useEffect(() => {
        // 必须判断是否相等，否则无限循环
        if (JSON.stringify(value) === JSON.stringify(tableData)) return;
        settableData(getValue(value));
    }, [value]);

    useEffect(() => {
        onChange!(tableData);
    }, [tableData]);

    const columns = [
        {
            title: '渠道',
            dataIndex: 'channel',
            render: (text: string, recode: obj, index: number) => (
                <Input
                    disabled={disabled}
                    placeholder="请输入渠道"
                    allowClear
                    value={tableData[index].channel}
                    onChange={(e) => rowChange('channel', e.target.value, index)}></Input>
            ),
        },

        {
            title: '操作',
            dataIndex: 'tool',
            width: 50,
            render: (text: any, recode: obj, index: number) => (
                <>
                    {index === tableData.length - 1 && (
                        <Button disabled={disabled} icon="plus" type="primary" onClick={addEditRow}></Button>
                    )}
                    {index !== tableData.length - 1 && (
                        <Button
                            disabled={disabled}
                            icon="minus"
                            type="danger"
                            onClick={() => delEditRow(index)}></Button>
                    )}
                </>
            ),
        },
    ];

    // 监听表单变化
    const rowChange = (key: 'channel', value: any, index: number) => {
        settableData((rows) => {
            rows[index][key] = value;
            return JSON.parse(JSON.stringify(rows));
        });
    };

    // 增加编辑表格行
    const addEditRow = () => {
        settableData([...tableData, row]);
    };

    // 删除编辑表格行
    const delEditRow = (index: number) => {
        const newTableData = tableData.filter((item, i) => i !== index);
        settableData(newTableData);
    };

    return (
        <Table
            showHeader={false}
            pagination={false}
            columns={columns}
            dataSource={tableData}
            rowKey={(record, i) => `${i}`}></Table>
    );
});

export default memo(Channels);
