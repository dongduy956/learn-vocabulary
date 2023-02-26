import { Col, Row, Watermark } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
const Main = () => {
    return (
        <>
            <Header />
            <Watermark content="Learn wordbook">
                <Row>
                    <Col span={24}>
                        <Outlet />
                    </Col>
                </Row>
            </Watermark>
        </>
    );
};
export default Main;
