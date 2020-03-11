import React, { FC, useState, useEffect } from 'react';
import HTable from '@/components/HTable/HTable';
import { Button } from 'antd';
import HModel from '@/components/HModel/HModel';
// import StepScale from '@/views/contract/Manage/StepScale';
// import MoreStepScale from '@/views/contract/Manage/MoreStepScale';
// import MoreFixScale from '@/views/contract/Manage/MoreFixScale';
import Games from '@/views/contract/Manage/Games';
import Channels from '@/views/contract/Manage/Channels';
import http from '@/assets/js/http';

// 接口
const url = 'contract.legal.table';

// 编辑接口
const editUrl = 'contract.legal.operate';

// 主函数
const Legal: FC = () => {
    // 主体列表
    const [companyList, setcompanyList] = useState([]);
    // 所有下拉列表
    const [allOptions, setallOptions]: [obj, any] = useState({});
    // 搜索键列表
    const [keys, setkeys] = useState([]);
    // 接口列表
    useEffect(() => {
        // 搜索键列表
        http('contract.legal.keys').then((res) => {
            setkeys(res.data || []);
        });
        // 设置主体列表
        http('pub.company').then((res) => {
            setcompanyList(res.data || []);
        });
        // 所有字段下拉列表
        http('contract.legal.options').then((res) => {
            setallOptions(res.data || {});
        });
    }, []);

    // 筛选框
    const tableFilters = [
        {
            key: 'key',
            title: '搜索键',
            type: 'select',
            options: keys,
        },
        {
            key: 'keyword',
            title: '搜索值',
            type: 'input',
        },
        {
            key: 'company_id',
            title: '主体',
            type: 'select',
            options: companyList,
            props: {
                style: { width: 240 },
            },
        },
    ];

    // 新增编辑筛选框
    const [editFilters, seteditFilters] = useState<filters>([]);

    // 前端对表单进行二次处理
    const handleFilters = (filters: filters, row: obj) => {
        let newFilters: filters = [];
        let newFilter: filterItem;
        for (let filter of filters) {
            switch (filter.key) {
                // 根据分成类型显示分成比例
                // case 'division':
                //     newFilter = {
                //         key: 'division',
                //         title: filter.title,
                //     };
                //     switch (row.share_type) {
                //         case '固定分成':
                //             newFilter = {
                //                 ...newFilter,
                //                 type: 'input',
                //                 options: [
                //                     {
                //                         id: '',
                //                         name: '',
                //                     },
                //                 ],
                //                 normalize: 'numberPercent',
                //             };
                //             break;
                //         case '阶梯分成':
                //             newFilter.tsx = <StepScale></StepScale>;
                //             break;
                //         case '多游戏阶梯分成':
                //             newFilter.tsx = <MoreStepScale></MoreStepScale>;
                //             break;
                //         case '多游戏固定分成':
                //             newFilter.tsx = <MoreFixScale></MoreFixScale>;
                //             break;

                //         default:
                //             newFilter = filter;
                //             break;
                //     }
                //     break;
                // 游戏项目
                case 'game_name':
                    newFilter = {
                        ...filter,
                        tsx: <Games></Games>,
                    };
                    break;
                case 'channel':
                    newFilter = {
                        ...filter,
                        tsx: <Channels></Channels>,
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

    // 当前选中的tab
    const [tab, settab] = useState('');
    const startTimeFilter = {
        key: 'start_date',
        title: '开始时间',
        type: 'date',
    };
    const endTimeFilter = [
        {
            key: 'end_date',
            title: '终止时间',
            type: 'date',
        },
        {
            key: 'auto_renewal',
            title: '是否自动续期',
            type: 'input',
        },
        {
            key: 'renewal',
            title: '续期后终止日期',
            type: 'input',
        },
    ];
    const auditDateFilter = {
        key: 'audit_date',
        title: '发送律师审核时间',
        type: 'date',
    };
    const feedbackDateFilter = {
        key: 'feedback_date',
        title: '律师反馈时间',
        type: 'date',
    };
    const contractStatusFilter = {
        key: 'contract_status',
        title: '合同状态',
        type: 'input',
        // options: allOptions.contract_status,
    };
    const isAuditFilter = {
        key: 'is_audit',
        title: '是否发送律师审核',
        type: 'select',
        options: allOptions.is_audit,
    };
    const totalPriceFilter = {
        key: 'total_price',
        title: '合同总金额（元）',
        type: 'input',
    };
    useEffect(() => {
        switch (tab) {
            case 'LY':
                //联运类
                const LY = [
                    {
                        key: 'number',
                        title: '合同编号',
                        type: 'input',
                    },
                    {
                        key: 'game_type',
                        title: '游戏类型',
                        type: 'select',
                        options: allOptions.game_type,
                    },

                    {
                        key: 'game_name',
                        title: '游戏项目',
                        type: 'input',
                    },
                    {
                        key: 'device_type',
                        title: '游戏版本',
                        type: 'input',
                    },
                    {
                        key: 'auth_area',
                        title: '授权区域',
                        type: 'input',
                    },
                    {
                        key: 'partners',
                        title: '合同方',
                        type: 'input',
                    },
                    {
                        key: 'channel',
                        title: '渠道简称',
                        type: 'input',
                    },
                    {
                        key: 'promoter',
                        title: '跟进人',
                        type: 'input',
                    },
                    startTimeFilter,
                    ...endTimeFilter,
                    contractStatusFilter,
                    {
                        key: 'note',
                        title: '备注',
                        type: 'input',
                    },
                    {
                        key: 'renewal_info',
                        title: '续签情况',
                        type: 'input',
                    },
                    isAuditFilter,
                    auditDateFilter,
                    feedbackDateFilter,
                ];
                seteditFilters(LY);
                break;
            case 'DL':
                //代理类
                const DL = [
                    {
                        key: 'number',
                        title: '合同编号',
                        type: 'input',
                    },
                    {
                        key: 'contract_type',
                        title: '合同类型',
                        type: 'select',
                        options:
                            allOptions.contract_type &&
                            allOptions.contract_type.filter((item: obj) => item.target === 'DL'),
                    },
                    {
                        key: 'partners',
                        title: '合同方',
                        type: 'input',
                    },
                    {
                        key: 'promoter',
                        title: '发起人',
                        type: 'input',
                    },
                    {
                        key: 'game_name',
                        title: '游戏项目',
                        type: 'input',
                    },
                    startTimeFilter,
                    ...endTimeFilter,
                    contractStatusFilter,
                    {
                        key: 'note',
                        title: '备注',
                        type: 'input',
                    },
                    {
                        key: 'renewal_info',
                        title: '续签情况',
                        type: 'input',
                    },
                    isAuditFilter,
                    auditDateFilter,
                    feedbackDateFilter,
                ];
                seteditFilters(DL);
                break;
            case 'FW':
                //服务类
                const FW = [
                    {
                        key: 'number',
                        title: '合同编号',
                        type: 'input',
                    },
                    {
                        key: 'contract_type',
                        title: '合同类型',
                        type: 'select',
                        options:
                            allOptions.contract_type &&
                            allOptions.contract_type.filter((item: obj) => item.target === 'FW'),
                    },
                    {
                        key: 'partners',
                        title: '合同方',
                        type: 'input',
                    },
                    {
                        key: 'title',
                        title: '合同名称',
                        type: 'input',
                    },
                    {
                        key: 'promoter',
                        title: '发起人',
                        type: 'input',
                    },
                    {
                        key: 'content',
                        title: '主要内容',
                        type: 'input',
                    },
                    totalPriceFilter,
                    startTimeFilter,
                    ...endTimeFilter,

                    contractStatusFilter,
                    {
                        key: 'note',
                        title: '备注',
                        type: 'input',
                    },
                    {
                        key: 'renewal_info',
                        title: '续签情况',
                        type: 'input',
                    },
                    isAuditFilter,
                    auditDateFilter,
                    feedbackDateFilter,
                ];
                seteditFilters(FW);
                break;
            case 'WB':
                //外包类
                const WB = [
                    {
                        key: 'number',
                        title: '合同编号',
                        type: 'input',
                    },
                    {
                        key: 'contract_type',
                        title: '合同类型',
                        type: 'select',
                        options:
                            allOptions.contract_type &&
                            allOptions.contract_type.filter((item: obj) => item.target === 'WB'),
                    },
                    {
                        key: 'partners',
                        title: '合同方',
                        type: 'input',
                    },
                    {
                        key: 'title',
                        title: '合同名称',
                        type: 'input',
                    },
                    {
                        key: 'promoter',
                        title: '发起人',
                        type: 'input',
                    },
                    {
                        key: 'project',
                        title: '项目',
                        type: 'input',
                    },
                    startTimeFilter,
                    {
                        key: 'end_date',
                        title: '最终交付时间',
                        type: 'input',
                    },
                    totalPriceFilter,
                    contractStatusFilter,
                    {
                        key: 'content',
                        title: '主要内容',
                        type: 'input',
                    },
                    {
                        key: 'note',
                        title: '备注',
                        type: 'input',
                    },
                    {
                        key: 'renewal_info',
                        title: '续签情况',
                        type: 'input',
                    },
                    isAuditFilter,
                    auditDateFilter,
                    feedbackDateFilter,
                ];
                seteditFilters(WB);
                break;
            case 'XZ':
                //行政类
                const XZ = [
                    {
                        key: 'number',
                        title: '合同编号',
                        type: 'input',
                    },
                    {
                        key: 'project',
                        title: '项目',
                        type: 'input',
                    },
                    {
                        key: 'contract_type',
                        title: '合同类型',
                        type: 'select',
                        options:
                            allOptions.contract_type &&
                            allOptions.contract_type.filter((item: obj) => item.target === 'XZ'),
                    },
                    {
                        key: 'partners',
                        title: '合同方',
                        type: 'input',
                    },
                    {
                        key: 'title',
                        title: '合同名称',
                        type: 'input',
                    },
                    {
                        key: 'promoter',
                        title: '发起人',
                        type: 'input',
                    },
                    totalPriceFilter,
                    startTimeFilter,
                    ...endTimeFilter,
                    contractStatusFilter,
                    {
                        key: 'content',
                        title: '主要内容',
                        type: 'input',
                    },
                    {
                        key: 'note',
                        title: '备注',
                        type: 'input',
                    },
                    {
                        key: 'renewal_info',
                        title: '续签情况',
                        type: 'input',
                    },
                    isAuditFilter,
                    auditDateFilter,
                    feedbackDateFilter,
                ];
                seteditFilters(XZ);
                break;
            default:
                break;
        }
    }, [tab, allOptions]);

    // 新增编辑数据
    const [editData, seteditData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 编辑
    const edit = (row: obj) => {
        seteditFilters((editFilters) => {
            return handleFilters(editFilters, row);
        });

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

    return (
        <section className="contract-legal">
            <HTable
                url={url}
                menu
                out
                tableHeader
                onTab={(tab) => settab(tab)}
                columns={columns}
                filters={tableFilters}></HTable>
            {/* 新增编辑 */}
            <HModel
                filters={editFilters}
                params={{ target: tab }}
                httpType="post"
                url={url}
                commitUrl={editUrl}
                data={editData}
                setData={seteditData}></HModel>
        </section>
    );
};

export default Legal;
