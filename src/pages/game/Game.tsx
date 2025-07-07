import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { AppContext } from "../../shared/context/appContext";

//swipes - жесты проведения с ограничением минимальных дистаний и скоростей

type eventData = {
    x:number,
    y:number,
    t:number
};
const distanceThreshold = 50; // минимальная длинна свайпа
const timeThreshold = 500; // максимальный время свайпа

export default function Game(){

    const {navigate} = useContext(AppContext)
    const [text, setText] = useState("Game");


    var startData: eventData | null = null;
    const detectSwipe = (finishData:eventData)=>{
        if(startData == null) return;
        const dx = finishData.x-startData!.x;
        const dy = finishData.y-startData!.y;
        const dt = finishData.t-startData!.t;
        // console.log(dx,dy,dt);
        if(dt<timeThreshold){
            if(Math.abs(dx)>Math.abs(dy)){
                if(Math.abs(dx)>distanceThreshold){
                    if(dx>0){
                        setText("Right")
                    }
                    else{
                        setText("Left")
                    }
                }
            }
            else{
                if(Math.abs(dy)>distanceThreshold){
                    if(dy>0){
                        setText("Down")
                    }
                    else{
                        setText("Up")
                    }
                }
            }
        }
    }
    
    return <TouchableWithoutFeedback
        onPressIn={e => {startData= {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
            t: e.nativeEvent.timestamp,
        }}}

        onPressOut={e=>detectSwipe({
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
            t: e.nativeEvent.timestamp,
        })}>

        <View style={styles.container}>
            <Pressable onPress={()=>navigate('calc')}>
                <Text style={{fontSize:50}}>{text}</Text>
            </Pressable>
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#123321"
  },
});