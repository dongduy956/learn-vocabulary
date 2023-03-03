import { Col, Dropdown, MenuProps, Row, Space } from 'antd';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import images from '~/components/Images';
import { configRoutes } from '~/configs';
import { MenuCenter, MenuAccount } from './Menu';
import styles from './HeaderStyles.module.scss';
import BreadcrumbCustom from './BreadcrumbCustom';
const cx = classNames.bind(styles);
const Header = () => {
    return (
        <Row className={` pl-[24px] pr-[24px] pt-4 pb-4 flex justify-between items-center ${cx('header')}`}>
            <Col className="flex md:mb-0 mb-2 md:justify-start justify-center" md={{ span: 2 }} span={24}>
                <Link to={configRoutes.dashboard}>
                    <img className="w-[60px]" src={images.logo} alt="Logo" />
                </Link>
            </Col>
            <Col sm={{ span: 4 }} span={24} className="flex sm:justify-start justify-center">
                <BreadcrumbCustom />
            </Col>
            <Col sm={{ span: 14 }} span={24}>
                <MenuCenter />
            </Col>
            <Col sm={{ span: 4 }} span={24} className="flex sm:justify-end justify-center sm:mb-0 mt-2 ">
                <MenuAccount />
            </Col>
        </Row>
    );
};
export default Header;
