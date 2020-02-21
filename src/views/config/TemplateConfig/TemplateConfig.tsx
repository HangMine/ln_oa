import React, { FC, useState } from 'react'
import HTable from "@/components/HTable/HTable"
import { Button } from 'antd';
import HModel from "@/components/HModel/HModel"
import HBack from '@/components/HBack/HBack'
import { history } from '@/router'

// 接口
const url = 'config.templateConfig.index'

// 编辑接口
const editUrl = 'config.templateConfig.operate'

// 编辑模态框
const editFilters =
  [{
    key: 'name',
    title: '参数',
    type: 'input',
    rules: [{ required: true, message: '请埴写该字段' }]
  },
  {
    key: 'display',
    title: '参数名称',
    type: 'input',
    rules: [{ required: true, message: '请埴写该字段' }]
  },
  {
    key: 'input_type',
    title: '表单类型',
    type: 'radio',
    options: [{
      key: '1',
      title: '输入框'
    }, {
      key: '2',
      title: '下拉框'
    }, {
      key: '3',
      title: '上传框'
    }, {
      key: '4',
      title: '时间范围筛选框'
    }, {
      key: '5',
      title: '时间筛选框'
    }, {
      key: '6',
      title: '筛选框'
    }, {
      key: '7',
      title: '下拉输入框'
    }],
    initValue: '1',
    rules: [{ required: true, message: '请埴写该字段' }]
  },
  {
    key: 'require',
    title: '是否必填',
    type: 'radio',
    options: [{
      key: '1',
      title: '必填'
    }, {
      key: '2',
      title: '非必填'
    }],
    initValue: '1',
    rules: [{ required: true, message: '请埴写该字段' }]
  },
  {
    key: 'tip',
    title: '表单外提示',
    type: 'input',
  },
  {
    key: 'sort',
    title: '排序',
    type: 'input',
  },
  {
    key: 'ext',
    title: '额外信息',
    type: 'input',
  },
  ]

const TemplateConfig: FC = () => {

  const routeParams = history.location.state;

  // 新增编辑数据
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
    })
  }

  // 编辑
  const edit = (row: obj) => {
    seteditData({
      ...editData,
      show: true,
      isEdit: true,
      row: row
    })
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
      title: '操作',
      dataIndex: 'tool',
      buttons: [{
        title: '编辑',
        fn: edit
      },],
    }]

  return (
    <section className="template-config">
      <HBack></HBack>
      <HTable url={url} params={routeParams} columns={columns} btns={btns}></HTable>
      {/* 新增编辑 */}
      <HModel filters={editFilters} url={url} params={routeParams} commitParams={routeParams} commitUrl={editUrl} data={editData} setData={seteditData}></HModel>
    </section>
  )
}

export default TemplateConfig;