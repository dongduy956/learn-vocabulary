import { LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Spin } from 'antd';
import Cookies from 'js-cookie';
import { FC, useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { configStorage } from '~/configs';
import { useLogout } from '~/hooks';
import { PropsChangeForgetPassword } from '~/interfaces';
import { authServices } from '~/services';

const ChangePassword: FC<PropsChangeForgetPassword> = ({ open, setOpen }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const logout = useLogout();
    useEffect(() => {
        if (!open) {
            form.setFieldsValue({
                oldPassWord: '',
                prePassWord: '',
                newPassWord: '',
            });
        }
    }, [open]);

    const onFinish = async (params: any) => {
        setLoading(true);
        const id = decodeToken<any>(
            JSON.parse(Cookies.get(configStorage.login) as string).accessToken as string,
        ).nameid;
        const resultChangePass = await authServices.changePassword(id, params);
        if (resultChangePass.isSuccess) {
            message.success(resultChangePass.messages[0]);
            setTimeout(() => {
                logout();
            }, 500);
        } else message.error(resultChangePass.messages[0]);
        setLoading(false);
    };
    return (
        <>
            <div
                className={`fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] ${
                    open ? 'transition delay-150 duration-300 ease-in-out opacity-100 z-[100]' : 'opacity-0 z-[-1]'
                }`}
            ></div>
            <div
                style={{
                    boxShadow:
                        '0 3px 1px -2px rgb(41 66 112 / 12%), 0 2px 2px 0 rgb(41 66 112 / 12%), 0 1px 5px 0 rgb(41 66 112 / 12%)',
                }}
                className={`bg-white rounded-[10px] fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:w-min w-[calc(100%-30px)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out rotate-0 opacity-100 scale-100 z-[100]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 rotate-90 scale-0 z-[-1]'
                }`}
            >
                <div className="flex justify-between items-center border-b-[1px] border-b-[#e6edf0]">
                    <h2 className="m-0 ml-5">Đổi mật khẩu</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row className="md:min-w-[700px] min-w-full">
                    <Form
                        name="wrap"
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            flex: 1,
                        }}
                        colon={false}
                        className="w-full p-4"
                        labelCol={{
                            flex: '200px',
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Mật khẩu cũ"
                                    name="oldPassWord"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ mật khẩu cũ.',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Mật khẩu mới"
                                    name="newPassWord"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ mật khẩu mới.',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Xác nhận mật khẩu"
                                    name="prePassWord"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ xác nhận mật khẩu.',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item>
                                    <Button
                                        className={`ml-2 ${
                                            loading && 'opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed'
                                        }`}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        <Spin
                                            indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                            spinning={loading}
                                        />{' '}
                                        <span className="ml-2">Đổi mật khẩu</span>
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </div>
        </>
    );
};

export default ChangePassword;
