import Container from "./components/Container";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Clue from "./components/Clue";
import Wordlist from "./components/Wordlist";
import { WordlistProvider } from "./contexts/wordlist";
import { useState } from "react";

function App() {

    const [wordlist, setWordlist] = useState([]);

    return (
        <WordlistProvider value={{ wordlist, setWordlist }}>
            <Header />
            <Container>
            <Clue />
            <Wordlist />
            </Container>
            <Footer />
        </WordlistProvider>
    );
}

export default App;