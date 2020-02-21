import React, { useState, useEffect, useRef, ReactNode, useMemo } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchTable, clearTable, setFilterParams } from '@/redux/actions';
import { useMapCurrent } from '@/components/use/useCurrent';
import { Table, Tabs, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import HFilter from '@/components/HFilter/HFilter';
import HTableHeader from '@/components/HTable/HTableHeader/HTableHeader';
import http from '@/assets/js/http';
import Tool from '@/components/HTable/Tool';
import { copy } from '@/assets/js/common';
import { Resizable } from 'react-resizable';
import './HTable.scss';

const { TabPane } = Tabs;

interface TableProp<T> {
    url: string;
    menu?: boolean;
    out?: boolean;
    params?: obj;
    filters?: filters;
    columns?: any[]; //传fixed属性时报错
    // columns?: ColumnProps<T>[],
    dataSource?: T[];
    btns?: ReactNode;
    tableHeader?: boolean;
    isMaxHeight?: boolean;
    handleData?: (any: obj[]) => any;
    onTab?: (activeTab: string) => void;
    onColsChange?: (cols: string[]) => void;
    [any: string]: any;
}

const ResizeableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
            <th {...restProps} />
        </Resizable>
    );
};

const components = {
    header: {
        cell: ResizeableTitle,
    },
};

interface HTableProp {
    <T>(props: TableProp<T>): any;
}

const HTable: HTableProp = ({
    url,
    menu,
    out,
    params,
    filters,
    columns,
    dataSource,
    btns,
    tableHeader = false,
    handleData,
    isMaxHeight,
    onTab,
    onColsChange,
    ...otherProps
}) => {
    const dispatch = useDispatch();
    const isMobile = useMappedState((state) => state.isMobile);
    const [maxHeight, setmaxHeight] = useState<string | undefined>(undefined);
    const [scroll, setscroll] = useState({ x: 'max-content', y: maxHeight });
    useEffect(() => {
        if (!isMaxHeight) return;
        setscroll({ x: 'max-content', y: maxHeight });
    }, [maxHeight]);

    const table = useMappedState((state) => state.table);
    const [tabs, settabs] = useState<{ id: string; name: string }[]>([]);
    const [tab, settab] = useState('');

    const filterParams = useMapCurrent('filterParams');
    const [pageParams, setpageParams] = useState({
        page: 1,
        limit: 20,
    });
    const [resParams, setresParams] = useState<obj>({
        ...pageParams,
        ...filterParams.current,
        ...params,
    });

    // 默认加载表格数据
    useEffect(() => {
        if (menu) {
            // 有菜单，通过修改tab来触发获取表格
            http(url, { tab: 1 }).then((res) => {
                const tabs = res.data || [];
                const tab = (tabs[0] && tabs[0].id) || '';
                settabs(tabs);
                settab(tab);
                // 有菜单，在渲染菜单之后设置高度
                setmaxHeight(getTableHeight(isMobile));
            });
        } else {
            // 没菜单，直接设置高度
            setmaxHeight(getTableHeight(isMobile));
            dispatch(fetchTable(url, resParams));
        }

        return () => {
            // 清除筛选数据
            dispatch(setFilterParams({}));
            // 清除表头和表格数据
            dispatch(clearTable());
        };
    }, []); //这里设置为filters是因为需要在确定筛选框高度之后设置高度

    // 监听filters
    useEffect(() => {
        // filter改变，在改变之后设置高度
        setmaxHeight(getTableHeight(isMobile));
        confirmMaxHeight();
    }, [filters]);

    // 监听tab
    useEffect(() => {
        if (!tab) return;
        // 根据tab页获取表格
        setTable({ target: tab });
        // 暴露到父组件
        onTab && onTab(tab);
    }, [tab]);

    // 在表格渲染完之后，重新确认设置maxHeight（为了清除当不需滚动条时，表格依然空出了滚动条宽度的问题）
    const confirmMaxHeight = () => {
        if (!isMaxHeight) return;
        setTimeout(() => {
            const tableBody = document.querySelector('.ant-table-body');
            if (tableBody && tableBody.scrollHeight < tableBody.clientHeight) {
                setmaxHeight(undefined);
            }
        }, 100);
    };

    // 合并dataSource
    let _dataSource = dataSource || table.data;

    // 处理表格数据
    if (handleData) {
        _dataSource = handleData(_dataSource);
    }

    const [_columns, set_columns] = useState<any[]>([]);
    useEffect(() => {
        const handleResize = (index: any) => (e: any, { size }: any) => {
            set_columns((columns: any[]) => {
                const nextColumns = [...columns];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width,
                };
                return nextColumns;
            });
        };

        let newColumns: any[] = [...table.columns];

        // 合并columns
        if (_dataSource.length) {
            // 如果有表格数据
            for (let _item of columns || []) {
                // 处理权限按钮
                if (_item.accessButton) {
                    _item = handleAccessButton(table, _item);
                }
                const mergeColumnIndex = table.columns.findIndex((item: any) => item.dataIndex === _item.dataIndex);
                const mergeColumn = table.columns[mergeColumnIndex];
                if (mergeColumn || _item.merge) {
                    // 合并项
                    if (mergeColumnIndex !== -1) newColumns[mergeColumnIndex] = { ...mergeColumn, ..._item };
                } else {
                    // 新增项
                    newColumns.push(_item);
                }
            }
        }

        set_columns(getHandledColumns(newColumns, _dataSource, isMobile, handleResize));

        //确认最大高度
        confirmMaxHeight();
    }, [_dataSource, table.columns, columns]);

    // 请求表格数据（该方法会设置resParams）
    const setTable = (params: obj) => {
        setresParams((resParams: obj) => {
            const newResParams = {
                ...resParams,
                ...filterParams.current,
                ...params,
            };
            dispatch(fetchTable(url, newResParams));
            return newResParams;
        });
    };

    // 分页、排序等变化
    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        const newPageParams = {
            page: pagination.current,
            limit: pagination.pageSize,
        };
        setpageParams(newPageParams);
        setTable(newPageParams);
    };

    // 搜索
    const onSearch = (searchParams: obj) => {
        setpageParams({ ...pageParams, page: 1 });
        setTable(searchParams);
    };

    // 表头标签同步到参数
    const tableTagChange = (tag: string) => {
        setresParams({ ...resParams, table_cols_tag_id: tag });
    };

    // 暴露隐藏列
    const colsChange = (cols: string[]) => {
        onColsChange && onColsChange(cols);
    };

    // 选项卡组件
    const tabsComponent = useMemo(
        () => (
            <Tabs tabPosition="top" onChange={(activeTab) => settab(activeTab)}>
                {tabs.map((tab) => (
                    // 只展示标签页，不展示标签内容
                    <TabPane tab={tab.name} key={tab.id}></TabPane>
                ))}
            </Tabs>
        ),
        [tab]
    );

    return (
        <div className="h-table">
            {filters && (
                <HFilter url={url} out={out} params={resParams} data={filters || []} isFilt onSearch={onSearch}>
                    {tableHeader && (
                        <HTableHeader
                            url={url}
                            activeTab={tab}
                            targets={tabs}
                            onTagChange={tableTagChange}
                            onColsChange={colsChange}></HTableHeader>
                    )}
                </HFilter>
            )}

            {btns && <div className="btn-rows">{btns}</div>}

            {menu && tabsComponent}

            <Table
                columns={_columns}
                dataSource={_dataSource}
                bordered
                components={components}
                pagination={{
                    total: table.total,
                    current: pageParams.page,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50'],
                    defaultPageSize: pageParams.limit,
                }}
                onChange={onChange}
                rowKey={(row, i) => `${i}`}
                loading={table.loading}
                size="middle"
                scroll={scroll}
                className="h-table-main"
                {...otherProps}
            />
        </div>
    );
};

// 主函数外方法----------------------------------------------------------------------

// 获取表格高度
const getTableHeight = (isMobile: boolean) => {
    const table = document.querySelector('.ant-table');
    if (!table || isMobile) return;
    const winHei = document.documentElement.clientHeight;
    const tableOffsetTop = table.getBoundingClientRect().top || 0;
    const tableHeaderHeight = 43;
    const pageHeight = 64;
    const paddingBottom = 24 + 24;
    const pcHeight = winHei - tableOffsetTop - tableHeaderHeight - pageHeight - paddingBottom;
    return `${pcHeight}px`;
};

// 处理权限按钮
const handleAccessButton = (table: any, column: any) => {
    const disButton = table.button.map((item: any) => ({
        ...item,
        fn: (column.accessButton[item.id] && column.accessButton[item.id].fn) || column.accessButton[item.id],
        rules: column.accessButton[item.id] && column.accessButton[item.id].rules,
    }));

    return (column = {
        ...column,
        render: (text: any, record: obj, index: number) => {
            return (
                <>
                    {// 传入的按钮
                    column.button &&
                        Object.values(column.button).map((button: any, i: number) => (
                            <Button key={i} type="link" onClick={() => button.fn(record)}>
                                {button.title}
                            </Button>
                        ))}
                    {// 权限控制的按钮
                    disButton.map(
                        (button: obj, i: number) =>
                            (button.rules === undefined || button.rules(record)) && (
                                <Button key={i} type="link" onClick={() => button.fn(record)}>
                                    {button.name}
                                </Button>
                            )
                    )}
                </>
            );
        },
    });
};

// 获取处理过的表头
const getHandledColumns = (columns: obj[], rows: obj[], isMobile: boolean, handleResize: any) => {
    columns = handleColumnWidth(columns, rows, isMobile);
    columns = handleTool(columns, isMobile);
    columns = addDoubleClick(columns, isMobile);
    columns = handleMoveColumn(columns, handleResize);
    columns = handleObjValue(columns);
    return columns;
};

// 增加可移动列
const handleMoveColumn = (columns: obj[], handleResize: any) => {
    // 列可移动
    return columns.map((item, index) => ({
        ...item,
        onHeaderCell: (column: obj) => ({
            width: column.width || 100,
            onResize: handleResize(index),
        }),
    }));
};

// 处理表头宽度
const handleColumnWidth = (columns: obj[], rows: obj[], isMobile: boolean) => {
    columns = columns.map((column) => {
        const contentWidth = getContentMaxWidth(rows, column);
        const headerWidth = getItemLength(column.title);
        const addWidth = column.addWidth || 0;
        const PADDING_WIDTH = 16;
        const width = column.width || Math.max(contentWidth, headerWidth) + addWidth + PADDING_WIDTH;
        return {
            width,
            ...column,
        };
    });
    return columns;
};

// 处理操作列
const handleTool = (columns: obj[], isMobile: boolean) => {
    const container = document.querySelector('.main-card .ant-card-body') as HTMLElement;
    if (!container) return columns;
    const containerPadding = +getComputedStyle(container).padding!.slice(0, -2);
    const containerWidth = container.clientWidth - containerPadding * 2;
    const widthArr = columns.map((column) => column.width);
    const columnsWidth = widthArr.length && widthArr.reduce((total, value) => total + value);
    const isScroll = columnsWidth > containerWidth;

    return columns.map((column: obj) => {
        if (column.dataIndex === 'tool') {
            return {
                render:
                    column.buttons || column.accessButtonFn
                        ? (text: any, record: obj, index: number) => {
                              return getToolButtons(column, record);
                          }
                        : undefined,
                fixed: isScroll && 'right',
                ...column,
                width: isMobile ? 80 : column.width,
            };
        } else {
            return column;
        }
    });
};

// 增加双击事件
const addDoubleClick = (columns: obj[], isMobile: boolean) => {
    if (isMobile) return columns;
    return (columns = columns.map((column) => ({
        ...column,
        onCell: (record: obj, index: number) => ({
            onDoubleClick: (e: any) => {
                const text = e.target.textContent;
                copy(text);
            },
        }),
    })));
};

// 处理当值为对象的情况
const handleObjValue = (columns: obj[]) => {
    return columns.map((column: obj) => {
        // 操作列和外部已经传入render的不作处理
        if (column.dataIndex === 'tool' || column.render) return column;
        return {
            ...column,
            render: (obj: any, record: obj, index: number) => {
                if (obj && obj.toString() === '[object Object]') {
                    // 如果是对象
                    if (obj.color) {
                        // 处理颜色
                        switch (obj.color) {
                            case 'green':
                            case 'red':
                            case 'yellow':
                            case 'blue':
                                return <span className={obj.color}>{obj.name}</span>;

                            default:
                                return <span style={{ color: obj.color }}>{obj.name}</span>;
                        }
                    } else {
                        return obj.name;
                    }
                } else if (typeof obj === 'string') {
                    // 如果是字符串
                    return obj;
                } else {
                    // 如果是其它，转成字符串
                    return JSON.stringify(obj);
                }
            },
        };
    });
};

// 获取操作按钮
const getToolButtons = (column: obj, record: obj) => {
    if (column.accessButtonFn) {
        return (
            <Tool>
                {(record.buttons || []).map((button: any, i: number) => (
                    <Button key={i} type="link" onClick={() => column.accessButtonFn(record, button.id, button.name)}>
                        {button.name}
                    </Button>
                ))}
            </Tool>
        );
    } else {
        return (
            <Tool>
                {column.buttons.map((button: any, i: number) => (
                    <Button key={i} type="link" onClick={() => button.fn(record)}>
                        {button.title}
                    </Button>
                ))}
            </Tool>
        );
    }
};

// 获取rows最宽长度
const getContentMaxWidth = (rows: obj[], column: obj) => {
    const columnName = column.dataIndex;
    const lengthArr = rows.map((item) => {
        if (columnName === 'tool' && (column.buttons || item.buttons)) {
            const buttons = column.buttons || item.buttons;
            return getToolButtonWidth(buttons);
        } else {
            return getItemLength(item[columnName]);
        }
    });
    const maxLength = Math.max.apply(null, lengthArr);
    return maxLength;
};

// 获取item长度
const SIGNLE_STRING_WIDTH = 8;
const DOUBLE_STRING_WIDTH = 14;
const getItemLength = (item: any) => {
    switch (typeof item) {
        case 'number':
            return Math.round(`${item}`.length * SIGNLE_STRING_WIDTH);
        case 'string':
            return getStrLength(item);
        case 'object':
            if (!item || item.name == 0) return 0; //值为null或者'0'时
            if (item.name) {
                return getStrLength(`${item.name}`);
            }
            return 100;
        default:
            return item ? 100 : 0; //固定宽度100，值为falsy则为0
    }
};

// 获取操作按钮长度
const getToolButtonWidth = (buttons: obj[]) => {
    const names = buttons.map((button) => button.name || button.title || '');
    const lengths = names.map((name) => name.length * 13 + 10); //10为左margin
    return lengths.reduce((total, value) => total + value) - 10; //10为扣掉第一个
};

// 获取字符长度
const getStrLength = (val: string) => {
    let doubleLength = (val.match(/[^\x00-\xff]/g) && val.match(/[^\x00-\xff]/g)!.length) || 0;
    let singleLength = val.length - doubleLength;
    return doubleLength * DOUBLE_STRING_WIDTH + Math.round(singleLength * SIGNLE_STRING_WIDTH);
};

export default HTable;
