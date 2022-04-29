export default function objectEqual(obj1,obj2){
    try {
        return JSON.stringify(obj1) === JSON.stringify(obj2)
    }
    catch (e) {
        return false;
    }
}
