import { Col, Row } from 'antd';
import { FC, Suspense, lazy } from 'react';
import { SkeletonLearn, SkeletonTopic, SkeletonWord } from './components/Skeleton';
import { useAuth } from '~/hooks';
const Words = lazy(() => import('./components/Words'));
const Topics = lazy(() => import('./components/Topics'));
const Learn = lazy(() => import('./components/Learn'));

const Dashboard: FC = () => {
    useAuth();
    return (
        <Row>
            <Col md={{ span: 12 }} className="md:order-1 order-2 md:mt-0 mt-[24px]" span={24}>
                <Suspense fallback={<SkeletonWord />}>
                    <Words />
                </Suspense>
                <Suspense fallback={<SkeletonTopic />}>
                    <Topics />
                </Suspense>
            </Col>
            <Col md={{ span: 12 }} className="md:order-2 order-1" span={24}>
                <Suspense fallback={<SkeletonLearn />}>
                    <Learn />
                </Suspense>
            </Col>
        </Row>
    );
};

export default Dashboard;
