import React, { useState, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { fetchTable } from '@/redux/actions';
import http from '@/assets/js/http';
import { timeFormat, handleUpload } from '@/assets/js/common';

type useViewProp = {
    url: string;
    editUrl?: string;
    httpType?: string;
    params?: obj;
    editParams?: obj;
    rowKey?: string;
    editFilters?: filters;
};

function useView({ url, editUrl, httpType, params, editParams, rowKey, editFilters }: useViewProp) {
    const dispatch = useDispatch();
    const [editShow, seteditShow] = useState(false);
    const [editLoading, seteditLoading] = useState(false);
    const [editForm, seteditForm]: [any, any] = useState(null);
    const [isEdit, setisEdit] = useState(false);
    const [row, setrow]: [obj, dispatch] = useState({});

    // 监听打开时(加上editForm的监听是因为弹窗显示后editForm还没有设置好值)
    useEffect(() => {
        isEdit ? setValues(row) : reset();
    }, [row, editForm]);

    // 获取到HFilter的form,然后设置到editForm
    const onForm = (form: any) => {
        seteditForm(form);
    };

    // 新增
    const add = () => {
        setisEdit(false);
        seteditShow(true);
        setrow({});
    };

    // 编辑
    const edit = (row: obj) => {
        setisEdit(true);
        seteditShow(true);
        setrow(row);
    };

    // 重置
    const reset = () => {
        if (!editForm || !editFilters) return;
        const { resetFields } = editForm;
        resetFields();
    };

    // 设置值
    const setValues = (row: obj) => {
        if (!editForm || !editFilters) return;
        const { setFieldsValue } = editForm;
        // 只保留表单需要的字段
        let resValues: obj = {};
        for (const [key, item] of Object.entries(row)) {
            const filter = editFilters.find((filter) => filter.key === key);
            if (filter) {
                switch (filter.type) {
                    // 处理上传类型的参数
                    case 'upload':
                        const uploadItem = item || [];
                        resValues[key] = uploadItem.map((_item: any, i: number) => {
                            return {
                                uid: i,
                                name: (_item && _item.split('/').slice(-1)[0]) || '',
                                status: 'done',
                                url: _item,
                            };
                        });
                        break;
                    default:
                        resValues[key] = item;
                        break;
                }
            }
        }
        setFieldsValue(resValues);
    };

    // 获取参数
    const getParams = (filters: filters, obj: obj) => {
        timeFormat(filters, obj);
        handleUpload(filters, obj);
        return obj;
    };

    // 提交
    const commit = () => {
        if (!editUrl) {
            return;
        }
        const { validateFields } = editForm;
        validateFields((err: any, values: any) => {
            if (err) return;
            seteditLoading(true);
            const _rowKey = rowKey || 'id';
            const _params = {
                [_rowKey]: isEdit ? row[_rowKey] : '',
                ...editParams,
                ...getParams(editFilters || [], values),
            };
            const _http = httpType === 'post' ? http.post : http;
            _http(editUrl, _params).then((res) => {
                seteditLoading(false);
                if (res.code == 0) {
                    seteditShow(false);
                    dispatch(fetchTable(url, params));
                }
            });
        });
    };

    return {
        onForm,
        isEdit,
        add,
        edit,
        commit,
        editShow,
        seteditShow,
        editLoading,
        seteditLoading,
        setrow,
    };
}

export default useView;
