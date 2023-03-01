import { DualAxes } from '@ant-design/plots';
import { Spin } from 'antd';
import { FC, useEffect, useState } from 'react';
import { PropsDataTopCustomer, PropsTopCustomerColumn, PropsTopCustomerLine } from '~/interfaces';
import { statisticalServices } from '~/services';
import { useAuth } from '~/hooks';
import Head from '~/components/Head';
import { configTitle } from '~/configs';

const Rank: FC = () => {
    useAuth();
    const [dataColumn, setDataColumn] = useState<PropsTopCustomerColumn[]>([]);
    const [dataLine, setDataLine] = useState<PropsTopCustomerLine[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const fetchData = async () => {
        setLoading(true);
        const result: PropsDataTopCustomer[] = (await statisticalServices.getTopCustomer()).data;
        setDataColumn(result.map((x) => ({ fullName: x.fullName, value: x.numberOfWords })));
        setDataLine(
            result.reduce(
                (arr: PropsTopCustomerLine[], item) => [
                    ...arr,
                    { fullName: item.fullName, count: item.numberOfWordsCorrect, name: 'Số từ đúng' },
                    { fullName: item.fullName, count: item.numberOfWordsWrong, name: 'Số từ sai' },
                ],
                [],
            ),
        );
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, []);
    const config = {
        data: [dataColumn, dataLine],
        xField: 'fullName',
        yField: ['value', 'count'],
        meta: {
            value: {
                alias: 'Tổng số từ đã học',
            },
        },
        geometryOptions: [
            {
                geometry: 'column',
                columnWidthRatio: 0.4,
            },
            {
                seriesField: 'name',
                geometry: 'line',
                lineStyle: {
                    lineWidth: 2,
                },
            },
        ],
    };
    return (
        <>
            <Head title={configTitle.rank} />

            <div
                className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px]"
                style={{
                    minHeight: 360,
                }}
            >
                <Spin spinning={loading} tip="Loading...">
                    <DualAxes {...config} />
                    <h5 className="text-center mt-2">Top 10 người dùng học nhiều từ vựng và chính xác cao.</h5>
                </Spin>
            </div>
        </>
    );
};

export default Rank;
