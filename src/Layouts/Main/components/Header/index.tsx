import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, MenuProps, Row, Space } from 'antd';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import images from '~/components/Images';
import { configRoutes } from '~/configs';
import MenuHeader from './MenuHeader';
import styles from './HeaderStyles.module.scss';
const cx = classNames.bind(styles);
const Header = () => {
    const items: MenuProps['items'] = [
        {
            label: '1st menu item',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: '2nd menu item',
            key: '2',
            icon: <UserOutlined />,
        },
        {
            label: '3rd menu item',
            key: '3',
            icon: <UserOutlined />,
            danger: true,
        },
        {
            label: '4rd menu item',
            key: '4',
            icon: <UserOutlined />,
            danger: true,
            disabled: true,
        },
    ];

    return (
        <Row className={` pl-[24px] pr-[24px] pt-4 pb-4 flex justify-between items-center ${cx('header')}`}>
            <Col className="flex sm:mb-0 mb-2 sm:justify-start justify-center" sm={{ span: 4 }} span={24}>
                <Link to={configRoutes.dashboard}>
                    <img className="h-[40px]" src={images.logo} alt="Logo" />
                </Link>
            </Col>
            <Col sm={{ span: 16 }} span={24}>
                <MenuHeader />
            </Col>
            <Col sm={{ span: 4 }} span={24} className="flex sm:justify-end justify-center sm:mb-0 mt-2 ">
                <Dropdown menu={{ items }} arrow placement="bottomCenter">
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
            </Col>
        </Row>
    );
};
export default Header;
