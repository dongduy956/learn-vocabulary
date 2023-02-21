import { UploadProps } from 'antd/es/upload';

export default interface PropsUploadFile extends UploadProps {
    customRequest: (options: any) => Promise<void>;
}
