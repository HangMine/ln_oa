import React, { FC, useState, useEffect } from 'react';
import HTable from '@/components/HTable/HTable';
import { Table, Button, Modal, Popconfirm, Form, Input, Select, Radio, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { useDispatch } from 'redux-react-hook';
import { fetchTable } from '@/redux/actions';
import http from '@/assets/js/http';
import Tool from '@/components/HTable/Tool';
const { Option } = Select;
// 接口
const url = 'flow.index.table';

// 编辑接口
const editUrl = 'flow.index.add';

// 新增编辑模态框
type editModelProps = {
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
    const [editTemplateId, seteditTemplateId] = useState('');
    const [editRows, seteditRows] = useState([
        {
            event_id: '',
            uids: [],
            role_ids: [],
        },
    ]);

    // 打开时处理
    useEffect(() => {
        // 编辑
        if (editData.isEdit) {
            seteditTemplateId(editData.row.template_id);
            seteditRows(
                editData.row.flows.map((item: any) => ({
                    event_id: item.event_id,
                    uids: item.uids,
                    role_ids: item.role_ids,
                }))
            );
            // 在渲染之后设置值
            setTimeout(() => {
                let editRowsValues: obj = {};
                editData.row.flows.forEach((item: any, i: number) => {
                    editRowsValues[`event_id_${i}`] = item.event_id;
                    editRowsValues[`uids_${i}`] = item.uids;
                    editRowsValues[`role_ids_${i}`] = item.role_ids;
                });
                setFieldsValue({
                    template_id: editData.row.template_id,
                    ...editRowsValues,
                });
            }, 0);
        } else {
            // 新增
            seteditTemplateId('');
            seteditRows([
                {
                    event_id: '',
                    uids: [],
                    role_ids: [],
                },
            ]);
            // 在渲染之后设置值
            setTimeout(() => {
                resetFields();
            }, 0);
        }
    }, [editData.show]);

    //新增编辑表头
    const editColumns = [
        {
            title: '步骤',
            dataIndex: 'step',
            render: (text: string, recode: obj, index: number) => <span>{index + 1}</span>,
        },
        {
            title: <span className="ant-form-item-required">事件</span>,
            dataIndex: 'event_id',
            render: (text: string, recode: obj, index: number) => (
                <Form.Item>
                    {getFieldDecorator(`event_id_${index}`, { rules: [{ required: true, message: '请填写该字段' }] })(
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
                <Form.Item>
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
                            onChange={(value: string) => rowChange('uids', value, recode, index)}>
                            {userList.map((option) => (
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
                <Form.Item>
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
                            onChange={(value: string) => rowChange('role_ids', value, recode, index)}>
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
            title: '操作',
            dataIndex: 'tool',
            render: (text: any, recode: obj, index: number) => (
                <Tool>
                    {index === editRows.length - 1 && <Button icon="plus" type="primary" onClick={addEditRow}></Button>}
                    {index !== editRows.length - 1 && (
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
        {
            editRows[index] = {
                ...editRows[index],
                [key]: value,
            };
            seteditRows(editRows);
        }
    };

    // 增加编辑表格行
    const addEditRow = () => {
        seteditRows([
            ...editRows,
            {
                event_id: '',
                uids: [],
                role_ids: [],
            },
        ]);
    };

    // 删除编辑表格行
    const delEditRow = (index: number) => {
        seteditRows(editRows.filter((item, i) => i !== index));
    };

    // 新增编辑提交
    const editCommit = () => {
        validateFields((err: any, values: any) => {
            if (err) return;

            const params = {
                template_id: editTemplateId,
                flows: editRows.map((item, i) => ({
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
            width={1200}
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
                    {getFieldDecorator('template_id', { rules: [{ required: true, message: '请填写该字段' }] })(
                        <Select
                            placeholder="请选择模版"
                            disabled={editData.isEdit}
                            style={{ width: 300 }}
                            onChange={(value: string) => seteditTemplateId(value)}>
                            {templateList.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Table columns={editColumns} dataSource={editRows} rowKey={(record, i) => `${i}`} />
            </Form>
        </Modal>
    );
};

const WrapEditModel = Form.create<editModelProps & FormComponentProps>()(EditModel);

// 主函数
const User: FC = () => {
    // 获取下拉列表
    const [templateList, settemplateList]: [obj[], any] = useState([]);
    const [eventList, seteventList]: [obj[], any] = useState([]);
    const [userList, setuserList]: [obj[], any] = useState([]);
    const [roleList, setroleList]: [obj[], any] = useState([]);
    useEffect(() => {
        // 模版列表
        http('pub.tempalte', { category: 1 }).then((res) => {
            settemplateList(res.data || []);
        });
        // 事件列表
        http('pub.flowEvent', { is_flow: 1 }).then((res) => {
            seteventList(res.data || []);
        });
        // 用户列表
        http('pub.user', { is_flow: 1 }).then((res) => {
            setuserList(res.data || []);
        });
        // 角色列表
        http('pub.role', { is_flow: 1 }).then((res) => {
            setroleList(res.data || []);
        });
    }, []);

    // 筛选框
    const filters = [
        {
            key: 'template_id',
            title: '模板',
            type: 'select',
            options: templateList,
            props: {
                style: { width: 300 },
            },
        },
    ];

    // 新增/编辑弹窗数据
    const [editData, seteditData]: [any, any] = useState({
        show: false,
        loading: false,
        isEdit: false,
        row: {},
    });

    // 新增
    const add = () => {
        seteditData({
            ...editData,
            show: true,
            isEdit: false,
            row: {},
        });
    };

    // 编辑
    const edit = (row: obj) => {
        seteditData({
            ...editData,
            show: true,
            isEdit: true,
            row: row,
        });
    };

    // 按钮
    const btns = (
        <>
            <Button type="primary" icon="plus" onClick={add}>
                新增
            </Button>
        </>
    );

    // 自定义的列
    const columns = [
        {
            title: '操作',
            dataIndex: 'tool',
            width: 40,
            render: (text: any, record: obj, index: number) => {
                return (
                    <>
                        <Button type="link" onClick={() => edit(record)}>
                            编辑
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <section className="template">
            <HTable url={url} columns={columns} filters={filters} btns={btns} rowKey="template_id"></HTable>
            {/* 新增编辑 */}
            <WrapEditModel
                editData={editData}
                seteditData={seteditData}
                eventList={eventList}
                userList={userList}
                templateList={templateList}
                roleList={roleList}></WrapEditModel>
        </section>
    );
};

export default User;
