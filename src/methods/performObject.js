export default function performObject(obj){
    try {
        return JSON.parse(JSON.stringify(obj))
    }
    catch (e) {
        return false;
    }
}
