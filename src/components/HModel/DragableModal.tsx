import React, { FC, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import './DragableModal.scss';

let startPosition = {
    x: 0,
    y: 0,
};

let moveDisance = {
    x: 0,
    y: 0,
};

let draging = false;

let initStyle = {
    top: 100,
    left: 0,
};

const getTarget = (currentDom: HTMLElement): HTMLElement => {
    const isTarget = currentDom.classList.contains('ant-modal-header') || currentDom.nodeName === 'BODY';
    return isTarget ? currentDom : getTarget(currentDom.parentElement!);
};

const DragableModel: FC<ModalProps> = ({ children, ...props }) => {
    const { visible, title } = props;

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
        e.preventDefault();
        moveDisance = {
            x: e.pageX - startPosition.x,
            y: e.pageY - startPosition.y,
        };
        setstyle((style) => {
            let newStyle = { top: initStyle.top + moveDisance.y, left: initStyle.left + moveDisance.x };
            return handleBounder(newStyle);
        });
    }, []);

    const end = useCallback((e: MouseEvent) => {
        if (!draging) return;
        draging = false;
        initStyle = { top: initStyle.top + moveDisance.y, left: initStyle.left + moveDisance.x };
    }, []);

    // 边界情况处理
    const handleBounder = (style: typeof initStyle) => {
        let { top, left } = style;
        const { clientWidth } = document.documentElement;
        const modalWidth = getTarget(titleRef.current!).clientWidth;
        const limitWidth = (clientWidth - modalWidth) / 2;
        top = Math.max(0, top);
        left = Math.max(-limitWidth, Math.min(left, limitWidth));
        return { top, left };
    };

    // 动画结束处理
    const handleAfterClose = useCallback(() => {
        initStyle = { top: 100, left: 0 };
        setstyle(initStyle);
    }, []);

    // 标题DOM元素，用于获取宽度
    const titleDom = useMemo(() => <div ref={titleRef}>{title}</div>, [title]);

    useEffect(() => {
        if (visible) {
            //    显示时
            document.addEventListener('mousedown', start);
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', end);
        } else {
            //    隐藏时
            document.removeEventListener('mousedown', start);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
        }
    }, [visible]);

    return (
        <Modal {...props} style={style} title={titleDom} afterClose={handleAfterClose}>
            {children}
        </Modal>
    );
};

export default DragableModel;
