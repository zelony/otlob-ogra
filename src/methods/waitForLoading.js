export default function(val, interval = 200) {
    const checkIfCorrect = (val) => {
        if (val){
            if (typeof val === 'function'){
                return checkIfCorrect(val());
            }
            return true;
        }
        return false;
    }
    return new Promise(resolve => {
        if (checkIfCorrect(val)) {
            resolve();
        }
        const time = setInterval(() => {
            if (checkIfCorrect(val)) {
                clearInterval(time);
                resolve();
            }
        }, interval);
    });
}
