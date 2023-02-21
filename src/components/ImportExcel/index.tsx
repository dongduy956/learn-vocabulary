import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Spin, Upload, UploadFile, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { defaultColumnEmpty, nameColumnsExcel, nameDownloadExcel, typeImportExcel } from '~/constraints';
import { PropsImportExcel, PropsUploadFile } from '~/interfaces';
import files from '../Files';
import handleImport from './functions';
const ImportExcel: FC<PropsImportExcel> = ({ title, type, open, setOpen, setTable }) => {
    const { Dragger } = Upload;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Array<Object>>([]);
    const [subData, setSubData] = useState<Array<Object>>([]);
    const [marginTop, setMarginTop] = useState(0);
    const [fileList, setFileList] = useState<UploadFile<any>[] | undefined>();
    const readExcel = (file: Blob) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target?.result;

                const wb = XLSX.read(bufferArray, {
                    type: 'buffer',
                    dateNF: 'YYYY-MM-DD',
                    cellDates: true,
                    cellNF: false,
                    cellText: true,
                });

                const wsName1 = wb.SheetNames[0];

                const ws1 = wb.Sheets[wsName1];
                const wsName2 = wb.SheetNames[1];

                const ws2 = wb.Sheets[wsName2];
                const data = XLSX.utils.sheet_to_json(ws1);
                const subData = XLSX.utils.sheet_to_json(ws2);

                resolve([data, subData]);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        const handleSetData = (data: Array<Object>, type: string) => {
            const columns = Object.values(data[2]).filter((_, index) => index !== 0);
            const index = Object.values(typeImportExcel).findIndex((x) => x === type);
            const keyNameColumn: string = Object.keys(typeImportExcel).find((_, i) => i === index) ?? '';
            const valueColumns = Object.values(
                nameColumnsExcel[keyNameColumn as nameColumnsExcel.typeNameColumnsExcel],
            );
            const title = Object.values(data[1])[0].toLowerCase().trim();
            if (
                columns.length === valueColumns.length &&
                columns.every((item) => valueColumns.find((x) => x === item))
            ) {
                const newData = data.reduce((arr: Array<Object>, item, index) => {
                    if (index > 2) {
                        const temp = Object.values(item).filter((_, index) => index !== 0);
                        const sumDefaultColumns = Object.values(defaultColumnEmpty).reduce(
                            (sum, item) =>
                                columns.some((x) => x.toLowerCase().trim() === item.toLowerCase().trim())
                                    ? sum + 1
                                    : sum,
                            0,
                        );
                        const columnsExcelItem =
                            temp.length <
                            Object.keys(nameColumnsExcel[keyNameColumn as nameColumnsExcel.typeNameColumnsExcel]).length
                                ? temp.length + sumDefaultColumns
                                : temp.length;
                        if (
                            temp.length === 0 ||
                            Object.keys(nameColumnsExcel[keyNameColumn as nameColumnsExcel.typeNameColumnsExcel])
                                .length !== columnsExcelItem
                        )
                            return arr;
                        const obj = temp.reduce((obj, item, index) => {
                            const key = Object.keys(
                                nameColumnsExcel[keyNameColumn as nameColumnsExcel.typeNameColumnsExcel],
                            ).find(
                                (key) =>
                                    (
                                        nameColumnsExcel[keyNameColumn as nameColumnsExcel.typeNameColumnsExcel][
                                            key as nameColumnsExcel.typeNameObject
                                        ] as string
                                    )
                                        .trim()
                                        .toLowerCase() === columns[index].trim().toLowerCase(),
                            );

                            return item ? { ...obj, [key as string]: item } : obj;
                        }, {});
                        return [...arr, obj];
                    }
                    return arr;
                }, []);
                message.success(`${newData.length} ${title} phù hợp.`);
                return newData;
            } else {
                message.success(`0 ${title} phù hợp.`);
                return [];
            }
        };
        promise.then((values) => {
            const [data, subData] = values as Array<Array<Object>>;
            const newData = handleSetData(data, type);
            setData((pre) => [...pre, ...newData]);
            // if (type === typeImportExcel.vaccinePackage) {
            //     const subNewData = handleSetData(subData, typeImportExcel.vaccinePackageDetail);
            //     setSubData((pre) => [...pre, ...subNewData]);
            // } else if (type === typeImportExcel.customer) {
            //     const subNewData = handleSetData(subData, typeImportExcel.additionalCustomerInformation);
            //     setSubData((pre) => [...pre, ...subNewData]);
            // }
            setMarginTop((pre) => pre + 30);
        });
    };
    const props: PropsUploadFile = {
        name: 'file',
        multiple: true,
        // fileList,
        customRequest: async (options) => {
            const { onSuccess, file, onProgress } = options;
            const formData = new FormData();
            formData.append('file', file);
            onSuccess('Ok');
            console.log(options);
            readExcel(file);
        },
        onChange(info: { file: { name?: string; status?: string }; fileList: UploadFile<any>[] | undefined }) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'removed') {
                setMarginTop((pre) => pre - 30);
            }
            if (status === 'done') {
                message.success(`File ${info.file.name} tải lên thành công.`);
            } else if (status === 'error') {
                message.error(`File ${info.file.name} tải lên thất bại.`);
            }
        },

        onDrop() {},
    };
    const handleSave = async () => {
        handleImport(type, setOpen, setData, setLoading, data, setTable, subData);
    };
    return (
        <>
            <div
                className={`fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] ${
                    open ? 'transition delay-150 duration-300 ease-in-out opacity-100 z-[100]' : 'opacity-0 z-[-1]'
                }`}
            ></div>
            <div
                style={{
                    boxShadow:
                        '0 3px 1px -2px rgb(41 66 112 / 12%), 0 2px 2px 0 rgb(41 66 112 / 12%), 0 1px 5px 0 rgb(41 66 112 / 12%)',
                }}
                className={`bg-white rounded-[10px] fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:w-min w-[calc(100%-30px)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out rotate-0 opacity-100 scale-100 z-[100]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 rotate-90 scale-0 z-[-1]'
                }`}
            >
                <div className="flex justify-between items-center border-b-[1px] border-b-[#e6edf0]">
                    <h2 className="m-0 ml-5">{title}</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row
                    gutter={[16, 16]}
                    style={{ marginLeft: 0, marginRight: 0 }}
                    className="md:min-w-[700px] min-w-full p-4 max-h-[500px] overflow-y-scroll overflow-x-hidden"
                >
                    <Col span={24}>
                        <Button type="link">
                            <a
                                download={
                                    nameDownloadExcel[
                                        Object.keys(typeImportExcel).find(
                                            (key) => typeImportExcel[key as typeImportExcel.type] === type,
                                        ) as nameDownloadExcel.type
                                    ]
                                }
                                href={`.${
                                    files[
                                        Object.keys(typeImportExcel).find(
                                            (key) => typeImportExcel[key as typeImportExcel.type] === type,
                                        ) as nameDownloadExcel.type
                                    ]
                                }`}
                            >
                                Tải bản mẫu
                            </a>
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                            <p className="ant-upload-hint">
                                Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty hoặc các tệp
                                độc hại khác.
                            </p>
                        </Dragger>
                    </Col>
                    <Col span={24}>
                        <Button
                            onClick={handleSave}
                            type="primary"
                            className={`${loading && 'cursor-not-allowed'}`}
                            style={{ marginTop }}
                        >
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} spinning={loading} />
                            <span className="ml-2"> Xác nhận</span>
                        </Button>
                    </Col>
                </Row>
            </div>
        </>
    );
};
export default ImportExcel;
