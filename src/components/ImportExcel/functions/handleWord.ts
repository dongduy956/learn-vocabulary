import { message } from 'antd';
import { PropsHandleImportEach, PropsTopic, PropsWord } from '~/interfaces';
import { wordServices, topicServices } from '~/services';

const handleWord: PropsHandleImportEach<PropsWord> = async (data, setOpen, setData, setLoading, setTable) => {
    console.log(data);
    setLoading(true);
    const words: Array<PropsWord> = (await wordServices.getAllWords()).data;
    const topics: Array<PropsTopic> = (await topicServices.getAllTopics()).data;
    const newData = data.reduce((arr: Array<PropsWord>, item): PropsWord[] => {
        const topic: PropsTopic | undefined = topics.find(
            (x) => x.name.toLowerCase().trim() === item.topicName?.toLowerCase().trim(),
        );
        return arr.find(
            (x) =>
                x.en.toLowerCase().trim() === item.en.toLowerCase().trim() &&
                x.type.toLowerCase().trim() === item.type.toLowerCase().trim(),
        ) ||
            words.find(
                (x) =>
                    x.en.toLowerCase().trim() === item.en.toLowerCase().trim() &&
                    x.type.toLowerCase().trim() === item.type.toLowerCase().trim(),
            ) ||
            !topic
            ? arr
            : [
                  ...arr,
                  {
                      ...item,
                      topicId: topic.id as number,
                  },
              ];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await wordServices.insertRangeWord(newData);
        if (resultInsert.isSuccess) {
            message.warning(
                `Đã bỏ qua ${data.length - newData.length} từ vựng do dữ liệu đã tồn tại hoặc từ vựng không tồn tại.`,
            );
            message.success(`Thêm thành công ${newData.length} từ vựng`);
            setOpen(false);
            if (typeof setTable === 'function') setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleWord;
