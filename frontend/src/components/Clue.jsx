import { useState } from "react"
import "../index.css"
import InputBox from "./InputBox"

function Clue() {

    const [clue, setClue] = useState([]);

    let [modifyClue, setModifyClue] = useState("");

    const buttonClasses = [
        "px-2 border-2 border-indigo-300 bg-indigo-300 ",
        "px-2 border-2 border-indigo-300 bg-indigo-100 rounded-r-lg "
    ]

    const buttonOnclick = [
        () => {
            setClue([...clue, modifyClue]);
            setModifyClue("");
        },
        () => {
            if (clue.includes(modifyClue)) {
                let index = clue.indexOf(modifyClue);
                clue.splice(index, 1);
                setClue([...clue]);
            }
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
                <InputBox inputLabel="Add Clue " inputType="text" isReadOnly={false} inputValue={modifyClue} inputName="addClue"
                    inputClasses="border-2 border-indigo-300 rounded-l-lg" inputPlaceHolder="Clue"
                    onChangeFn={(e) => setModifyClue(e.target.value)} buttonClasses={buttonClasses}
                    buttonOnclick={buttonOnclick} buttonName={buttonName}
                    />
            </div>
        </>
    )
}

export default Clue;