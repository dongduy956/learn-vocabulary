import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Form, Pagination, Popconfirm, Row, Select, Table, TableProps, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import { configRoutes, configTitle } from '~/configs';
import { pageSizeOptions } from '~/constraints';
import { arrayLibrary } from '~/helpers';
import { ParamsSettable, PropsPagination, PropsWord } from '~/interfaces';
const Submit = () => {
    const history = useNavigate();
    const { search } = useLocation();
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(0);
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

            {/* <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu loại khách"
                typeImport={typeImportExcel.typeOfVaccine}
            /> */}
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
                        loading={loading}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        columns={columns as ColumnsType<PropsWord>}
                        rowClassName="editable-row"
                        title={() => <>Các từ vựng bạn vừa học</>}
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
export default Submit;
