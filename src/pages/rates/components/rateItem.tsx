import { StyleSheet, Text, View } from "react-native";
import NbuRate from "../types/NbuRate";


export default function rateItem({item, index}:{item:NbuRate, index:number}){
    return <View style={[styles.rateItem,(index%2 ==0? styles.bgEven:styles.bgOdd) ]}>
        <Text style={styles.rateCc}>{item.cc}</Text>
        <Text style={styles.rateTxt}>{item.txt}</Text>
        <Text style={styles.rateRate}>{item.rate}</Text>
    </View>;
} 

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    bgEven:{
        backgroundColor: '#969494ff',
    },
    bgOdd:{
        backgroundColor: '#aaa7a7ff',
    },
  rateItem:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  rateCc:{
    color: "#FCF7F0",
    flex: 1,
  },
  rateTxt:{
    color: "#000000ff",
    flex: 3,
  },
  rateRate:{
    color: "#FCF7F0",
    flex: 2,
  },
  
});