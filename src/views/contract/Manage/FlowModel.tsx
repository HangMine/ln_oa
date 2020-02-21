import React, { FC, memo, useState, useEffect, useRef, Children } from 'react';
import http from '@/assets/js/http';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { useCurrent } from '@/components/use/useCurrent';
import HFilter from '@/components/HFilter/HFilter';
import { fetchTable } from '@/redux/actions';
import { timeFormat, handleUpload } from '@/assets/js/common';
import { Button, Modal, Card, Empty, Icon, Spin } from 'antd';
import './FlowModel.scss';

// 合同发起接口
const addUrl = 'contract.manage.add';

// 审核流提交接口
const flowUrl = 'contract.manage.action';

// 补充协议接口
const supplyUrl = 'contract.manage.supply';

// 表单保存计时器
let formSaveTimer: NodeJS.Timeout;

type FlowModelProps = {
    url: string;
    parmas?: obj;
    filters: filters;
    data: obj;
    setData: any;

    [any: string]: any;
};

const FlowModel: FC<FlowModelProps> = ({
    children,
    url,
    parmas,
    filters,
    data,
    setData,

    ...ohterProps
}) => {
    const dispatch = useDispatch();
    const filterParams = useMappedState((state) => state.filterParams);
    const [form, setform]: [any, any] = useState({});
    const { validateFields, resetFields, validateFieldsAndScroll, getFieldsValue } = form;
    const [signForm, setSignform]: [any, any] = useState({});
    const {
        validateFields: signValidateFields,
        resetFields: resetSignFields,
        getFieldsValue: signGetFieldsValue,
    } = signForm;
    // 获取合同审批单表单
    const [checkFilters, setcheckFilters, checkFiltersRef]: [filters, any, any] = useCurrent(filters);

    useEffect(() => {
        setcheckFilters(filters);
    }, [filters]);

    useEffect(() => {
        if (!Object.keys(form).length) return;
        if (!Object.keys(signForm).length) return;
        if (data.type !== 'add') return;
        if (data.show) {
            setFormSaveTimer();
        } else {
            clearFormSaveTimer();
        }
    }, [data.show, form, signForm]);

    useEffect(() => {
        // 关闭时
        if (!Object.keys(form).length) return;
        if (!data.show) {
            // 重置isFormSave
            if (data.type === 'add') {
                setData({ ...data, isFormSave: undefined });
            }

            return;
        }
        // 打开时
        if (data.type === 'add') {
            // 清除值
            resetInfo();
        }
        resetSign();
    }, [data.show, data.type, form]);

    useEffect(() => {
        if (!Object.keys(form).length) return;
        if (!data.show) return;

        if (data.isFormSave) {
            // 如果是通过接口设置值，重新触发
            setTimeout(() => {
                setData({ ...data, isFormSave: false });
            }, 0);
            return;
        }

        handleImmdiateCallback(data);

        // 必须使用setTimeout保证在callback之后运行
        setTimeout(() => {
            const filters: filters = checkFiltersRef.current;
            switch (data.type) {
                case 'look':
                    const lookFilters = filters.map((filter) => ({
                        ...filter,
                        props: {
                            ...filter.props,
                            disabled: true,
                        },
                    }));
                    setcheckFilters(lookFilters);
                    break;
                default:
                    setcheckFilters(filters);
                    break;
            }
            // 此处与hmodel不同，新增也要设置值,并且增加了计时器
            if (data.type) {
                // 必须在filters改变之后,秒数不能设置为0，否则新增和分成比例设置不到
                setTimeout(() => {
                    setValues(data.row);
                }, 100);
            }
        }, 100);
    }, [data, form]);

    // 处理需要马上执行的函数
    const handleImmdiateCallback = (data: obj) => {
        const row = data.row;

        if (!Object.keys(row).length) return;
        for (const filter of filters) {
            // 接口设置值时需要排除【合同类型】这个值
            if (data.isFormSave === false && filter.key === 'template_id') continue;
            if (filter.react && filter.react.callback && filter.react.immediate) {
                const value = (row.info && row.info[filter.key]) || row[filter.key];

                filter.react.callback(value, form);
            }
        }
    };

    // 返回步骤表单(用useCurrent储存最新的flowsFilters,否则agreeChange的回调里获取不到最新的值)
    const [flowsFilter, setflowsFilter, flowsFilterRef] = useCurrent({});
    useEffect(() => {
        if (!data.show) return;

        const setSignFilters = (signFilters: filters) => {
            // 因为使用了useCurrent，需要在useEffect之后执行
            setTimeout(() => {
                setsignFilters(signFilters);
            }, 0);
        };

        const setFLowsFilter = () => {
            return http('flow.index.table', {
                template_id: data.row.template_id,
                action: data.type,
                step: data.row.step || '',
            }).then((res) => {
                const flows = (res.data && res.data.rows && res.data.rows[0] && res.data.rows[0].flows) || [];
                const flowList = flows.map((item: obj) => ({
                    id: item.step,
                    name: item.alias_name,
                }));
                const flowsFilter = {
                    key: 'return_step',
                    title: '返回步骤',
                    type: 'radio',
                    options: flowList,
                    rules: [{ required: true, message: '请填写该字段' }],
                };
                // 在这里设置返回步骤数据
                setflowsFilter(flowsFilter);
                return flowsFilter;
            });
        };

        // 获取合同签字表单
        switch (data.type) {
            case 'check':
                setFLowsFilter().then((flowsFilter) => {
                    const checkFlowFilter = { ...flowsFilter, rules: undefined };
                    setSignFilters([remarkFilter, agreeFilter, checkFlowFilter]);
                });
                break;
            case 'turn_down':
            case 'restart':
                setFLowsFilter().then((flowsFilter) => {
                    setSignFilters([remarkFilter, flowsFilter]);
                });
                break;
            default:
                setSignFilters([remarkFilter]);
                break;
        }
    }, [data]);

    // 监听是否同意
    const agreeChange = (e: any) => {
        const value = e.target.value;
        let returnStepFilter =
            value === '0'
                ? { ...flowsFilterRef.current, rules: [{ required: true, message: '请填写该字段' }] }
                : { ...flowsFilterRef.current, rules: undefined };
        setsignFilters([remarkFilter, agreeFilter, returnStepFilter]);
    };

    // 签字意见表单
    const getRemarkTitle = () => {
        switch (data.type) {
            case 'check':
                return '审批意见';
            case 'add':
                return '操作人意见';
            default:
                return '签字意见';
        }
    };
    const remarkFilter: filterItem = {
        key: 'remark',
        title: getRemarkTitle(),
        type: 'textarea',
        rules: [{ required: true, message: '请填写该字段' }],
    };

    // 是否同意表单
    const agreeFilter = {
        key: 'status',
        title: '是否同意',
        type: 'radio',
        options: [
            {
                key: '1',
                title: '同意',
            },
            {
                key: '0',
                title: '不同意',
            },
        ],
        initValue: '1',
        rules: [{ required: true, message: '请填写该字段' }],
        react: {
            callback: agreeChange,
        },
    };

    // 合同签字表单
    const [signFilters, setsignFilters]: [filters, any] = useState([]);

    // 设置值
    const setValues = (row: obj) => {
        if (!Object.keys(row).length) return;
        const filters = checkFiltersRef.current;
        if (!Object.keys(form).length || !filters) return;
        const { setFieldsValue } = form;
        // 保留表单上的字段
        let resValues: obj = {};
        for (const filter of filters) {
            const key = filter.key;
            const value = (row.info && row.info[filter.key]) || row[filter.key];

            switch (filter.type) {
                // 处理上传类型的参数
                case 'upload':
                    const uploadItem = value || [];
                    resValues[key] = uploadItem.map((_item: any, i: number) => {
                        return {
                            uid: i,
                            name: (_item && _item.split('/').slice(-1)[0]) || '',
                            status: 'done',
                            url: _item,
                        };
                    });
                    break;
                case 'select':
                    resValues[key] = value || undefined;
                    break;
                default:
                    resValues[key] = value;
                    break;
            }
        }

        setFieldsValue(resValues);
    };

    // 清空审批单
    const resetInfo = () => {
        if (!Object.keys(form).length || !filters) return;
        resetFields();
    };

    // 清空合同签字表单
    const resetSign = () => {
        if (!Object.keys(signForm).length || !filters) return;
        resetSignFields();
    };

    // 获取参数
    const getParams = (filters: filters, obj: obj) => {
        timeFormat(filters, obj);
        handleUpload(filters, obj);
        return obj;
    };

    // 提交
    const commit = () => {
        validateFields((err: any, values: any) => {
            if (err) {
                validateFieldsAndScroll();
                return;
            }
            // 获取签名参数
            let signValues = {};
            signValidateFields((err: any, values: any) => {
                if (err) return;
                signValues = values;
            });
            if (!Object.keys(signValues).length) return;

            setData({
                ...data,
                loading: true,
            });

            // 判断是新增还是审核流
            let resCommitUrl = '';
            let commitParams = {};
            switch (data.type) {
                case 'add':
                case 'copy':
                    // 新增
                    resCommitUrl = addUrl;
                    commitParams = {
                        ...getParams(filters, values),
                        ...getParams(signFilters, signValues),
                    };
                    break;
                case 'supplement':
                    // 补充协议
                    resCommitUrl = supplyUrl;
                    commitParams = {
                        id: data.row.id,
                        info: getParams(filters, values),
                        ...getParams(signFilters, signValues),
                    };
                    break;
                default:
                    // 审核流
                    resCommitUrl = flowUrl;
                    commitParams = {
                        number: data.row.number,
                        type: data.type,
                        info: getParams(filters, values),
                        status: '0',
                        ...getParams(signFilters, signValues),
                    };
                    break;
            }

            http.post(resCommitUrl, commitParams).then((res) => {
                setData({
                    ...data,
                    loading: false,
                });
                if (res.code == 0) {
                    setData({
                        ...data,
                        show: false,
                    });
                    dispatch(fetchTable(url, { ...parmas, ...filterParams }));
                }
            });
        });
    };

    // 保存表单数据
    const formSave = () => {
        const values = getFieldsValue();

        const signValues = signGetFieldsValue();
        const commitParams = {
            ...getParams(filters, values),
            ...getParams(signFilters, signValues),
        };
        // 新增时，接口缓存数据
        if (data.type === 'add') http.post('contract.manage.formsave', { type: 'record', params: commitParams });
    };

    // 新增时，定时保存表单数据
    const formSaveBtn = useRef<any>();
    const setFormSaveTimer = () => {
        clearFormSaveTimer();
        formSaveTimer = setInterval(() => {
            // 直接调用onsave的话remark字段会报错
            if (formSaveBtn.current.props) {
                formSaveBtn.current.props.onClick();
            }
        }, 60000);
    };

    const clearFormSaveTimer = () => {
        clearInterval(formSaveTimer);
    };

    // ----------历史文件
    const [historyShow, sethistoryShow] = useState(false);
    const [historyFiles, sethistoryFiles] = useState([]);
    // 打开历史文件模态框
    const openHistory = (i: number) => {
        sethistoryShow(true);
        const flowLogs = data.row.flowLogs || [];
        const historyFiles = (flowLogs[i] && flowLogs[i].src) || [];
        sethistoryFiles(historyFiles);
    };

    return (
        <>
            <Modal
                {...ohterProps}
                visible={data.show}
                width={1000}
                className="flow-modal"
                onOk={commit}
                onCancel={() =>
                    setData({
                        ...data,
                        show: false,
                    })
                }
                title={
                    <span>
                        {data.title}
                        {data.type === 'add' && (
                            <Button
                                key="formsave"
                                type="primary"
                                className="formsave-btn"
                                onClick={formSave}
                                ref={formSaveBtn}>
                                保存
                            </Button>
                        )}
                    </span>
                }
                footer={[
                    <Button
                        key="cancel"
                        onClick={() =>
                            setData({
                                ...data,
                                show: false,
                            })
                        }>
                        取消
                    </Button>,
                    <Button key="commit" type="primary" loading={data.loading} onClick={commit}>
                        确定
                    </Button>,
                ]}
                bodyStyle={{ background: 'rgb(240, 242, 245)' }}>
                <Spin spinning={!!data.spinning}>
                    <Card title="合同审批单" bordered={false}>
                        <HFilter data={checkFilters} onForm={(form: any) => setform(form)}></HFilter>
                    </Card>

                    {!['look'].includes(data.type) && (
                        <Card title="合同签字意见" bordered={false} style={{ marginTop: '20px' }}>
                            <HFilter data={signFilters} onForm={(form: any) => setSignform(form)}></HFilter>
                        </Card>
                    )}

                    {
                        <Card title="审核流相关日志" bordered={false} style={{ marginTop: '20px' }}>
                            {Array.isArray(data.row.flowLogs) && data.row.flowLogs.length > 0 && (
                                <table style={{ width: '100%' }}>
                                    <colgroup style={{ width: 60 }}></colgroup>
                                    <colgroup style={{ width: 80 }}></colgroup>
                                    <colgroup></colgroup>
                                    <colgroup style={{ width: 100 }}></colgroup>
                                    <colgroup style={{ width: 160 }}></colgroup>
                                    <tbody>
                                        {data.row.flowLogs.map((flow: obj, i: number) => (
                                            <tr key={i}>
                                                <td>{flow.name} </td>
                                                <td>{flow.action}</td>
                                                <td>{flow.remark}</td>
                                                <td>
                                                    {flow.src && flow.src.length > 0 && (
                                                        <Button type="link" onClick={() => openHistory(i)}>
                                                            历史文件
                                                        </Button>
                                                    )}
                                                </td>
                                                <td>{flow.o_time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {(!Array.isArray(data.row.flowLogs) ||
                                (Array.isArray(data.row.flowLogs) && !data.row.flowLogs.length)) && (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>
                    }
                </Spin>
            </Modal>

            <Modal
                title="历史文件"
                visible={historyShow}
                className="history-model"
                onOk={() => sethistoryShow(false)}
                onCancel={() => sethistoryShow(false)}>
                {historyFiles.length ? (
                    <ul className="history-list">
                        {historyFiles.map((url: string, i: number) => (
                            <li key={i}>
                                <Icon className="file-icon" type="paper-clip" />
                                <a href={url} target="_blank" title={url.split('/').slice(-1)[0] || ''}>
                                    {url.split('/').slice(-1)[0] || ''}
                                </a>
                                <Icon
                                    className="hover-icon"
                                    title="下载文件"
                                    type="download"
                                    onClick={() => window.open(url)}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    // <HFilter
                    //     data={[{ key: 'src1', title: '文件上传', type: 'upload', initValue: historyFiles }]}></HFilter>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
                )}
            </Modal>
        </>
    );
};

export default FlowModel;
