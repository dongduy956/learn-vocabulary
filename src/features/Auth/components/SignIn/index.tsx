import { LoadingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Spin, message, Row, Typography } from 'antd';
import Cookies from 'js-cookie';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { configRoutes, configStorage } from '~/configs';
import { PropsAuth } from '~/interfaces';
import { authServices } from '~/services';
import { SliceAuth } from '~/store/Slice';
import ForgetPassword from '../ForgetPassword';

const Login: FC<PropsAuth> = ({ setOpen }) => {
    const history = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [openForget, setOpenForget] = useState<boolean>(false);
    const dispatch = useDispatch();
    const user =
        localStorage.getItem(configStorage.remember) &&
        JSON.parse(localStorage.getItem(configStorage.remember) as string);

    const onFinish = async (params: any): Promise<void> => {
        const remember = params.remember;
        delete params.remember;
        setLoading(true);
        const result = await authServices.login(params);
        if (result.isSuccess) {
            if (remember) {
                localStorage.setItem(
                    configStorage.remember,
                    JSON.stringify({
                        userName: params.username,
                        password: params.password,
                    }),
                );
            } else localStorage.removeItem(configStorage.remember);
            Cookies.set(configStorage.login, JSON.stringify(result.data), { expires: result.data.expiredTime });
            dispatch(SliceAuth.actions.setLogin(true));
            history(configRoutes.dashboard);
        } else {
            message.error(result.messages[0]);
        }
        setLoading(false);
    };
    return (
        <>
            <ForgetPassword open={openForget} setOpen={setOpenForget} />
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
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Tài khoản"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập vào tài khoản!',
                                        },
                                    ]}
                                    initialValue={user && user.userName}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    initialValue={user && user.password}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập vào mật khẩu!',
                                        },
                                    ]}
                                >
                                    <Input.Password size="large" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="remember"
                                    valuePropName={user && 'checked'}
                                    wrapperCol={{
                                        offset: 0,
                                        span: 24,
                                    }}
                                >
                                    <Checkbox>Nhớ mật khẩu</Checkbox>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
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
                            </Col>
                            <Col span={24} className="flex ">
                                <Typography className="mr-5">
                                    Bạn chưa có tài khoản?{' '}
                                    <Typography.Link onClick={() => setOpen(false)}>Đăng ký ngay</Typography.Link>
                                </Typography>
                                <Typography.Link
                                    onClick={() => {
                                        setOpenForget(true);
                                    }}
                                >
                                    Quên mật khẩu?
                                </Typography.Link>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Col>
        </>
    );
};

export default Login;
