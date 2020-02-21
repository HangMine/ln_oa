import React, { FC, Suspense } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { lazy } from 'react';
import { Spin } from 'antd';
import { history } from '@/router';
import { PrivateRoute } from '@/router';
import ComponentError from '@/views/Error/Error';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// const App: FC = () => {
//   return (
//     <div className="App">
//       <Router history={history}>
//         <Route exact path="/" component={Auth}></Route>
//         <PrivateRoute path="/auth" component={Auth}></PrivateRoute>
//         <PrivateRoute path="/login" component={Login}></PrivateRoute>
//         <PrivateRoute path="/app" component={routerView}></PrivateRoute>
//         <PrivateRoute path="/print/cost" component={Cost}></PrivateRoute>
//         <PrivateRoute path="/print/union" component={Union}></PrivateRoute>
//         <PrivateRoute path="/error" component={ComponentError}></PrivateRoute>
//       </Router>
//     </div>
//   );
// }

// 需要错误处理，改成class组件
class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, className: props.isMobile ? 'App mobile' : 'App' };
    }

    static getDerivedStateFromError() {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.error('渲染错误:', error);
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return <ComponentError></ComponentError>;
        }
        return (
            <div className={this.state.className}>
                <Router history={history}>
                    <Suspense
                        fallback={
                            <div className="view-loading">
                                <Spin size="large" tip="页面跳转中..." />
                            </div>
                        }>
                        <Switch>
                            <PrivateRoute exact path="/" noMenu={true}></PrivateRoute>
                            <PrivateRoute
                                path="/auth"
                                noMenu={true}
                                component={lazy(() => import('@/views/Auth/Auth'))}></PrivateRoute>
                            <PrivateRoute
                                path="/login"
                                noMenu={true}
                                component={lazy(() => import('@/views/Login/Login'))}></PrivateRoute>
                            <PrivateRoute
                                path="/app"
                                noMenu={true}
                                component={lazy(() => import('@/views/index'))}></PrivateRoute>
                            <PrivateRoute
                                path="/print/cost"
                                noMenu={true}
                                component={lazy(() => import('@/views/print/Cost/Cost'))}></PrivateRoute>
                            <PrivateRoute
                                path="/print/union"
                                noMenu={true}
                                component={lazy(() => import('@/views/print/Union/Union'))}></PrivateRoute>
                            <PrivateRoute
                                path="/error"
                                noMenu={true}
                                component={lazy(() => import('@/views/Error/Error'))}></PrivateRoute>
                        </Switch>
                    </Suspense>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({ isMobile: state.isMobile });

const _APP = connect(mapStateToProps)(App);

export default _APP;
