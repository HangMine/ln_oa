import React, { FC, useState, useEffect } from 'react';
import '../common.scss';
// import 'paper-css/paper.min.css';
import { history } from '@/router';
import { to } from '@/assets/js/common';
import http from '@/assets/js/http';

const Union: FC = () => {
    const [imgLoaded, setimgLoaded] = useState(false);
    const [apiLoaded, setapiLoaded] = useState(false);
    const [formData, setformData] = useState<obj>({});
    useEffect(() => {
        imgLoaded && apiLoaded && window.print();
    }, [imgLoaded, apiLoaded]);
    useEffect(() => {
        getApiData();
        return () => {
            document.body.classList.remove('A4');
        };
    }, []);
    const imgOnload = () => {
        document.body.classList.add('A4');
        setimgLoaded(true);
    };

    const getApiData = () => {
        const id = history.location.pathname.split('/').reverse()[0];
        http('contract.manage.checkFormData', { id }).then((res) => {
            setformData(res.data || {});
            setapiLoaded(true);
        });
    };

    return (
        <section className="union print-table-wrap sheet padding-20mm">
            <table className="print-table">
                <thead>
                    <tr className="fat-tr">
                        <th colSpan={6} style={{ width: '210mm' }}>
                            <img
                                className="table-logo"
                                src={require('@/assets/img/table_logo.png')}
                                alt=""
                                onLoad={imgOnload}
                            />
                            合 同 审 批 表
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="left bold">
                        <td colSpan={6}>协议编号: {formData.number}</td>
                    </tr>

                    <tr>
                        <td style={{ width: '15%' }}>签约部门</td>
                        <td style={{ width: '20%' }}>{formData.department}</td>
                        <td style={{ width: '10%' }}>签约人</td>
                        <td style={{ width: '15%' }}>{formData.m_uname}</td>
                        <td style={{ width: '20%' }}>申请日期</td>
                        <td style={{ width: '20%' }}>{formData.apply_date}</td>
                    </tr>

                    <tr>
                        <td>签约主体</td>
                        <td className="left" colSpan={5}>
                            {formData.company_name}
                        </td>
                    </tr>

                    <tr>
                        <td>合同来源</td>
                        <td className="left" colSpan={5}>
                            <span>
                                对方提供<span className="square">□</span>
                            </span>
                            <span className="table-check-box-wrap">
                                我司拟定<span className="square">□</span>
                            </span>
                            <span className="table-check-box-wrap">
                                格式合同<span className="square">□</span>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>合同类型</td>
                        <td className="left" colSpan={5}>
                            <span>
                                <span className="square">□</span>联运
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>外放
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>投放
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>公会
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>代理
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>其他：
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>合同名称</td>
                        <td className="left" colSpan={5}>
                            {formData.title}
                        </td>
                    </tr>

                    <tr>
                        <td>签约方</td>
                        <td className="left" colSpan={5}>
                            {formData.contract_party}
                        </td>
                    </tr>

                    <tr>
                        <td>合作游戏</td>
                        <td className="left" colSpan={5}>
                            {(Array.isArray(formData.game_name) &&
                                formData.game_name.map((item) => item.game_name).join('、')) ||
                                ''}
                        </td>
                    </tr>

                    <tr>
                        <td style={{ padding: 0 }}>合同有效期限</td>
                        <td className="left" colSpan={5}>
                            {formData.start_date} 至 {formData.end_date}
                        </td>
                    </tr>

                    <tr>
                        <td>渠道/版本</td>
                        <td>
                            <small>当月游戏用户实际充值总额</small>
                        </td>
                        <td colSpan={2}>甲方分成比例</td>
                        <td colSpan={2}>乙方分成比例</td>
                    </tr>

                    <tr className="empty-tr">
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr className="empty-tr">
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr className="empty-tr">
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr className="empty-tr">
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr className="empty-tr">
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr className="double-tr">
                        <td style={{ padding: 0 }}>是否有特殊要求</td>
                        <td className="left" colSpan={5}></td>
                    </tr>

                    <tr className="fat-tr">
                        <td colSpan={6} className="bold">
                            经办部门审核意见
                        </td>
                    </tr>

                    <tr>
                        <td style={{ lineHeight: 1.5, padding: 0 }}>
                            <div>对方资质审查</div>
                        </td>
                        <td className="left" style={{ padding: 0 }} colSpan={5}>
                            <ul className="table-ul">
                                <li>
                                    1. 是否已经合作方资质审批
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li style={{ lineHeight: 2, paddingLeft: '10px' }}>
                                    2. 是否已通过运营部门、业内同行的了解评估
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="fat-tr left bold ">
                        <td colSpan={6}>审核人:</td>
                    </tr>

                    <tr className="fat-tr">
                        <td colSpan={6} className="bold">
                            法务审核意见
                        </td>
                    </tr>

                    <tr className="left ">
                        <td colSpan={6}>已对经办部门审核内容、主体资格、合同形式、合同内容的合法性进行复核。</td>
                    </tr>

                    <tr className="fat-tr left bold">
                        <td colSpan={6}>审核人:</td>
                    </tr>

                    <tr className="fat-tr">
                        <td colSpan={6} className="bold">
                            财务审核意见
                        </td>
                    </tr>

                    <tr className="left">
                        <td colSpan={6}>已进行了财务预算、履行程序、分成比例、结算条件、票据等财务方面的审核。</td>
                    </tr>

                    <tr className="fat-tr left bold">
                        <td colSpan={6}>审核人:</td>
                    </tr>

                    <tr className="left bold double-tr">
                        <td colSpan={6}>总经理审批:</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Union;
