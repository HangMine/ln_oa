import React, { FC, useEffect } from 'react';
import PAside from './PAside';
import MAside from './MAside';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchMenu } from '@/redux/actions';
const Aside: FC = () => {
    const dispatch = useDispatch();
    // 初始加载，获取后台菜单数据
    useEffect(() => {
        dispatch(fetchMenu());
    }, []);
    const isMobile = useMappedState((state) => state.isMobile);
    return <>{isMobile ? <MAside></MAside> : <PAside></PAside>}</>;
};

export default Aside;
