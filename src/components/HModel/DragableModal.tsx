import React, { FC } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import useDrag from './useDrag';
import './DragableModal.scss';

const DragableModel: FC<ModalProps> = ({ children, ...props }) => {
    const { style, titleDom, handleAfterClose } = useDrag(props);

    return (
        <Modal {...props} style={style} title={titleDom} afterClose={handleAfterClose}>
            {children}
        </Modal>
    );
};

export default DragableModel;
