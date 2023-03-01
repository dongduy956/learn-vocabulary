import { Col, Row } from 'antd';
import { FC, useEffect, useState, lazy } from 'react';
import Head from '~/components/Head';
import images from '~/components/Images';
import { configTitle } from '~/configs';
const SignUp = lazy(() => import('./components/SignUp'));
const SignIn = lazy(() => import('./components/SignIn'));
const Auth: FC = () => {
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [openForm, setOpenForm] = useState<boolean>(true);
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);
    return (
        <>
            <Head title={configTitle.auth} />

            <div
                className="bg-no-repeat bg-center bg-cover flex justify-center flex-col"
                style={{ minHeight: '100vh', backgroundImage: `url(${images.bgAuth})` }}
            >
                <Row className="sm:pr-16 sm:pl-16 pr-4 pl-4 mb-4 mt-2">
                    <Col span={24}>
                        <img className="w-[200px]" src={images.logo} alt="Logo VNVC" />
                    </Col>
                </Row>
                <div className="sm:mb-0 mb-2 sm:pr-16 sm:pl-16 pr-4 pl-4 grow">
                    <Row>
                        <Col className="relative " md={{ span: 12 }} span={24}>
                            <h1
                                style={{
                                    fontFamily: 'Metropolis',
                                    fontSize: '45px',
                                    fontWeight: 600,
                                    letterSpacing: '-0.05em',
                                    lineHeight: '50px',
                                    color: '#1e325c',
                                }}
                                className="m-0 text"
                            >
                                {openForm ? 'Đăng nhập vào tài khoản của bạn' : 'Đăng ký tài khoản của bạn'}
                            </h1>
                            <p style={{ color: 'rgba(63,67,80,0.72)' }}>Learn wordbook</p>
                            {screenWidth >= 770 && (
                                <div className="inline-block absolute z-20" style={{ right: '-6%', bottom: '-17%' }}>
                                    <img className="inline" alt="login" src={images.auth} />
                                </div>
                            )}
                        </Col>
                        {openForm ? <SignIn setOpen={setOpenForm} /> : <SignUp setOpen={setOpenForm} />}
                    </Row>
                </div>
            </div>
        </>
    );
};

export default Auth;
