import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    notification,
    Pagination,
    Popconfirm,
    Row,
    Table,
    TableProps,
    Tooltip,
    Typography,
    Select,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import { configRoutes, configTitle } from '~/configs';
import { ParamsSettable, PropsEditTable, PropsPagination, PropsWord } from '~/interfaces';
import { pageSizeOptions, typeImportExcel } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import ImportExcel from '~/components/ImportExcel';
const EditableCell: FC<PropsEditTable<PropsWord>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

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
    const [editingKey, setEditingKey] = useState<number>(0);
    const [openImport, setOpenImport] = useState<boolean>(false);
    const [data, setData] = useState<Array<PropsWord>>([
        {
            id: 1,
            name: 'Duy',
        },
        {
            id: 2,
            name: 'Đông',
        },
        {
            id: 3,
            name: 'Dương',
        },
        {
            id: 1,
            name: 'Duy',
        },
        {
            id: 2,
            name: 'Đông',
        },
        {
            id: 3,
            name: 'Dương',
        },
        {
            id: 1,
            name: 'Duy',
        },
        {
            id: 2,
            name: 'Đông',
        },
        {
            id: 3,
            name: 'Dương',
        },
        {
            id: 1,
            name: 'Duy',
        },
        {
            id: 2,
            name: 'Đông',
        },
        {
            id: 3,
            name: 'Dương',
        },
        {
            id: 1,
            name: 'Duy',
        },
        {
            id: 2,
            name: 'Đông',
        },
        {
            id: 3,
            name: 'Dương',
        },
    ]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PropsPagination>({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
        total: 15,
        pageSize: 1,
    });
    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: PropsWord) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex justify-center">
                        <Typography.Link onClick={() => save(record.id)} className="mr-4">
                            Lưu
                        </Typography.Link>
                        <Typography.Link onClick={cancel}>Huỷ</Typography.Link>
                    </div>
                ) : (
                    data.length > 0 && (
                        <div className="flex justify-center">
                            <Tooltip placement="bottom" title={`Xoá ${record.name.toLowerCase()}`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
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
                compare: (a: PropsWord, b: PropsWord) => a.no && b.no && a.no - b.no,
            },
        },
        {
            title: 'Tên loại vaccine',
            editable: true,
            dataIndex: 'name',
            sorter: {
                compare: (a: PropsWord, b: PropsWord) => a.name > b.name,
            },
        },
    ];
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow<Array<PropsWord>>(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const isEditing = (record: PropsWord) => record.id === editingKey;
    const edit = (record: PropsWord) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
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
                // const resultUpdate = await typeOfVaccineService.updateTypeOfVaccine(id, row);
                // if (resultUpdate.isSuccess) {
                //     if (debounced)
                //         fetchData({
                //             pagination,
                //             searchText: debounced,
                //         });
                //     else
                //         fetchData({
                //             pagination,
                //         });
                //     notification.success({
                //         message: 'Thành công',
                //         description: resultUpdate.messages[0],
                //         duration: 3,
                //     });
                // }
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
                inputType: col.dataIndex === 'number' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const fetchData = (params = {}) => {
        setLoading(true);
        (async () => {
            let res;
            // if (params.searchText)
            //     res = await typeOfVaccineService.searchTypeOfVaccines(
            //         params.searchText,
            //         params.pagination.current,
            //         params.pagination.pageSize,
            //     );
            // else
            //     res = await typeOfVaccineService.getTypeOfVaccines(
            //         params.pagination.current,
            //         params.pagination.pageSize,
            //     );
            // setLoading(false);
            // setData(res.data.map((item) => ({ ...item, key: item.id })));
            // setPagination({
            //     ...params.pagination,
            //     pageSize: params.pagination.pageSize ? params.pagination.pageSize : res.pageSize,
            //     total: res.totalItems,
            // });
        })();
        setLoading(false);
    };
    const handleDelete = (id: number) => {
        (async () => {
            setLoading(true);
            // const res = await typeOfVaccineService.deleteTypeOfVaccine(id);
            // if (res.data)
            //     notification.success({
            //         message: 'Thành công',
            //         description: res.messages[0],
            //         duration: 3,
            //     });
            // else
            //     notification.error({
            //         message: 'Lỗi',
            //         description: res.messages[0],
            //         duration: 3,
            //     });
            // setLoading(false);
            // fetchData({
            //     pagination,
            //     delete: true,
            //     searchText: debounced,
            // });
        })();
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
            <ImportExcel
                setTable={handleSetData}
                title={'Nhập excel từ vựng'}
                type={typeImportExcel.word}
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
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        columns={mergedColumns as ColumnsType<PropsWord>}
                        rowClassName="editable-row"
                        title={() => (
                            <>
                                <Row>
                                    <Col
                                        md={{ span: 8 }}
                                        span={24}
                                        className="md:mb-0 mb-2 flex md:justify-start justify-center "
                                    >
                                        <Button type="primary">Thêm chủ đề</Button>
                                    </Col>
                                    <Col md={{ span: 16 }} span={24}>
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
                                <Row className="justify-between items-center">
                                    <Col md={{ span: 8 }} span={24} className="md:justify-start flex justify-center">
                                        Danh sách từ vựng
                                    </Col>
                                    <Col
                                        md={{ span: 8 }}
                                        span={24}
                                        className="flex md:justify-start justify-center md:mt-0 mt-2"
                                    >
                                        <Button type="primary">Thêm</Button>
                                    </Col>
                                    <Col
                                        md={{ span: 8 }}
                                        span={24}
                                        className="flex md:justify-end justify-center md:mt-0 mt-2"
                                    >
                                        <Button
                                            onClick={() => {
                                                setOpenImport(true);
                                            }}
                                            type="primary"
                                        >
                                            Thêm bằng excel
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        )}
                        rowKey={(record) => record.id}
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
