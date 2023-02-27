import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    Input,
    Pagination,
    Popconfirm,
    Row,
    Table,
    TableProps,
    Tooltip,
    Typography,
    notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ChangeEvent, FC, lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Head from '~/components/Head';
import { configTitle } from '~/configs';
import { pageSizeOptions, typeImportExcel } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import { useDebounce } from '~/hooks';
import { ParamsSettable, PropsEditTable, PropsPagination, PropsTopic } from '~/interfaces';
import { topicServices } from '~/services';
import { SliceTopic } from '~/store/Slice';
const FormImportTopic = lazy(() => import('./FormImport/FormImportTopic'));
const ImportExcel = lazy(() => import('~/components/ImportExcel'));

const EditableCell: FC<PropsEditTable<PropsTopic>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <></> : <Input />;
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
const Topics = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [search, setSearch] = useState<string>('');
    const debounced = useDebounce(search, 500);
    const [editingKey, setEditingKey] = useState<number>(0);
    const [openImport, setOpenImport] = useState<boolean>(false);
    const [openImportTopic, setOpenImportTopic] = useState<boolean>(false);
    const [data, setData] = useState<Array<PropsTopic>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PropsPagination>({
        current: 1,
    });
    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: PropsTopic) => {
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
                            <Tooltip placement="bottom" title={`Xoá ${record.name.toLowerCase()}`} color="cyan">
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
                            <Tooltip placement="bottom" title={`Sửa ${record.name.toLowerCase()}`} color="cyan">
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
                compare: (a: PropsTopic, b: PropsTopic) => a.no && b.no && a.no - b.no,
            },
        },
        {
            title: 'Tên chủ đề',
            editable: true,
            dataIndex: 'name',
            sorter: {
                compare: (a: PropsTopic, b: PropsTopic) => a.name > b.name,
            },
        },
    ];
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow<Array<PropsTopic>>(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const isEditing = (record: PropsTopic) => record.id === editingKey;
    const edit = (record: PropsTopic) => {
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
            const row: PropsTopic = await form.validateFields();
            if (id > 0) {
                const resultUpdate = await topicServices.updateTopic(id, row);
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
            onCell: (record: PropsTopic) => ({
                record,
                inputType: col.dataIndex === 'topicName' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const fetchData = (params: ParamsSettable = {}) => {
        (async () => {
            setLoading(true);
            let res;
            if (params.searchText)
                res = await topicServices.searchTopics(
                    params.searchText as string,
                    (params.pagination as PropsPagination).current as number,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            else
                res = await topicServices.getAllTopicsPaging(
                    (params.pagination as PropsPagination).current as number,
                    (params.pagination as PropsPagination).pageSize as number,
                );
            setLoading(false);
            const newData: Array<PropsTopic> = res.data;
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
        const res = await topicServices.deleteTopic(id);
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
        handleSetData();
    };

    useEffect(() => {
        handleSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    const handleTableChange: TableProps<PropsTopic>['onChange'] = (_, filters, sorter) => {
        fetchData({
            ...sorter,
            pagination,
            ...filters,
        });
    };

    const handleSetData = (params: ParamsSettable = {}) => {
        dispatch(SliceTopic.actions.setAdd());
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
            <Head title={`${configTitle.dashboard}`} />

            <FormImportTopic
                setTable={handleSetData}
                open={openImportTopic}
                title="Thêm chủ đề"
                setOpen={setOpenImportTopic}
            />
            <ImportExcel
                setTable={handleSetData}
                title={`Nhập excel chủ đề`}
                type={typeImportExcel.topic}
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
                className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px] md:mt-0 mt-2"
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
                        columns={mergedColumns as ColumnsType<PropsTopic>}
                        rowClassName="editable-row"
                        rowKey={(record) => record.id as number}
                        title={() => (
                            <>
                                <Row className="justify-between items-center">
                                    <Col span={12}>
                                        <Button
                                            onClick={() => {
                                                setOpenImportTopic(true);
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
                                        <Input placeholder="Tìm kiếm từ khoá" value={search} onChange={handleSearch} />
                                    </Col>
                                    <Col span={24} className="mt-2 md:justify-start flex justify-center">
                                        Danh sách chủ đề
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
export default Topics;
