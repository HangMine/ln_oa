import React, { FC, useState, useEffect, useMemo } from 'react';
import http, { getUrl } from '@/assets/js/http';
import { Transfer, Modal, Button, Spin, Form, Select, Input, message, Row, Col } from 'antd';
import './HTableHeader.scss';
import DragItem from './DragItem';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import usePrevious from '@/components/use/usePrevious';

const { Option } = Select;

type HTableHeaderProps = {
    url: string;
    onTagChange: (tag: string) => void;
    onColsChange?: (cols: string[]) => void;
    activeTab?: string;
    targets?: obj[];
};
let once = {
    show: true,
    tag: true,
    user: true,
    setCols: true,
};
const HTableHeader: FC<HTableHeaderProps> = ({ url, onTagChange, onColsChange, activeTab, targets }) => {
    const reverseArr = getUrl(url)
        .split('/')
        .reverse();
    const controller = reverseArr[1];
    const action = reverseArr[0];

    const [show, setshow] = useState(false);
    const [loading, setloading] = useState(false);
    // 标签相关
    const [tag, settag] = useState('0');
    const [tags, settags]: [obj[], any] = useState([]);
    const [tagName, settagName] = useState();
    // 选项卡
    const [target, settarget] = useState();
    // 用户相关
    const [user, setuser] = useState('0');
    const [users, setusers]: [obj[], any] = useState([]);
    // 数据源
    const [dataSource, setdataSource] = useState();
    // 显示列
    const [disKeys, setdisKeys]: [string[], any] = useState([]);
    // 隐藏列(用于提交参数)
    const [hideKeys, sethideKeys]: [string[], any] = useState([]);
    // 提交Loading
    const [commitLoading, setcommitLoading] = useState(false);

    useEffect(() => {
        // 首次加载
        // 设置用户下拉数据
        http('pub.user').then((res) => {
            setusers(res.data || []);
        });
        // 获取标签数据
        setTags();
    }, []);

    // 显隐时
    useEffect(() => {
        // 第一次不执行
        if (once.show) {
            once.show = false;
            return;
        }
        if (show) setCols();
        // 显示时获取表头数据，关闭时获取最新的标签数据
        // show ? setCols() : setTags();
    }, [show]);

    // 当外面的选项卡改变时，同步里面的选项卡
    useEffect(() => {
        if (!activeTab) return;
        settarget(activeTab);
    }, [activeTab]);

    // 选项卡修改
    const prevTarget = usePrevious(target);
    useEffect(() => {
        // 需判断是否相等，否则会执行多一次
        if (prevTarget === target) return;
        setTags();
        // 如果原来标签为默认，则需要拉Cols数据，如果不是，则通过修改标签拉Cols数据（否则会拉取两次）
        tag === '0' ? setCols() : settag('0');
    }, [target]);

    // 用户修改,修改标签为默认，刷新表头
    useEffect(() => {
        // 第一次不执行
        if (once.user) {
            once.user = false;
            return;
        }
        tag === '0' ? setCols() : settag('0');
    }, [user]);

    // 标签修改
    useEffect(() => {
        // 同步标签名称
        const newTag = tags.find((item) => item.id === tag);
        let tagName = '';
        switch (tag) {
            case '':
                tagName = '';
                break;
            case '0':
                tagName = '默认';
                break;
            default:
                tagName = newTag && newTag.name;
                break;
        }
        settagName(tagName);
        // 暴露标签出去
        onTagChange(tag);

        // 第一次不拉接口
        if (once.tag) {
            once.tag = false;
            return;
        }
        // 不是新增时，重新拉Cols
        tag !== '' && setCols(tag);
    }, [tag]);

    // 暴露隐藏列
    const exportCols = (cols: string[]) => {
        onColsChange && onColsChange(cols);
    };

    // 获取所有表头相关数据
    const setCols = (_tag?: string) => {
        setloading(true);
        http('pub.tableHeader.cols', {
            controller,
            action,
            table_cols_tag_id: _tag || tag || '0',
            target,
            uid: user,
        }).then((res) => {
            setloading(false);
            const dataSource = [];
            const disKeys = [];
            const hideKeys = [];
            for (const col of res.data) {
                // 设置数据源
                dataSource.push({ key: col.cols_key, title: col.cols_name });
                // 设置隐藏列和显示列
                col.is_show === '1' ? disKeys.push(col.cols_key) : hideKeys.push(col.cols_key);
            }
            setdataSource(dataSource);
            setdisKeys(disKeys);
            sethideKeys(hideKeys);

            if (once.setCols) exportCols(dataSource.map((item) => item.key));
        });
    };

    // 获取标签数据
    const setTags = (tab?: string) => {
        http('pub.tableHeader.tags', {
            controller,
            action,
            table_cols_tag_id: 0,
            target: tab || target,
        }).then((res) => {
            settags(res.data);
        });
    };

    // 打开模态框
    const openModal = () => {
        setshow(true);
    };

    // 显示列和隐藏列变化
    const handleChange = (nextDisKeys: string[], direction: string, moveKeys: string[]) => {
        // push后在最下方，而不是按原来的排序
        if (direction === 'right') {
            setdisKeys([...disKeys, ...moveKeys]);
            sethideKeys(hideKeys.filter((item) => !moveKeys.includes(item)));
        } else {
            sethideKeys([...hideKeys, ...moveKeys]);
            setdisKeys(disKeys.filter((item) => !moveKeys.includes(item)));
        }
    };

    // 提交表头
    const commit = () => {
        const isAdd = tag === '';
        if (isAdd && tagName === '') {
            message.error('标签名称不能为空');
            return;
        }
        setcommitLoading(true);
        http('pub.tableHeader.commit', {
            controller,
            action,
            table_cols_tag_id: tag,
            cols_key: disKeys,
            un_show_cols_key: hideKeys,
            name: tagName,
            target,
            uid: user,
        })
            .then((res) => {
                setcommitLoading(false);
                if (res.code == '0') {
                    setshow(false);
                    exportCols(hideKeys);
                    // 获取最新标签数据
                    setTags();
                }
                if (isAdd) {
                    // 设置标签为默认
                    settag('0');
                }
            })
            .catch(() => {
                setcommitLoading(false);
            });
    };

    // 需要选项卡
    const isMenu = useMemo(() => targets && targets.length > 0, [targets]);

    //筛选框列宽
    const colspan = useMemo(() => (isMenu ? 6 : 8), [isMenu]);

    return (
        <>
            <div className="h-table-header">
                <Form.Item label="表头标签">
                    <Select
                        placeholder="请选择表头标签"
                        allowClear
                        style={{ width: 150 }}
                        value={tag}
                        onChange={(tag: string) => settag(tag)}>
                        {tags.map((tag) => (
                            <Option key={tag.id} value={tag.id}>
                                {tag.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Button onClick={openModal}>自定义表头</Button>
            </div>
            <Modal
                title="自定义表头"
                width={800}
                className="h-table-header-modal"
                visible={show}
                onOk={commit}
                onCancel={() => setshow(false)}
                confirmLoading={commitLoading}>
                <Form className="h-table-header-filter">
                    <Row gutter={20}>
                        <Col span={colspan}>
                            <Form.Item label="表头标签">
                                <Select
                                    placeholder="请选择表头标签"
                                    disabled={user !== '0'}
                                    value={tag}
                                    onChange={(tag: string) => settag(tag)}>
                                    <Option key="" value="" style={{ color: '#f5222d' }}>
                                        新增
                                    </Option>
                                    {tags.map((tag) => (
                                        <Option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={colspan}>
                            <Form.Item label={<span className="required">标签名称</span>}>
                                <Input
                                    placeholder="请选择标签名称"
                                    allowClear
                                    disabled={tag == '0'}
                                    value={tagName}
                                    onChange={(e) => settagName(e.target.value)}></Input>
                            </Form.Item>
                        </Col>

                        {isMenu && (
                            <Col span={colspan}>
                                <Form.Item label="选项卡">
                                    <Select
                                        placeholder="请选择选项卡"
                                        value={target}
                                        onChange={(target: string) => settarget(target)}>
                                        {targets!.map((target) => (
                                            <Option key={target.id} value={target.id}>
                                                {target.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={colspan}>
                            <Form.Item label="用户">
                                <Select
                                    placeholder="请选择用户"
                                    value={user}
                                    showSearch
                                    filterOption={(input, option: any) => option.props.children.includes(input)}
                                    onChange={(user: string) => setuser(user)}>
                                    <Option key="0" value="0" title="本人">
                                        本人
                                    </Option>
                                    {users.map((user) => (
                                        <Option key={user.id} value={user.id} title={user.name}>
                                            {user.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Spin spinning={loading}>
                    <DndProvider backend={HTML5Backend}>
                        <Transfer
                            className="h-table-header-transfer"
                            dataSource={dataSource}
                            titles={['隐藏列', '显示列']}
                            targetKeys={disKeys}
                            onChange={handleChange}
                            render={(item) => (
                                <DragItem
                                    item={item}
                                    dragKeys={disKeys}
                                    onKeysChange={(disKeys) => {
                                        setdisKeys([...disKeys]);
                                    }}></DragItem>
                            )}
                            listStyle={{
                                width: 210,
                                height: 300,
                            }}
                        />
                    </DndProvider>
                </Spin>
            </Modal>
        </>
    );
};

export default HTableHeader;
