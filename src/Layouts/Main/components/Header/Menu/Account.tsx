import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { FC } from 'react';
import images from '~/components/Images';
import { useLogout } from '~/hooks';
import { configStorage } from '~/configs';
import { authServices } from '~/services';
import { PropsJwtRequest } from '~/interfaces';
import Cookies from 'js-cookie';
const keys = {
    info: 'account.info',
    changePass: 'account.changePass',
    logout: 'account.logout',
};
const items: MenuProps['items'] = [
    {
        label: 'Thông tin tài khoản',
        key: keys.info,
        icon: <UserOutlined />,
    },
    {
        label: 'Đổi mật khẩu',
        key: keys.changePass,
        icon: <UserOutlined />,
    },
    {
        label: 'Đăng xuất',
        key: keys.logout,
        icon: <UserOutlined />,
    },
];
const Account: FC = () => {
    const logout = useLogout();
    const handleLogout = async () => {
        const login: PropsJwtRequest = Cookies.get(configStorage.login)
            ? JSON.parse(Cookies.get(configStorage.login) as string)
            : {};
        const result = await authServices.logout({
            accessToken: login.accessToken,
            refreshToken: login.refreshToken,
        });
        if (result.isSuccess) logout();
    };
    const onClick: MenuProps['onClick'] = async ({ key }) => {
        switch (key) {
            case keys.logout:
                await handleLogout();
                break;
        }
    };

    return (
        <Dropdown menu={{ items, onClick }} arrow placement="bottomCenter">
            <a href="goo" onClick={(e) => e.preventDefault()}>
                <Space>
                    <img src={images.auth} alt="avatar" className="w-[40px] h-[40px] rounded-[50%] " />
                    <span>Dương Đông Duy</span>
                    <span>
                        <DownOutlined />
                    </span>
                </Space>
            </a>
        </Dropdown>
    );
};

export default Account;
