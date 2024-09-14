import { useState } from 'react';

const useInputBoxError = () => {

    const [errorMessage, setErrorMessage] = useState("");
    const [inputBoxClasses, setInputBoxClasses] = useState("border-2 border-indigo-300 rounded-l-lg");

    const errorState = [errorMessage, inputBoxClasses];
    const setErrorState = (errorMsg, inputBoxCls) => {
        setErrorMessage(errorMsg);
        setInputBoxClasses(inputBoxCls);
    }
    return [errorState, setErrorState];
}

export default useInputBoxError;