import { useState } from "react"
import "../index.css"
import InputBox from "./InputBox"
import useInputBoxError from "../hooks/useInputBoxError";
import PasswordLength from "./PasswordLength";

function Clue() {

    const [clue, setClue] = useState([]);

    const [length, setLength] = useState(2);

    const [modifyClue, setModifyClue] = useState("");

    const [errorState, setErrorState] = useInputBoxError();

    const buttonClasses = [
        `px-2 border-2 border-indigo-300 active:bg-indigo-100 bg-indigo-300`,
        `px-2 border-2 border-indigo-300 active:bg-indigo-100 bg-indigo-300 rounded-r-lg`
    ]
    
    const buttonOnclick = [
        //add button
        () => {
            setErrorState("", "border-2 border-indigo-300 rounded-l-lg")
            if (modifyClue === "") { setErrorState("Error: Blank clue cannot be added", "border-2 border-red-700 rounded-l-lg"); return; }
            if (clue.includes(modifyClue)) { setModifyClue(""); setErrorState("Error: Clue is already present", "border-2 border-red-700 rounded-l-lg"); return; }
            setClue([...clue, modifyClue]);
            setModifyClue("");
        },
        //remove button
        () => {
            setErrorState("", "border-2 border-indigo-300 rounded-l-lg");
            if (clue.includes(modifyClue)) {
                let index = clue.indexOf(modifyClue);
                clue.splice(index, 1);
                setClue([...clue]);
                setModifyClue("");
                return;
            }
            setErrorState("Error: Clue not found", "border-2 border-red-700 rounded-l-lg");
            setModifyClue("");
        }
    ];
    const buttonName = ["Add", "Remove"];

    return (
        <>
            <div className="px-10 py-10">
                <InputBox inputLabel="Given Clues: " inputType="text" isReadOnly={true} inputValue={clue} inputName="clues"
                    inputClasses="rounded-lg" inputPlaceHolder="" />
                <br />
                <InputBox inputLabel="Add/Remove Clue " inputType="text" isReadOnly={false} inputValue={modifyClue} inputName="addClue"
                    inputClasses={errorState[1]} inputPlaceHolder="Clue"
                    onChangeFn={(e) => {
                        setErrorState("", "border-2 border-indigo-300 rounded-l-lg");
                        if (e.target.value.includes(" ")) {
                            setErrorState("Error: Clue cannot contain spaces", "border-2 border-red-700 rounded-l-lg");
                        }
                        return setModifyClue(e.target.value.trim());
                    }} errorMessage={errorState[0]} buttonClasses={buttonClasses}
                    buttonOnclick={buttonOnclick} buttonName={buttonName}
                />
                <br />
                <PasswordLength clueLength={clue.length} rangeValue={length} setLength={setLength} />
            </div>
        </>
    )
}

export default Clue;