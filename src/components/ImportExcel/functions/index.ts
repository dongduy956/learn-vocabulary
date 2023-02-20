import { typeImportExcel } from '~/constraints';
import handleWord from './handleWord';
import { PropsHandleImportExcel, PropsWord } from '~/interfaces';
const handleImport: PropsHandleImportExcel = async (type, setOpen, setData, setLoading, data, setTable, subData) => {
    // eslint-disable-next-line default-case
    switch (type) {
        case typeImportExcel.word:
            await handleWord(data, setOpen, setData, setLoading, setTable);
            break;
    }
};

export default handleImport;
