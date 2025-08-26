import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChatMessage from "../types/ChatMessage";
import { DateFormater } from "../servises/DateFormater";

export default function OtherMessage(
    {message, onPress}:
     {message: ChatMessage, onPress:(message: ChatMessage)=> void})
      {
    return <TouchableOpacity 
        key={message.id} 
        style={styles.container}
        onPress={()=>onPress(message)}>
            <Text>{DateFormater(message.moment)}</Text>
            <Text>{message.author}</Text>
            <Text>{message.text}</Text>
    </TouchableOpacity>;
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#88c7f1ff",
    borderBottomLeftRadius: 0,
    borderBottomEndRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginVertical:10,
    marginLeft: 8,
    marginRight: 80,
    padding:10,
    elevation: 2
    },
});