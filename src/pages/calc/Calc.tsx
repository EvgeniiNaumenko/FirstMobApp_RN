import { View , StyleSheet, Text, TouchableOpacity, useWindowDimensions} from "react-native";
import CalcButton from "./components/CalcButton";
import { useState } from "react";

const maxResultDigits = 5;

export default function Calc() {
  const[result, setResult] = useState("0");
  const{width, height}=useWindowDimensions();

  const onOperationPress = (title:string, data?:string)=>{
    switch(data){
      case "clear" : setResult("0"); break;
      case "backspace" :
        if(result.length>1)
        {
          setResult(result.substring(0, result.length-1));
        }
        else
        {
          setResult("0");
        }
       break;
       case "inverse" : setResult((1/Number(result)).toString());
       break;
      }
    };

  const onDigitPress = (title:string)=>{
    if(result.length< (result.includes('.') ? maxResultDigits+1: maxResultDigits)){
      if(result[0]=="0" && result[1] !="." ){
        setResult(title)
      }
      else{
        setResult(result+title)
      }
      console.log(title);
    }
  }
  const onDotPress = (title:string)=>{
    if(!result.includes(".")){
      setResult(result+'.') 
    }
  }
  const onPmPress = (title:string)=>{
    console.log(title);
  }
  const portraitView = () =>{
    return <View style={styles.calcContainer}>
      <Text style={styles.title}>Калькулятор</Text>
      <Text style={styles.expression}>22+33=</Text>
      <Text style={[styles.result, {fontSize : result.length < 20 ? styles.result.fontSize : styles.result.fontSize * 19 / result.length}]}>{result}</Text>
      <View style={styles.calcFirstRow}>
      <CalcButton title="MC" action={onOperationPress}/>
      <CalcButton title="MR" action={onOperationPress}/>
      <CalcButton title="M+" action={onOperationPress}/>
      <CalcButton title="M-" action={onOperationPress}/>
      <CalcButton title="MS" action={onOperationPress}/>
      <CalcButton title="Mv" action={onOperationPress}/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title="%"         action={onOperationPress}/>
        <CalcButton title="CE"        action={onOperationPress}/>
        <CalcButton title="C"         action={onOperationPress} data="clear"/>
        <CalcButton title={"\u232B"}  action={onOperationPress} data="backspace"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={'\u00B9/\u{1D465}'} action={onOperationPress} data="inverse" />
        <CalcButton title={'\u{1D465}\u00B2'} action={onOperationPress} data="square"/>
        <CalcButton title={'\u221A\u{1D465}\u0305'}action={onOperationPress} data="sqrt" />
        <CalcButton title={'\u00F7'}  action={onOperationPress} data="div"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"7"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"8"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"9"} type ="digit" action={onDigitPress}/>
        <CalcButton title={'\u00D7'} action={onOperationPress} data="mul"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"4"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"5"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"6"} type ="digit" action={onDigitPress}/>
        <CalcButton title={'\uFF0D'} action={onOperationPress} data="sub"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"1"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"2"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"3"} type ="digit" action={onDigitPress}/>
        <CalcButton title={'\uFF0B'} action={onOperationPress} data="add" />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"\u00B1"} type ="digit" action={onPmPress}/>
        <CalcButton title={"0"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"."} type ="digit" action={onDotPress}/>
        <CalcButton title={"\u003D"} type ="equal" action={onOperationPress}/>
      </View>
    </View>
  };
  
  const landscapeView = () => {
    return <View style={styles.calcContainer}>

      <View style={{display: "flex", flexDirection: "row"}}> 
        <View style={{flex:2, display: "flex", flexDirection: "column"}}>
          <Text style={[styles.title, {margin:0}]}>Калькулятор</Text>
          <Text style={styles.expression}>22 + 33 =</Text>
        </View>
          <Text style={[styles.result,{flex:3}]}>{result}</Text>
      </View> 

      <View style={styles.calcFirstRow}>
      <CalcButton title="MC" action={onOperationPress}/>
      <CalcButton title="MR" action={onOperationPress}/>
      <CalcButton title="M+" action={onOperationPress}/>
      <CalcButton title="M-" action={onOperationPress}/>
      <CalcButton title="MS" action={onOperationPress}/>
      <CalcButton title="Mv" action={onOperationPress}/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title="%"        action={onOperationPress}/>
        <CalcButton title="7" type="digit" action={onDigitPress}/>
        <CalcButton title="8" type="digit" action={onDigitPress}/> 
        <CalcButton title="9" type="digit" action={onDigitPress}/> 
        <CalcButton title={'\u00F7'}  action={onOperationPress} data="div"/>
        <CalcButton title={"\u232B"} action={onOperationPress} data="backspace"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={'\u00B9/\u{1D465}'} action={onOperationPress} data="inverse" />
        <CalcButton title="4" type="digit"  action={onDigitPress}/>
        <CalcButton title="5" type="digit"  action={onDigitPress}/> 
        <CalcButton title="6" type="digit"  action={onDigitPress}/> 
        <CalcButton title={'\u00D7'} action={onOperationPress} data="mul"/>
        <CalcButton title="C"        action={onOperationPress} data="clear"/> 
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={'\u{1D465}\u00B2'} action={onOperationPress} data="square"/>
        <CalcButton title="1" type="digit"  action={onDigitPress}/>
        <CalcButton title="2" type="digit"  action={onDigitPress}/> 
        <CalcButton title="3" type="digit"  action={onDigitPress}/> 
        <CalcButton title={'\uFF0D'} action={onOperationPress} data="sub"/>
        <CalcButton title="CE"       action={onOperationPress} data="clearEntry"/> 
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={'\u221A\u{1D465}\u0305'}action={onOperationPress} data="sqrt" />
        <CalcButton title={'\u00B1'} type="digit" action={onPmPress}/>
        <CalcButton title="0" type="digit"        action={onDigitPress}/> 
        <CalcButton title="," type="digit"        action={onDotPress}/> 
        <CalcButton title={'\uFF0B'} action={onOperationPress} data="add" />
        <CalcButton title={'\uFF1D'} type="equal" action={onOperationPress}/>
      </View>
    </View>;
  };
  
  return width<height ? portraitView() : landscapeView();
}

const styles = StyleSheet.create({

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
  expression:{
    textAlign: "right",
    color:"#ffffff",
    margin: 10 
  },

  title:{
    color:"#ffffff",
    margin: 16 
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
  },
});
