import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import Cookies from 'js-cookie';
import { FC, useState } from 'react';
import ChangePassword from '../ChangePassword';
import { configStorage } from '~/configs';
import { useLogout } from '~/hooks';
import { PropsAccount, PropsJwtRequest } from '~/interfaces';
import { authServices } from '~/services';
import { googleLogout } from '@react-oauth/google';
const keys = {
    info: 'account.info',
    changePass: 'account.changePass',
    logout: 'account.logout',
};

const Account: FC = () => {
    const user: PropsAccount | Object = Cookies.get(configStorage.login)
        ? JSON.parse(Cookies.get(configStorage.login) as string).user
        : {};
    const items: MenuProps['items'] = [
        // {
        //     label: 'Thông tin tài khoản',
        //     key: keys.info,
        //     icon: <UserOutlined />,
        // },
        {
            label: 'Đổi mật khẩu',
            key: keys.changePass,
            icon: <UserOutlined />,
            disabled: (user as PropsAccount).social !== 0,
        },
        {
            label: 'Đăng xuất',
            key: keys.logout,
            icon: <UserOutlined />,
        },
    ];
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const logout = useLogout();

    const handleLogout = async () => {
        const login: PropsJwtRequest = Cookies.get(configStorage.login)
            ? JSON.parse(Cookies.get(configStorage.login) as string)
            : {};
        if ((user as PropsAccount).social !== 0) googleLogout();
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
            case keys.changePass:
                setOpenChangePassword(true);
                break;
        }
    };

    return (
        <>
            <ChangePassword open={openChangePassword} setOpen={setOpenChangePassword} />
            <Dropdown menu={{ items, onClick }} arrow placement="bottomCenter">
                <a href="goo" onClick={(e) => e.preventDefault()}>
                    <Space>
                        <img
                            src={(user as PropsAccount).avatar}
                            alt="avatar"
                            className="w-[40px] h-[40px] rounded-[50%] "
                        />
                        <span>{(user as PropsAccount).fullName}</span>
                        <span>
                            <DownOutlined />
                        </span>
                    </Space>
                </a>
            </Dropdown>
        </>
    );
};

export default Account;
