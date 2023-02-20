import { Row, Col } from 'antd';
import { Words, Learn } from '../../components';

function Manager() {
    return (
        <Row>
            <Col md={{ span: 12 }} className="md:order-1 order-2 md:mt-0 mt-[24px]" span={24}>
                <Words />
            </Col>
            <Col md={{ span: 12 }} className="md:order-2 order-1" span={24}>
                <Learn />
            </Col>
        </Row>
    );
}

export default Manager;
