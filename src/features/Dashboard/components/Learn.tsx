import { Button, Col, Form, Input, InputRef, Row, Select, Spin, Typography, Radio, RadioChangeEvent } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { numberLibrary } from '~/helpers';
import { PropsDataLearn, PropsLearnedWord, PropsTopic, PropsWord, PropsWordLearn } from '~/interfaces';
import { learnedWordServices, topicServices, wordServices } from '~/services';
import { addTopicSelector } from '~/store';
import Submit from './Submit';

const { Title } = Typography;
const Learn = () => {
    const accountId = 1;
    const refInput = useRef<InputRef>(null);
    const stateAddTopic = useSelector(addTopicSelector);
    const [form] = Form.useForm();
    const [valueRadio, setValueRadio] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [topics, setTopics] = useState<Array<PropsTopic>>([]);
    const [wordsByTopic, setWordsByTopics] = useState<Array<PropsDataLearn>>([]);
    const [wordsLearn, setWordsLearn] = useState<Array<PropsWordLearn>>([]);
    const [checkLearned, setCheckLearned] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultTopics: Array<PropsTopic> = (await topicServices.getAllTopics()).data;
            setLoading(false);
            setTopics(resultTopics);
        })();
    }, [stateAddTopic]);
    const onChange = (e: RadioChangeEvent) => {
        setValueRadio(e.target.value);
    };
    useEffect(() => {
        (async () => {
            await handleTopic(form.getFieldValue('topicId'));
        })();
    }, [valueRadio]);
    const handleTopic = async (topicId: number) => {
        let resultWordsByTopic: Array<PropsWord> = [];
        setLoading(true);
        if (topicId > 0) {
            resultWordsByTopic = (await wordServices.getWordsByTopicId(topicId)).data;
        } else if (topicId === -1) {
            resultWordsByTopic = (await wordServices.getAllWords()).data;
        } else if (topicId === 0) {
            const learnedWords: PropsLearnedWord[] = (await learnedWordServices.getAllIncorrectLearnedWords(accountId))
                .data;
            setWordsByTopics(learnedWords.map((item) => ({ ...(item.wordModel as PropsWord), rand: item.rand })));
        }
        setLoading(false);
        if (topicId !== 0)
            if (valueRadio === 1)
                setWordsByTopics(resultWordsByTopic.map((x) => ({ ...x, rand: numberLibrary.getRandInteger(0, 1) })));
            else if (valueRadio === 2) setWordsByTopics(resultWordsByTopic.map((x) => ({ ...x, rand: 0 })));
            else setWordsByTopics(resultWordsByTopic.map((x) => ({ ...x, rand: 1 })));

        setLearnEmpty();
        setWordsLearn([]);
        setCheckLearned(false);
    };
    useEffect(() => {
        refInput.current?.focus();
    }, [wordsByTopic]);
    const setLearnEmpty = (): void => {
        setInput('');
        setIndex(0);
    };
    const handleContinue = async (last: boolean = false): Promise<void> => {
        if (input) {
            const dataFilter = wordsLearn.filter((x) => x.index < index);
            const newData = [
                ...dataFilter,
                {
                    ...wordsByTopic[index],
                    index,
                    input,
                },
            ];
            setWordsLearn(newData);
            if (!last) {
                setIndex((pre) => pre + 1);
            } else {
                setLearnEmpty();
                form.setFieldValue('topicId', -2);
                setWordsByTopics([]);
                setCheckLearned(true);
                setLoading(true);
                const learnedWords: PropsLearnedWord[] = (await learnedWordServices.getAllLearnedWords(accountId)).data;
                const listUpdate = newData.reduce((arr: PropsLearnedWord[], item) => {
                    const learnedWord = learnedWords.find((x) => x.wordId === item.id);
                    return learnedWord ? [...arr, { ...learnedWord, input: item.input, rand: item.rand }] : arr;
                }, []);
                const listAdd: PropsLearnedWord[] = newData.reduce((arr: PropsLearnedWord[], item) => {
                    return learnedWords.find((x) => x.wordId === (item.id as number))
                        ? arr
                        : [...arr, { accountId, wordId: item.id as number, rand: item.rand, input: item.input }];
                }, []);
                if (listAdd.length) await learnedWordServices.insertRangeLearnedWord(listAdd);
                if (listUpdate.length) await learnedWordServices.updateRangeLearnedWord(listUpdate);
                setLoading(false);
            }
        }
    };
    const handleContinueBack = async (type: boolean, last: boolean = false): Promise<void> => {
        if (type) await handleContinue(last);
        else setIndex((pre) => pre - 1);
        refInput.current?.focus();
        setInput('');
    };

    return (
        <Row className="pt-[24px] sm:pr-[24px] pr-[8px] sm:pl-[24px] md:pl-0 pl-[8px]">
            <Col className="rounded-[8px] p-[8px] border-[#f0f0f0] border-solid border-[1px]" span={24}>
                <Title level={3} className="text-center">
                    Chọn chủ đề để học
                </Title>
                <Spin spinning={loading} tip="Loading...">
                    <Form form={form}>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Chủ đề"
                                    name="topicId"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    initialValue={-2}
                                >
                                    <Select onChange={handleTopic}>
                                        <Select.Option value={-2}>Chọn chủ đề</Select.Option>

                                        <Select.Option value={-1}>Tất cả</Select.Option>
                                        <Select.Option value={0}>Các từ bạn sai</Select.Option>
                                        {topics.map((x) => (
                                            <Select.Option value={x.id} key={x.id}>
                                                {x.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Chỗ trống"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    initialValue={1}
                                >
                                    <Radio.Group
                                        disabled={form.getFieldValue('topicId') === 0}
                                        onChange={onChange}
                                        value={valueRadio}
                                    >
                                        <Radio value={1}>Random</Radio>
                                        <Radio value={2}>Tiếng Anh</Radio>
                                        <Radio value={3}>Tiếng Việt</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        {wordsByTopic.length > 0 && (
                            <>
                                <Col span={24}>
                                    <Row className="flex justify-center items-center mb-2">
                                        {wordsByTopic[index].rand === 0 ? (
                                            <Col span={11}>
                                                <Input
                                                    ref={refInput}
                                                    value={input}
                                                    onChange={(e) => {
                                                        setInput(e.target.value);
                                                    }}
                                                    onKeyDown={async (e) => {
                                                        if (e.keyCode === 13) {
                                                            await handleContinueBack(
                                                                true,
                                                                index === wordsByTopic.length - 1,
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Col>
                                        ) : (
                                            <Col span={11}>{wordsByTopic[index].en}</Col>
                                        )}
                                        <Col span={2} className="flex justify-center">
                                            {`(${wordsByTopic[index].type})`} :
                                        </Col>
                                        {wordsByTopic[index].rand === 1 ? (
                                            <Col span={11}>
                                                <Input
                                                    ref={refInput}
                                                    value={input}
                                                    onChange={(e) => {
                                                        setInput(e.target.value);
                                                    }}
                                                    onKeyDown={async (e) => {
                                                        if (e.keyCode === 13) {
                                                            await handleContinueBack(
                                                                true,
                                                                index === wordsByTopic.length - 1,
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Col>
                                        ) : (
                                            <Col span={11}>{wordsByTopic[index].vi}</Col>
                                        )}
                                    </Row>
                                </Col>
                                <Col span={24} className="mt-2">
                                    <Row>
                                        {index > 0 && (
                                            <Col span={12}>
                                                <Button
                                                    type="dashed"
                                                    onClick={async () => {
                                                        await handleContinueBack(false);
                                                    }}
                                                >
                                                    Trở lại
                                                </Button>
                                            </Col>
                                        )}
                                        {index < wordsByTopic.length - 1 && (
                                            <Col span={12}>
                                                <Button
                                                    type="primary"
                                                    onClick={async () => {
                                                        await handleContinueBack(true);
                                                    }}
                                                >
                                                    Tiếp tục
                                                </Button>
                                            </Col>
                                        )}
                                        {index === wordsByTopic.length - 1 && (
                                            <Col span={12}>
                                                <Button onClick={() => handleContinue(true)} type="primary">
                                                    Nộp
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </>
                        )}
                    </Row>
                    {checkLearned && <Submit wordsLearn={wordsLearn} />}
                </Spin>
            </Col>
        </Row>
    );
};

export default Learn;
