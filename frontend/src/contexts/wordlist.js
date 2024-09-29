import React from 'react';

export const WordlistContext = React.createContext({
    wordlist: [],
    setWordlist: (wordlist) => { }
});

export const useWordlist = () => {
    return React.useContext(WordlistContext);
}

export const WordlistProvider = WordlistContext.Provider;