import { useState } from 'react';

const useInputBoxError = (eMsg, eCls) => {

    const [errorMessage, setErrorMessage] = useState(eMsg);
    const [inputBoxClasses, setInputBoxClasses] = useState(eCls);

    const errorState = [errorMessage, inputBoxClasses];
    const setErrorState = (errorMsg, inputBoxCls) => {
        setErrorMessage(errorMsg);
        setInputBoxClasses(inputBoxCls);
    }
    return [errorState, setErrorState];
}

export default useInputBoxError;