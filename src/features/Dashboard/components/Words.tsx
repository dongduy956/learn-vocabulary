import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    Input,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Table,
    TableProps,
    Tooltip,
    Typography,
    notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ChangeEvent, FC, useEffect, useState, lazy } from 'react';
import { useSelector } from 'react-redux';
import { pageSizeOptions, typeImportExcel } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import {
    ParamsSettable,
    PropsEditTableWord,
    PropsPagination,
    PropsTopic,
    PropsWord,
    PropsFilterTable,
} from '~/interfaces';
import { topicServices, wordServices } from '~/services';
import { addTopicSelector } from '~/store';
import { useDebounce } from '~/hooks';
const FormImportWord = lazy(() => import('./FormImport/FormImportWord'));
const ImportExcel = lazy(() => import('~/components/ImportExcel'));

const EditableCell: FC<PropsEditTableWord> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    topics,
    ...restProps
}) => {
    const inputNode =
        inputType === 'select' ? (
            <Select>
                {topics.map((x) => (
                    <Select.Option value={x.id}>{x.name}</Select.Option>
                ))}
            </Select>
        ) : (
            <Input />
        );
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex.toString()}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title.toLowerCase()}`,
                        },
                        {
                            validator: (rule, value, cb) => (value < 0 ? cb(`${title} không được nhỏ hơn 0.`) : cb()),
                            message: `${title} không được nhỏ hơn 0.`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const Words = () => {
    const stateAddTopic = useSelector(addTopicSelector);
    const [form] = Form.useForm();
    const [formTopic] = Form.useForm();
    const [search, setSearch] = useState<string>('');
    const debounced = useDebounce(search, 500);
    const [editingKey, setEditingKey] = useState<number>(0);
    const [openImport, setOpenImport] = useState<boolean>(false);
    const [openImportWord, setOpenImportWord] = useState<boolean>(false);
    const [topics, setTopics] = useState<Array<PropsTopic>>([]);
    const [data, setData] = useState<Array<PropsWord>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PropsPagination>({
        current: 1,
    });
    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: PropsWord) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex justify-center">
                        <Typography.Link onClick={() => save(record.id as number)} className="mr-4">
                            Lưu
                        </Typography.Link>
                        <Typography.Link onClick={cancel}>Huỷ</Typography.Link>
                    </div>
                ) : (
                    data.length > 0 && (
                        <div className="flex justify-center">
                            <Tooltip placement="bottom" title={`Xoá ${record.en.toLowerCase()}`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm
                                        title="Bạn chắc chắn xoá?"
                                        onConfirm={() => handleDelete(record.id as number)}
                                    >
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                            <Tooltip placement="bottom" title={`Sửa ${record.en.toLowerCase()}`} color="cyan">
                                <Typography.Link disabled={editingKey !== 0} onClick={() => edit(record)}>
                                    <EditOutlined />
                                </Typography.Link>
                            </Tooltip>
                        </div>
                    )
                );
            },
        },
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a: PropsWord, b: PropsWord) => a.no && b.no && a.no - b.no,
            },
        },
        {
            title: 'Tiếng anh',
            editable: true,
            dataIndex: 'en',
            sorter: {
                compare: (a: PropsWord, b: PropsWord) => a.en > b.en,
            },
        },
        {
            title: 'Loại từ',
            editable: true,
            dataIndex: 'type',
            sorter: {
                compare: (a: PropsWord, b: PropsWord) => a.type > b.type,
            },
        },
        {
            title: 'Tiếng Việt',
            editable: true,
            dataIndex: 'vi',
            sorter: {
                compare: (a: PropsWord, b: PropsWord) => a.vi > b.vi,
            },
        },
        {
            title: 'Chủ đề',
            editable: true,
            dataIndex: 'topicName',
            sorter: {
                compare: (a: PropsWord, b: PropsWord) => a.topicName && b.topicName && a.topicName > b.topicName,
            },
            filters:
                topics.length > 0
                    ? topics.reduce(
                          (arr: PropsFilterTable[], item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value: string, record: PropsWord) => record.topicName?.toLowerCase().trim() === value,
        },
    ];
    const handleSetTopics = () => {
        (async () => {
            setLoading(true);
            const resultTopics = (await topicServices.getAllTopics())?.data;
            setLoading(false);
            if (resultTopics) setTopics(resultTopics);
        })();
    };
    useEffect(() => {
        handleSetTopics();
    }, [stateAddTopic]);
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow<Array<PropsWord>>(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const isEditing = (record: PropsWord) => record.id === editingKey;
    const edit = (record: PropsWord) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id as number);
    };
    const cancel = () => {
        setEditingKey(0);
    };
    //lưu dữ liệu sửa 1 dòng
    const save = async (id: number) => {
        setLoading(true);
        try {
            const row = await form.validateFields();
            if (id > 0) {
                const topicId: number = Number.isInteger(row.topicName) ? row.topicName : form.getFieldValue('topicId');
                delete row.topicName;
                const resultUpdate = await wordServices.updateWord(id, {
                    ...row,
                    topicId,
                });
                if (resultUpdate.isSuccess) {
                    notification.success({
                        message: 'Thành công',
                        description: resultUpdate.messages[0],
                        duration: 3,
                    });
                    handleSetData();
                }
                setEditingKey(0);
            }
        } catch (errInfo) {}
        setLoading(false);
    };
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: PropsWord) => ({
                record,
                inputType: col.dataIndex === 'topicName' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                topics,
            }),
        };
    });

    const fetchData = (params: ParamsSettable = {}) => {
        (async () => {
            setLoading(true);
            if (search && !params.searchText) params.searchText = search;
            let res;
            const topicId: number = formTopic.getFieldValue('topicId');
            if (params.searchText)
                res = await wordServices.searchWords(
                    params.searchText as string,
                    (params.pagination as PropsPagination).current as number,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            else if (topicId !== -1)
                res = await wordServices.getWordsByTopicIdPaging(
                    topicId,
                    (params.pagination as PropsPagination).current,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            else
                res = await wordServices.getAllWordsPaging(
                    (params.pagination as PropsPagination).current as number,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            setLoading(false);
            const newData: Array<PropsWord> = res.data ?? [];
            setData(newData.map((item) => ({ ...item, key: item.id })));
            const newPagination: PropsPagination = {
                ...params.pagination,
                pageSize: params.pagination?.pageSize ? params.pagination?.pageSize : res.pageSize,
                total: res.totalItems,
            };
            setPagination(newPagination);
        })();
    };
    const handleDelete = async (id: number) => {
        setLoading(true);
        const res = await wordServices.deleteWord(id);
        if (res.data)
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
        else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
        setLoading(false);
        fetchData({
            pagination,
            // searchText: debounced,
        });
    };

    useEffect(() => {
        handleSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    const handleTableChange: TableProps<PropsWord>['onChange'] = (_, filters, sorter) => {
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
            <FormImportWord
                setTable={handleSetData}
                open={openImportWord}
                title="Thêm từ vựng"
                setOpen={setOpenImportWord}
            />
            <ImportExcel
                setTable={handleSetData}
                title={`Nhập excel từ vựng`}
                type={typeImportExcel.word}
                open={openImport}
                setOpen={setOpenImport}
            />

            <div
                className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px]"
                style={{
                    minHeight: 360,
                }}
            >
                <Form form={form} component={false}>
                    <Table
                        bordered
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        loading={loading}
                        dataSource={data}
                        pagination={false}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        columns={mergedColumns as ColumnsType<PropsWord>}
                        rowClassName="editable-row"
                        rowKey={(record) => record.id as number}
                        title={() => (
                            <>
                                <Row className="justify-between items-center">
                                    <Col span={12}>
                                        <Button
                                            onClick={() => {
                                                setOpenImportWord(true);
                                            }}
                                            type="primary"
                                        >
                                            Thêm
                                        </Button>
                                    </Col>
                                    <Col span={12} className="flex justify-end">
                                        <Button
                                            onClick={() => {
                                                setOpenImport(true);
                                            }}
                                            type="primary"
                                        >
                                            Nhập excel
                                        </Button>
                                    </Col>
                                    <Col span={24} className="mt-2">
                                        <Form form={formTopic}>
                                            <Form.Item label="Chủ đề" name="topicId" initialValue={-1}>
                                                <Select
                                                    onChange={() => {
                                                        handleSetData();
                                                    }}
                                                >
                                                    <Select.Option value={-1}>Tất cả</Select.Option>
                                                    {topics.map((x) => (
                                                        <Select.Option value={x.id}>{x.name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                    <Col span={24} className="mt-2">
                                        <Input placeholder="Tìm kiếm từ khoá" onChange={handleSearch} />
                                    </Col>
                                    <Col span={24} className="mt-2 md:justify-start flex justify-center">
                                        Danh sách từ vựng
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
export default Words;
