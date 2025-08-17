import { View , StyleSheet, Text, TouchableOpacity, useWindowDimensions, Button} from "react-native";
import CalcButton from "./components/CalcButton";
import { useEffect, useState } from "react";
import CalcModel from "./models/CalcModel.ts";
const maxResultDigits = 5;

export default function Calc() {
  const {width, height}=useWindowDimensions();
  const model = CalcModel.instance;

  const [result, setResult] = useState(CalcModel.instance.result);
  const [memory, setMemory] = useState(CalcModel.instance.memory);
  const [history, setHistory] = useState(CalcModel.instance.history);
  const [calculation, setCalculation] =useState(CalcModel.instance.calculation);

  const [showMemoryView, setShowMemoryView] = useState(false);

  useEffect(() => {
    syncFromModel();
  }, []);

  const syncFromModel = () => {
    setResult(model.result);
    setMemory(model.memory)
    setCalculation(model.calculation);
    setHistory(model.history);
  };
  
  useEffect(() => {
  model.result = result;
  model.calculation = calculation;
  model.history = history;
  model.memory = memory;
  }, [result, calculation, history, memory]);

  
  const onMemoryOperationPress = (title:string, data?:string)=>{
    switch(title){
      case "MC" :
        setMemory("0")
        break;
      case "MR" :
        setResult(memory);
        break;
      case "M+" :
        setMemory((Number(memory)+Number(result == "0" ? calculation : result)).toString());
        break;
      case "M-" :
        setMemory((Number(memory)-Number(result == "0" ? calculation : result)).toString());
        break;
      case "MS" :
        setMemory(result == "0" ? calculation : result);
        break;
      case "Mv" :
        if(!showMemoryView)
          setShowMemoryView(true);
        else
          setShowMemoryView(false);
        break;
    }
  };
 
  const onOperationPress = (title: string, data?: string) => {
  switch (data) {
    case "clear":{
      setResult("0");
      setHistory("");
      setCalculation("");
      break;
    }
    case "clearResult":{
      setResult("");
      break;
    }
    case "backspace":{
      if (result.length > 1) {
        setResult(result.substring(0, result.length - 1));
      } else {
        setResult("0");
      }
      break;
    }
    case "inverse":{

      if(result=="0" && calculation!=""){
        setHistory("1/(" + Number(calculation).toString() + ")=");
        var inverse = (1 / Number(calculation)).toString();
        setCalculation(inverse);
        setResult("0");
        break;
      }

      if(result =="0") {
        setCalculation("ZeroDiv");
         break;
      }

      setHistory("1/(" + Number(result).toString() + ")=");
      var inverse = (1 / Number(result)).toString();
      setResult("0");
      setCalculation(inverse);
      break;
    }

    case "add":{
      if(history.slice(-1)!="+" && history !="" && history!.includes("+") && history.slice(-1)!="\u003D"){
        setHistory(history.substring(0, history.length - 1)+"+");
        break;
      }

      if(calculation !="" && result =="0"){
        setHistory(calculation + "+" );
        break;
      }

      if(calculation != "" && result != "0"){
        let res = (Number(calculation)+Number(result)).toString()
        setCalculation(res);
        setHistory(res + "+");
        setResult("0");
        break;
      }
      setHistory(result + "+");
      setCalculation(result);
      setResult("0");
      break;
    }

    case "sub":{
      if(history.slice(-1)!="-" && history !="" && history!.includes("-") && history.slice(-1)!="\u003D"){
        setHistory(history.substring(0, history.length - 1)+"-");
        break;
      }

      if(calculation !="" && result =="0"){
        setHistory(calculation + "-" );
        break;
      }

      if(calculation != "" ){
        let res = (Number(calculation)-Number(result)).toString()
        setCalculation(res);
        setHistory(res + "-");
        setResult("0");
        break;
      }

      setHistory(result + "-");
      setCalculation(result);
      setResult("0");
      break;
    }
    
    case "mul":{
      if(history.slice(-1)!="\u00D7" && history !="" && history!.includes("\u00D7") && history.slice(-1)!="\u003D"){
        setHistory(history.substring(0, history.length - 1)+"\u00D7");
        break;
      }

      if(calculation !="" && result =="0"){
        setHistory(calculation + "\u00D7" );
        break;
      }

      if(calculation != "" ){
        let res = (Number(calculation)*Number(result)).toString()
        setCalculation(res);
        setHistory(res + "\u00D7");
        setResult("0");
        break;
      }

      setHistory(result + "\u00D7");
      setCalculation(result);
      setResult("0");
      break;
     }

    case "div":{

      if(history.slice(-1)!="\u00F7" && history !="" && history!.includes("+") && history.slice(-1)!="\u003D"){
        setHistory(history.substring(0, history.length - 1)+"\u00F7");
        break;
      }

      if(calculation !="" && result =="0"){
        setHistory(calculation + "\u00F7" );
        break;
      }

      if(calculation != "" ){
        let res = (Number(calculation)/Number(result)).toString()
        setCalculation(res);
        setHistory(res + "\u00F7");
        setResult("0");
        break;
      }

      setHistory(result + "\u00F7");
      setCalculation(result);
      setResult("0");
      break; 
    } 
    case "square":{

      if(result=="0" && calculation!=""){
        let res = (Math.pow(Number(calculation),2)).toString();
        setCalculation(res);
        setHistory(calculation+"\u00B2")
        setResult("0");
        break;
      }

      let res = (Math.pow(Number(result),2)).toString();
      setCalculation(res);
      setHistory(result+"\u00B2")
      setResult("0");
      break;

    }

    case "sqrt":{

      if(Number(result)<0) break;

      if(result=="0" && calculation!=""){
        let res =Math.sqrt(Number(calculation)).toString();
        setCalculation(res);
        setHistory("\u00B2\u221A"+calculation)
        setResult("0");
      break; 

      }
      let res =Math.sqrt(Number(result)).toString();
      setCalculation(res);
      setHistory("\u00B2\u221A"+result)
      setResult("0");
      break; 
    }

    case "percent":{
      if(!history || !calculation) break;
      let operator = history.slice(-1);
      let left = Number(calculation);
      let right = Number(result);
      let res = "0";

      switch (operator) {
        case "+":
          res = (left + ((left*right)/100)).toString();
          break;
        case "-":
          res = (left - ((left*right)/100)).toString();
          break;
        case "\u00D7":
          res = (left * ((right)/100)).toString();
          break;
        case "\u00F7":
          res = right !== 0 ? (left / ((right)/100)).toString() : "Error";
          break;
        default:
          res = result;
      }
      setHistory(history + result + "%"+ "\u003D");
      setResult("0");
      setCalculation(res);
      break; 
    }
    case "equal":{
      
      if (!calculation || !history || history.includes("\u003D")) return;

      let operator = history.slice(-1);
      let left = Number(calculation);
      let right = Number(result);
      let res = "0";

      switch (operator) {
        case "+":
          res = (left + right).toString();
          break;
        case "-":
          res = (left - right).toString();
          break;
        case "\u00D7":
          res = (left * right).toString();
          break;
        case "\u00F7":
          res = right !== 0 ? (left / right).toString() : "Error";
          break;
        default:
          res = result;
      }

      setHistory(history + result + "\u003D");
      setCalculation(res);
      setResult("0");
      break;
    }
    default:
      break;
  }
};

  const onDigitPress = (title:string)=>{
    let extraChars = 0;
    if (result.includes('.')) extraChars++;
    if (result.includes('-')) extraChars++;

    if (history.includes("\u003D")){  
      setCalculation("");
      setHistory("");
    };

    if (result.length < maxResultDigits + extraChars){
      if(result[0]=="0" && result[1] !="." ){
        setResult(title)
      }
      else{
        setResult(result+title)
      }
    }
  }
  const onDotPress = (title:string)=>{
    if(!result.includes(".")){
      setResult(result+'.') 
    }
  }
  const onPmPress = (title:string)=>{
    result.includes("-") ? setResult(result.substring(1)) : setResult("-"+result);
  }

  const portraitView = () =>{
    return <View style={styles.calcContainer}>
      <Text style={styles.title}>Калькулятор</Text>
      <Text style={styles.expression}>{history}</Text>
      <Text style={[styles.result, {
        fontSize : result.length < 20 ? styles.result.fontSize 
        : styles.result.fontSize * 19 / result.length}]}>
        {result == "0" ? calculation : result}
        </Text>
      
      <View style={styles.calcFirstRow}>
        <CalcButton title="MC" action={onMemoryOperationPress}/>
        <CalcButton title="MR" action={onMemoryOperationPress}/>
        <CalcButton title="M+" action={onMemoryOperationPress}/>
        <CalcButton title="M-" action={onMemoryOperationPress}/>
        <CalcButton title="MS" action={onMemoryOperationPress}/>
        <CalcButton title="Mv" action={onMemoryOperationPress}/>
      </View>

      {showMemoryView && (
        <View style={styles.memoryOverlay}>
          <Text style={styles.memoryText}>{memory}</Text>

          <View style={styles.memoryFirstRow}>
            {['MC', 'M+', 'M-'].map(label => (
              <TouchableOpacity
                key={label}
                style={styles.memoryButton}
                onPress={() => onMemoryOperationPress(label)}
              >
                <Text style={styles.memoryButtonText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ alignSelf: 'flex-end', marginTop: 'auto' }}>
            <Button title="Закрыть" onPress={() => setShowMemoryView(false)} color="#696969ff" />
          </View>
        </View>
      )}

      <View style={styles.calcButtonRow}>
        <CalcButton title="%"         action={onOperationPress} data="percent"/>
        <CalcButton title="CE"        action={onOperationPress} data="clearResult"/>
        <CalcButton title="C"         action={onOperationPress} data="clear"/>
        <CalcButton title={"\u232B"}  action={onOperationPress} data="backspace"/>
      </View>


      <View style={styles.calcButtonRow}>
        <CalcButton title={'\u00B9/\u{1D465}'}      action={onOperationPress} data="inverse" />
        <CalcButton title={'\u{1D465}\u00B2'}       action={onOperationPress} data="square"/>
        <CalcButton title={'\u221A\u{1D465}\u0305'} action={onOperationPress} data="sqrt" />
        <CalcButton title={'\u00F7'}                action={onOperationPress} data="div"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"7"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"8"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"9"} type ="digit" action={onDigitPress}/>
        <CalcButton title={'\u00D7'}          action={onOperationPress} data="mul"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"4"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"5"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"6"} type ="digit" action={onDigitPress}/>
        <CalcButton title={'\uFF0D'}          action={onOperationPress} data="sub"/>
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"1"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"2"} type ="digit" action={onDigitPress}/>
        <CalcButton title={"3"} type ="digit" action={onDigitPress}/>
        <CalcButton title={'\uFF0B'}          action={onOperationPress} data="add" />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"\u00B1"}  type ="digit" action={onPmPress}/>
        <CalcButton title={"0"}       type ="digit" action={onDigitPress}/>
        <CalcButton title={"."}       type ="digit" action={onDotPress}/>
        <CalcButton title={"\u003D"}  type ="equal" action={onOperationPress} data="equal"/>
      </View>
    </View>
  };
  
  const landscapeView = () => {
    return <View style={styles.calcContainer}>

      <View style={{display: "flex", flexDirection: "row"}}> 
        <View style={{flex:2, display: "flex", flexDirection: "column"}}>
          <Text style={[styles.title, {margin:0}]}>Калькулятор</Text>
          <Text style={styles.expression}>{history}</Text>
        </View>
          <Text style={[styles.result,{flex:3}]}>{result == "0" ? calculation : result}</Text>
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
        <CalcButton title="1" type="digit"    action={onDigitPress}/>
        <CalcButton title="2" type="digit"    action={onDigitPress}/> 
        <CalcButton title="3" type="digit"     action={onDigitPress}/> 
        <CalcButton title={'\uFF0D'}          action={onOperationPress} data="sub"/>
        <CalcButton title="CE"                action={onOperationPress} data="clearEntry"/> 
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={'\u221A\u{1D465}\u0305'}               action={onOperationPress} data="sqrt" />
        <CalcButton title={'\u00B1'}  type="digit"                action={onPmPress}/>
        <CalcButton title="0"         type="digit"                action={onDigitPress}/> 
        <CalcButton title=","         type="digit"                action={onDotPress}/> 
        <CalcButton title={'\uFF0B'}  action={onOperationPress}   data="add" />
        <CalcButton title={'\uFF1D'}  type="equal"                action={onOperationPress}/>
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
  memoryOverlay: {
  position: 'absolute',
  top: 208, 
  left: 5,
  right: 5,
  bottom: 2,
  backgroundColor: "#202020",
  zIndex: 10,
  padding: 20,
  justifyContent: 'center',
  alignItems: "flex-end",
  borderRadius: 5,
  },

  memoryFirstRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8, 
    marginBottom: 20,
  },

  memoryText: {
    color: '#fff',
    textAlign: "left",
    fontSize: 20,
    marginBottom: 20,
  },

  memoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#696969ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  memoryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
