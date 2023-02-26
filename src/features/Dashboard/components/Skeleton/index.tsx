import { Select, Skeleton, Table } from 'antd';
import { FC } from 'react';
export const SkeletonWord: FC = () => (
    <>
        <div
            className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px]"
            style={{
                minHeight: 360,
            }}
        >
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
    <div
        className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px]"
        style={{
            minHeight: 360,
        }}
    >
        <Skeleton active={true} paragraph={{ rows: 1 }}>
            <h1>Tiêu đề</h1>
        </Skeleton>
        <Skeleton active={true} paragraph={{ rows: 5 }}>
            <Table />
        </Skeleton>
    </div>
);
export const SkeletonLearn: FC = () => (
    <div
        className="site-layout-background sm:p-[24px] pl-[8px] pr-[8px]"
        style={{
            minHeight: 360,
        }}
    >
        <Skeleton active={true} paragraph={{ rows: 1 }}>
            <h1>Tiêu đề</h1>
        </Skeleton>
        <Skeleton active={true} paragraph={{ rows: 2 }}>
            <Select style={{ width: 200 }} placeholder="Select a value" />
        </Skeleton>
    </div>
);
