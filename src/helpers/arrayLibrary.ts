export const isGrow = <T extends Array<any>>(arr: T): boolean => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        if (arr[i]?.no > arr[i + 1]?.no) return false;
    }
    return true;
};
export const shuffleArray = <T>(array: Array<T>) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
