import { View , StyleSheet, Text, TouchableOpacity} from "react-native";


type CalcButtonData = {
  title : string,
  type?: string,
  data?: string,
  action:(title:string, data?:string) => any
}

export default function CalcButton({title, type, data, action}:CalcButtonData){
  return <TouchableOpacity 
            onPress={()=>action(title,data)} 
            style={[styles.calcButton,(
                type=="digit"?styles.digitButton
                : type =="equal" ?styles.equalButton 
                : styles.operationButton)]}>
      <Text style={type=="equal"? styles.calcEqualText: styles.calcButtonText}>{title}</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  calcButton:{
    borderRadius: 5,
    flex: 1,
    margin: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  calcEqualText:{
    color: "#323232",
    fontSize: 22,
  },
  calcButtonText:{
    color: "#ffffff",
    fontSize: 20,
  },
  operationButton:{
    backgroundColor: "#323232",
  },
  digitButton:{
    backgroundColor: "#3B3B3B",
  },
  equalButton:{
    backgroundColor: "#4CC2FF",
    color:"323232"
  }
});