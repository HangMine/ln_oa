import React, { FC, useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { useDispatch } from 'redux-react-hook';
import { fetchTable } from '@/redux/actions';
import Tool from '@/components/HTable/Tool';
import http from '@/assets/js/http';
const { Option } = Select;
// 编辑接口
const editUrl = 'flow.index.add';
// 新增编辑模态框
type editModelProps = {
    url: string;
    editData: {
        show: boolean;
        loading: boolean;
        isEdit: boolean;
        row: obj;
    };
    seteditData: any;
    eventList: any[];
    userList: any[];
    roleList: any[];
    templateList: any[];
};

const EditModel: FC<editModelProps & FormComponentProps> = ({
    form,
    url,
    editData,
    seteditData,
    eventList,
    userList,
    roleList,
    templateList,
}) => {
    const dispatch = useDispatch();
    const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;
    // 新增/编辑表单数据(绑定的值和form里面的值不一样，特殊处理)
    const [formData, setformData] = useState({
        template_id: '',
        flows: [
            {
                event_id: '',
                uids: [],
                role_ids: [],
                alias_name: '',
            },
        ],
    });
    // 打开时处理
    useEffect(() => {
        // 编辑
        if (editData.isEdit) {
            const formData = {
                template_id: editData.row.template_id,
                flows: editData.row.flows.map((item: any) => ({
                    event_id: item.event_id,
                    uids: item.uids,
                    role_ids: item.role_ids,
                    alias_name: item.alias_name,
                })),
            };
            setformData(formData);
        } else {
            // 新增
            setformData({
                template_id: '',
                flows: [
                    {
                        event_id: '',
                        uids: [],
                        role_ids: [],
                        alias_name: '',
                    },
                ],
            });
            resetValues();
        }
    }, [editData.show]);

    // 监听formData,实时更新值
    useEffect(() => {
        if (!editData.isEdit) return;
        setValues(formData);
    }, [formData]);

    // 设置表单值
    const setValues = (row: obj) => {
        let editRowsValues: obj = {};
        row.flows.forEach((item: any, i: number) => {
            editRowsValues[`event_id_${i}`] = item.event_id;
            editRowsValues[`uids_${i}`] = item.uids;
            editRowsValues[`role_ids_${i}`] = item.role_ids;
            editRowsValues[`alias_name_${i}`] = item.alias_name;
        });
        setFieldsValue({
            template_id: row.template_id,
            ...editRowsValues,
        });
    };

    // 重置表单值
    const resetValues = () => {
        // 在渲染之后设置值
        resetFields();
    };

    //新增编辑表头
    const editColumns: any = [
        {
            title: '步骤',
            dataIndex: 'step',
            render: (text: string, recode: obj, index: number) => <span>{index + 1}</span>,
        },
        {
            title: <span className="ant-form-item-required">事件</span>,
            dataIndex: 'event_id',
            render: (text: string, recode: obj, index: number) => (
                <Form.Item key={`event_id_${index}`}>
                    {getFieldDecorator(`event_id_${index}`, {
                        rules: [{ required: true, message: '请填写该字段' }],
                    })(
                        <Select
                            placeholder="请选择事件"
                            style={{ width: 150 }}
                            onChange={(value: string) => rowChange('event_id', value, recode, index)}>
                            {eventList.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            ),
        },
        {
            title: '参与人',
            dataIndex: 'uids',
            render: (text: string, recode: obj, index: number) => (
                <Form.Item key={`uids_${index}`}>
                    {getFieldDecorator(`uids_${index}`, {
                        rules: [
                            {
                                message: '请填写该字段',
                                validator: (rule, value, callback) =>
                                    validator('role_ids', recode, index, value, callback),
                            },
                        ],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="请选择参与人"
                            style={{ width: 300 }}
                            onChange={(value: string) => rowChange('uids', value, recode, index)}
                            filterOption={(input, option: any) => option.props.children.includes(input)}>
                            {userList &&
                                userList.map((option) => (
                                    <Option key={option.id} value={option.id}>
                                        {option.name}
                                    </Option>
                                ))}
                        </Select>
                    )}
                </Form.Item>
            ),
        },
        {
            title: '参与角色',
            dataIndex: 'role_ids',
            render: (text: string, recode: obj, index: number) => (
                <Form.Item key={`role_ids_${index}`}>
                    {getFieldDecorator(`role_ids_${index}`, {
                        rules: [
                            {
                                message: '请填写该字段',
                                validator: (rule, value, callback) => validator('uids', recode, index, value, callback),
                            },
                        ],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="请选择参与角色"
                            style={{ width: 300 }}
                            onChange={(value: string) => rowChange('role_ids', value, recode, index)}
                            filterOption={(input, option: any) => option.props.children.includes(input)}>
                            {roleList.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            ),
        },
        {
            title: '审批流别名',
            dataIndex: 'alias_name',
            render: (text: string, recode: obj, index: number) => (
                <Form.Item>
                    {getFieldDecorator(`alias_name_${index}`)(
                        <Input
                            placeholder="请输入审批流别名"
                            allowClear
                            onChange={(e) => rowChange('alias_name', e.target.value, recode, index)}></Input>
                    )}
                </Form.Item>
            ),
        },
        {
            title: '操作',
            dataIndex: 'tool',
            render: (text: any, recode: obj, index: number) => (
                <Tool>
                    {index === formData.flows.length - 1 && (
                        <Button icon="plus" type="primary" onClick={addEditRow}></Button>
                    )}
                    {index !== formData.flows.length - 1 && (
                        <Button icon="minus" type="danger" onClick={() => delEditRow(index)}></Button>
                    )}
                </Tool>
            ),
        },
    ];

    const validator = (key: string, recode: obj, index: number, value: any, callback: any) => {
        // 参与人或者参与角色
        const otherValue = recode[key];
        if ((!value || !value.length) && (!otherValue || !otherValue.length)) {
            callback('请填写该字段');
        } else {
            callback();
        }
        // 必须使用settimeout否则值有延迟
        setTimeout(() => {
            validateFields([`${key}_${index}`]);
        }, 0);
    };

    // 监听下拉框变化
    const rowChange = (key: string, value: string, recode: obj, index: number) => {
        formData.flows[index] = {
            ...formData.flows[index],
            [key]: value,
        };
        setformData({
            ...formData,
            flows: formData.flows,
        });
    };

    // 增加编辑表格行
    const addEditRow = () => {
        setformData({
            ...formData,
            flows: [
                ...formData.flows,
                {
                    event_id: '',
                    uids: [],
                    role_ids: [],
                    alias_name: '',
                },
            ],
        });
    };

    // 删除编辑表格行
    const delEditRow = (index: number) => {
        const flows = formData.flows.filter((item, i) => {
            return i !== index;
        });
        setformData({
            ...formData,
            flows,
        });
        // setValues(formData)
    };

    // 新增编辑提交
    const editCommit = () => {
        validateFields((err: any, values: any) => {
            if (err) return;

            const params = {
                template_id: formData.template_id,
                flows: formData.flows.map((item, i) => ({
                    step: i + 1,
                    ...item,
                })),
            };
            seteditData({
                ...editData,
                loading: true,
            });
            http.post(editUrl, params).then((res) => {
                seteditData({
                    ...editData,
                    loading: false,
                });
                if (res.code == 0) {
                    seteditData({
                        ...editData,
                        show: false,
                    });
                    dispatch(fetchTable(url));
                }
            });
        });
    };

    return (
        <Modal
            title={editData.isEdit ? '编辑' : '新增'}
            visible={editData.show}
            width={1350}
            onOk={editCommit}
            onCancel={() =>
                seteditData({
                    ...editData,
                    show: false,
                })
            }
            footer={[
                <Button
                    key="cancel"
                    onClick={() =>
                        seteditData({
                            ...editData,
                            show: false,
                        })
                    }>
                    取消
                </Button>,
                <Button key="commit" type="primary" loading={editData.loading} onClick={editCommit}>
                    确定
                </Button>,
            ]}>
            <Form layout="inline">
                <Form.Item key="template_id" label="模版" style={{ marginBottom: '20px' }}>
                    {getFieldDecorator('template_id', {
                        rules: [{ required: true, message: '请填写该字段' }],
                    })(
                        <Select
                            placeholder="请选择模版"
                            disabled={editData.isEdit}
                            style={{ width: 300 }}
                            onChange={(value: string) => setformData({ ...formData, template_id: value })}>
                            {templateList.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Table
                    columns={editColumns}
                    dataSource={formData.flows}
                    pagination={false}
                    rowKey={(record, i) => `${i}`}
                />
            </Form>
        </Modal>
    );
};

export default Form.create<editModelProps & FormComponentProps>()(EditModel);
