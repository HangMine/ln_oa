import React, { FC, memo, forwardRef, useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import DotNumber from '@/components/DotNumber/DotNumber';
import './MoreFixScale.scss';

export type StepScaleProps = {
    value?: obj[];
    onChange?: (value: obj[]) => void;
    disabled?: boolean;
};

// 这里虽然没用到ref的转发，但必须加上，否则会警告
const StepScale: FC<StepScaleProps> = forwardRef(({ value, onChange, disabled = false }, ref) => {
    const row = {
        game_name: '',
        scale: '',
    };
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
            title: '游戏项目',
            dataIndex: 'game_name',
            render: (text: string, recode: obj, index: number) => (
                <div className="game-wrap">
                    <span>游戏项目：</span>
                    <Input
                        placeholder="请输入游戏项目"
                        value={tableData[index].game_name}
                        onChange={(e) => rowChange('game_name', e.target.value, index)}
                        style={{ width: 460 }}></Input>
                </div>
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
                        style={{ width: 230 }}
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
        // const newTableData: obj[] = tableData.map((item, i) => {
        //     return i === index
        //         ? {
        //               ...item,
        //               [key]: value,
        //           }
        //         : item;
        // });
        // JSON.parse(JSON.stringify(rows))
        // settableData(newTableData);

        settableData((tableData) => {
            tableData[index][key] = value;
            return JSON.parse(JSON.stringify(tableData));
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
            bordered
            showHeader={false}
            pagination={false}
            columns={columns}
            dataSource={tableData}
            className="more-fix-scale"
            rowKey={(record, i) => `${i}`}></Table>
    );
});

export default memo(StepScale);
