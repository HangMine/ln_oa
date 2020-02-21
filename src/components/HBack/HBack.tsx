import React, { FC } from 'react'
import { Icon } from 'antd'
import { history } from '@/router'
import "./HBack.scss";
const HBack = () => {
  return (
    <div className="h-back">
      <span onClick={() => history.go(-1)}>
        <Icon type="left" />返回
      </span>

    </div>
  )
}

export default HBack;