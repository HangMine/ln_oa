import React, { FC, useState, useEffect } from 'react';
import HTable from '@/components/HTable/HTable';
import { Button } from 'antd';
import HModel from '@/components/HModel/HModel';
import useFilters from '@/components/HTable/useFilters';
import StepScale from '@/views/contract/Manage/StepScale';
import ReturnRate from '@/views/contract/Manage/ReturnRate';

import MoreStepScale from '@/views/contract/Manage/MoreStepScale';
import MoreFixScale from '@/views/contract/Manage/MoreFixScale';
import Games from '@/views/contract/Manage/Games';
import Channels from '@/views/contract/Manage/Channels';
import './Base.scss';
// 接口
const url = 'contract.base.table';

// 编辑接口
const editUrl = 'contract.base.operate';

// 筛选框
const tableFilters = [
    {
        key: 'key',
        title: '搜索键',
        type: 'select',
        optionsUrl: 'contract.base.keys',
    },
    {
        key: 'keyword',
        title: '搜索值',
        type: 'input',
    },
];

// 收入筛选框
const incomeFilters = [
    {
        key: 'step_name',
        title: '合同进度',
        type: 'input',
    },
    {
        key: 'company',
        title: '签约主体',
        type: 'input',
    },
    {
        key: 'partners',
        title: '合作方',
        type: 'input',
    },
    {
        key: 'channel',
        title: '渠道',
        type: 'input',
    },
    {
        key: 'game_name',
        title: '游戏名称',
        type: 'input',
    },
    {
        key: 'game_name2',
        title: '游戏名称2',
        type: 'input',
    },

    {
        key: 'operate_date',
        title: '操作时间',
        type: 'input',
    },
    {
        key: 'docking_date',
        title: '开始对接时间',
        type: 'input',
    },

    {
        key: 'coop_type',
        title: '合作类型',
        type: 'input',
    },
    {
        key: 'business_mode',
        title: '业务模式',
        type: 'input',
    },
    {
        key: 'device_type',
        title: '系统',
        type: 'input',
    },
    {
        key: 'nature',
        title: '授权区域',
        type: 'input',
        // options: [
        //     {
        //         id: '是',
        //         name: '是',
        //     },
        //     {
        //         id: '否',
        //         name: '否',
        //     },
        // ],
    },
    {
        key: 'start_date',
        title: '合同起始日期',
        type: 'input',
    },
    {
        key: 'end_date',
        title: '合同终止日期',
        type: 'input',
    },
    {
        key: 'auto_renewal',
        title: '是否自动续期',
        type: 'input',
    },
    {
        key: 'stop_date',
        title: '续期后终止日期',
        type: 'input',
    },
    {
        key: 'is_online',
        title: '游戏是否在线',
        type: 'input',
    },
    {
        key: 'special_division',
        title: '特殊分成条款',
        type: 'input',
    },
    {
        key: 'ensure',
        title: '保量条款',
        type: 'input',
    },
    {
        key: 'division',
        title: '我方分成比例',
        type: 'input',
    },
    {
        key: 'channel_cost_rate',
        title: '我方渠道费率',
        type: 'input',
    },
    {
        key: 'tax_rate',
        title: '税率',
        type: 'input',
    },
    {
        key: 'rec_cycle',
        title: '对账周期',
        type: 'input',
    },
    {
        key: 'rec_node',
        title: '对账节点',
        type: 'input',
    },
    {
        key: 'pay_node',
        title: '回款时间',
        type: 'input',
    },
    {
        key: 'min_pay',
        title: '最低结算额度',
        type: 'input',
    },
    {
        key: 'accept_rate',
        title: '可接受差异率',
        type: 'input',
    },
    {
        key: 'data_base',
        title: '数据基数',
        type: 'input',
    },
    {
        key: 'diff_type',
        title: '差异处理方式',
        type: 'input',
    },
    {
        key: 'server_cost',
        title: '是否我方承担服务器成本	',
        type: 'input',
    },
    {
        key: 'bad_debt',
        title: '坏账处理',
        type: 'input',
    },
    {
        key: 'number',
        title: '合同编号',
        type: 'input',
    },

    {
        key: 'review_date',
        title: '财务复核时间',
        type: 'input',
    },
    {
        key: 'recheck',
        title: '是否需要再次审核',
        type: 'input',
    },
    {
        key: 'note',
        title: '备注',
        type: 'input',
    },
];

// 代理筛选框
const agentFilters = [
    {
        key: 'company',
        title: '签约主体',
        type: 'input',
    },
    {
        key: 'partners',
        title: '合作方',
        type: 'input',
    },
    {
        key: 'game_name',
        title: '游戏名称',
        type: 'input',
    },
    {
        key: 'game_name2',
        title: '游戏名称2',
        type: 'input',
    },

    {
        key: 'device_type',
        title: '系统',
        type: 'input',
    },
    {
        key: 'start_date',
        title: '合同起始日期',
        type: 'input',
    },
    {
        key: 'end_date',
        title: '合同终止日期',
        type: 'input',
    },
    {
        key: 'auto_renewal',
        title: '是否自动续期',
        type: 'input',
    },
    {
        key: 'special_division',
        title: '特殊分成条款',
        type: 'input',
    },
    {
        key: 'division',
        title: '合作方分成比例',
        type: 'input',
    },
    {
        key: 'channel_cost',
        title: '是否我方承担渠道费',
        type: 'input',
    },
    {
        key: 'tax_rate',
        title: '税率',
        type: 'input',
    },
    {
        key: 'rec_cycle',
        title: '对账周期',
        type: 'input',
    },
    {
        key: 'rec_node',
        title: '对账节点',
        type: 'input',
    },
    {
        key: 'pay_node',
        title: '回款时间',
        type: 'input',
    },
    {
        key: 'min_pay',
        title: '最低结算额度',
        type: 'input',
    },
    {
        key: 'accept_rate',
        title: '可接受差异率',
        type: 'input',
    },
    {
        key: 'data_base',
        title: '数据基数',
        type: 'input',
    },
    {
        key: 'diff_type',
        title: '差异处理方式',
        type: 'input',
    },
    {
        key: 'server_cost',
        title: '是否我方承担服务器成本	',
        type: 'input',
    },
    {
        key: 'bad_debt',
        title: '坏账处理',
        type: 'input',
    },
    {
        key: 'number',
        title: '合同编号',
        type: 'input',
    },
    {
        key: 'nature',
        title: '性质',
        type: 'input',
    },
    {
        key: 'review_date',
        title: '财务复核时间',
        type: 'input',
    },
    {
        key: 'recheck',
        title: '是否需要再次审核',
        type: 'input',
    },
    {
        key: 'note',
        title: '备注',
        type: 'input',
    },
    {
        key: 'partners_simple',
        title: '合作方公司简称',
        type: 'input',
    },
    {
        key: 'renewal_date',
        title: '续签日期',
        type: 'input',
    },
];

// 推广筛选框
const spreadFilters = [
    {
        key: 'company',
        title: '签约主体',
        type: 'input',
    },
    {
        key: 'channel',
        title: '渠道',
        type: 'input',
    },
    {
        key: 'start_date',
        title: '合同起始日期',
        type: 'input',
    },
    {
        key: 'end_date',
        title: '合同终止日期',
        type: 'input',
    },
    {
        key: 'delivery',
        title: '投放方式',
        type: 'input',
    },
    {
        key: 'total_price',
        title: '合同总价',
        type: 'input',
    },
    {
        key: 'pay_type',
        title: '付款方式',
        type: 'input',
    },
    {
        key: 'cycle',
        title: '账期',
        type: 'input',
    },
    {
        key: 'return_rate',
        title: '返点率',
        type: 'input',
    },
    {
        key: 'return_point',
        title: '返点方式',
        type: 'input',
    },
    {
        key: 'invoice',
        title: '发票内容',
        type: 'input',
    },
    {
        key: 'invoice_type',
        title: '发票类型',
        type: 'input',
    },
    {
        key: 'invoice_tax_rate',
        title: '发票税率',
        type: 'input',
    },
    {
        key: 'recheck',
        title: '是否需要再次审核',
        type: 'input',
    },
];

// 主函数
const Base: FC = () => {
    // 筛选框
    const [filters] = useFilters(tableFilters);

    // 新增编辑筛选框
    const [editFilters, seteditFilters]: [filters, any] = useState([]);

    // 当前选中的tab
    const [tab, settab] = useState('');
    // useEffect(() => {
    //     switch (tab) {
    //         case '6':
    //         case '7':
    //         case '9':
    //         case '24':
    //             seteditFilters(incomeFilters);
    //             break;
    //         case '5':
    //             seteditFilters(agentFilters);
    //             break;
    //         case '4':
    //             seteditFilters(spreadFilters);
    //             break;

    //         default:
    //             break;
    //     }
    // }, [tab]);

    // 显示列
    const [cols, setcols]: [(string | number)[], any] = useState([]);
    useEffect(() => {
        if (!cols.length || !tab) return;
        let newEditFilters: filters = [];
        switch (tab) {
            case '6':
            case '7':
            case '9':
            case '24':
                newEditFilters = incomeFilters.filter((item) => cols.includes(item.key));
                break;
            case '5':
                newEditFilters = agentFilters.filter((item) => cols.includes(item.key));
                break;
            case '4':
                newEditFilters = spreadFilters.filter((item) => cols.includes(item.key));
                break;

            default:
                break;
        }
        seteditFilters(newEditFilters);
    }, [cols, tab]);

    // 前端对表单进行二次处理
    const handleFilters = (filters: filters, row: obj) => {
        let newFilters: filters = [];
        let newFilter: filterItem;
        for (let filter of filters) {
            newFilter = {
                key: filter.key,
                title: filter.title,
            };
            switch (filter.key) {
                // 游戏项目，替换成有+号的
                case 'game_name':
                    newFilter.tsx = <Games></Games>;
                    break;
                case 'channel':
                    newFilter.tsx = <Channels></Channels>;
                    break;
                // 根据分成类型显示分成比例
                case 'division':
                    switch (row.share_type) {
                        case '固定分成':
                            newFilter = {
                                ...newFilter,
                                type: 'input',
                                options: [
                                    {
                                        id: '',
                                        name: '',
                                    },
                                ],
                                normalize: 'numberPercent',
                            };
                            break;
                        case '阶梯分成':
                            newFilter.tsx = <StepScale></StepScale>;
                            break;
                        case '多游戏阶梯分成':
                            newFilter.tsx = <MoreStepScale></MoreStepScale>;
                            break;
                        case '多游戏固定分成':
                            newFilter.tsx = <MoreFixScale></MoreFixScale>;
                            break;

                        default:
                            newFilter = filter;
                            break;
                    }
                    break;

                case 'return_rate':
                    newFilter.tsx = <ReturnRate></ReturnRate>;
                    break;

                case 'review_date':
                    // 【财务复核时间】如果有值不可编辑
                    // newFilter = {
                    //     key: 'review_date',
                    //     title: '财务复核时间',
                    //     props: {
                    //         disabled: !!row.review_date,
                    //     },
                    // };
                    newFilter.props = {
                        disabled: !!row.review_date,
                    };
                    break;
                default:
                    newFilter = filter;
                    break;
            }
            newFilters.push(newFilter);
        }
        return newFilters;
    };

    // 新增编辑数据
    const [editData, seteditData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 编辑
    const edit = (row: obj) => {
        seteditFilters((editFilters: filters) => handleFilters(editFilters, row));
        seteditData({
            ...editData,
            show: true,
            isEdit: true,
            row: row,
        });
    };

    // 自定义的列
    const columns = [
        {
            dataIndex: 'game_name',
            merge: true,
            width: 150,
            render: (value: any, recode: obj, index: number) => {
                if (Array.isArray(value)) {
                    return (
                        <ul>
                            {value.map((item, i) => (
                                <li key={i}>{item.game_name}</li>
                            ))}
                        </ul>
                    );
                } else {
                    return value;
                }
            },
        },
        {
            dataIndex: 'channel',
            merge: true,
            width: 150,
            render: (value: any, recode: obj, index: number) => {
                if (Array.isArray(value)) {
                    return (
                        <ul>
                            {value.map((item, i) => (
                                <li key={i}>{item.channel}</li>
                            ))}
                        </ul>
                    );
                } else {
                    return value;
                }
            },
        },
        {
            dataIndex: 'division',
            merge: true,
            width: 320,
            render: (value: any, recode: obj, index: number) => {
                const stepScale = (value: any) => (
                    <table className="step-scale-table">
                        <colgroup>
                            <col width="70" />
                            <col width="20" />
                            <col width="30" />
                            <col width="20" />
                            <col width="70" />
                            <col width="50" />
                        </colgroup>
                        {/* <thead>
                                        <tr>
                                            <th style={{ width: 70 }}>金额</th>
                                            <th style={{ width: 20 }}></th>
                                            <th style={{ width: 30 }}>流水</th>
                                            <th style={{ width: 20 }}></th>
                                            <th style={{ width: 70 }}>金额</th>
                                            <th style={{ width: 50 }}>分成比例</th>
                                        </tr>
                                    </thead> */}
                        <tbody>
                            {value.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td>{item.start_interval}</td>
                                    <td>{item.than1}</td>
                                    <td>{item.text}</td>
                                    <td>{item.than2}</td>
                                    <td>{item.end_interval}</td>
                                    <td>{addPercent(item.scale)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                switch (recode.share_type) {
                    case '固定分成':
                        return addPercent(value);
                    case '阶梯分成':
                        if (!Array.isArray(value)) value = [];
                        return stepScale(value);

                    case '多游戏阶梯分成':
                        if (!Array.isArray(value)) value = [];
                        return (
                            <ul className="more-step-scale-table">
                                {value.map((item: any, i: number) => (
                                    <li key={i}>
                                        <div className="game-name">{item.game_name}</div>
                                        {stepScale(item.division)}
                                    </li>
                                ))}
                            </ul>
                        );
                    case '多游戏固定分成':
                        if (!Array.isArray(value)) value = [];
                        return (
                            <table className="step-scale-table">
                                <colgroup>
                                    <col width="70" />
                                    <col width="50" />
                                </colgroup>

                                <tbody>
                                    {value.map((item: any, i: number) => (
                                        <tr key={i}>
                                            <td>{item.game_name}</td>
                                            <td>{item.scale}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        );

                    default:
                        break;
                }
            },
        },
        {
            dataIndex: 'return_rate',
            merge: true,
            width: 300,
            render: (
                value: { channel: string; startTime: string; endTime: string; rate: string }[],
                recode: obj,
                index: number
            ) => {
                // 返点率
                if (Array.isArray(value)) {
                    return (
                        <table>
                            {/* <thead>
                <tr>
                  <th>开始时间</th>
                  <th>结束时间</th>
                  <th>返点率</th>
                </tr>
              </thead> */}
                            <tbody>
                                {value.map((item, i) => (
                                    <tr key={i}>
                                        <td style={{ width: 50, textAlign: 'center' }}>{item.channel}</td>
                                        <td style={{ width: 40, textAlign: 'center' }}>{item.startTime}</td>
                                        <td style={{ width: 5, textAlign: 'center' }}>-</td>
                                        <td style={{ width: 40, textAlign: 'center' }}>{item.endTime}</td>
                                        <td style={{ width: 35, textAlign: 'left', paddingLeft: 10 }}>
                                            {addPercent(item.rate)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    );
                } else {
                    return value;
                }
            },
        },
        {
            title: '操作',
            dataIndex: 'tool',
            buttons: [
                {
                    title: '编辑',
                    fn: edit,
                },
            ],
        },
    ];

    const colsChange = (cols: string[]) => {
        setcols(cols);
    };

    return (
        <section className="contract-base">
            <HTable
                url={url}
                tableHeader
                menu
                out
                onTab={(tab) => settab(tab)}
                onColsChange={colsChange}
                columns={columns}
                filters={filters}></HTable>
            {/* 新增编辑 */}
            <HModel
                httpType="post"
                width={950}
                filters={editFilters}
                params={{ target: tab }}
                url={url}
                commitUrl={editUrl}
                data={editData}
                setData={seteditData}></HModel>
        </section>
    );
};
// 显示增加%
const addPercent = (value: string) => {
    return (value && `${value}%`) || '';
};

export default Base;
