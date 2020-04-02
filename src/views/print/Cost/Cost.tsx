import React, { FC, useState, useEffect } from 'react';
import '../common.scss';
import 'paper-css/paper.min.css';
import { history } from '@/router';
import { to } from '@/assets/js/common';
import http from '@/assets/js/http';

const Cost: FC = () => {
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
        <section className="cost print-table-wrap sheet padding-25mm">
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
                    <tr className="left bold fat-tr">
                        <td colSpan={6}>合同编号: {formData.number}</td>
                    </tr>

                    <tr>
                        <td style={{ width: '15%' }}>签约部门</td>
                        <td style={{ width: '15%' }}>{formData.department}</td>
                        <td style={{ width: '15%' }}>签约人</td>
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
                                <span className="square">□</span>租赁
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>外包
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>装修
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>采购
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
                        <td style={{ lineHeight: 1.5 }}>
                            <div>对方主体</div>
                            <div>资格审查</div>
                        </td>
                        <td className="left" style={{ padding: 0 }} colSpan={5}>
                            <ul className="table-ul">
                                <li>
                                    1. 已取得对方的营业执照、税务登记证复印件
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    2. 具备合同规定的行业的相应资质及合法批准手续
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li>
                                    3. 注册资本及净资产是否大于合同标的
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                                <li style={{ lineHeight: 2, paddingLeft: '10px' }}>
                                    4. 已通过对签约对方的商业信誉、产品质量的考察符合我方合同目的
                                    <span className="check">
                                        是<span className="square">□</span> 否<span className="square">□</span>
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td>序号</td>
                        <td colSpan={2}>合同委托项目</td>
                        <td>数量</td>
                        <td>单价</td>
                        <td>金额（元）</td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td colSpan={2}>{formData.scheme}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td colSpan={2}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td colSpan={2}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr className="left bold fat-tr">
                        <td colSpan={6}>
                            合同总价（人民币）：{formData.total_price}{' '}
                            <span style={{ marginLeft: '250px' }}>{formData.total_price_big}</span>
                        </td>
                    </tr>

                    <tr>
                        <td>付款方式</td>
                        <td className="left" colSpan={5}>
                            <span>
                                <span className="square">□</span>一次支付
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>分批支付
                            </span>
                            <span className="table-check-box-wrap">
                                <span className="square">□</span>其他
                            </span>
                        </td>
                    </tr>

                    <tr className="more-line-tr">
                        <td>发票取得方式</td>
                        <td className="left" style={{ padding: 0 }} colSpan={5}>
                            <ul style={{ margin: 0 }}>
                                <li style={{ borderBottom: '1px solid gray', lineHeight: 2, paddingLeft: '10px' }}>
                                    <span className="square">□</span>企业自开； <span className="square">□</span>
                                    税局代开（我方是否需要承担税点：<span className="square">□</span>是；
                                    <span className="square">□</span>否）
                                </li>
                                <li style={{ lineHeight: 2, paddingLeft: '10px' }}>
                                    {' '}
                                    <span className="square">□</span>其他：
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
                        <td>付款时间</td>
                        <td>付款条件</td>
                        <td>付款比例</td>
                        <td>付款金额</td>
                        <td>累计比例</td>
                    </tr>

                    <tr>
                        <td>1</td>
                        <td>{formData.pay_date}</td>
                        <td>{formData.condtion}</td>
                        <td>{formData.ratio}</td>
                        <td>{formData.total_price}</td>
                        <td>{formData.acratio}</td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className="bold more-line-tr">部门负责人审核</td>
                        <td className="left" colSpan={5}>
                            <span style={{ float: 'right', marginRight: '150px' }}>
                                年<span className="date-block"></span>月<span className="date-block"></span>日
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td className="bold more-line-tr">法务审核意见</td>
                        <td className="left" colSpan={5}>
                            <ul className="td-ul">
                                <li style={{ lineHeight: 1.5 }}>1.已对经办部门审核内容进行复核</li>
                                <li style={{ lineHeight: 1.5 }}>2.已对主体资格、合同形式、合同内容进行审核</li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td className="bold more-line-tr">财务部审核意见</td>
                        <td className="left" colSpan={5}>
                            <ul className="td-ul">
                                <li style={{ lineHeight: 1.5 }}>
                                    1. 已进行了财务预算、履行程序及付款条件等财务方面的审核{' '}
                                    <span style={{ marginLeft: '10px' }}>
                                        是<span className="square">□</span> 否<span className="square">□</span> 需修改
                                        <span className="square">□</span>
                                    </span>
                                </li>
                                <li style={{ lineHeight: 1.5 }}>2. 其他意见</li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="left bold fat-tr">
                        <td colSpan={6}>
                            CEO审批：
                            <span style={{ float: 'right', marginRight: '150px' }}>
                                年<span className="date-block"></span>月<span className="date-block"></span>日
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Cost;
