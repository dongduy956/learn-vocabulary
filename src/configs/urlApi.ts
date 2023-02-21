const tables = {
    topic: 'Topic',
    word: 'Word',
};
const urlApi = {
    //topic
    getAllTopics: `${tables.topic}/GetAll`,
    searchTopics: `${tables.topic}/Search`,
    insertTopic: `${tables.topic}/Insert`,
    insertRangeTopic: `${tables.topic}/InsertRange`,
    //word
    getAllWords: `${tables.word}/GetAll`,
    getAllWordsPaging: `${tables.word}/GetAllPaging`,
    getWordsByTopicId: `${tables.word}/GetWordsByTopicId`,
    searchWords: `${tables.word}/Search`,
    insertWord: `${tables.word}/Insert`,
    insertRangeWord: `${tables.word}/InsertRange`,
    updateWord: `${tables.word}/Update`,
    deleteWord: `${tables.word}/Delete`,
};
export default urlApi;
