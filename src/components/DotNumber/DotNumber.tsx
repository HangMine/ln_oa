import React, { FC, Children, cloneElement } from 'react'
import { isNumber, numClear } from '@/assets/js/check'

type DotNumberProps = {
  form?: any,
  filterKey?: string | number
}

const DotNumber: FC<DotNumberProps> = ({ children, form, filterKey }) => {

  children = Children.toArray(children).map((child: any) => {

    return cloneElement(child, {
      onChange: (e: any) => {
        const { value } = e.target;
        const isEmpty = value === "";
        if (isNumber(value, 2) || isEmpty) {
          // 传了onChange用这种方式
          child.props.onChange && child.props.onChange(e)
        } else {
          // 传了form需要用这种方式,form和key需要一起传
          if (form && filterKey) {
            const { setFieldsValue } = form;
            const newValue = numClear(e.target.value);
            setFieldsValue({ [filterKey]: newValue })
          }
        }
      },
      onBlur: (e: any) => {
        e.target.value = (+e.target.value).toFixed(2);
        child.props.onChange && child.props.onChange(e)
      }
    })

  })

  return (
    <>
      {children}
    </>
  )
}

export default DotNumber;