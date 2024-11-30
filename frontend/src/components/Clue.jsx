import { useCallback, useState, useEffect } from "react"
import "../index.css"
import InputBox from "./InputBox"
import useInputBoxError from "../hooks/useInputBoxError";
import axios from "axios";
import { useWordlist } from "../contexts/wordlist";

function addClue(filterBlock, modifyCheckedClueArray, checkedClueArray, eachClue) {
    if (filterBlock === "StartsWith") {
        modifyCheckedClueArray.setStartsWithClue([...checkedClueArray.startsWithClue, eachClue]);
    }
    if (filterBlock === "Contains") {
        modifyCheckedClueArray.setContainsClue([...checkedClueArray.containsClue, eachClue]);
    }
    if (filterBlock === "EndsWith") {
        modifyCheckedClueArray.setEndsWithClue([...checkedClueArray.endsWithClue, eachClue]);
    }
}

function removeClue(filterBlock, modifyCheckedClueArray, checkedClueArray, eachClue) {
    if (filterBlock === "StartsWith") {
        const newArray = checkedClueArray.startsWithClue.filter(item => item !== eachClue);
        modifyCheckedClueArray.setStartsWithClue(newArray);
    }
    if (filterBlock === "Contains") {
        const newArray = checkedClueArray.containsClue.filter(item => item !== eachClue);
        modifyCheckedClueArray.setContainsClue(newArray);
    }
    if (filterBlock === "EndsWith") {
        const newArray = checkedClueArray.endsWithClue.filter(item => item !== eachClue);
        modifyCheckedClueArray.setEndsWithClue(newArray);
    }
}

function getIndex(array, filterBlock, clue) {
    if (filterBlock === "StartsWith") {
        return array.startsWithClue.indexOf(clue);
    }
    if (filterBlock === "Contains") {
        return array.containsClue.indexOf(clue);
    }
    if (filterBlock === "EndsWith") {
        return array.endsWithClue.indexOf(clue);
    }
}

function CheckClue({ clue, filterBlock, checkedClueArray, modifyCheckedClueArray }) {
    const padding = "----->"
    return (
        <>
            {
            clue.map((eachClue) => {
                return (
                    <div key={eachClue}>
                        <InputBox
                            inputLabelRight={`${eachClue} ${(getIndex(checkedClueArray, filterBlock, eachClue)) >= 0 ? `${padding} ${getIndex(checkedClueArray, filterBlock, eachClue) + 1}` : ""  }`}
                            inputType="checkbox" onChangeFn={
                            (e) => {
                                if (e.target.checked) {
                                    addClue(filterBlock, modifyCheckedClueArray, checkedClueArray, eachClue);
                                }
                                else {
                                    removeClue(filterBlock, modifyCheckedClueArray, checkedClueArray, eachClue);
                                }
                            }
                        }
                        inputClasses="w-1/1 mx-1" />
                    </div>
                );
            })
            }
        </>
    );
}

function Clue() {

    const [clue, setClue] = useState([]);

    const [length, setLength] = useState(2);

    const [startsWith, setStartsWith] = useState(false);
    const [contains, setContains] = useState(false);
    const [endsWith, setEndsWith] = useState(false);

    const [startsWithClue, setStartsWithClue] = useState([]);
    const [containsClue, setContainsClue] = useState([]);
    const [endsWithClue, setEndsWithClue] = useState([]);

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
            length,
            ...(startsWith && {startsWithClue}),
            ...(contains && {containsClue}),
            ...(endsWith && {endsWithClue})
        })
        .then(response => {
            setWordlist(response.data);
        })
        .catch(error => {
            console.log(error, error.message);
            setWordlist("Error: " + error.message);
        });

    }

    var generate = useCallback(generateWordlist, [clue, containsClue, endsWithClue, length, setErrorState1, setWordlist, startsWithClue]);

    useEffect(() => {
        if (clue.length !== 0) {
            setErrorState1("", "");
        }
    }, [clue, setErrorState1]);

    useEffect(() => {
        startsWithClue.map((eachClue) => {
            if (!clue.includes(eachClue)) {
                setStartsWithClue(startsWithClue.filter(item => item !== eachClue));
            }
        });
        containsClue.map((eachClue) => {
            if (!clue.includes(eachClue)) {
                setContainsClue(containsClue.filter(item => item !== eachClue));
            }
        });
        endsWithClue.map((eachClue) => {
            if (!clue.includes(eachClue)) {
                setEndsWithClue(endsWithClue.filter(item => item !== eachClue));
            }
        });
    }, [clue, containsClue, endsWithClue, startsWithClue]);

    const [containsWithDisabled, setContainsWithDisabled] = useState(false);

    useEffect(() => {
            if (length - (startsWithClue.length + endsWithClue.length) <= 0) {
                setContainsWithDisabled(true);
                if(contains) {
                    setContains(false);
                }
            }
            else {
                setContainsWithDisabled(false);
                if(!contains && containsClue.length > 0) {
                    setContains(true);
                }
            }
    }, [length, startsWithClue, endsWithClue]);

    return (
        <div>
            <InputBox inputLabelLeft="Given Clues: " inputType="text" isReadOnly={true} inputValue={clue} inputName="clues"
                inputClasses={errorState1[1]} inputPlaceHolder="" />
            <div className="text-xs text-red-700" >{errorState1[0]}</div>
            <br />
            <InputBox inputLabelLeft="Add/Remove Clue " inputType="text" isReadOnly={false} inputValue={modifyClue} inputName="addClue"
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
            <InputBox inputLabelLeft="Password Length" inputType="range" inputValue={length} onChangeFn={
                (e) => {
                    return setLength(e.target.value);
                }
            } inputClasses="w-1/1 mx-1" extras={{ min: 2, max: 15, step: 1 }} />
            <label>Length: {length}</label>
            <br />
            <br />
            <div className="flex justify-evenly">
                <div>
                    <InputBox inputLabelRight="Starts with" inputType="checkbox" onChangeFn={() => { setStartsWith(!startsWith) }} inputClasses="w-1/1 mx-1" extras={{ checked: startsWith }} />
                    <div style={{ display: startsWith ? "block" : "none" }}>
                    <CheckClue clue={clue} filterBlock="StartsWith"
                        checkedClueArray={{ startsWithClue, containsClue, endsWithClue }}
                        modifyCheckedClueArray={{ setStartsWithClue, setContainsClue, setEndsWithClue }}
                        />
                    </div>
                </div>
                <div>
                    <InputBox inputLabelRight="Contains" inputType="checkbox" onChangeFn={() => { setContains(!contains) }} inputClasses="w-1/1 mx-1" extras={{ checked: contains, disabled: containsWithDisabled }} />
                    <div style={{ display: contains ? "block" : "none" }}>
                    <CheckClue clue={clue} filterBlock="Contains"
                        checkedClueArray={{ startsWithClue, containsClue, endsWithClue }}
                        modifyCheckedClueArray={{setStartsWithClue, setContainsClue, setEndsWithClue}}
                        />
                    </div>
                </div>
                <div>
                    <InputBox inputLabelRight="Ends with" inputType="checkbox" onChangeFn={() => { setEndsWith(!endsWith) }} inputClasses="w-1/1 mx-1" extras={{ checked: endsWith }} />
                    <div style={{ display: endsWith ? "block" : "none" }}>
                    <CheckClue clue={clue} filterBlock="EndsWith"
                        checkedClueArray={{ startsWithClue, containsClue, endsWithClue }}
                        modifyCheckedClueArray={{ setStartsWithClue, setContainsClue, setEndsWithClue }}
                        />
                    </div>
                </div>
            </div>
            <br />
            <br />
            <button onClick={generate} className="mx-32 px-2 border-2 border-indigo-300 active:bg-indigo-100 bg-indigo-300 rounded-lg">Generate Password</button>
        </div>
    );
}

export default Clue;