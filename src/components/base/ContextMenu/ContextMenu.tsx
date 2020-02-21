import React, { FC, Children, cloneElement, useState, useEffect, useRef, forwardRef, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';
import $ from '@/assets/js/hQuery';
import './ContextMenu.scss';
type ContextMenuProp = {
    visable?: boolean;
    event?: any;
    trigger?: 'hover' | 'click';
    title?: string;
};
const ContextMenu: FC<ContextMenuProp> = ({ visable, event, trigger = 'hover', title, children }) => {
    const [show, setshow] = useState(false);
    const [position, setposition] = useState({
        left: 0,
        top: 0,
    });
    const menuDom = useRef(null);
    const targetDom = useRef(null);
    // 加载时绑定clickOutside
    useEffect(() => {
        addDocumentEvent();
        return () => {
            removeDocumentEvent();
        };
    }, []);

    // 外部控制是否显示
    useEffect(() => {
        setshow(visable || false);
    }, [visable]);

    // 传递event: 当event改变时
    useEffect(() => {
        if (!event) return;
        setshow(true);
    }, [event]);

    // 核心函数
    useEffect(() => {
        if (!menuDom.current) return;
        if (show) {
            // 打开菜单
            const _target = event || (targetDom.current as any).parentNode;
            const position = getPosition(_target, menuDom.current!);
            setposition({
                left: position.left,
                top: position.top,
            });
        } else {
            // 关闭菜单
            setposition({
                left: 0,
                top: 0,
            });
        }
    }, [event, show]);

    //点击outside,隐藏右键菜单
    const addDocumentEvent = () => {
        document.addEventListener('click', clickOutSide);
    };
    const removeDocumentEvent = () => {
        document.removeEventListener('click', clickOutSide);
    };
    //点击空白事件
    const clickOutSide = (e: Event) => {
        const isOutSide = !$(e.target).parent('.context-menu');
        if (isOutSide) {
            setshow(false);
        }
    };

    // 给最子级的菜单添加点击关闭菜单事件
    children = Children.toArray(children).map((child: any) => {
        const onClick = child.props.onClick;
        const isContextMenu = child && child.type && child.type.name === 'ContextMenu';
        if (onClick && !isContextMenu) {
            return cloneElement(child, {
                onClick: (e) => {
                    onClick(e);
                    setshow(false);
                },
            });
        } else {
            return child;
        }
    });

    return (
        <>
            {title && <span ref={targetDom}>{title}</span>}
            {show && (
                <ul
                    ref={menuDom}
                    className="context-menu"
                    style={{
                        position: 'fixed',
                        left: `${position.left}px`,
                        top: `${position.top}px`,
                    }}>
                    {children}
                </ul>
            )}
        </>
    );
};

// item
type ContextMenuItemProp = {
    onClick?: (e: any) => void;
};
const ContextMenuItem: FC<ContextMenuItemProp> = ({ children, onClick }: any) => {
    const isContextMenu = children && children.type && children.type.name === 'ContextMenu';
    const [show, setshow] = useState(false);

    // 悬浮时
    const onMouseEnter = () => {
        setshow(true);
    };

    // 离开时
    const onMouseLeave = () => {
        setshow(false);
    };

    // 点击弹出菜单
    const itemClick = (e: React.MouseEvent) => {
        setshow(true);
    };

    if (isContextMenu) {
        const trigger = children.props.trigger || 'hover';
        children = Children.toArray(children).map((child) => cloneElement(child, { visable: show }));
        switch (trigger) {
            case 'hover':
            default:
                return (
                    <li onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        {children}
                    </li>
                );
            case 'click':
                return <li onClick={itemClick}>{children}</li>;
        }
    } else {
        return <li onClick={onClick}>{children}</li>;
    }
};

// 获取右键菜单弹出层位置
const getPosition = (target: MouseEvent | HTMLElement | { x: number; y: number }, menuDom: HTMLElement) => {
    let x, y;
    if (target instanceof MouseEvent) {
        // 鼠标位置
        x = target.pageX;
        y = target.pageY;
    } else if (target instanceof HTMLElement) {
        // 传入元素，定位到右上角
        const pos = target.getBoundingClientRect();

        x = pos.right;
        y = pos.top;
    } else {
        // 自定义位置
        x = target.x || 0;
        y = target.y || 0;
    }

    const viewWid = document.documentElement.clientWidth;
    const viewHei = document.documentElement.clientHeight;
    const domWid = menuDom.offsetWidth;
    const domHei = menuDom.offsetHeight;
    const distanceX = x + domWid - viewWid;
    const distanceY = y + domHei - viewHei;
    const position = {
        left: distanceX > 0 ? x - domWid : x,
        top: distanceY > 0 ? y - domHei : y,
    };
    return position;
};

export { ContextMenu, ContextMenuItem };
