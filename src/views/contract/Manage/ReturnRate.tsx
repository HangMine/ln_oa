import React, { FC, memo, forwardRef, useState, useEffect } from 'react';
import { Input, DatePicker, Button, Table } from 'antd';
import DotNumber from '@/components/DotNumber/DotNumber';
import moment from 'moment';
import { formatMap } from '@/assets/js/common';

type ReturnRateProps = {
    value?: obj[];
    onChange?: (value: obj[]) => void;
    disabled?: boolean;
};
// 这里虽然没用到ref的转发，但必须加上，否则会警告
const ReturnRate: FC<ReturnRateProps> = forwardRef(({ value, onChange, disabled = false }, ref) => {
    const row = {
        startTime: moment(new Date()),
        endTime: moment(new Date()),
        rate: '',
    };

    const [tableData, settableData] = useState((Array.isArray(value) && allStr2time(value)) || [row]);
    useEffect(() => {
        // 必须判断是否相等，否则无限循环
        if (JSON.stringify(value) === JSON.stringify(allTime2str(tableData))) return;
        settableData((Array.isArray(value) && allStr2time(value)) || [row]);
    }, [value]);

    useEffect(() => {
        onChange!(allTime2str(tableData));
    }, [tableData]);

    const columns = [
        {
            title: '开始日期',
            dataIndex: 'startTime',
            render: (text: string, recode: obj, index: number) => (
                <DatePicker
                    disabled={disabled}
                    style={{ marginRight: 10 }}
                    placeholder="请选择开始日期"
                    allowClear
                    value={tableData[index].startTime}
                    onChange={(value) => rowChange('startTime', value, index)}
                />
            ),
        },
        {
            title: '结束日期',
            dataIndex: 'endTime',
            render: (text: string, recode: obj, index: number) => (
                <DatePicker
                    disabled={disabled}
                    style={{ marginRight: 10 }}
                    placeholder="请选择结束日期"
                    allowClear
                    value={tableData[index].endTime}
                    onChange={(value) => rowChange('endTime', value, index)}
                />
            ),
        },
        {
            title: '返点率',
            dataIndex: 'scale',
            render: (text: string, recode: obj, index: number) => (
                <DotNumber>
                    <Input
                        disabled={disabled}
                        style={{ width: 180 }}
                        allowClear
                        placeholder="请输入返点率"
                        addonAfter="%"
                        value={tableData[index].rate}
                        onChange={(e) => rowChange('rate', e.target.value, index)}></Input>
                </DotNumber>
            ),
        },
        {
            title: '操作',
            dataIndex: 'tool',
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
    const rowChange = (key: string, value: any, index: number) => {
        const newTableData: obj[] = tableData.map((item, i) => {
            return i === index
                ? {
                      ...item,
                      [key]: value,
                  }
                : item;
        });
        settableData(newTableData);
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

// 时间转成字符串
const time2str = (value: any) => {
    return value instanceof moment ? (value as any).format(formatMap.date) : value;
};

// 整个数组时间转成字符串
const allTime2str = (tableData: obj[]) => {
    return tableData.map((row) => {
        let newRow: obj = {};
        for (const [key, value] of Object.entries(row)) {
            newRow[key] = time2str(value);
        }
        return newRow;
    });
};

// 字符串转成时间
const str2time = (value: string) => {
    return moment(value);
};

// 整个数组字符串转成时间
const allStr2time = (tableData: obj[]) => {
    const toTimeKeys = ['startTime', 'endTime'];
    return tableData.map((row) => {
        let newRow: obj = {};
        for (const [key, value] of Object.entries(row)) {
            newRow[key] = toTimeKeys.includes(key) ? str2time(value) : value;
        }
        return newRow;
    });
};

export default memo(ReturnRate);
