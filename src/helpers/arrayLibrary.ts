export const isGrow = <T extends Array<any>>(arr: T): boolean => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        if (arr[i]?.no > arr[i + 1]?.no) return false;
    }
    return true;
};
export const shuffleArray = <T>(array: Array<T>) => {
    const temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
};
