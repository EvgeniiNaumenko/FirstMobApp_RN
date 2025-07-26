import { createContext } from "react";

type AppContextType = {
    navigate: (href: string) => void,
    user: string|null,
    setUser: (user: string|null) => void,
    request: (url: string, ini?:any) => Promise<any>,
    
}

const init = {
    navigate: (_:string)=> { throw "navigate not implemented!";},
    user: null,
    setUser: (_: string|null) => {throw "setUser not implemented"},
    request: (_: string, __:any) => {throw "setUser not implemented"},
}

export const AppContext = createContext<AppContextType>(init);