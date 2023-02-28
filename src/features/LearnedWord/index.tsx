import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Col, Form, Input, Pagination, Row, Table, TableProps, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ChangeEvent, useEffect, useState } from 'react';
import Head from '~/components/Head';
import { configTitle } from '~/configs';
import { filterLearnedWord, pageSizeOptions } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import { useDebounce } from '~/hooks';
import { ParamsSettable, PropsLearnedWord, PropsPagination } from '~/interfaces';
import { learnedWordServices } from '~/services';
import { useAuth } from '~/hooks';
const LearnedWord = () => {
    useAuth();

    const accountId = 1;
    const [form] = Form.useForm();
    const [search, setSearch] = useState<string>('');
    const debounced = useDebounce(search, 500);
    const [data, setData] = useState<Array<PropsLearnedWord>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PropsPagination>({
        current: 1,
    });
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a: PropsLearnedWord, b: PropsLearnedWord) => a.no && b.no && a.no - b.no,
            },
        },
        {
            title: 'Tiếng anh',
            editable: true,
            dataIndex: 'en',
            sorter: {
                compare: (a: PropsLearnedWord, b: PropsLearnedWord) =>
                    a.wordModel && b.wordModel && a.wordModel.en > b.wordModel.en,
            },
            render: (_: any, record: PropsLearnedWord) => {
                if (
                    record.rand === 0 &&
                    record.input.toLowerCase().trim() !== record.wordModel?.en.toLowerCase().trim()
                ) {
                    return (
                        <>
                            <Tag color="error">{record.input}</Tag>
                            <Tag color="success">{record.wordModel?.en}</Tag>
                        </>
                    );
                } else return <Tag color="success">{record.wordModel?.en}</Tag>;
            },
        },
        {
            title: 'Loại từ',
            editable: true,
            dataIndex: 'type',
            sorter: {
                compare: (a: PropsLearnedWord, b: PropsLearnedWord) =>
                    a.wordModel && b.wordModel && a.wordModel.type > b.wordModel.type,
            },
            render: (_: any, record: PropsLearnedWord) => record.wordModel?.type,
        },
        {
            title: 'Tiếng Việt',
            editable: true,
            dataIndex: 'vi',
            sorter: {
                compare: (a: PropsLearnedWord, b: PropsLearnedWord) =>
                    a.wordModel && b.wordModel && a.wordModel.vi > b.wordModel.vi,
            },
            render: (_: any, record: PropsLearnedWord) => {
                if (
                    record.rand === 1 &&
                    record.input.toLowerCase().trim() !== record.wordModel?.vi.toLowerCase().trim()
                ) {
                    return (
                        <>
                            <Tag color="error">{record.input}</Tag>
                            <Tag color="success">{record.wordModel?.vi}</Tag>
                        </>
                    );
                } else return <Tag color="success">{record.wordModel?.vi}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'correct',
            render: (_: any, record: PropsLearnedWord) =>
                record?.correct ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Đúng
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Sai
                    </Tag>
                ),
            filters: filterLearnedWord,
            onFilter: (value: boolean, record: PropsLearnedWord) => value === record.correct,
        },
    ];
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow<Array<PropsLearnedWord>>(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);

    const fetchData = (params: ParamsSettable = {}) => {
        (async () => {
            setLoading(true);
            if (search && !params.searchText) params.searchText = search;
            let res;
            if (params.searchText)
                res = await learnedWordServices.searchLearnedWords(
                    accountId,
                    params.searchText as string,
                    (params.pagination as PropsPagination).current as number,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            else
                res = await learnedWordServices.getAllLearnedWordsPaging(
                    accountId,
                    (params.pagination as PropsPagination).current as number,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            setLoading(false);
            const newData: Array<PropsLearnedWord> = res.data;
            setData(newData.map((item) => ({ ...item, key: item.id })));
            const newPagination: PropsPagination = {
                ...params.pagination,
                pageSize: params.pagination?.pageSize ? params.pagination?.pageSize : res.pageSize,
                total: res.totalItems,
            };
            setPagination(newPagination);
        })();
    };

    useEffect(() => {
        handleSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    const handleTableChange: TableProps<PropsLearnedWord>['onChange'] = (_, filters, sorter) => {
        fetchData({
            ...sorter,
            pagination,
            ...filters,
        });
    };

    const handleSetData = (params: ParamsSettable = {}) => {
        const newPagination = { ...pagination };
        if (params.page) newPagination.current = params.page;
        if (params.pageSize) newPagination.pageSize = params.pageSize;
        if (debounced)
            fetchData({
                pagination: newPagination,
                searchText: debounced,
            });
        else
            fetchData({
                pagination: newPagination,
            });
    };
    const handleChangPagination = (page: number, pageSize: number) => {
        handleSetData({ page, pageSize });
    };
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.charAt(0) === ' ') return;
        setSearch(e.target.value);
    };
    return (
        <>
            <Head title={`${configTitle.learnedWord}`} />

            <div
                className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px]"
                style={{
                    minHeight: 360,
                }}
            >
                <Form form={form} component={false}>
                    <Table
                        bordered
                        loading={loading}
                        dataSource={data}
                        pagination={false}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        columns={columns as ColumnsType<PropsLearnedWord>}
                        rowClassName="editable-row"
                        rowKey={(record) => record.id as number}
                        title={() => (
                            <>
                                <Row className="justify-between items-center">
                                    <Col span={24} className="mt-2">
                                        <Input placeholder="Tìm kiếm từ khoá" value={search} onChange={handleSearch} />
                                    </Col>
                                    <Col span={24} className="mt-2 md:justify-start flex justify-center">
                                        Các từ đã học
                                    </Col>
                                </Row>
                            </>
                        )}
                    />
                    {!!pagination.pageSize && !!pagination.total && (
                        <>
                            <Pagination
                                current={pagination.current}
                                className="mt-5 inline-block mb-5 float-right"
                                total={pagination.total}
                                onChange={handleChangPagination}
                                showSizeChanger
                                pageSizeOptions={pageSizeOptions}
                            />
                        </>
                    )}
                </Form>
            </div>
        </>
    );
};
export default LearnedWord;