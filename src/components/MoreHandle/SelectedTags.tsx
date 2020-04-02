import React, { FC, useMemo } from 'react';
import { Tag, Empty } from 'antd';
import './SelectedTags.scss';

type SelectTagsProps = {
    tags: string[];
    tip?: string;
};

const SelectTags: FC<SelectTagsProps> = ({ tags, tip = '已勾选以下记录:' }) => {
    const tagsEl = useMemo(() => tags.map((tag, i) => <Tag key={i}>{tag}</Tag>), [tags]);

    return (
        <div className="select-tags">
            <h4>{tip}</h4>
            {tags.length ? tagsEl : <Empty></Empty>}
        </div>
    );
};

export default SelectTags;
