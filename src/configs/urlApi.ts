const tables = {
    topic: 'Topic',
    word: 'Word',
    learnedWord: 'LearnedWord',
    statistical: 'Statistical',
    auth: 'Auth',
    account: 'Account',
    user: 'User',
    upload: 'Upload',
};
const urlApi = {
    //topic
    getAllTopics: `${tables.topic}/GetAll`,
    getAllTopicsPaging: `${tables.topic}/GetAllPaging`,
    searchTopics: `${tables.topic}/Search`,
    insertTopic: `${tables.topic}/Insert`,
    updateTopic: `${tables.topic}/Update`,
    deleteTopic: `${tables.topic}/Delete`,
    insertRangeTopic: `${tables.topic}/InsertRange`,
    //word
    getAllWords: `${tables.word}/GetAll`,
    getAllWordsPaging: `${tables.word}/GetAllPaging`,
    getWordsByTopicId: `${tables.word}/GetWordsByTopicId`,
    getWordsByTopicIdPaging: `${tables.word}/GetWordsByTopicIdPaging`,
    searchWords: `${tables.word}/Search`,
    insertWord: `${tables.word}/Insert`,
    insertRangeWord: `${tables.word}/InsertRange`,
    updateWord: `${tables.word}/Update`,
    deleteWord: `${tables.word}/Delete`,
    //learnedWord
    getAllLearnedWords: `${tables.learnedWord}/GetAll`,
    getAllIncorrectLearnedWords: `${tables.learnedWord}/GetAllIncorrect`,
    getAllLearnedWordsPaging: `${tables.learnedWord}/GetAllPaging`,
    searchLearnedWords: `${tables.learnedWord}/Search`,
    insertRangeLearnedWord: `${tables.learnedWord}/InsertRange`,
    updateRangeLearnedWord: `${tables.learnedWord}/UpdateRange`,
    //statistical
    getTopCustomer: `${tables.statistical}/GetTopCustomer`,
    //auth
    login: `${tables.auth}/Login`,
    logout: `${tables.auth}/Logout`,
    refreshToken: `${tables.auth}/RefreshToken`,
    changePassword: `${tables.auth}/ChangePassword`,
    sendCode: `${tables.auth}/SendCode`,
    confirmCode: `${tables.auth}/ConfirmCode`,
    forgetPassword: `${tables.auth}/ForgetPassword`,
    //account
    registerAccount: `${tables.account}/Register`,
    //user
    registerUser: `${tables.user}/Register`,
    updateUser: `${tables.user}/Update`,
    deleteUser: `${tables.user}/Delete`,
    //upload
    uploadImage: `${tables.upload}/UploadImage`,
};
export default urlApi;
