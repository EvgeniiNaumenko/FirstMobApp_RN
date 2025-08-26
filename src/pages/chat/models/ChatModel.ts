import ChatMassage from "../types/ChatMessage";


class ChatModel {
    static #instanse: ChatModel|null = null;
    static get instance(): ChatModel {
        if (ChatModel.#instanse == null){
            ChatModel.#instanse = new ChatModel();
        }
        return ChatModel.#instanse;
    }
    messages: Array<ChatMassage> = [];

}

export default ChatModel;