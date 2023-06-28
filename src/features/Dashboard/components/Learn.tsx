import {
    Button,
    Col,
    Form,
    Input,
    InputRef,
    Row,
    Select,
    Spin,
    Typography,
    Radio,
    RadioChangeEvent,
    Checkbox,
    message,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { numberLibrary } from '~/helpers';
import { PropsDataLearn, PropsLearnedWord, PropsTopic, PropsWord, PropsWordLearn } from '~/interfaces';
import { learnedWordServices, topicServices, wordServices } from '~/services';
import { addTopicSelector } from '~/store';
import Submit from './Submit';
import { decodeToken } from 'react-jwt';
import { configStorage } from '~/configs';
import Cookies from 'js-cookie';
import { arrayLibrary } from '~/helpers';
import { useDebounce } from '~/hooks';
const { Title } = Typography;
const Learn = () => {
    const accountId = decodeToken<any>(
        JSON.parse(Cookies.get(configStorage.login) as string).accessToken as string,
    ).nameid;
    const refInput = useRef<InputRef>(null);
    const stateAddTopic = useSelector(addTopicSelector);
    const [form] = Form.useForm();
    const [valueRadio, setValueRadio] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [topics, setTopics] = useState<Array<PropsTopic>>([]);
    const [wordsByTopic, setWordsByTopic] = useState<Array<PropsDataLearn>>([]);
    const [wordsByTopicOrigin, setWordsByTopicOrigin] = useState<Array<PropsDataLearn>>([]);
    const [wordsLearn, setWordsLearn] = useState<Array<PropsWordLearn>>([]);
    const [checkLearned, setCheckLearned] = useState<boolean>(false);
    const [checkQuantityWord, setCheckQuantityWord] = useState<boolean>(false);
    const [quantityStart, setQuantityStart] = useState<number>(0);
    const [quantityEnd, setQuantityEnd] = useState<number>(0);
    const [totalWords, setTotalWord] = useState<number>(0);
    const debounceStart = Number(useDebounce(quantityStart.toString(), 500));
    const debounceEnd = Number(useDebounce(quantityEnd.toString(), 500));
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultTopics: Array<PropsTopic> = (await topicServices.getAllTopics()).data;
            setLoading(false);
            if (resultTopics) setTopics(resultTopics);
        })();
    }, [stateAddTopic]);
    const onChange = (e: RadioChangeEvent) => {
        setValueRadio(e.target.value);
    };
    const handleTopic = async (topicId: number) => {
        setCheckQuantityWord(false);
        setQuantityStart(0);
        setQuantityEnd(0);
        let resultWordsByTopic: Array<PropsWord> = [];
        let newData: Array<PropsDataLearn> = [];
        setLoading(true);
        if (topicId > 0) {
            resultWordsByTopic = (await wordServices.getWordsByTopicId(topicId)).data;
        } else if (topicId === -1) {
            resultWordsByTopic = (await wordServices.getAllWords()).data;
        } else if (topicId === 0) {
            const learnedWords: PropsLearnedWord[] = (await learnedWordServices.getAllIncorrectLearnedWords(accountId))
                .data;
            newData = learnedWords.map((item) => ({
                ...(item.wordModel as PropsWord),
                rand: item.rand,
            }));
        }
        setLoading(false);
        if (topicId !== 0) {
            if (valueRadio === 1) {
                newData = resultWordsByTopic.map((x) => ({ ...x, rand: numberLibrary.getRandInteger(0, 1) }));
            } else if (valueRadio === 2) newData = resultWordsByTopic.map((x) => ({ ...x, rand: 0 }));
            else newData = resultWordsByTopic.map((x) => ({ ...x, rand: 1 }));
        }
        setWordsByTopicOrigin(newData);
        setWordsByTopic(arrayLibrary.shuffleArray<PropsDataLearn>(newData));
        setLearnEmpty();
        setWordsLearn([]);
        setTotalWord(newData.length);
        setCheckLearned(false);
    };
    useEffect(() => {
        refInput.current?.focus();
    }, [wordsByTopic, index]);
    useEffect(() => {
        if (checkQuantityWord) {
            if (debounceEnd && debounceStart) {
                if (debounceEnd > wordsByTopicOrigin.length) message.warning('Kết thúc không lớn hơn tổng số từ vựng.');
                else if (debounceStart > debounceEnd) message.warning('Bắt đầu phải nhỏ hơn hoặc bằng kết thúc.');
                else {
                    setIndex(0);
                    let newData = wordsByTopicOrigin.filter((_, i) => i >= debounceStart - 1 && i <= debounceEnd - 1);
                    setWordsByRadio(newData);
                }
            }
        } else {
            setWordsByRadio(wordsByTopicOrigin);
        }
    }, [debounceStart, debounceEnd, valueRadio]);
    const setWordsByRadio = (newData: Array<PropsDataLearn>): void => {
        setInput('');
        if (valueRadio === 1) {
            newData = newData.map((x) => ({ ...x, rand: numberLibrary.getRandInteger(0, 1) }));
        } else if (valueRadio === 2) newData = newData.map((x) => ({ ...x, rand: 0 }));
        else newData = newData.map((x) => ({ ...x, rand: 1 }));
        setTotalWord(newData.length);
        setWordsByTopic(arrayLibrary.shuffleArray(newData));
    };
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
                setTotalWord(0);
                setCheckQuantityWord(false);
                setQuantityStart(0);
                setQuantityEnd(0);
                setWordsByTopic([]);
                setWordsByTopicOrigin([]);
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
    const handleCheckQuantity = async (e: CheckboxChangeEvent) => {
        setCheckQuantityWord(e.target.checked);
    };
    const handleQuantityStart = async (e: ChangeEvent<HTMLInputElement>) => {
        setQuantityStart(e.target.value ? Number(e.target.value) : 0);
    };
    const handleQuantityEnd = async (e: ChangeEvent<HTMLInputElement>) => {
        setQuantityEnd(e.target.value ? Number(e.target.value) : 0);
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
                            <Col span={24} className="mb-2">
                                <Row gutter={[16, 16]} className="items-baseline">
                                    <Col span={24}>
                                        <Checkbox checked={checkQuantityWord} onChange={handleCheckQuantity}>
                                            Số lượng từ vựng
                                        </Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={quantityStart ? quantityStart : ''}
                                            onChange={handleQuantityStart}
                                            disabled={!checkQuantityWord}
                                            placeholder="Bắt đầu"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Input
                                            type="number"
                                            value={quantityEnd ? quantityEnd : ''}
                                            min={quantityStart + 1}
                                            max={totalWords}
                                            onChange={handleQuantityEnd}
                                            disabled={!checkQuantityWord}
                                            placeholder="Kết thúc"
                                        />
                                    </Col>
                                    {totalWords ? (
                                        <>
                                            <Col span={12}>
                                                <Typography className="text-red-600">
                                                    {index + 1}/{totalWords}
                                                </Typography>
                                            </Col>
                                            <Col span={12} className="text-end">
                                                <Typography>(Tổng {totalWords} từ vựng)</Typography>
                                            </Col>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        {wordsByTopic.length > 0 && (
                            <>
                                <Col span={24}>
                                    <Row className="flex justify-center items-center mb-2">
                                        {wordsByTopic[index].rand === 0 ? (
                                            <Col span={10}>
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
                                            <Col span={10}>{wordsByTopic[index].en}</Col>
                                        )}
                                        <Col span={4} className="flex justify-center">
                                            {`(${wordsByTopic[index].type})`} :
                                        </Col>
                                        {wordsByTopic[index].rand === 1 ? (
                                            <Col span={10}>
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
                                            <Col span={10}>{wordsByTopic[index].vi}</Col>
                                        )}
                                        {wordsByTopic[index].rand === 0 && (
                                            <Col span={24} className="flex">
                                                {wordsByTopic
                                                    .filter(
                                                        (x) =>
                                                            x.en !== wordsByTopic[index].en &&
                                                            x.type === wordsByTopic[index].type &&
                                                            x.vi
                                                                .split(',')
                                                                .some(
                                                                    (e) =>
                                                                        e &&
                                                                        wordsByTopic[index].vi
                                                                            .split(',')
                                                                            .some((t) => t && t.trim() === e.trim()),
                                                                ),
                                                    )
                                                    .map(
                                                        (x, index, arrCur) =>
                                                            `${index === 0 ? 'Các từ đồng nghĩa: ' : ''}${x.en} ${
                                                                index < arrCur.length - 1 ? ' | ' : ''
                                                            }`,
                                                    )}
                                            </Col>
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
