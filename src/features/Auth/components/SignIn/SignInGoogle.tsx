import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button, message } from 'antd';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { configRoutes, configStorage } from '~/configs';
import { PropsUser } from '~/interfaces';
import { authServices } from '~/services';
import { SliceAuth } from '~/store/Slice';

const SignInGoogle = () => {
    const history = useNavigate();
    const dispatch = useDispatch();

    // const onSuccess = async (res: any) => {
    //     const result = await authServices.googleLogin(res.tokenId);
    //     if (result.isSuccess) {
    //         Cookies.set(configStorage.login, JSON.stringify(result.data), { expires: result.data.expiredTime });
    //         dispatch(SliceAuth.actions.setLogin(true));
    //         history(configRoutes.dashboard);
    //     } else {
    //         message.error(result.messages[0]);
    //     }
    // };
    // const onFailure = (res: any) => {
    //     console.log('Login Failed:', res);
    // };

    const onSuccess = async (credentialResponse: any) => {
        const decodeTK: any = decodeToken(credentialResponse.credential);
        const user: PropsUser = {
            email: decodeTK.email,
            fullName: decodeTK.name,
            avatar: decodeTK.picture,
        };
        const result = await authServices.googleLogin(user);
        if (result.isSuccess) {
            Cookies.set(configStorage.login, JSON.stringify(result.data), { expires: result.data.expiredTime });
            dispatch(SliceAuth.actions.setLogin(true));
            history(configRoutes.dashboard);
        } else {
            message.error(result.messages[0]);
        }
    };
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENTID as string}>
            <GoogleLogin
                onSuccess={onSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
                theme="outline"
            />
            ;
        </GoogleOAuthProvider>
    );
};

export default SignInGoogle;
