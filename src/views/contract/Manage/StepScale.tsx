import React, { FC, memo, forwardRef, useState, useEffect } from 'react';
import { Table, Button, Input, Select } from 'antd';
import DotNumber from '@/components/DotNumber/DotNumber';

const { Option } = Select;

type StepScaleProps = {
    value?: obj[];
    onChange?: (value: obj[]) => void;
    disabled?: boolean;
};

export const row = {
    start_interval: '',
    than1: '',
    text: '流水',
    than2: '',
    end_interval: '',
    scale: '',
};

// 这里虽然没用到ref的转发，但必须加上，否则会警告
const StepScale: FC<StepScaleProps> = forwardRef(({ value, onChange, disabled = false }, ref) => {
    const compareList = [
        {
            key: '>',
            title: '>',
        },
        {
            key: '<',
            title: '<',
        },
        {
            key: '>=',
            title: '>=',
        },
        {
            key: '<=',
            title: '<=',
        },
    ];

    const [tableData, settableData] = useState((Array.isArray(value) && value) || [row]);
    useEffect(() => {
        // 必须判断是否相等，否则无限循环
        if (JSON.stringify(value) === JSON.stringify(tableData)) return;
        settableData((Array.isArray(value) && value) || [row]);
    }, [value]);

    useEffect(() => {
        onChange!(tableData);
    }, [tableData]);

    const columns = [
        {
            title: '金额',
            dataIndex: 'start_interval',
            render: (text: string, recode: obj, index: number) => (
                <DotNumber>
                    <Input
                        disabled={disabled}
                        allowClear
                        style={{ width: 150 }}
                        placeholder="请输入金额"
                        value={tableData[index].start_interval}
                        onChange={(e) => rowChange('start_interval', e.target.value, index)}></Input>
                </DotNumber>
            ),
        },
        {
            title: '',
            dataIndex: 'than1',
            render: (text: string, recode: obj, index: number) => (
                <Select
                    disabled={disabled}
                    allowClear
                    value={tableData[index].than1}
                    style={{ width: 70 }}
                    onChange={(value: string) => rowChange('than1', value, index)}>
                    {compareList.map((option) => (
                        <Option key={option.key} value={option.key} title={option.title}>
                            {option.title}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: '流水',
            dataIndex: 'text',
            width: 100,
            // render: (text: string, recode: obj, index: number) => (
            //     <span>流水</span>
            // ),
        },
        {
            title: '',
            dataIndex: 'than2',
            render: (text: string, recode: obj, index: number) => (
                <Select
                    disabled={disabled}
                    allowClear
                    value={tableData[index].than2}
                    style={{ width: 70 }}
                    onChange={(value: string) => rowChange('than2', value, index)}>
                    {compareList.map((option) => (
                        <Option key={option.key} value={option.key} title={option.title}>
                            {option.title}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: '金额',
            dataIndex: 'end_interval',
            render: (text: string, recode: obj, index: number) => (
                <DotNumber>
                    <Input
                        disabled={disabled}
                        allowClear
                        style={{ width: 150 }}
                        placeholder="请输入金额"
                        value={tableData[index].end_interval}
                        onChange={(e) => rowChange('end_interval', e.target.value, index)}></Input>
                </DotNumber>
            ),
        },
        {
            title: '分成比例',
            dataIndex: 'scale',
            render: (text: string, recode: obj, index: number) => (
                <DotNumber>
                    <Input
                        disabled={disabled}
                        allowClear
                        style={{ width: 130 }}
                        addonAfter="%"
                        value={tableData[index].scale}
                        onChange={(e) => rowChange('scale', e.target.value, index)}></Input>
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

    // 监听下拉框变化
    const rowChange = (key: string, value: string, index: number) => {
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
            bordered
            showHeader={false}
            pagination={false}
            columns={columns}
            dataSource={tableData}
            className="step-scale"
            rowKey={(record, i) => `${i}`}></Table>
    );
});

export default memo(StepScale);
