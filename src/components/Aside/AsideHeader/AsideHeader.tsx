import React from 'react'
import { useMappedState } from 'redux-react-hook';
import './AsideHeader.scss'

type prop = {
  collapse: boolean
}
const AsideHeader: React.FC<prop> = ({ collapse }) => {
  const isMobile = useMappedState(state => state.isMobile);
  return (
    <div className="aside-header" style={{ marginLeft: collapse ? '15px' : '5px' }}>
      <img src={require('@/assets/img/logo.png')} alt="logo" />
      {(isMobile || !collapse) && <h1 className="aside-header-title">合同线上审批系统</h1>}
    </div>
  )
}

export default AsideHeader;