import { Button, Col, Form, Input, Row, Spin, notification } from 'antd';
import { FC, useState } from 'react';
import { PropsFormImportTopic, PropsTopic } from '~/interfaces';
import { topicServices } from '~/services';

const FormImportTopic: FC<PropsFormImportTopic> = ({ title, open, setOpen, setTopics }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formAdd] = Form.useForm();
    const onFinish = async (params: PropsTopic): Promise<void> => {
        setLoading(true);
        const res = await topicServices.insertTopic(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm chủ đề.',
                duration: 3,
            });
        else if (res.isSuccess) {
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
            formAdd.setFieldsValue({
                name: '',
            });
            setTopics();
        } else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
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
                    <h2 className="m-0 ml-5">{title}</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row
                    gutter={[16, 16]}
                    style={{ marginLeft: 0, marginRight: 0 }}
                    className="md:min-w-[700px] min-w-full p-4 pb-0 max-h-[500px] overflow-y-scroll overflow-x-hidden"
                >
                    <Col span={24}>
                        <Spin spinning={loading} tip="Loading...">
                            <Col span={24}>
                                <Form
                                    form={formAdd}
                                    name="wrap"
                                    labelCol={{
                                        flex: '110px',
                                    }}
                                    labelAlign="left"
                                    labelWrap
                                    wrapperCol={{
                                        flex: 1,
                                    }}
                                    colon={false}
                                    onFinish={onFinish}
                                >
                                    <Row gutter={[16, 0]}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Tên chủ đề"
                                                name="name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ từ tên chủ đề.',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>

                                        <Col span={24}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Thêm
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default FormImportTopic;
