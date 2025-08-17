
class CalcModel {
    static #instanse: CalcModel|null;
    static get instance(): CalcModel {
        if (CalcModel.#instanse == null){
            CalcModel.#instanse = new CalcModel();
        }
        return CalcModel.#instanse;
    }

    result: string = "0";
    memory: string = "0";
    calculation: string = "";
    history: string = "";

    reset() {
    this.result = "0";
    this.calculation = "";
    this.history = "";
   }
}

export default CalcModel;