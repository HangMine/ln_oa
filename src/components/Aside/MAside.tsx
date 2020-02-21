import React, { FC } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { setMenuCollapse } from '@/redux/actions';
import PAside from './PAside';
import { Drawer } from 'antd';
import './MAside.scss';
const MAside: FC = () => {
    const dispatch = useDispatch();
    const collapse = useMappedState((state) => state.collapse);

    return (
        <Drawer
            className="m-aside"
            placement="left"
            closable={false}
            onClose={() => dispatch(setMenuCollapse(false))}
            visible={collapse}>
            <PAside></PAside>
        </Drawer>
    );
};

export default MAside;
