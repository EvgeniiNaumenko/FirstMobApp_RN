import { View , StyleSheet, Text, TouchableOpacity} from "react-native";

export default function Calc() {
    const onButtonPress = (title:string)=>{
      console.log(title);
    }
    return <View style={styles.calcContainer}>
        <Text style={styles.title}>Калькулятор</Text>
        <Text style={styles.expresion}>22+33=</Text>
        <Text style={styles.result}>55</Text>

        <View style={styles.calcFirstRow}>
        <CalcButton title="MC" action={onButtonPress}/>
        <CalcButton title="MR" action={onButtonPress}/>
        <CalcButton title="M+" action={onButtonPress}/>
        <CalcButton title="M-" action={onButtonPress}/>
        <CalcButton title="MS" action={onButtonPress}/>
        <CalcButton title="Mv" action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title="%" action={onButtonPress}/>
          <CalcButton title="CE" action={onButtonPress}/>
          <CalcButton title="C" action={onButtonPress}/>
          <CalcButton title={"\u232B"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title={"\u00B9/x"} action={onButtonPress}/>
          <CalcButton title={"x\u00B2"} action={onButtonPress}/>
          <CalcButton title={"\u00B2\u221Ax"} action={onButtonPress}/>
          <CalcButton title={"\u00F7"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title={"\u0037"} action={onButtonPress}/>
          <CalcButton title={"\u0038"} action={onButtonPress}/>
          <CalcButton title={"\u0039"} action={onButtonPress}/>
          <CalcButton title={"\u00D7"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title={"\u0034"} action={onButtonPress}/>
          <CalcButton title={"\u0035"} action={onButtonPress}/>
          <CalcButton title={"\u0036"} action={onButtonPress}/>
          <CalcButton title={"\u2212"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title={"\u0031"} action={onButtonPress}/>
          <CalcButton title={"\u0032"} action={onButtonPress}/>
          <CalcButton title={"\u0033"} action={onButtonPress}/>
          <CalcButton title={"\u002B"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title={"\u00B1"} action={onButtonPress}/>
          <CalcButton title={"\u0030"} action={onButtonPress}/>
          <CalcButton title={"\u002C"} action={onButtonPress}/>
          <CalcButton title={"\u003D"} action={onButtonPress}/>
        </View>

        
    </View>
}

type CalcButtonData = {
  title : string,
  type?: string,
  action:(title:string, type?:string) => any
}

function CalcButton({title, type, action}:CalcButtonData){
  return <TouchableOpacity onPress={()=>action(title,type)} style={styles.calcButton}>
      <Text style={styles.calcButtonText}>{title}</Text>
  </TouchableOpacity>
}


const styles = StyleSheet.create({
  calcButton:{
    backgroundColor: "#323232",
    borderRadius: 5,
    flex: 1,
    margin: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  calcButtonText:{
    color: "#ffffff",
    fontSize: 20,

  },

  calcFirstRow: {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  flexWrap: "nowrap",
  flex: 1,
  paddingHorizontal: 4
  },

  calcContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "stretch",
    width: "100%",
    backgroundColor: "#202020",
    color: "#ffffff",
    

  },
  expresion:{
    textAlign: "right",
    color:"#ffffff",
    margin: 10 
  },

  title:{
    color:"#ffffff",
    margin: 10 
  },
  result:{
    color:"#ffffff",
    fontSize: 30,
    margin: 10,
    fontWeight: 700,
    textAlign: "right"
  },
  calcButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 4
  }
});
