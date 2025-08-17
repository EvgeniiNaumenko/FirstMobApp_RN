import NbuRate from "../types/NbuRate";

class RatesModel {
    static #instanse: RatesModel|null;
    static get instance(): RatesModel {
        if (RatesModel.#instanse == null){
            RatesModel.#instanse = new RatesModel();
        }
        return RatesModel.#instanse;
    }
    rates: Array<NbuRate> = [];
    shownRates: Array<NbuRate> = [];
    searchText: string ="";
    loadedDate: string | null = null;
}

export default RatesModel;