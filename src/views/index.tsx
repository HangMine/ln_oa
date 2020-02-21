import React, { Component } from 'react';
import { Layout } from 'antd';
import Aside from '@/components/Aside/Aside';
import Main from '@/components/Main/Main';

class App extends Component {
    render() {
        return (
            <Layout>
                <Aside />
                <Main />
            </Layout>
        );
    }
}

export default App;
