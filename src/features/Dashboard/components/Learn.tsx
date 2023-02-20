import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import Words from './Words';
import Submit from './Submit';
const list = [
    {
        en: 'good',
        vi: 'tốt',
    },
    {
        en: 'bad',
        vi: 'dở',
    },
    {
        en: 'school',
        vi: 'trường',
    },
    {
        en: 'learn',
        vi: 'study',
    },
];
const Learn = () => {
    const [index, setIndex] = useState<number>(0);
    const [rand, setRand] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    return (
        <Row className="pt-[24px] sm:pr-[24px] pr-[8px] sm:pl-[24px] md:pl-0 pl-[8px]">
            <Col className="rounded-[8px] p-[8px] border-[#f0f0f0] border-solid border-[1px]" span={24}>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Chủ đề"
                                name="permissionId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn chủ đề.',
                                    },
                                    {
                                        validator: (rule, value, cb) =>
                                            value <= -1 ? cb('Vui lòng chọn chủ đề.') : cb(),
                                        message: 'Vui lòng chọn chủ đề.',
                                    },
                                ]}
                                initialValue={-1}
                            >
                                <Select>
                                    <Select.Option value={-1}>Chọn chủ đề</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col span={24}>
                        {
                            <Row className="flex justify-center items-center mb-2">
                                {rand >= 5 ? (
                                    <Col span={11}>
                                        <Input
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13 && index < list.length - 1) {
                                                    setIndex((pre) => pre + 1);
                                                    const rand = Math.random();
                                                    setRand(rand * 10);
                                                }
                                            }}
                                        />
                                    </Col>
                                ) : (
                                    <Col span={11}>{list[index].en}</Col>
                                )}
                                <Col span={2} className="flex justify-center">
                                    :
                                </Col>
                                {rand < 5 ? (
                                    <Col span={11}>
                                        <Input
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13 && index < list.length - 1) {
                                                    setIndex((pre) => pre + 1);
                                                    const rand = Math.random();
                                                    setRand(rand * 10);
                                                    e.key = '';
                                                }
                                            }}
                                        />
                                    </Col>
                                ) : (
                                    <Col span={11}>{list[index].vi}</Col>
                                )}
                            </Row>
                        }
                    </Col>
                    <Col span={24} className="mt-2">
                        <Row>
                            {index > 0 && (
                                <Col span={12}>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            setIndex((pre) => pre - 1);
                                            const rand = Math.random();
                                            setRand(rand * 10);
                                        }}
                                    >
                                        Trở lại
                                    </Button>
                                </Col>
                            )}
                            {index < list.length - 1 && (
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setIndex((pre) => pre + 1);
                                            const rand = Math.random();
                                            setRand(rand * 10);
                                        }}
                                    >
                                        Tiếp tục
                                    </Button>
                                </Col>
                            )}
                            {index === list.length - 1 && (
                                <Col span={12}>
                                    <Button type="primary">Nộp</Button>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
                <Submit />
            </Col>
        </Row>
    );
};

export default Learn;
