import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Spin, Typography, Upload, UploadFile, message } from 'antd';
import { FC, useState } from 'react';
import { configStorage } from '~/configs';
import { validate } from '~/helpers';
import { PropsAccount, PropsAuth, PropsUploadFile, PropsUser } from '~/interfaces';
import { accountServices, uploadServices, userServices } from '~/services';
const SignUp: FC<PropsAuth> = ({ setOpen }) => {
    const { Dragger } = Upload;
    const [loading, setLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<string>('');
    const props: PropsUploadFile = {
        name: 'file',
        multiple: false,
        customRequest: async (options) => {
            const { onSuccess, onError, file, onProgress } = options;

            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (event: any) => {
                    onProgress({ percent: (event.loaded / event.total) * 100 });
                },
            };
            console.log(formData);
            uploadServices
                .uploadImage(formData, config)
                .then((res: any) => {
                    setAvatar(res.data);
                    onSuccess('Ok');
                })
                .catch((err: any) => {
                    onError({ err });
                });
        },
        onChange(info: { file: { name?: string; status?: string }; fileList: UploadFile<any>[] | undefined }) {
            const { status } = info.file;

            if (status !== 'uploading') {
            }

            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e: any) {},
    };
    const onFinish = async (params: any): Promise<void> => {
        setLoading(true);
        let user: PropsUser = {
            email: params.email,
            fullName: params.fullName,
            avatar: avatar,
        };
        const resultUserInsert = await userServices.registerUser(user);
        if (resultUserInsert.isSuccess) {
            user = resultUserInsert.data;
            const account: PropsAccount = {
                userId: user.id as number,
                username: params.username,
                password: params.password,
                social: 0,
            };
            const resultAccountInsert = await accountServices.registerAccount(account);
            if (resultAccountInsert.isSuccess) {
                message.success(resultAccountInsert.messages[0]);
                localStorage.setItem(
                    configStorage.remember,
                    JSON.stringify({
                        userName: params.username,
                        password: params.password,
                    }),
                );
                setOpen(true);
            } else {
                message.error(resultAccountInsert.messages[0]);
                userServices.deleteUser(user.id as number);
            }
        } else message.warning(resultUserInsert.messages[0]);
        setLoading(false);
    };
    return (
        <>
            <Col md={{ span: 12 }} span={24}>
                <div
                    style={{
                        boxShadow: '0 12px 32px 0 rgba(0,0,0,0.12)',
                        border: '1px solid rgba(63,67,80,0.08)',
                    }}
                    className="rounded-lg pt-12 pb-12 pl-14 pr-14 bg-white"
                >
                    <h1 style={{ color: '#3f4350' }} className="m-0 mb-2">
                        Đăng ký
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
                        <Row gutter={[16, 0]}>
                            <Col sm={{ span: 12 }} span={24}>
                                <Form.Item
                                    label="Họ tên"
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập vào họ tên!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col sm={{ span: 12 }} span={24}>
                                <Form.Item
                                    label="E-mail"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập vào e-mail!',
                                        },
                                        {
                                            validator: (rule, value, cb) =>
                                                validate.isEmail(value) ? cb() : cb('E-mail không đúng định dạng.'),
                                            message: 'E-mail không đúng định dạng.',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col sm={{ span: 12 }} span={24}>
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
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col sm={{ span: 12 }} span={24}>
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
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="avatar" label="Avatar">
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                                        <p className="ant-upload-hint">
                                            Support for a single or bulk upload. Strictly prohibit from uploading
                                            company data or other band files
                                        </p>
                                    </Dragger>
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
                                            loading &&
                                            'pointer-events-none opacity-8 bg-[#40a9ff] border-[#40a9ff] cursor-not-allowed'
                                        }`}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        <Spin
                                            indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                                            spinning={loading}
                                        />
                                        <span className="ml-2">{loading ? 'Đang đăng ký' : 'Đăng ký'}</span>
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Typography>
                                    Bạn đã có tài khoản?{' '}
                                    <Typography.Link onClick={() => setOpen(true)}>Đăng nhập ngay</Typography.Link>
                                </Typography>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Col>
        </>
    );
};

export default SignUp;
