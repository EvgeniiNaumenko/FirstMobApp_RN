import { createContext } from "react";
import ModelData from "../types/ModalData";

type AppContextType = {
    navigate: (href: string) => void,
    user: string|null,
    setUser: (user: string|null) => void,
    request: (url: string, ini?:any) => Promise<any>,
    showModal: (data: ModelData)=> void,
    
}

const init = {
    navigate: (_:string)=> { throw "navigate not implemented!";},
    user: null,
    setUser: (_: string|null) => {throw "setUser not implemented"},
    request: (_: string, __:any) => {throw "setUser not implemented"},
    showModal: (_:ModelData)=>{throw "showModal not implemented"}
}

export const AppContext = createContext<AppContextType>(init);