import { useWordlist } from "../contexts/wordlist";

function Wordlist() {

    const { wordlist } = useWordlist();

    return (
        <div className="h-screen">
            <textarea readOnly className="h-full" cols={50} name="postContent" placeholder="Passwords" value={wordlist} />
        </div>
    );
}

export default Wordlist;