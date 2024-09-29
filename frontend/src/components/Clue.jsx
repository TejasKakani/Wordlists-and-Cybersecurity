import { useCallback, useState, useEffect } from "react"
import "../index.css"
import InputBox from "./InputBox"
import useInputBoxError from "../hooks/useInputBoxError";
import axios from "axios";
import { useWordlist } from "../contexts/wordlist";

function Clue() {

    const [clue, setClue] = useState([]);

    const [length, setLength] = useState(2);

    const [modifyClue, setModifyClue] = useState("");

    const [errorState1, setErrorState1] = useInputBoxError("", "");
    const [errorState2, setErrorState2] = useInputBoxError("", "border-2 border-indigo-300 rounded-l-lg");

    const buttonClasses = [
        `px-2 border-2 border-indigo-300 active:bg-indigo-100 bg-indigo-300`,
        `px-2 border-2 border-indigo-300 active:bg-indigo-100 bg-indigo-300 rounded-r-lg`
    ]

    const buttonOnclick = [
        //add button
        () => {
            setErrorState2("", "border-2 border-indigo-300 rounded-l-lg")
            if (modifyClue === "") { setErrorState2("Error: Blank clue cannot be added", "border-2 border-red-700 rounded-l-lg"); return; }
            if (clue.includes(modifyClue)) { setModifyClue(""); setErrorState2("Error: Clue is already present", "border-2 border-red-700 rounded-l-lg"); return; }
            setClue([...clue, modifyClue]);
            setModifyClue("");
        },
        //remove button
        () => {
            setErrorState2("", "border-2 border-indigo-300 rounded-l-lg");
            if (clue.includes(modifyClue)) {
                let index = clue.indexOf(modifyClue);
                clue.splice(index, 1);
                setClue([...clue]);
                setModifyClue("");
                return;
            }
            setErrorState2("Error: Clue not found", "border-2 border-red-700 rounded-l-lg");
            setModifyClue("");
        }
    ];

    const buttonName = ["Add", "Remove"];

    const { setWordlist } = useWordlist();

    async function generateWordlist() {
       
        if (clue.length === 0) {
            setErrorState1("Error: Clue cannot be empty", "border-2 border-red-700 rounded-lg");
            return;
        }
        setWordlist("Loading...");
        await axios.post("http://localhost:5000/api/v1/generate-wordlist", {
            clue,
            length
        })
        .then(response => {
            setWordlist(response.data);
        })
        .catch(error => {
            console.log(error, error.message);
            setWordlist("Error: " + error.message);
        });

    }

    var generate = useCallback(generateWordlist, [clue, length, setErrorState1, setWordlist]);

    useEffect(() => {
        if (clue.length !== 0) {
            setErrorState1("", "");
        }
    }, [clue, setErrorState1]);

    return (
        <div>
            <InputBox inputLabel="Given Clues: " inputType="text" isReadOnly={true} inputValue={clue} inputName="clues"
                inputClasses={errorState1[1]} inputPlaceHolder="" />
            <div className="text-xs text-red-700" >{errorState1[0]}</div>
            <br />
            <InputBox inputLabel="Add/Remove Clue " inputType="text" isReadOnly={false} inputValue={modifyClue} inputName="addClue"
                inputClasses={errorState2[1]} inputPlaceHolder="Clue"
                onChangeFn={(e) => {
                    setErrorState2("", "border-2 border-indigo-300 rounded-l-lg");
                    if (e.target.value.includes(" ")) {
                        setErrorState2("Error: Clue cannot contain spaces", "border-2 border-red-700 rounded-l-lg");
                    }
                    return setModifyClue(e.target.value.trim());
                }} buttonClasses={buttonClasses}
                buttonOnclick={buttonOnclick} buttonName={buttonName}
            />
            <div className="text-xs text-red-700" >{errorState2[0]}</div>
            <br />
            <InputBox inputLabel="Password Length" inputType="range" inputValue={length} onChangeFn={
                (e) => {
                
                    return setLength(e.target.value);
                }
            } inputClasses="w-1/1 mx-1" extras={{ min: 2, max: 15, step: 1 }} />
            <label>Length: {length}</label>
            <br />
            <br />
            <button onClick={generate} className="mx-32 px-2 border-2 border-indigo-300 active:bg-indigo-100 bg-indigo-300 rounded-lg">Generate Password</button>
        </div>
    );
}

export default Clue;