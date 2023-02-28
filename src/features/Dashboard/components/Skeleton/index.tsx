import { Select, Skeleton, Table } from 'antd';
import { FC } from 'react';
export const SkeletonWord: FC = () => (
    <>
        <div className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px] min-h-[360px]">
            <Skeleton active={true} paragraph={{ rows: 1 }}>
                <h1>Tiêu đề</h1>
            </Skeleton>
            <Skeleton active={true} paragraph={{ rows: 2 }}>
                <Select style={{ width: 200 }} placeholder="Select a value" />
            </Skeleton>
            <Skeleton active={true} paragraph={{ rows: 5 }}>
                <Table />
            </Skeleton>
        </div>
    </>
);
export const SkeletonTopic: FC = () => (
    <div className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px] min-h-[360px]">
        <Skeleton active={true} paragraph={{ rows: 1 }}>
            <h1>Tiêu đề</h1>
        </Skeleton>
        <Skeleton active={true} paragraph={{ rows: 5 }}>
            <Table />
        </Skeleton>
    </div>
);
export const SkeletonLearn: FC = () => (
    <div className="pt-[24px] sm:pr-[24px] pr-[8px] sm:pl-[24px] md:pl-0 pl-[8px]">
        <Skeleton active={true} paragraph={{ rows: 1 }}>
            <h1>Tiêu đề</h1>
        </Skeleton>
        <Skeleton active={true} paragraph={{ rows: 2 }}>
            <Select style={{ width: 200 }} placeholder="Select a value" />
        </Skeleton>
    </div>
);
