import Buttons from "./Buttons";

function InputBox({ inputLabel, inputType, isReadOnly, inputValue, inputName,
                    inputClasses, inputPlaceHolder, onChangeFn, buttonClasses = [], buttonOnclick = [], buttonName = []}) {
    
    return (
        <>
        <span>{inputLabel}</span>
            <input type={inputType} readOnly={isReadOnly} value={inputValue}
                onChange={onChangeFn} name={inputName} className={inputClasses} placeholder={inputPlaceHolder}
           />
           <Buttons buttonName={buttonName} buttonClasses={buttonClasses} buttonOnclick={buttonOnclick} />
        </>
    );
}

export default InputBox;
