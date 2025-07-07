import { createContext } from "react";

type AppContextType = {
    navigate: (href: string) => void,
}

const init = {
    navigate: (_:string)=> { throw "navigate not implemented!";}
}

export const AppContext = createContext<AppContextType>(init);