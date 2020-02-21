import React, { FC, useState } from 'react';
import TodoCache1 from './TodoCache1';
import TodoCache2 from './TodoCache2';
import { Radio } from 'antd';
const dbMap: obj = {
    redis_db_9: 'redis-cli -h S1.STATIS.LNREDIS.COM (db:9)',
    redis_statis_db_1: 'redis-cli -h STATIS.LNREDIS.COM (db:1)',
};
const TodoCache: FC = () => {
    const [db, setdb] = useState('redis_db_9');
    return (
        <>
            <ul className="red">
                <li>当前redis实例：</li>
                <li>
                    <Radio.Group
                        onChange={(e) => {
                            setdb(e.target.value);
                        }}
                        value={db}>
                        {Object.entries(dbMap).map(([key, item]) => (
                            <Radio key={key} value={key}>
                                {item}
                            </Radio>
                        ))}
                    </Radio.Group>
                </li>
                {/* <li>{dbMap[db]}</li>
                <li>{dbIndexMap[db]} </li> */}
            </ul>
            <TodoCache1 db={db}></TodoCache1>
            <TodoCache2 db={db}></TodoCache2>
        </>
    );
};

export default TodoCache;
