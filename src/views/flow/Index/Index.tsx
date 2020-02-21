import React, { FC, useState, useEffect } from 'react'
import HTable from "@/components/HTable/HTable"
import { Button } from 'antd';
import http from "@/assets/js/http";
import EditModel from './EditModel'
// 接口
const url = 'flow.index.table'

// 主函数
const User: FC = () => {


  // 获取下拉列表
  const [templateList, settemplateList]: [obj[], any] = useState([]);
  const [eventList, seteventList]: [obj[], any] = useState([]);
  const [userList, setuserList]: [obj[], any] = useState([]);
  const [roleList, setroleList]: [obj[], any] = useState([]);
  useEffect(() => {
    // 模版列表
    http('pub.tempalte', { category: 1 }).then(res => {
      settemplateList(res.data || []);
    })
    // 事件列表
    http('pub.flowEvent', { is_flow: 1 }).then(res => {
      seteventList(res.data || []);
    })
    // 用户列表
    http('pub.user', { is_flow: 1 }).then(res => {
      setuserList(res.data || []);
    })
    // 角色列表
    http('pub.role', { is_flow: 1 }).then(res => {
      setroleList(res.data || []);
    })
  }, [])

  // 筛选框
  const filters = [
    {
      key: 'template_id',
      title: '模板',
      type: 'select',
      options: templateList,
      props: {
        style: { width: 240 }
      }
    }
  ]

  // 新增/编辑弹窗数据
  const [editData, seteditData]: [any, any] = useState({
    show: false,
    loading: false,
    isEdit: false,
    row: {}
  })



  // 新增
  const add = () => {
    seteditData({
      ...editData,
      show: true,
      isEdit: false,
      row: {}
    });

  }

  // 编辑
  const edit = (row: obj) => {
    seteditData({
      ...editData,
      show: true,
      isEdit: true,
      row: row
    });

  }

  // 按钮
  const btns = (
    <>
      <Button type="primary" icon="plus" onClick={add}>新建</Button>
    </>
  )

  // 自定义的列
  const columns = [
    {
      dataIndex: 'template_name',
    },
    {
      title: '操作',
      dataIndex: 'tool',
      buttons: [{
        title: '编辑',
        fn: edit
      }]
    }]


  return (
    <section className="flow-index">
      <HTable url={url} columns={columns} filters={filters} btns={btns} rowKey={(recode: any, i: number) => i}></HTable>
      {/* 新增编辑 */}
      <EditModel url={url} editData={editData} seteditData={seteditData} eventList={eventList} userList={userList} templateList={templateList} roleList={roleList}></EditModel>
    </section >
  )
}



export default User;