import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { AppContext } from '../../shared/context/appContext';
import { useContext, useEffect } from 'react';

export default function Chat() {
    const{showModal, navigate, user} = useContext(AppContext)
    useEffect (()=>{
        if(user == null){
            showModal({
                title: "Greeting",
                message: "Hello BRO",
                positiveButtonText: "Enter",
                positiveButtonAction: () => navigate("auth"),
                negativeButtonText: "Exit",
                negativeButtonAction: () => navigate("-1"),
                closeButtonAction: () => navigate("-1"),
            })
        }
    },[user]);

    return (
        <View>
            <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => showModal({
                title: "Greeting",
                message: "Hello BRO",
                positiveButtonText: "Enter",
                positiveButtonAction: () => navigate("auth"),
                negativeButtonText: "Exit",
                negativeButtonAction: () => navigate("-1"),
                })}>
            <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

