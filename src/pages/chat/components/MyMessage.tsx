import { StyleSheet, Text, TouchableOpacity } from "react-native";
import ChatMessage from "../types/ChatMessage";
import { DateFormater } from "../servises/DateFormater";

export default function MyMessage(
  { message, onPress }: { message: ChatMessage, onPress: (message: ChatMessage) => void }
) {
  return (
    <TouchableOpacity
      key={message.id}
      style={styles.container}
      onPress={() => onPress(message)}
    >
      <Text style={styles.date}>{DateFormater(message.moment)}</Text>
      <Text style={styles.author}>Я</Text>
      {/* ну или закоментировать строку будет без Я ) */}
      <Text style={styles.text}>{message.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c4e9c1ff",
    borderBottomLeftRadius: 10,
    borderBottomEndRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginVertical: 10,
    marginLeft: 80,
    marginRight: 8,
    padding: 10,
    elevation: 2,
  },
  date: {
    fontSize: 10,
    color: "#555",
    marginBottom: 2,
  },
  author: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
