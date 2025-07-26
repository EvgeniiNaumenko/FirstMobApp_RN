import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ButtonTypes } from "../model/ButtonTypes";

export default function FirmButton({type, action, title}: {type?: string, action: Function, title: string})
{
    if(typeof type=="undefined"){
        type = ButtonTypes.primary;
    }
    return  <TouchableOpacity onPress={_=>action()} style={[styles.enterButton, (type == ButtonTypes.primary? styles.primaryButton : styles.secondaryButton)]}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>;
};

const styles = StyleSheet.create({
primaryButton:{
    backgroundColor: "#19c980ff",
  },
secondaryButton:{
    backgroundColor: "#19a0c9ff",
  },
enterButton:{
    borderRadius: 7,
    margin: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#0d80ddff",
    borderWidth: 1,
  },
buttonText:{
    fontSize: 16,
    margin: 5,
  },
});