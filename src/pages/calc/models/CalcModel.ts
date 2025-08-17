
class CalcModel {
    static #instanse: CalcModel|null;
    static get instance(): CalcModel {
        if (CalcModel.#instanse == null){
            CalcModel.#instanse = new CalcModel();
        }
        return CalcModel.#instanse;
    }

    result: string = "0";
    calculation: string = "";
    history: string = "";
    memory: string = "0";

    reset() {
    this.result = "0";
    this.calculation = "";
    this.history = "";
    this.memory = "0";
   }
}

export default CalcModel;