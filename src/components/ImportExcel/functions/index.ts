import { typeImportExcel } from '~/constraints';
import { PropsHandleImportExcel, PropsTopic, PropsWord } from '~/interfaces';
import handleTopic from './handleTopic';
import handleWord from './handleWord';
const handleImport: PropsHandleImportExcel = async (type, setOpen, setData, setLoading, data, setTable, subData) => {
    // eslint-disable-next-line default-case
    switch (type) {
        case typeImportExcel.word:
            await handleWord(data as PropsWord[], setOpen, setData, setLoading, setTable);
            break;
        case typeImportExcel.topic:
            await handleTopic(data as PropsTopic[], setOpen, setData, setLoading, setTable);
            break;
    }
};

export default handleImport;
