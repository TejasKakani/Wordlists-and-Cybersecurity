import Buttons from "./Buttons";
function InputBox({ inputLabelLeft, inputLabelRight, inputType, isReadOnly, inputValue, inputName,
    inputClasses, inputPlaceHolder, onChangeFn, buttonClasses = [], buttonOnclick = [], buttonName = [],
    extras
    }) {
    
    return (
        <>
            <span>{inputLabelLeft}</span>
            <div className="inline-block">
                <input type={inputType} readOnly={isReadOnly} value={inputValue}
                    onChange={onChangeFn} name={inputName} className={inputClasses} placeholder={inputPlaceHolder}
                    { ...extras }
            />
                <Buttons buttonName={buttonName} buttonClasses={buttonClasses} buttonOnclick={buttonOnclick} />
            </div>
            <span>{inputLabelRight}</span>
        </>
    );
}

export default InputBox;
