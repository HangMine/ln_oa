import React, { FC, useState, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

type DragItemProps = {
  item: obj,
  dragKeys: string[],
  onKeysChange: (dragKeys: string[]) => void
}
const DragItem: FC<DragItemProps> = ({ item, dragKeys, onKeysChange }) => {
  const [currentDragKeys, setcurrentDragKeys]: [string[], any] = useState([]);
  useEffect(() => {
    setcurrentDragKeys(dragKeys);
  }, [dragKeys])
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'disCol', key: item.key },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    //定义拖拽的类型
    accept: 'disCol',
    hover(dropItem: obj, monitor) {

      //异常处理判断
      if (!ref.current) {
        return
      }
      //拖拽目标的Index
      const dragIndex = currentDragKeys.findIndex(key => key === dropItem.key);
      //放置目标Index
      const hoverIndex = currentDragKeys.findIndex(key => key === item.key);
      // 如果拖拽目标和放置目标相同的话，停止执行
      if (dragIndex === hoverIndex) {
        return
      }

      currentDragKeys.splice(dragIndex, 1);
      currentDragKeys.splice(hoverIndex, 0, dropItem.key);
      onKeysChange(currentDragKeys);
      dropItem.index = hoverIndex;  //重新赋值index，否则会出现无限交换情况

    },
  })

  drag(drop(ref))

  return (
    <span ref={ref} className="drag-item">{item.title}</span>
  )
}

export default DragItem;