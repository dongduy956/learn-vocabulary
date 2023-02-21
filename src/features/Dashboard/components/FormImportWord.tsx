import { Button, Col, Form, Input, Row, Select, Spin, notification } from 'antd';
import { FC, useEffect, useState } from 'react';
import { PropsFormImportWord, PropsTopic, PropsWord } from '~/interfaces';
import { topicServices, wordServices } from '~/services';

const FormImportWord: FC<PropsFormImportWord> = ({ title, open, setOpen, setTable }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formAdd] = Form.useForm();
    const [topics, setTopics] = useState<Array<PropsTopic>>([]);
    useEffect(() => {
        (async () => {
            const resultTopics: Array<PropsTopic> = (await topicServices.getAllTopics()).data;
            setTopics(resultTopics);
        })();
    }, []);
    const onFinish = async (params: PropsWord): Promise<void> => {
        setLoading(true);
        const res = await wordServices.insertWord(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm từ vựng.',
                duration: 3,
            });
        else if (res.isSuccess) {
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
            formAdd.setFieldsValue({
                topicId: -1,
                en: '',
                vi: '',
                note: '',
                type: '',
            });
            setTable();
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
                    className="md:min-w-[700px] min-w-full p-4 max-h-[500px] overflow-y-scroll overflow-x-hidden"
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
                                                label="Chủ đề"
                                                name="topicId"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                    {
                                                        validator: (rule, value, cb) =>
                                                            value === -1 ? cb('Vui lòng chọn chủ đề.') : cb(),
                                                        message: 'Vui lòng chọn chủ đề.',
                                                    },
                                                ]}
                                                initialValue={-1}
                                            >
                                                <Select>
                                                    <Select.Option value={-1}>Chọn chủ đề</Select.Option>
                                                    {topics.map((topic) => (
                                                        <Select.Option key={topic.id} value={topic.id}>
                                                            {topic.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Tiếng anh"
                                                name="en"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ từ tiếng anh.',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Loại từ"
                                                name="type"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ loại từ.',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Tiếng việt"
                                                name="vi"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ từ tiếng việt.',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item label="Ghi chú" name="note">
                                                <Input.TextArea />
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

export default FormImportWord;
