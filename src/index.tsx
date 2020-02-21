import 'core-js/es/map';
import 'core-js/es/set';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './m_index.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';

// 中文化
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

// redux
import { StoreContext } from "redux-react-hook";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

ReactDOM.render(
  // redux-react-hook的仓库
  <StoreContext.Provider value={store} >
    {/* react-redux的仓库 */}
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </Provider>

  </StoreContext.Provider>
  , document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
