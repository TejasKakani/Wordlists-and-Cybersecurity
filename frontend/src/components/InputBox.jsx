function InputBox({ inputLabel, inputType, isReadOnly, inputValue, inputName,
                    inputClasses, inputPlaceHolder, onChangeFn, isButton, buttonClasses, buttonOnclick, buttonName}) {
    if (isButton) return (
        <>
        <span>{inputLabel}</span>
            <input type={inputType} readOnly={isReadOnly} value={inputValue}
                onChange={onChangeFn} name={inputName} className={inputClasses} placeholder={inputPlaceHolder}
            />
        <button className={buttonClasses}
            onClick={buttonOnclick}
            >{buttonName}</button>
        </>
    );
    return (
        <>
            <span>{inputLabel}</span>
            <input type={inputType} readOnly={isReadOnly} value={inputValue}
                onChange={onChangeFn} name={inputName} className={inputClasses} placeholder={inputPlaceHolder}
            />
        </>
    );
}

export default InputBox;
