import {Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { AppContext } from '../../shared/context/appContext';
import { useContext, useEffect, useRef, useState } from 'react';
import ChatModel from './models/ChatModel';
import OtherMessage from './components/OtherMessage';
import ChatMessage from './types/ChatMessage';
import MyMessage from './components/MyMessage';

export default function Chat() {
    const chatUrl = `https://chat.momentfor.fun/`;
    const scrollViewRef = useRef<ScrollView>(null);
    const {showModal, navigate, user} = useContext(AppContext)
    const [messages, setMessages] = useState(ChatModel.instance.messages);
    const [messageText, setMessageText] = useState("");

    // - розрізняти "свої" повідомлення за збігом авторизованого імені
    // - для своїх повідомлень не виводити саме ім'я, можна зазначати "Я/від мене"
    // - прибирати введене повідомлення якщо воно успішно надіслане (якщо ні, то ні)
    // * розібратись чому "2+2" надсилається як "2 2"

    useEffect (()=>{
        if(user == null){
            showModal({
                title: "Greeting",
                message: "Hello",
                positiveButtonText: "Enter",
                positiveButtonAction: () => navigate("auth"),
                negativeButtonText: "Exit",
                negativeButtonAction: () => navigate("-1"),
                closeButtonAction: () => navigate("-1"),
            })
        }
    },[user]);

    useEffect(()=>{
      let handle : NodeJS.Timeout|null = null;
      if(ChatModel.instance.messages.length == 0){
        console.log("load data")
        fetch(chatUrl)
          .then(r => r.json())
          .then(j => {
            console.log("Loaded data");
            ChatModel.instance.messages = j.data;
            setMessages(j.data);
          })
      }
      else {
        handle = setInterval(updateMessages, 1000)
        return ()=>{
          if(handle != null) clearInterval(handle)
        }
      }
    },[user]);
    const updateMessages = () =>{
      console.log("update messages");
        fetch(chatUrl)
          .then(r => r.json())
          .then(j => {
            console.log("Loaded data");
            // проверяем есть ли новые сообщения по айди
            let wasNew = false;
            for(let m of j.data){
              if(typeof messages.find(e=> e.id == m.id)== 'undefined'){
                // значит новое сообщение
                messages.push(m);
                wasNew = true;
              }  
            }
            // если были новые сообщение обновляем состояние
            if(wasNew){
              setMessages([...messages.sort(
                // (a, b) => new Date(a.moment).getTime() - new Date(b.moment).getTime()
                (a,b) => a.moment> b.moment ? 1 
                : a.moment < b.moment? -1 : 0
              )])
            }
          });
    };
    const messagePressed = (m: ChatMessage) => {
      setMessages([...messages]);
    }

    const onSendPressed = () =>{
      console.log(user?.nam, messageText);
      if(messageText.trim().length == 0){
        showModal({
          title: "Коммуникатор",
          message: "Введите сообщение"
        })
      }
      let data = `author=${encodeURIComponent(user!.nam)}&msg=${encodeURIComponent(messageText)}`;
      fetch(chatUrl, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      }).then( r =>{
        if(r.status == 201){
          setMessageText("");
          updateMessages();
        }
        else{
          r.json().then(console.error);
          showModal({
            title: "Коммуникатор",
            message: "error, попробуйте позже"
          })

        }});
    };

    return user == null ? <View></View> : <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container} >
          <View style={styles.chat}>
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() => { scrollViewRef }}>
              {messages.map((m, i) =>
                m.author === user?.nam
                  ? <MyMessage key={m.id} message={{...m, author: "Я"}} onPress={messagePressed} />
                  : <OtherMessage key={m.id} message={m} onPress={messagePressed} />
              )}
            </ScrollView>
          </View>
          <View style={styles.inputRow}>
            <TextInput
                      style={styles.textInput}
                      value={messageText}
                      onChangeText={setMessageText}
                      />
            <TouchableOpacity style={styles.sendButton} onPress={onSendPressed}>
                <Text> &#10148;</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}}></View>
        </KeyboardAvoidingView>
};

const styles = StyleSheet.create({
  container:{
    height: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chat:{
    flex: 1,
  },
  sendButton:{
    backgroundColor: "#ffffff",
    padding: 5,
    justifyContent: "center",
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  inputRow:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
  },
  textInput: {
    flex: 1,
    borderColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 8,
    margin: 10,
    backgroundColor: "#fff"
  },
});

