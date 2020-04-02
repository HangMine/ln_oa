import React, { FC, useState, useEffect, useMemo, ReactElement } from 'react';
import { Button, Modal } from 'antd';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchTable } from '@/redux/actions';
import http from '@/assets/js/http';
import HFilter from '@/components/HFilter/HFilter';
import { timeFormat, handleUpload } from '@/assets/js/common';
import { useCurrent } from '../use/useCurrent';
import DragableModal from './DragableModal';
import { LocationState } from 'history';
type HMdeolProp = {
    filters: filters;
    url?: string;
    params?: LocationState;
    commitUrl: string;
    commitParams?: LocationState;
    onCommited?: (res: res) => void;
    httpType?: string;
    data: {
        show: boolean;
        loading: boolean;
        isEdit: boolean;
        row: obj;
        title: string;
    };
    setData: (any: any) => void;
    handleValues?: (values: obj) => any;
    rowKey?: string;
    title?: string;
    cols?: 1 | 2 | 3 | 4 | 6 | 8;
    noReset?: Boolean;
    front?: ReactElement;
    end?: ReactElement;
    [any: string]: any;
};

const HModel: FC<HMdeolProp> = ({
    filters,
    url,
    params,
    commitUrl,
    commitParams,
    onCommited,
    httpType,
    data,
    setData,
    handleValues,
    rowKey,
    title,
    cols,
    noReset,
    front,
    end,
    ...otherProps
}) => {
    const dispatch = useDispatch();
    const filterParams = useMappedState((state) => state.filterParams);
    const [form, setform]: [any, any] = useCurrent({});
    const { getFieldDecorator, validateFields, resetFields, validateFieldsAndScroll } = form;
    const [loading, setloading] = useState(false);

    const hasImmediate = useMemo(() => {
        return filters.some((filter) => filter.react && filter.react.immediate);
    }, [filters]);

    // 监听打开时(加上editForm的监听是因为弹窗显示后editForm还没有设置好值)
    useEffect(() => {
        if (!Object.keys(form).length) return;
        // if (data.isEdit) {
        //     setValues(data.row);
        // } else {
        //     reset();
        // }
        new Promise((resolve, reject) => {
            handleImmdiateCallback(data.row);
            resolve();
        }).then(() => {
            // 使用promise保证在handleImmdiateCallback后面设置值(可能延迟不够，会有警告)
            data.isEdit ? setValues(data.row) : reset();
        });
    }, [data, form]);

    // 重置
    const reset = () => {
        if (!Object.keys(form).length || !filters || noReset) return;
        resetFields();
    };

    // 处理需要马上执行的函数
    const handleImmdiateCallback = (row: obj) => {
        for (const filter of filters) {
            if (filter.react && filter.react.callback && filter.react.immediate) {
                const value = (row.info && row.info[filter.key]) || row[filter.key];
                filter.react.callback(value, form);
            }
        }
    };

    // 设置值
    const setValues = (row: obj) => {
        if (!Object.keys(form).length || !filters) return;

        const { setFieldsValue } = form;
        // 保留表单上的字段
        let resValues: obj = {};

        for (const filter of filters) {
            const key = filter.key;
            const value = row[filter.key];
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
        // 必须使用settimeout，否则会出现报错（虽然好像不影响使用）
        setTimeout(() => {
            setFieldsValue(resValues);
        }, 0);
    };

    // 获取参数
    const getFormParams = (filters: filters, obj: obj) => {
        timeFormat(filters, obj);
        handleUpload(filters, obj);
        if (handleValues) obj = handleValues(obj);
        return obj;
    };

    // 提交
    const _commit = () => {
        if (!commitUrl) {
            return;
        }
        validateFields((err: any, values: any) => {
            if (err) {
                validateFieldsAndScroll();
                return;
            }

            setloading(true);
            const _rowKey = rowKey || 'id';
            const _params = {
                [_rowKey]: data.isEdit ? data.row[_rowKey] : '',
                ...getFormParams(filters || [], values),
                ...commitParams,
            };
            const _http = httpType === 'post' ? http.post : http;

            _http(commitUrl, _params).then((res) => {
                setloading(false);
                onCommited && onCommited(res);
                if (res.code == 0) {
                    setData({
                        ...data,
                        show: false,
                    });
                    url && dispatch(fetchTable(url, { ...params, ...filterParams }));
                }
            });
        });
    };

    return (
        <DragableModal
            title={title || data.title || (data.isEdit ? '编辑' : '新增')}
            destroyOnClose={hasImmediate}
            visible={data.show}
            onOk={_commit}
            onCancel={() =>
                setData({
                    ...data,
                    show: false,
                })
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
                <Button key="commit" type="primary" loading={loading} onClick={_commit}>
                    确定
                </Button>,
            ]}
            {...otherProps}>
            {front}
            <HFilter cols={cols} data={filters} onForm={(form: any) => setform(form)}></HFilter>
            {end}
        </DragableModal>
    );
};

export default HModel;
