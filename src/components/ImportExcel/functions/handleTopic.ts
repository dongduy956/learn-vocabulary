import { message } from 'antd';
import { PropsHandleImportEach, PropsTopic } from '~/interfaces';
import { topicServices } from '~/services';

const handleTopic: PropsHandleImportEach<PropsTopic> = async (data, setOpen, setData, setLoading, setTable) => {
    setLoading(true);
    const topics: Array<PropsTopic> = (await topicServices.getAllTopics()).data;
    const newData = data.reduce(
        (arr: Array<PropsTopic>, item) =>
            arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            topics.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim())
                ? arr
                : [...arr, item],
        [],
    );
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await topicServices.insertRangeTopic(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} loại vaccine do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} loại vaccine`);
            setOpen(false);
            if (typeof setTable === 'function') setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleTopic;
