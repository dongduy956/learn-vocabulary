import axios from 'axios';
import Cookies from 'js-cookie';
import { configStorage } from '~/configs';
import { PropsRequest } from '~/interfaces';
import { authServices } from '~/services';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
let isRefreshing = false; // Biến trạng thái
let refreshSubscribers: ((newToken: string) => void)[] = []; // Mảng lưu trữ
// Hàm gọi refresh token
async function callRefreshToken() {
    isRefreshing = true;
    // Gọi API để lấy token mới
    const session = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login) as string) : {};
    const result = await authServices.refreshToken({
        accessToken: session?.accessToken,
        refreshToken: session?.refreshToken,
    });
    if (result.isSuccess) {
        Cookies.set(configStorage.login, JSON.stringify(result.data), { expires: result.data.expiredTime });
        // config.headers = {
        //     ...config.headers,
        //     authorization: `Bearer ${result.data.accessToken}`,
        // };
    } else if (result.statusCode === 404 || result.statusCode === 400) Cookies.remove(configStorage.login);
    // Cập nhật token mới vào các request chờ
    refreshSubscribers.forEach((subscriber) => {
        subscriber(result.data.accessToken);
    });

    refreshSubscribers = [];
    isRefreshing = false;
}
axios.interceptors.request.use(
    async (config: any) => {
        const session = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login) as string) : {};
        if (session?.accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${session?.accessToken}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error),
);
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra nếu request trả về mã lỗi 401 (token hết hạn)
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh token, tạm dừng và chờ kết quả refresh
                return new Promise((resolve) => {
                    refreshSubscribers.push((newToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(axios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            // Gọi hàm refresh token và trả về kết quả của request ban đầu
            return callRefreshToken().then(() => axios(originalRequest));
        }

        return Promise.reject(error);
    },
);
export const get: PropsRequest.RequestType = async (path, data = {}) => {
    const res = await axios.get(path, data);
    return res.data;
};
export const del: PropsRequest.RequestType = async (path, data = {}) => {
    const res = await axios.delete(path, data);
    return res.data;
};

export const post: PropsRequest.RequestDataType = async (path, data, config = {}) => {
    const res = await axios.post(path, data, config);
    return res.data;
};
export const put: PropsRequest.RequestDataType = async (path, data, config = {}) => {
    const res = await axios.put(path, data, config);
    return res.data;
};
