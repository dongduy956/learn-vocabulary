import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { configRoutes } from '~/configs';

const items: MenuProps['items'] = [
    {
        label: 'Trang chủ',
        key: configRoutes.dashboard,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Từ đã học',
        key: configRoutes.learnedWord,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Bảng xếp hạng',
        key: configRoutes.rank,
        icon: <MailOutlined />,
    },
];

const App: React.FC = () => {
    const { pathname }: { pathname: string } = useLocation();
    const [current, setCurrent] = useState<string>(pathname);
    useLayoutEffect(() => {
        setCurrent(pathname);
    }, [pathname]);
    const history = useNavigate();
    const onClick: MenuProps['onClick'] = (e) => {
        history(e.key);
    };

    return (
        <Menu
            className="flex justify-center"
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};

export default App;
