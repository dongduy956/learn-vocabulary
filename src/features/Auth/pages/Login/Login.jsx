import { LoadingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, message, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import images from '~/components/Images';
import { configTitle } from '~/configs';

const Login = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);

    const onFinish = async (params) => {
        const remember = params.remember;
        delete params.remember;
        setLoading(true);

        setLoading(false);
    };
    return (
        <>
            {contextHolder}
            <Head title={configTitle.auth} />

            <div
                className="bg-no-repeat bg-center bg-cover flex justify-center flex-col"
                style={{ minHeight: '100vh', backgroundImage: `url(${images.bgAuth})` }}
            >
                <Row className="r-16 pl-16 mb-4 mt-2">
                    <Col span={24}>
                        <img className="w-[200px]" src={images.logo} alt="Logo VNVC" />
                    </Col>
                </Row>
                <div className="sm:mb-0 mb-2 pr-16 pl-16 grow">
                    <Row>
                        <Col className="relative " md={{ span: 12 }} span={24}>
                            <h1
                                style={{
                                    fontFamily: 'Metropolis',
                                    fontSize: '45px',
                                    fontWeight: 600,
                                    letterSpacing: '-0.05em',
                                    lineHeight: '50px',
                                    color: '#1e325c',
                                }}
                                className="m-0 text"
                            >
                                Đăng nhập vào tài khoản của bạn
                            </h1>
                            <p style={{ color: 'rgba(63,67,80,0.72)' }}>Quản lý trung tâm tiêm chủng vnvc </p>
                            {screenWidth >= 770 && (
                                <div className="inline-block absolute z-20" style={{ right: '-6%', bottom: '-17%' }}>
                                    <img className="inline" alt="login" src={images.auth} />
                                </div>
                            )}
                        </Col>
                        <Col md={{ span: 12 }} span={24}>
                            <div
                                style={{
                                    boxShadow: '0 12px 32px 0 rgba(0,0,0,0.12)',
                                    border: '1px solid rgba(63,67,80,0.08)',
                                }}
                                className="rounded-lg pt-12 pb-12 pl-14 pr-14 bg-white"
                            >
                                <h1 style={{ color: '#3f4350' }} className="m-0 mb-2">
                                    Đăng nhập
                                </h1>
                                <Form
                                    name="basic"
                                    layout="vertical"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Tài khoản"
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập vào tài khoản!',
                                            },
                                        ]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập vào mật khẩu!',
                                            },
                                        ]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        name="remember"
                                        valuePropName={'checked'}
                                        wrapperCol={{
                                            offset: 0,
                                            span: 24,
                                        }}
                                    >
                                        <Checkbox>Nhớ mật khẩu</Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        wrapperCol={{
                                            offset: 0,
                                            span: 24,
                                        }}
                                    >
                                        <Button
                                            size="large"
                                            className={`w-full ${
                                                loading && 'opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed'
                                            }`}
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            <Spin
                                                indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                                spinning={loading}
                                            />
                                            <span className="ml-2"> Đăng nhập</span>
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default Login;
