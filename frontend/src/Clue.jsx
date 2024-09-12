import { useState } from "react"
import "./index.css"
import InputBox from "./components/InputBox"

function Clue() {

    const [clue, setClue] = useState([]);
    let [addClue, setAddClue] = useState("");
    let [removeClue, setRemoveClue] = useState("");

    return (
        <>
            <div className="px-10 py-10">
                <InputBox inputLabel="Given Clues: " inputType="text" isReadOnly={true} inputValue={clue} inputName="clues"
                    inputClasses="rounded-lg" inputPlaceHolder="" />
                <br />
                <br />
                <InputBox inputLabel="Add Clue " inputType="text" isReadOnly={false} inputValue={addClue} inputName="addClue"
                    inputClasses="border-2 border-indigo-300 rounded-l-lg" inputPlaceHolder="Clue"
                    onChangeFn={(e) => setAddClue(e.target.value)} isButton={true} buttonClasses="px-2 border-2 border-indigo-300 rounded-r-lg bg-indigo-300"
                    buttonOnclick={() => {
                        setClue([...clue, addClue]);
                        setAddClue("");
                    }} buttonName="Add"
                />
                <br />
                 <br />
                <InputBox inputLabel="Remove Clue " inputType="text" isReadOnly={false} inputValue={removeClue} inputName="removeClue"
                    inputClasses="border-2 border-indigo-300 rounded-l-lg" inputPlaceHolder="Clue"
                    onChangeFn={(e) => setRemoveClue(e.target.value)} isButton={true} buttonClasses="px-2 border-2 border-indigo-300 rounded-r-lg bg-indigo-300"
                    buttonOnclick={() => {
                        if (clue.includes(removeClue)) {
                            let index = clue.indexOf(removeClue);
                            clue.splice(index, 1);
                            setClue([...clue]);
                        }
                        setRemoveClue("");
                    }} buttonName="Remove"
                />
            </div>
        </>
    )
}

export default Clue;