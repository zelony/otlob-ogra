import {connectFunctionsEmulator, getFunctions} from "firebase/functions";
export const initFunctions = ( ) => {
    const functions = getFunctions();
    if (process.env.NODE_ENV === 'development') {
        connectFunctionsEmulator(functions,"localhost", 5001);
    }
    return functions;
}
