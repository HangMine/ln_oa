import React, { FC } from 'react'
import { useMappedState, useDispatch } from "redux-react-hook"
import { Button, Menu, Dropdown, Icon } from "antd"

type ToolProps = {
  children?: any
}
const MTool: FC<ToolProps> = ({ children }) => {
  const menu = (
    <Menu>
      {
        children && children.map((child: any, i: number) => (
          <Menu.Item key={i}>
            {child}
          </Menu.Item>
        ))
      }
    </Menu>
  );
  const dropDown = (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        操作<Icon type="down" />
      </a>
    </Dropdown>
  )

  return dropDown;
}

const Tool: FC<ToolProps> = ({ children }) => {
  const isMobile = useMappedState(state => state.isMobile);
  // 使children变成数组
  if (children) {
    children = children && children.length ? children : [children]
  }
  return (
    isMobile ? <MTool>{children}</MTool> : <>{children}</>
  )
}

export default Tool;