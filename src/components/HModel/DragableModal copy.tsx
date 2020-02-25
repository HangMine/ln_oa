import React, { FC, Children, cloneElement, useState, useEffect, useRef, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { ModalProps } from 'antd/es/modal';
import './DragableModal.scss';

type DragableModelProps = {
    children: {
        props?: ModalProps;
    };
};

let initPosition = {
    x: 0,
    y: 0,
};

let draging = false;

const initTop = 100;

const DragableModel: FC<DragableModelProps> = ({ children }) => {
    console.log(children);
    const { width, visible, title } = children.props;
    const [top, settop] = useState<number>(initTop);
    const [left, setleft] = useState<number>(0);

    let moveDisance = {
        x: 0,
        y: 0,
    };

    const start = (e: MouseEvent) => {
        console.log('开始');
        e.persist();
        draging = true;
        initPosition = {
            x: e.pageX,
            y: e.pageY,
        };
    };

    const move = (e: MouseEvent) => {
        if (!draging) return;
        e.persist();
        moveDisance = {
            x: e.pageX - initPosition.x,
            y: e.pageY - initPosition.y,
        };
        console.log('移动', moveDisance);
        settop(initTop + moveDisance.y);
        setleft(moveDisance.x);
    };

    const end = (e: MouseEvent) => {
        console.log('结束');
        e.persist();
        draging = false;
        moveDisance = {
            x: 0,
            y: 0,
        };
        initPosition = {
            x: 0,
            y: 0,
        };
    };
    console.log(1);
    const props: any = {
        wrapClassName: 'dragable-modal',
        style: {
            top,
            left,
        },
        title: (
            <div onMouseDown={start} onMouseMove={move} onMouseUp={end}>
                {title}
            </div>
        ),
    };

    const resetChildren = () => {
        children = Children.toArray(children).map((child: any) => cloneElement(child, props));
    };
    resetChildren();

    useEffect(() => {
        if (visible) {
            // 显示时
        } else {
            // 隐藏时
        }
    }, [visible]);
    return <>{children}</>;
};

export default DragableModel;
