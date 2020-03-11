import React, { FC, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import http from '@/assets/js/http';
import HTable from '@/components/HTable/HTable';
import { Button } from 'antd';
import useFilters from '@/components/HTable/useFilters';
import FlowModel from './FlowModel';
import StepScale from './StepScale';
import ReturnRate from './ReturnRate';
import MoreStepScale from './MoreStepScale';
import MoreFixScale from './MoreFixScale';
import Games from './Games';
import Channels from './Channels';
import { to, num2cn } from '@/assets/js/common';
import { history } from '@/router';
import { LocationState } from 'history';
import { useCurrent } from '@/components/use/useCurrent';

// 接口
const url = 'contract.manage.table';

// 额外输入框转换
const getExtFilters = (apiData = [], values: obj = {}) => {
    let extFilters: filters = apiData.map((filter: any) => ({
        key: filter.name,
        title: filter.display,
        placeholder: filter.tip,
        type: typeMap[filter.input_type],
        options: filter.option,
        initValue: (values && values[filter.name]) || undefined,
        rules: filter.requied === '1' ? [{ required: true, message: '请埴写该字段' }] : undefined,
    }));
    // extFiltersHandle(extFilters);
    return extFilters;
};

// 特殊额外输入框处理
const extFiltersHandle = (extFilters: filters) => {
    for (const item of extFilters) {
        // 预付款小写转大写（现在已去除）
        if (item.key === 'total_price') {
            item.react = {
                callback: (value, form) => {
                    // form.setFieldsValue({
                    //   total_price_big: num2cn(value)
                    // })
                },
            };
        }
    }
};

// 获取输入框类型
const typeMap: obj = {
    '1': 'input',
    '2': 'select',
    '3': 'upload',
    '4': 'range',
    '5': 'date',
    '6': 'diy',
    '7': 'auto',
};

// 主函数
const Manage: FC = () => {
    const routeParams = history.location.state || {};
    // 筛选框
    const tableFilters = [
        {
            key: 'number',
            title: '合同编号',
            type: 'input',
            initValue: (routeParams as any).number,
        },
        {
            key: 'key',
            title: '搜索类',
            type: 'select',
            options: [
                {
                    id: 'title',
                    name: '合同标题',
                },
                {
                    id: 'first_party',
                    name: '甲方',
                },
                {
                    id: 'second_party',
                    name: '乙方',
                },
                {
                    id: 'third_party',
                    name: '丙方',
                },
            ],
        },
        {
            key: 'keyword',
            title: '关键词',
            type: 'input',
        },
        {
            key: 'game_name',
            title: '游戏名称',
            type: 'input',
        },
        {
            key: 'template_id',
            title: '合同类型',
            type: 'select',
            optionsUrl: 'pub.tempalte',
            optionsParams: { category: 1 },
            react: {
                key: 'event_id',
                url: 'pub.event',
                paramsKey: 'template_id',
            },
        },
        {
            key: 'event_id',
            title: '当前节点',
            type: 'select',
            optionsUrl: 'pub.event',
            optionsParams: {}, //之后需要根据合同类型设置参数
        },
    ];

    // 表格筛选框
    const [_tableFilters] = useFilters(tableFilters);

    // 下拉列表
    const [templateList, settemplateList]: [obj[], any] = useState([]);
    // 主体列表
    const [companyList, setcompanyList] = useState([]);
    // 美术乙方列表
    const [artCompanys, setartCompanys, artCompanysRef] = useCurrent([]);
    useEffect(() => {
        // 模版列表
        http('pub.tempalte', { category: 1 }).then((res) => {
            settemplateList(res.data || []);
        });
        // 设置主体列表
        http('pub.company').then((res) => {
            setcompanyList(res.data || []);
        });
        // 设置美术乙方列表
        http('contract.manage.artCompanys').then((res) => {
            setartCompanys(res.data || []);
        });
    }, []);

    // 共用表单
    const shareFiltersRef: any = useRef(); //操作按钮的callback需要用到
    let shareFilters = useMemo(
        () => [
            {
                key: 'title',
                title: '合同标题',
                type: 'input',
                rules: [{ required: true, message: '请埴写该字段' }],
            },
            {
                key: 'level',
                title: '合同紧急程度',
                type: 'select',
                options: [
                    {
                        id: '1',
                        name: '正常',
                    },
                    {
                        id: '3',
                        name: '紧急',
                    },
                ],
                rules: [{ required: true, message: '请埴写该字段' }],
                react: {
                    callback: (value: string) => {
                        if (value === '3') {
                            // 当合同紧急程度为紧急时，增加加急说明输入框
                            const explainFilter = {
                                key: 'explain',
                                title: '加急说明',
                                type: 'input',
                                rules: [{ required: true, message: '请埴写该字段' }],
                            };
                            seteditFilters((editFilters: filters) => {
                                const levelFilterIndex = editFilters.findIndex((filter: any) => filter.key === 'level');
                                if (levelFilterIndex !== -1) {
                                    editFilters.splice(levelFilterIndex + 1, 0, explainFilter);
                                }
                                return [...editFilters];
                            });
                        } else {
                            // 不是紧急时，去除加急说明输入框
                            seteditFilters((editFilters: filters) => {
                                const explainFilter = editFilters.findIndex((filter: any) => filter.key === 'explain');
                                if (explainFilter !== -1) {
                                    editFilters.splice(explainFilter, 1);
                                }
                                return [...editFilters];
                            });
                        }
                    },
                    immediate: true,
                },
            },
            {
                key: 'company_id',
                title: '主体',
                type: 'select',
                options: companyList,
                initValue: '2',
                props: {
                    style: { width: 300 },
                },
                rules: [{ required: true, message: '请埴写该字段' }],
            },
            {
                key: 'first_party',
                title: '甲方',
                type: 'input',
            },
            {
                key: 'second_party',
                title: '乙方',
                type: 'input',
            },
            {
                key: 'third_party',
                title: '丙方',
                type: 'input',
            },
            {
                key: 'src',
                title: '文件上传',
                type: 'upload',
                uploadUrl: 'contract.manage.upload',
                rules: [{ required: true, message: '请上传文件' }],
            },
            {
                key: 'start_date',
                title: '合同起始日期',
                type: 'date',
            },
            {
                key: 'end_date',
                title: '合同终止日期',
                type: 'date',
            },
        ],
        [companyList]
    );
    useEffect(() => {
        shareFiltersRef.current = shareFilters;
    }, [shareFilters]);

    useEffect(() => {
        // 设置合同新增独有表单
        const addOnlyFilters = [
            {
                key: 'template_id',
                title: '合同类型',
                type: 'select',
                options: templateList,
                rules: [{ required: true, message: '请埴写该字段' }],
                props: {
                    dropdownClassName: 'auto-height',
                },
                react: {
                    callback: (value: string, form: any) => {
                        if (!value) return;

                        // 根据合同类型渲染额外表单
                        http('config.templateConfig.get', { template_id: value }).then((res) => {
                            const extAddFilters = getExtFilters(res.data);
                            const editFilters = [...addOnlyFilters, ...shareFilters, ...extAddFilters];
                            const handledFilters = handleFilters(editFilters, value);
                            seteditFilters(handledFilters);

                            // 清空紧急说明和自动续期值，否则这两个的callback不生效
                            for (const filter of handledFilters) {
                                switch (filter.key) {
                                    case 'level':
                                    case 'auto_renewal':
                                    case 'invoice_type':
                                        form.setFieldsValue({
                                            level: undefined,
                                            auto_renewal: undefined,
                                            invoice_type: undefined,
                                        });
                                        break;
                                    default:
                                        break;
                                }
                            }

                            if (formSave.current.isSave) {
                                // 通过接口设置的值
                                setEditData((editData: obj) => ({ ...editData, isFormSave: true }));
                                formSave.current.isSave = false;
                            }
                        });
                    },
                    immediate: true,
                },
            },
        ];
        setaddOnlyFilters(addOnlyFilters);
    }, [templateList, shareFilters]);

    // 前端对表单进行二次处理
    const handleFilters = (filters: filters, template_id: string = '', type?: string) => {
        let newFilters = [];
        for (let filter of filters) {
            switch (filter.key) {
                // 业务模式根据合同类型设置默认值
                case 'business_mode':
                    const valueMap: obj = {
                        '6': '联运',
                        '7': '外放',
                        '9': '公会',
                        '24': '投放',
                    };
                    filter.initValue = valueMap[template_id];
                    break;
                //是否自动续期选择是的时候，出现值的选择
                case 'auto_renewal':
                    filter.react = {
                        callback: (value: string) => {
                            const auto_renewal_value_filter = {
                                key: 'auto_renewal_value',
                                type: 'radio',
                                options: [
                                    {
                                        id: '1',
                                        name: '1年',
                                    },
                                    {
                                        id: '2',
                                        name: '2年',
                                    },
                                    {
                                        id: '3',
                                        name: '不限次数',
                                    },
                                ],
                                rules: [{ required: true, message: '请埴写该字段' }],
                            };
                            const renewal_filter = {
                                key: 'renewal',
                                title: '续签后合同终止日期',
                                type: 'date',
                            };
                            const towFilters = [auto_renewal_value_filter, renewal_filter];
                            seteditFilters((editFilters: filters) => {
                                const auto_renewal__filter_index = editFilters.findIndex(
                                    (filter) => filter.key === 'auto_renewal'
                                );
                                const auto_renewal__filter_value_index = editFilters.findIndex(
                                    (filter: any) => filter.key === 'auto_renewal_value'
                                );

                                if (value === '是') {
                                    if (auto_renewal__filter_value_index === -1) {
                                        editFilters.splice(auto_renewal__filter_index + 1, 0, ...towFilters);
                                    }
                                } else {
                                    if (auto_renewal__filter_value_index !== -1) {
                                        editFilters.splice(auto_renewal__filter_value_index, 2);
                                    }
                                }
                                return editFilters;
                            });
                        },
                        immediate: true,
                    };
                    break;
                // 根据分成类型显示分成比例
                case 'share_type':
                    filter.react = {
                        callback: (value: string, form: any) => {
                            seteditFilters((editFilters: filters) => {
                                // 代理合同为'合作方分成比例'
                                const title = template_id === '5' ? '合作方分成比例' : '我方分成比例';
                                // 分成类型
                                const share_type_filter_index = editFilters.findIndex(
                                    (filter) => filter.key === 'share_type'
                                );
                                // 分成比例
                                const division_filter_index = editFilters.findIndex(
                                    (filter: any) => filter.key === 'division'
                                );

                                // 插入分成比例
                                const pushDivisionFilter = () => {
                                    let divisionFilter: filterItem = {
                                        key: 'division',
                                        title,
                                    };
                                    switch (value) {
                                        case '固定分成':
                                            divisionFilter = {
                                                ...divisionFilter,
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
                                            divisionFilter.tsx = <StepScale disabled={type === 'look'}></StepScale>;
                                            break;
                                        case '多游戏阶梯分成':
                                            divisionFilter.tsx = (
                                                <MoreStepScale disabled={type === 'look'}></MoreStepScale>
                                            );
                                            break;
                                        case '多游戏固定分成':
                                            divisionFilter.tsx = (
                                                <MoreFixScale disabled={type === 'look'}></MoreFixScale>
                                            );
                                            break;

                                        default:
                                            break;
                                    }
                                    editFilters.splice(share_type_filter_index + 1, 0, divisionFilter);
                                };

                                // 如果存在分成比例，则清除
                                if (division_filter_index !== -1) {
                                    editFilters.splice(division_filter_index, 1);
                                }

                                // 清除值（首次加载会报警告，后续解决）
                                form.setFieldsValue({ division: '' });

                                pushDivisionFilter();

                                return [...editFilters];
                            });
                        },
                        immediate: true,
                    };
                    break;
                // 推广合同的返点率特殊处理
                case 'return_rate':
                    if (template_id !== '4') break;
                    filter.tsx = <ReturnRate disabled={type === 'look'}></ReturnRate>;
                // 发票类型为【增值税发票】时，才出现发票税率
                case 'invoice_type':
                    filter.react = {
                        callback: (value: string) => {
                            seteditFilters((editFilters: filters) => {
                                const invoice_type_filter_index = editFilters.findIndex(
                                    (filter) => filter.key === 'invoice_type'
                                );
                                const invoice_tax_rate_filter_index = editFilters.findIndex(
                                    (filter: any) => filter.key === 'invoice_tax_rate'
                                );

                                if (value === '增值税专用发票') {
                                    const invoice_tax_rate_filter: filterItem = {
                                        key: 'invoice_tax_rate',
                                        title: '发票税率',
                                        type: 'auto',
                                        options: [
                                            {
                                                id: '0',
                                                name: '0',
                                            },
                                            {
                                                id: '3',
                                                name: '3',
                                            },
                                            {
                                                id: '6',
                                                name: '6',
                                            },
                                            {
                                                id: '9',
                                                name: '9',
                                            },
                                            {
                                                id: '13',
                                                name: '13',
                                            },
                                        ],
                                        normalize: 'numberPercent',
                                    };
                                    // 插入发票税率
                                    if (invoice_type_filter_index !== -1 && invoice_tax_rate_filter_index === -1) {
                                        editFilters.splice(invoice_type_filter_index + 1, 0, invoice_tax_rate_filter);
                                    }
                                } else {
                                    // 清除发票税率
                                    if (invoice_tax_rate_filter_index !== -1) {
                                        editFilters.splice(invoice_tax_rate_filter_index, 1);
                                    }
                                }
                                return [...editFilters];
                            });
                        },
                        immediate: true,
                    };
                    break;
                // 两位小数数字
                case 'total_price': //【预收款】
                case 'advance_charge': //【预付款】
                case 'license_fee': //【授权金】
                    filter.normalize = 'dotNumber';
                    break;
                // 数字+%
                case 'division': //【我方分成比例】
                case 'return_rate': //【返点率】(发票类型为【增值税发票】时，才出现发票税率，在上面设置)
                    filter.normalize = 'numberPercent';
                    break;
                // 美术合同时乙方为下拉框
                case 'second_party':
                    if (template_id !== '10') {
                        filter.type = 'input';
                    } else {
                        filter.type = 'auto';
                        filter.options = artCompanysRef.current;
                    }
                    break;
                // 游戏项目，替换成有+号的，支持多个
                case 'game_name':
                    filter.tsx = <Games disabled={type === 'look'}></Games>;
                    break;
                // 渠道，替换成有+号的，支持多个
                case 'channel':
                    filter.tsx = <Channels disabled={type === 'look'}></Channels>;
                    break;
                default:
                    break;
            }
            newFilters.push(filter);
        }
        return newFilters;
    };

    // 合同新增独有表单
    const [addOnlyFilters, setaddOnlyFilters]: [filters, any] = useState([]);

    // 编辑表单
    const [editFilters, seteditFilters]: [filters, any] = useState(shareFilters);

    // 合同编辑数据
    const [editData, setEditData]: [any, any] = useState({
        show: false,
        isEdit: false,
        row: {},
    });

    // 打印
    const print = (row: obj) => {
        if (row.type === '1') {
            // 收入类审批单
            to('/print/union', { formData: row.approval_form });
        } else {
            // 费用类审批单
            to('/print/cost', { formData: row.approval_form });
        }
    };

    // 打开操作框

    // 通过接口设置值的标记，在合同类型改变时的回调中体现
    const formSave = useRef({
        isSave: false,
    });
    const openFlowModel = (row: obj, type: string, title: string) => {
        const shareFilters = shareFiltersRef.current;
        let extEditFilters = [];
        let filters = [];
        switch (type) {
            case 'print':
                print(row);
                break;
            case 'add':
            case 'copy':
                // 额外表单(额外表单的值在这里通过row.info设置)
                filters = [...addOnlyFilters, ...shareFilters];
                seteditFilters(handleFilters(filters, row.template_id, type));
                // 新增时需要先请求缓存表单数据
                const formValueUrl = type === 'add' ? 'contract.manage.formsave' : 'contract.manage.formCopy';
                const formValueParams = type === 'add' ? { type: 'get' } : { id: row.id };
                http.post(formValueUrl, formValueParams).then((res) => {
                    const saveRow = type === 'add' ? (res.data && res.data.params) || {} : res.data || {};
                    formSave.current = {
                        isSave: true,
                    };
                    setEditData({
                        ...editData,
                        show: true,
                        isEdit: false,
                        row: saveRow,
                        type,
                        title: '合同发起',
                    });
                });
                break;
            default:
                // 额外表单(额外表单的值在这里通过row.info设置)
                extEditFilters = getExtFilters(row.params, row.info);
                filters = [...shareFilters, ...extEditFilters];
                seteditFilters(handleFilters(filters, row.template_id, type));
                // 设置表单数据
                setEditData({
                    ...editData,
                    show: true,
                    isEdit: true,
                    row,
                    type,
                    title,
                });

                break;
        }
    };

    // 按钮
    const btns = (
        <>
            <Button type="primary" icon="plus" onClick={() => openFlowModel({}, 'add', '合同发起')}>
                合同发起
            </Button>
        </>
    );

    // 自定义的列
    const columns = useMemo(
        () => [
            {
                title: '操作',
                dataIndex: 'tool',
                accessButtonFn: (record: obj, id: string, name: string) => openFlowModel(record, id, name),
            },
        ],
        [shareFilters, addOnlyFilters, editData, companyList]
    );

    return (
        <section className="contract-manage">
            <HTable
                url={url}
                tableHeader
                columns={columns}
                params={routeParams}
                filters={_tableFilters}
                btns={btns}
                rowKey={(recode: any, i: number) => i}></HTable>
            {/* 审核流模态框 */}
            <FlowModel
                title={editData.title}
                filters={editFilters}
                url={url}
                data={editData}
                setData={setEditData}></FlowModel>
        </section>
    );
};

export default Manage;
