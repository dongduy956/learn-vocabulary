import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
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
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import ImportExcel from '~/components/ImportExcel';
import { configRoutes, configTitle } from '~/configs';
import { pageSizeOptions, typeImportExcel } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import { ParamsSettable, PropsEditTableWord, PropsPagination, PropsTopic, PropsWord } from '~/interfaces';
import { topicServices, wordServices } from '~/services';
import FormImportTopic from './FormImportTopic';
import FormImportWord from './FormImportWord';
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
    const history = useNavigate();
    const { search } = useLocation();
    const [form] = Form.useForm();
    const [formTopic] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(0);
    const [openImport, setOpenImport] = useState<boolean>(false);
    const [openImportWord, setOpenImportWord] = useState<boolean>(false);
    const [openImportTopic, setOpenImportTopic] = useState<boolean>(false);
    const [topics, setTopics] = useState<Array<PropsTopic>>([]);
    const [data, setData] = useState<Array<PropsWord>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [typeExcel, setTypeExcel] = useState<string>('');
    const [pagination, setPagination] = useState<PropsPagination>({
        current: search ? Number(search.split(configRoutes.page)[1] ?? '1') : 1,
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
        },
    ];
    const handleSetTopics = () => {
        (async () => {
            setLoading(true);
            const resultTopics = (await topicServices.getAllTopics()).data;
            setLoading(false);
            setTopics(resultTopics);
        })();
    };
    useEffect(() => {
        handleSetTopics();
    }, []);
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
            const newData: Array<PropsWord> = res.data;
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
    }, []);
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
        // if (debounced)
        //     fetchData({
        //         pagination: newPagination,
        // searchText: debounced,
        //     });
        // else
        fetchData({
            pagination: newPagination,
        });
    };
    const handleChangPagination = (page: number, pageSize: number) => {
        if (page > 1) history(configRoutes.page + page);
        else history('.');
        handleSetData({ page, pageSize });
    };
    return (
        <>
            <Head title={`${configTitle.dashboard}`} />
            <FormImportTopic
                setTopics={handleSetTopics}
                open={openImportTopic}
                title="Thêm chủ đề"
                setOpen={setOpenImportTopic}
            />
            <FormImportWord
                setTable={handleSetData}
                open={openImportWord}
                title="Thêm từ vựng"
                setOpen={setOpenImportWord}
            />
            <ImportExcel
                setTable={typeExcel === typeImportExcel.word ? handleSetData : handleSetTopics}
                title={`Nhập excel ${typeExcel === typeImportExcel.word ? 'từ vừng' : 'chủ đề'}`}
                type={typeExcel}
                open={openImport}
                setOpen={setOpenImport}
            />

            {/* <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu loại khách"
                typeImport={typeImportExcel.typeOfVaccine}
            /> */}

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
                                    <Col
                                        md={{ span: 12 }}
                                        span={24}
                                        className="flex md:justify-start justify-center md:mt-0 mt-2"
                                    >
                                        <Button
                                            onClick={() => {
                                                setOpenImportTopic(true);
                                            }}
                                            type="primary"
                                        >
                                            Thêm chủ đề
                                        </Button>
                                    </Col>
                                    <Col
                                        md={{ span: 12 }}
                                        span={24}
                                        className="flex md:justify-end justify-center md:mt-0 mt-2"
                                    >
                                        <Button
                                            onClick={() => {
                                                setTypeExcel(typeImportExcel.topic);
                                                setOpenImport(true);
                                            }}
                                            type="primary"
                                        >
                                            Thêm chủ đề bằng excel
                                        </Button>
                                    </Col>
                                    <Col
                                        md={{ span: 12 }}
                                        span={24}
                                        className="flex md:justify-start justify-center  mt-2"
                                    >
                                        <Button
                                            onClick={() => {
                                                setOpenImportWord(true);
                                            }}
                                            type="primary"
                                        >
                                            Thêm từ vựng
                                        </Button>
                                    </Col>
                                    <Col
                                        md={{ span: 12 }}
                                        span={24}
                                        className="flex md:justify-end justify-center mt-2"
                                    >
                                        <Button
                                            onClick={() => {
                                                setTypeExcel(typeImportExcel.word);
                                                setOpenImport(true);
                                            }}
                                            type="primary"
                                        >
                                            Thêm từ vựng bằng excel
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
