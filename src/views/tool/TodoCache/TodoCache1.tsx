import React, { FC, useState } from 'react';
import './TodoCache.scss';
import http from '@/assets/js/http';
import HightLight from '@/components/base/HightLight/HightLight';
import { Input, Button, Tag, Popconfirm, Radio } from 'antd';

const { TextArea } = Input;

const url = 'tool.todoCache';

const btns = [
    {
        key: 'getType',
        title: '获取key类型',
    },
    {
        key: 'unsetKey',
        title: '清除某个key',
        isConfirm: true,
    },
    {
        key: 'get',
        title: '获取某个string类型数据',
    },
    {
        key: 'set',
        title: '设置某个string类型数据',
        isConfirm: true,
    },
    {
        key: 'lrange',
        title: '获取list最近10条',
    },
    {
        key: 'llen',
        title: '获取list长度',
    },
    {
        key: 'countKey',
        title: '获取key的数量',
    },
    {
        key: 'push_list',
        title: '推进队列',
        isConfirm: true,
    },
    {
        key: 'set_new_ad_callback',
        title: '渠道或广告切至新版 旧版db(1) 谨慎！',
        isConfirm: true,
        type: 'danger',
    },
];

type propsType = {
    db: string;
};

const TodoCache: FC<propsType> = ({ db }) => {
    const [key, setkey] = useState('');
    const [value, setvalue] = useState('');
    const [res, setres] = useState({
        code: null,
        notice: '',
        data: '',
    });

    const action = (action: string) => {
        const params = {
            key,
            value,
            action,
            db,
        };
        http(url, params).then((res) => {
            setres({
                code: res.code,
                notice: res.notice,
                data: JSON.stringify(res.data),
            });
        });
    };

    const test =
        '{"raw":{"url":"http:\\/\\/mcs.snssdk.com\\/v2\\/event\\/json","params":{"user":{"user_unique_id":"7279395522","build_serial ":"unknow","openudid":null},"header":{"app_package":"menghuanjianghu01"},"events":[{"event":"purchase","params":"{\\"currency\\":\\"rmb\\",\\"is_success\\":\\"yes\\",\\"currency_amount\\":6}"}]}},"ret":"{\\"e\\":0,\\"message\\":\\"success\\",\\"sc\\":1}","package":{"campaign_id":"5338578123","channel_id":"652","leniu_ip":"183.6.55.82","leniu_lnid":"868067032833907","leniu_imei":"868067032833907","leniu_idfa":"","leniu_idfv":"","leniu_md5_device":"c83e61cf5fa52cb17bf31fd13a695ec1","event_time":1575625776,"event_type":"4","unique":"is_test_1575625776","leniu_user_id":"7279395522","is_test":1,"weixin_username":"wengyonglin","is_no_need_click":1,"push_times":8,"params":{"order_id":"is_test_1575625776","money":600},"campaignConfig":{"id":"317630","data_type":"1","app":"55960","campaign_id":"5338578123","game_id":"40","device_platform_id":"2","package_id":"30592","channel_id":"366","tag_id":"0","callback_type":[],"package_version":"1.00","final_url":"","third_part_track_url":"","follow_uid":"0","discount":"0.0000","encrypt_key":"","sign_key":"","ext_config":null,"is_test":"2","state":"1","m_uid":"0","m_time":"0","callback":[],"sdk_channel_shortname":"toutiaotoufang","sdk_channel_id":"176","sdk_channel_name":"\\u4eca\\u65e5\\u5934\\u6761\\uff08\\u4e50\\u725b\\uff09","third_data_key":"","package_campaign":"5338578123","channel_name":"\\u53d1\\u884c\\u6e20\\u9053","match_policy":"1","click_valid_time":"86400","receive_param":[]},"info":[],"callback_log_auto_id":"14067"}}';

    return (
        <section className="todo-cache">
            <div className="filter">
                <span className="filter-input-wrap">
                    <span className="filter-input-name">键名: </span>
                    <Input
                        value={key}
                        className="filter-input"
                        allowClear
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            setkey(e.target.value);
                        }}></Input>
                </span>

                <span className="block">
                    <span className="filter-input-name">键值: </span>
                    <TextArea
                        value={value}
                        className="filter-textarea"
                        rows={8}
                        style={{ marginTop: '15px' }}
                        onChange={(e) => {
                            setvalue(e.target.value);
                        }}></TextArea>
                </span>

                {/* <span className="filter-input-wrap">
          <span className="filter-input-name">键值: </span><Input value={value} className="filter-input" allowClear onChange={(e) => { setvalue(e.target.value) }}></Input>
        </span> */}
            </div>
            <div className="btn-group">
                {btns.map((btn) => {
                    return btn.isConfirm ? (
                        <Popconfirm key={btn.key} title="确定执行该操作?" onConfirm={() => action(btn.key)}>
                            <Button type={btn.type || ('primary' as any)}>{btn.title}</Button>
                        </Popconfirm>
                    ) : (
                        <Button key={btn.key} type={btn.type || ('primary' as any)} onClick={() => action(btn.key)}>
                            {btn.title}
                        </Button>
                    );
                })}
            </div>
            <div className="content">
                {(res.code || res.code === 0) && (
                    <>{res.code == '0' ? <Tag color="green">{res.notice}</Tag> : <Tag color="red">{res.notice}</Tag>}</>
                )}
                <HightLight content={test} style={{ marginTop: '10px', height: '150px' }}></HightLight>
            </div>
        </section>
    );
};

export default TodoCache;
