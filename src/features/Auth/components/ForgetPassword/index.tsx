import { LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Spin, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { validate } from '~/helpers';
import { PropsAccount, PropsChangeForgetPassword } from '~/interfaces';
import { authServices } from '~/services';

const ForgetPassword: FC<PropsChangeForgetPassword> = ({ open, setOpen }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<number>(0);
    const [email, setEmail] = useState<string>('');
    const [account, setAccount] = useState<PropsAccount | undefined>();
    useEffect(() => {
        if (!open) {
            setConfirm(0);
            setEmail('');
        }
        if (confirm === 0) {
            setEmail('');
            form.setFieldValue('email', '');
            setAccount(undefined);
        } else if (confirm === 1) form.setFieldValue('code', '');
        else {
            form.setFieldsValue({
                newPass: '',
                prePass: '',
            });
        }
    }, [open, confirm]);

    const onFinish = async (params: any) => {
        if (confirm === 0) await handleSendCode(params.email);
        else if (confirm === 1) await handleConfirmCode(params.code);
        else await handleForgetPassword(params.newPass);
    };
    const handleSendCode = async (email: string, again: boolean = false) => {
        setLoading(true);
        const result = await authServices.sendCode(email);
        setLoading(false);
        if (result.isSuccess) {
            message.success(result.messages[0]);
            if (!again) {
                setAccount(result.data);
                setEmail(email);
                setConfirm(1);
            }
        } else message.error(result.messages[0]);
    };
    const handleConfirmCode = async (code: string) => {
        setLoading(true);
        const result = await authServices.confirmCode((account as PropsAccount).id as number, code);
        setLoading(false);
        if (result.isSuccess) {
            message.success(result.messages[0]);

            setConfirm(2);
            setEmail('');
        } else message.error(result.messages[0]);
    };
    const handleForgetPassword = async (password: string) => {
        setLoading(true);
        const result = await authServices.forgetPassword((account as PropsAccount).id as number, password);
        setLoading(false);
        if (result.isSuccess) {
            message.success(result.messages[0]);
            setOpen(false);
            setConfirm(0);
        } else message.error(result.messages[0]);
    };
    const handleSendCodeAgain = async () => {
        await handleSendCode(email, true);
    };

    const handleBack = async () => {
        setConfirm(0);
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
                    <h2 className="m-0 ml-5">Quên mật khẩu</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row className="md:min-w-[700px] min-w-full">
                    <Form
                        form={form}
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
                            {confirm === 2 ? (
                                <>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Mật khẩu mới"
                                            name="newPass"
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
                                            name="prePass"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập đầy đủ xác nhận mật khẩu.',
                                                },
                                                {
                                                    validator: (_, value, callback) =>
                                                        value === form.getFieldValue('newPass')
                                                            ? callback()
                                                            : callback('Xác nhận mật khẩu không chính xác.'),
                                                    message: 'Xác nhận mật khẩu không chính xác.',
                                                },
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item>
                                            <Button>Trở lại</Button>
                                            <Button
                                                className={`ml-2 ${
                                                    loading &&
                                                    'opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed pointer-events-none'
                                                }`}
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                <Spin
                                                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                                    spinning={loading}
                                                />{' '}
                                                <span className="ml-2">
                                                    {loading ? 'Đang thực hiện' : 'Đổi mật khẩu'}
                                                </span>
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </>
                            ) : confirm === 1 ? (
                                <>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Mã xác nhận"
                                            name="code"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập đầy đủ mã xác nhận.',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item>
                                            <Button type="dashed" onClick={handleBack}>
                                                Trở lại
                                            </Button>
                                            <Button
                                                className={`ml-2 ${
                                                    loading &&
                                                    'pointer-events-none opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed'
                                                }`}
                                                type="primary"
                                                onClick={handleSendCodeAgain}
                                            >
                                                <Spin
                                                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                                    spinning={loading}
                                                />{' '}
                                                <span className="ml-2">{loading ? 'Đang gửi' : 'Gửi lại'}</span>
                                            </Button>
                                            <Button
                                                className={`ml-2 ${
                                                    loading &&
                                                    'pointer-events-none opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed'
                                                }`}
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                <Spin
                                                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                                    spinning={loading}
                                                />{' '}
                                                <span className="ml-2">{loading ? 'Đang kiểm tra' : 'Tiếp tục'}</span>
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </>
                            ) : (
                                <>
                                    <Col span={24}>
                                        <Form.Item
                                            label="E-mail"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập đầy đủ e-mail.',
                                                },
                                                {
                                                    validator: (rule, value, cb) =>
                                                        validate.isEmail(value)
                                                            ? cb()
                                                            : cb('E-mail không đúng định dạng.'),
                                                    message: 'E-mail không đúng định dạng.',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Button
                                            className={`ml-2 ${
                                                loading &&
                                                'pointer-events-none opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed'
                                            }`}
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            <Spin
                                                indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                                spinning={loading}
                                            />{' '}
                                            <span className="ml-2">{loading ? 'Đang kiểm tra' : 'Xác nhận'}</span>
                                        </Button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </Form>
                </Row>
            </div>
        </>
    );
};

export default ForgetPassword;
