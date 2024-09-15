function PasswordLength({clueLength, rangeValue, setLength}) {

    return (
        <>
            <span className="flex">Password Length
                <input type="range" min="2" max={clueLength} value={rangeValue} step="1"
                    onChange={(e) => setLength(e.target.value)} className="w-1/5 mx-1"
                />
                <label>Length: {rangeValue}</label>
            </span>
        </>
    );
}

export default PasswordLength;