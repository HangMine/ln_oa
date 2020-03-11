import React, { useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react';
import { ModalProps } from 'antd/es/modal';

type useDragProps = (
    props: ModalProps
) => {
    style: typeof currentStyle;
    titleDom: ReactNode;
    handleAfterClose: () => void;
};

let startPosition = {
    x: 0,
    y: 0,
};

let moveDisance = {
    x: 0,
    y: 0,
};

let draging = false;

const initStyle = {
    top: 100,
    left: 0,
};

let currentStyle = { ...initStyle };

const getTarget = (currentDom: HTMLElement | null): HTMLElement | null => {
    if (!currentDom) return null;
    const isTarget = currentDom.classList.contains('ant-modal-header');
    return isTarget ? currentDom : getTarget(currentDom.parentElement!);
};

const useDrag: useDragProps = ({ visible, title }) => {
    const titleRef = useRef(null);

    const [style, setstyle] = useState(initStyle);

    const start = useCallback((e: MouseEvent) => {
        const target = getTarget(e.target as HTMLElement);
        if (!target) return;
        draging = true;
        startPosition = {
            x: e.pageX,
            y: e.pageY,
        };
    }, []);

    const move = useCallback((e: MouseEvent) => {
        if (!draging) return;
        moveDisance = {
            x: e.pageX - startPosition.x,
            y: e.pageY - startPosition.y,
        };
        setstyle((style) => {
            let newStyle = { top: currentStyle.top + moveDisance.y, left: currentStyle.left + moveDisance.x };
            return handleBounder(newStyle);
        });
    }, []);

    const end = useCallback((e: MouseEvent) => {
        if (!draging) return;
        draging = false;
        currentStyle = { top: currentStyle.top + moveDisance.y, left: currentStyle.left + moveDisance.x };
    }, []);

    // 边界情况处理
    const handleBounder = (style: typeof initStyle) => {
        let { top, left } = style;
        const { clientWidth } = document.documentElement;
        const target = getTarget(titleRef.current);
        const modalWidth = target ? target.clientWidth : 520;
        const limitWidth = (clientWidth - modalWidth) / 2;
        top = Math.max(0, top);
        left = Math.max(-limitWidth, Math.min(left, limitWidth));
        return { top, left };
    };

    // 动画结束处理
    const handleAfterClose = useCallback(() => {
        currentStyle = initStyle;
        setstyle(initStyle);
    }, []);

    // 标题DOM元素，用于获取宽度
    const titleDom = useMemo(() => <div ref={titleRef}>{title}</div>, [title]);

    useEffect(() => {
        if (visible) {
            //    显示时
            document.addEventListener('mousedown', start);
            document.addEventListener('mousemove', move, { passive: true });
            document.addEventListener('mouseup', end);
        } else {
            //    隐藏时
            document.removeEventListener('mousedown', start);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
        }
    }, [visible]);

    return { style, titleDom, handleAfterClose };
};

export default useDrag;
