import { Form, Pagination, Table, TableProps, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import Head from '~/components/Head';
import { configTitle } from '~/configs';
import { pageSizeOptions } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import { ParamsSettable, PropsPagination, PropsSubmit, PropsWord, PropsWordLearn } from '~/interfaces';
const Submit: FC<PropsSubmit> = ({ wordsLearn }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState<Array<PropsWordLearn>>([]);
    const [pagination, setPagination] = useState<PropsPagination>({
        current: 1,
        pageSize: 10,
    });
    const setDataPaging = (_pagination: PropsPagination): void => {
        const newData: Array<PropsWordLearn> = wordsLearn.reduce((arr: Array<PropsWordLearn>, item, index) => {
            const start = ((_pagination.current as number) - 1) * (_pagination.pageSize as number);
            const end = start + (_pagination.pageSize as number) - 1;
            return index >= start && index <= end ? [...arr, item] : arr;
        }, []);
        setPagination(_pagination);
        setData(newData);
    };
    useEffect(() => {
        setPagination((pre) => ({ ...pre, total: wordsLearn.length }));
        setDataPaging({ ...pagination, total: wordsLearn.length });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordsLearn]);
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a: PropsWordLearn, b: PropsWordLearn) => a.no && b.no && a.no - b.no,
            },
        },
        {
            title: 'Tiếng anh',
            editable: true,
            dataIndex: 'en',
            sorter: {
                compare: (a: PropsWordLearn, b: PropsWordLearn) => a.en > b.en,
            },
            render: (_: any, record: PropsWordLearn) => {
                if (record.rand === 0 && record.input.toLowerCase().trim() !== record.en.toLowerCase().trim()) {
                    return (
                        <>
                            <Tag color="error">{record.input}</Tag>
                            <Tag color="success">{record.en}</Tag>
                        </>
                    );
                } else return <Tag color="success">{record.en}</Tag>;
            },
        },
        {
            title: 'Loại từ',
            editable: true,
            dataIndex: 'type',
            sorter: {
                compare: (a: PropsWordLearn, b: PropsWordLearn) => a.type > b.type,
            },
        },
        {
            title: 'Tiếng Việt',
            editable: true,
            dataIndex: 'vi',
            sorter: {
                compare: (a: PropsWordLearn, b: PropsWordLearn) => a.vi > b.vi,
            },
            render: (_: any, record: PropsWordLearn) => {
                const vis = record.vi
                    .split(',')
                    .filter((x) => x && x)
                    .map((x) => x.trim());
                const inputs = record.input
                    .toLowerCase()
                    .trim()
                    .split(',')
                    .filter((x) => x && x)
                    .map((x) => x.trim());
                const check = vis.length === new Set([...vis, ...inputs]).size;
                if (record.rand === 1 && !check) {
                    return (
                        <>
                            <Tag color="error">{record.input}</Tag>
                            <Tag color="success">{record.vi}</Tag>
                        </>
                    );
                } else return <Tag color="success">{record.vi}</Tag>;
            },
        },
        {
            title: 'Chủ đề',
            editable: true,
            dataIndex: 'topicName',
            sorter: {
                compare: (a: PropsWordLearn, b: PropsWordLearn) =>
                    a.topicName && b.topicName && a.topicName > b.topicName,
            },
        },
    ];
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow<Array<PropsWordLearn>>(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const handleTableChange: TableProps<PropsWord>['onChange'] = (_pagination, filters, sorter) => {
        setDataPaging(_pagination);
    };

    const handleSetData = (params: ParamsSettable = {}) => {
        const newPagination = { ...pagination };
        if (params.page) newPagination.current = params.page;
        if (params.pageSize) newPagination.pageSize = params.pageSize;
        setDataPaging(newPagination);
    };
    const handleChangPagination = (page: number, pageSize: number) => {
        handleSetData({ page, pageSize });
    };
    return (
        <>
            <Head title={`${configTitle.dashboard}`} />
            <div
                className="mt-2"
                style={{
                    minHeight: 360,
                }}
            >
                <Form form={form} component={false}>
                    <Table
                        bordered
                        dataSource={data}
                        pagination={false}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        columns={columns as ColumnsType<PropsWord>}
                        rowClassName="editable-row"
                        title={() => <>Các từ vựng bạn vừa học</>}
                        rowKey={(record) => record.id as number}
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
export default Submit;
