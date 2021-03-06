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
                        <td>合同类型</td>
                        <td className="left" colSpan={5}>
                            <span>
                                <span className="square">□</span>联运
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>联运
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>独代
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
                        <td>合同内容</td>
                        <td className="left" colSpan={5}></td>
                    </tr>

                    <tr>
                        <td>签约方</td>
                        <td className="left" colSpan={5}>
                            {formData.contract_party}
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

                    <tr className="fat-tr">
                        <td colSpan={6} className="bold">
                            经办部门审核意见
                        </td>
                    </tr>

                    <tr>
                        <td style={{ lineHeight: 1.5 }}>
                            <div>公司综合</div>
                            <div>实力审查</div>
                        </td>
                        <td className="left" style={{ padding: 0 }} colSpan={5}>
                            <ul className="table-ul">
                                <li>
                                    1. 是否已通过平台合作调查表的调查
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

                    <tr>
                        <td style={{ lineHeight: 1.5 }}>
                            <div>运营团队</div>
                            <div>实力审查</div>
                        </td>
                        <td className="left" style={{ padding: 0 }} colSpan={5}>
                            <ul className="table-ul">
                                <li>
                                    1. 是否有运营捷游其他游戏产品的经验
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li style={{ lineHeight: 2, paddingLeft: '10px' }}>
                                    2. 是否有运营市面上主要热门游戏的经验
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ lineHeight: 1.5 }}>
                            <div>公司综合</div>
                            <div>实力审查</div>
                        </td>
                        <td className="left" style={{ padding: 0 }} colSpan={5}>
                            <ul className="table-ul">
                                <li>
                                    1. 是否已取得对方营业执照副本复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    2. 是否已取得对方网络文化经营许可证复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    3. 是否已取得对方ICP证复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    4. 是否已取得对方税务登记证复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    5. 是否已取得对方组织结构代码证复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li style={{ lineHeight: 2, paddingLeft: '10px' }}>
                                    6. 是否已取得对方国际域名注册证书复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="more-line-tr">
                        <td>合同有效期限</td>
                        <td className="left" colSpan={5}>
                            {formData.start_date} 至 {formData.end_date}
                        </td>
                    </tr>

                    <tr>
                        <td>序号</td>
                        <td>当月运营收入</td>
                        <td colSpan={2}>甲方分成比例</td>
                        <td colSpan={2}>乙方分成比例</td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td colSpan={2}></td>
                    </tr>

                    <tr>
                        <td className="bold">其他意见</td>
                        <td colSpan={5}>
                            <span style={{ float: 'right', marginRight: '100px' }}>
                                <span style={{ marginRight: '95px' }}>审核人：</span>
                                <span className="date-block"></span>年<span className="date-block"></span>月
                                <span className="date-block"></span>日
                            </span>
                        </td>
                    </tr>

                    <tr className="fat-tr">
                        <td colSpan={6} className="bold">
                            法务审核意见
                        </td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td colSpan={5} className="left" style={{ padding: 0, paddingLeft: '10px' }}>
                            已对经办部门审核内容进行复核
                            <span className="check right">
                                是<span className="square">□</span> 否<span className="square">□</span>
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td colSpan={5} className="left" style={{ padding: 0 }}>
                            <ul className="table-ul">
                                <li>
                                    主体资格所需文件是否齐备
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    合同形式是否合法
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    合同内容是否合法
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li style={{ lineHeight: 2, paddingLeft: '10px' }}>其他意见</li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="fat-tr">
                        <td colSpan={6} className="bold">
                            财务部审核意见
                        </td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td colSpan={5} className="left">
                            已进行了财务预算、履行程序、分成比例、结算条件、票据等财务方面的审核。
                        </td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td colSpan={5} className="left">
                            其他意见
                        </td>
                    </tr>

                    <tr className="left bold">
                        <td colSpan={6}>总经理审批:</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Union;
