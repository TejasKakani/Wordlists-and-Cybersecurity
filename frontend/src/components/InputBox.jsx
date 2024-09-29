import Buttons from "./Buttons";
function InputBox({ inputLabel, inputType, isReadOnly, inputValue, inputName,
    inputClasses, inputPlaceHolder, onChangeFn, buttonClasses = [], buttonOnclick = [], buttonName = [],
    extras
    }) {
    
    return (
        <>
            <span>{inputLabel}</span>
            <div className="inline-block">
                <input type={inputType} readOnly={isReadOnly} value={inputValue}
                    onChange={onChangeFn} name={inputName} className={inputClasses} placeholder={inputPlaceHolder}
                    { ...extras }
            />
                <Buttons buttonName={buttonName} buttonClasses={buttonClasses} buttonOnclick={buttonOnclick} />
            </div>
        </>
    );
}

export default InputBox;
