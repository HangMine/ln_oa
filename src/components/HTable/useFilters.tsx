import React, { useState, useEffect } from 'react';
import http from '@/assets/js/http';

// 处理optionsUrl，斌值options
const useFilters = (filters: filters) => {
    const [resFilters, setresFilters] = useState(filters);
    useEffect(() => {
        let promises: any[] = [];
        // 这里需要新建一个对象，否则options无法复用(不用JSON.parse，无法复制函数)
        let _resFilters: filters = [...resFilters];
        _resFilters.forEach((filter) => {
            if (filter.optionsUrl) {
                const promise = http(filter.optionsUrl, filter.optionsParams);
                promises.push(promise);
                promise.then((res) => {
                    filter.options = res.data || [];
                });
            }
        });
        Promise.all(promises).then(() => {
            setresFilters(_resFilters);
        });
    }, []);

    const res: [filters, any] = [resFilters, setresFilters];
    return res;
};

export default useFilters;
