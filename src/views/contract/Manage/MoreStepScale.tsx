import React, { FC, memo, forwardRef, useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import StepScale, { row as stepScaleRow } from './StepScale';
import './MoreStepScale.scss';

type MoreStepScaleProps = {
    value?: rowsProp;
    onChange?: (value: rowsProp) => void;
    disabled?: boolean;
};

type rowsProp = {
    game_name: string;
    division: obj[];
}[];

const MoreStepScale: FC<MoreStepScaleProps> = forwardRef(({ value, onChange, disabled }, ref) => {
    // 需要放在里面，否则是同个对象
    const row = {
        game_name: '',
        division: [{ ...stepScaleRow }],
    };

    const [rows, setrows] = useState<rowsProp>((Array.isArray(value) && value) || [row]);

    useEffect(() => {
        // 必须判断是否相等，否则无限循环
        if (JSON.stringify(value) === JSON.stringify(rows)) return;
        setrows(value || [row]);
    }, [value]);

    useEffect(() => {
        onChange!(rows);
    }, [rows]);

    const handleChange = (key: 'game_name' | 'division', value: any, i: number) => {
        setrows((rows) => {
            rows[i][key] = value;
            return [...rows];
        });
    };

    // 增加编辑表格行
    const addEditRow = () => {
        setrows((rows) => [...rows, row]);
    };

    // 删除编辑表格行
    const delEditRow = (index: number) => {
        setrows((rows) => rows.filter((item, i) => i !== index));
    };

    return (
        <ul className="more-step-scale">
            {rows.map((row, i) => (
                <li key={i} className="more-step-row">
                    <div className="game-wrap">
                        <span>游戏项目：</span>
                        <Input
                            placeholder="请输入游戏项目"
                            value={row.game_name}
                            onChange={(e) => handleChange('game_name', e.target.value, i)}
                            className="game-input"
                            disabled={disabled}></Input>
                        <>
                            {i === rows.length - 1 && (
                                <Button disabled={disabled} icon="plus" type="primary" onClick={addEditRow}></Button>
                            )}
                            {i !== rows.length - 1 && (
                                <Button
                                    disabled={disabled}
                                    icon="minus"
                                    type="danger"
                                    onClick={() => delEditRow(i)}></Button>
                            )}
                        </>
                    </div>

                    <StepScale
                        value={row.division}
                        onChange={(value) => handleChange('division', value, i)}
                        disabled={disabled}></StepScale>
                </li>
            ))}
        </ul>
    );
});

export default memo(MoreStepScale);
