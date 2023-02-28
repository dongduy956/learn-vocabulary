import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { FC, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { configRoutes, configTitle } from '~/configs';

const items: MenuProps['items'] = [
    {
        label: configTitle.dashboard,
        key: configRoutes.dashboard,
        icon: <AppstoreOutlined />,
    },
    {
        label: configTitle.learnedWord,
        key: configRoutes.learnedWord,
        icon: <AppstoreOutlined />,
    },
    {
        label: configTitle.rank,
        key: configRoutes.rank,
        icon: <MailOutlined />,
    },
];

const Center: FC = () => {
    const { pathname }: { pathname: string } = useLocation();
    const [current, setCurrent] = useState<string>(pathname);
    useLayoutEffect(() => {
        setCurrent(pathname);
        console.log(pathname);
    }, [pathname]);
    const history = useNavigate();
    const onClick: MenuProps['onClick'] = (e) => {
        history(e.key);
    };

    return (
        <Menu
            className="flex sm:justify-start justify-center"
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};

export default Center;
