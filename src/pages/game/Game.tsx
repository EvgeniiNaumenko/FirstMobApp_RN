import { useContext, useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { AppContext } from "../../shared/context/appContext";


//swipes - жесты проведения с ограничением минимальных дистаний и скоростей

type eventData = {
    x:number,
    y:number,
    t:number
};
const distanceThreshold = 50; // минимальная длинна свайпа
const timeThreshold = 500; // максимальный время свайпа
let animaValue = new Animated.Value(1);
const opacityValues = Array.from({length: 16}, () => new Animated.Value(1));
const scaleValues = Array.from({length: 16}, () => new Animated.Value(1));
let scale = new Animated.Value(1);
let rotate = new Animated.Value(0);

 const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

function tileBackground(tileValue: number){
    return tileValue == 0?       "#BDAFA2"
    : tileValue == 2     ?       "#EEE3D8"
    : tileValue == 4     ?       "#EEE1D0"
    : tileValue == 8     ?       "#E8B486"
    : tileValue == 16    ?       "#E79B73"
    : tileValue == 32    ?       "#E4846E"
    : tileValue == 64    ?       "#E26A51"
    : tileValue == 128   ?       "#E2CA85"
    : tileValue == 256   ?       "#E2C87A"
    : tileValue == 512   ?       "#E2C46C"
    : tileValue == 1024  ?       "#E4C564"
    : tileValue == 2048  ?       "#E3C35A"
    : tileValue == 4096  ?       "#6A665D"
    : tileValue == 8192  ?       "#83BF3F"
    : tileValue == 16384 ?       "#7BBA34"
    : tileValue == 32768 ?       "#76AE37"
    : tileValue == 65536 ?       "#719941"
    :                            "#719941";
}


function tileForeground(tileValue: number){
    return tileValue == 0?       "#BDAFA2"
    : tileValue == 2     ?       "#746C63"
    : tileValue == 4     ?       "#766E66"
    : tileValue == 8     ?       "#FAF3EF"
    : tileValue == 16    ?       "#FBF5F2"
    : tileValue == 32    ?       "#FBF5F2"
    : tileValue == 64    ?       "#FBF5F2"
    : tileValue == 128   ?       "#F9F6F2"
    : tileValue == 256   ?       "#F9F6F2"
    :                            "#F9F6F2";

}

const animateScales = (indexes: number[], scaleValues: Animated.Value[]) => {
  if (indexes.length > 0) {
    Animated.parallel(
      indexes.map(index =>
        Animated.sequence([
          Animated.timing(scaleValues[index], {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValues[index], {
            toValue: 1.0,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }
};

export default function Game(){

    const [text, setText] = useState("Game");
    const [score, setScore] = useState(0);
    const {width, height}=useWindowDimensions();
    const [tiles, setTiles]= useState([
        0,      2,      4,      8,
        16,     32,     64,     128,
        256,    512,    1024,   2048,
        4096,   8192,   16384,  32768
    ])


    const tileFontSize = (tileValue: number) =>{
    return tileValue < 10     ?   width *0.1 
        : tileValue  < 100    ?   width *0.09
        : tileValue  < 1000   ?   width *0.08
        : tileValue  < 10000  ?   width *0.07
        :                         width *0.06
    }
    var startData: eventData | null = null;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scale, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(scale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
                }),
            ])
        ]).start();
    }, [text]);

    // START GAME
    const spawnTile = () =>{
        var freeTiles = [];
        for(let i=0; i < tiles.length; i +=1){
            if(tiles[i]==0){
                freeTiles.push(i)
            }
        }
        const randomIndex = freeTiles[Math.floor(Math.random()*freeTiles.length)];
        tiles[randomIndex] = Math.random()<0.9 ? 2 : 4;
        Animated.sequence([
            Animated.timing(opacityValues[randomIndex],{
                toValue:0,
                duration: 30,
                useNativeDriver:true,
            }),
             Animated.timing(opacityValues[randomIndex],{
                toValue:1,
                duration: 500,
                useNativeDriver:true,
            }),
        ]).start();
        setTiles(tiles);
    }

    const newGame = () => {
        for(let i=0; i < tiles.length; i +=1){
            tiles[i]=0
        }
        spawnTile();
        spawnTile();
        setTiles([...tiles]);
    }

    const moveRight=()=>{
        /*      логика
            [2000]->[0002]
            [2004]->[0024]
            [2002]->[0004]
            [2022]->[0024] приоритет по свайпу
            [2222]->[0044]

        */
       const N = 4;
       let res = false;

       var collapsedIndexes =[];

       for(let r = 0; r < N; r +=1){ //row index
            //1.Move Right
            for(let i=0 ;i< N; i+=1){// column index
                for(let c = 0; c < N-1; c +=1){
                    if( tiles[r*N+c] != 0 && tiles[r*N+c+1] ==0){
                        tiles[r*N+c+1] = tiles[r*N+c];
                        tiles[r*N+c] = 0;
                        res = true;
                    }
                }
            }
            //2.collapse: from right to left
            for(let c = N-1; c > 0; c -=1){
                if( tiles[r*N+c] != 0 && tiles[r*N+c-1] == tiles[r*N+c]){
                    tiles[r*N+c] *=2;
                    tiles[r*N+c-1]=0;
                    setScore(score+tiles[r*N+c]);
                    collapsedIndexes.push(r*N+c);
                    res = true;
                }
            }
            //3.Move Right after collapse
            for(let i=0 ;i< N; i+=1){
                for(let c = 0; c < N-1; c +=1){
                    if( tiles[r*N+c] != 0 && tiles[r*N+c+1] ==0){
                        let index = collapsedIndexes.indexOf(r*N+c);
                        tiles[r*N+c+1] = tiles[r*N+c];
                        tiles[r*N+c] = 0;
                        collapsedIndexes[index] = r*N+c+1;
                    }
                }
            }
       }
       animateScales(collapsedIndexes, scaleValues);
    //    if(collapsedIndexes.length >0){
    //     Animated.parallel(collapsedIndexes.map(index=>
    //          Animated.sequence([
    //             Animated.timing(scaleValues[index], {
    //                 toValue: 1.2,
    //                 duration: 150,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(scaleValues[index], {
    //                 toValue: 1.0,
    //                 duration: 150,
    //                 useNativeDriver: true,
    //              }),
    //             ])
    //         )).start();
    //    }

       return res;
    }

    const moveLeft=()=>{
       const N = 4;
       let res = false;
       var collapsedIndexes =[];
       for(let r = 0; r < N; r +=1){ 
            //1.Move Right
            for(let i=0 ;i< N; i+=1){
                for(let c = 0; c < N-1; c +=1){
                    if( tiles[r*N+c] == 0 && tiles[r*N+c+1] !=0){
                        tiles[r*N+c] = tiles[r*N+c+1];
                        tiles[r*N+c+1] = 0;
                        res = true;
                    }
                }
            }
            //2.collapse: from right to left
            for(let c = 0; c < N-1; c += 1){
                if( tiles[r*N+c] != 0 && tiles[r*N+c+1] == tiles[r*N+c]){
                    tiles[r*N+c] *= 2;
                    tiles[r*N+c+1] = 0;
                    setScore(score+tiles[r*N+c]);
                    collapsedIndexes.push(r*N+c);
                    res = true;
                }
            }
            //3.Move Right
            for(let i=0 ;i< N; i+=1){
                for(let c = 0; c < N-1; c +=1){
                   if( tiles[r*N+c] == 0 && tiles[r*N+c+1] !=0){
                        let index = collapsedIndexes.indexOf(r*N+c+1);
                        tiles[r*N+c] = tiles[r*N+c+1];
                        tiles[r*N+c+1] = 0;
                        collapsedIndexes[index] = r*N+c;
                    }
                }
            }
       }
       animateScales(collapsedIndexes, scaleValues);
    //    if(collapsedIndexes.length >0){
    //     Animated.parallel(collapsedIndexes.map(index=>
    //          Animated.sequence([
    //             Animated.timing(scaleValues[index], {
    //                 toValue: 1.2,
    //                 duration: 150,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(scaleValues[index], {
    //                 toValue: 1.0,
    //                 duration: 150,
    //                 useNativeDriver: true,
    //              }),
    //             ])
    //         )).start();
    //    }
       return res;
    }

    const moveTop=()=>{
       const N = 4;
       let res = false;
       var collapsedIndexes =[];
       for(let c = 0; c < N; c +=1){ 
            //1.Move top
            for(let i = 0 ; i < N; i += 1){
                for(let r = 0; r < N-1; r += 1){
                    if( tiles[r*N+c] == 0 && tiles[r*N+c+N] !=0){
                        tiles[r*N+c] = tiles[r*N+c+N];
                        tiles[r*N+c+N] = 0;
                        res = true;
                    }
                }
            }
            //2.collapse: 
            for(let r = 0; r < N-1; r += 1){
                if( tiles[r*N+c] != 0 && tiles[r*N+c] == tiles[r*N+c+N]){
                    tiles[r*N+c] *= 2;
                    tiles[r*N+c+N] = 0;
                    setScore(score+tiles[r*N+c]);
                    collapsedIndexes.push(r*N+c);
                    res = true;
                }
            }
            //3.Move Top
            for(let i=0 ;i< N; i+=1){
                for(let r = 0; r < N-1; r +=1){
                   if(tiles[r*N+c] == 0 && tiles[r*N+c+N] !=0){
                        let index = collapsedIndexes.indexOf(r*N+c+N);
                        tiles[r*N+c] = tiles[r*N+c+N];
                        tiles[r*N+c+N] = 0;
                        collapsedIndexes[index] = r*N+c;
                    }
                }
            }
       }
       if(collapsedIndexes.length >0){
        Animated.parallel(collapsedIndexes.map(index=>
             Animated.sequence([
                Animated.timing(scaleValues[index], {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValues[index], {
                    toValue: 1.0,
                    duration: 150,
                    useNativeDriver: true,
                 }),
                ])
            )).start();
       }
       return res;
    }

    const moveDown=()=>{
       const N = 4;
       let res = false;
       var collapsedIndexes =[];
       for(let c = 0; c < N; c +=1){ 
            //1.Move top
            for(let i = 0 ; i < N; i += 1){
                for(let r = N-1; r > 0; r -= 1){
                    if( tiles[r*N+c] == 0 && tiles[r*N+c-N] !=0){
                        tiles[r*N+c] = tiles[r*N+c-N];
                        tiles[r*N+c-N] = 0;
                        res = true;
                    }
                }
            }
            //2.collapse: 
            for(let r = N-1; r > 0; r -= 1){
                if( tiles[r*N+c] != 0 && tiles[r*N+c] == tiles[r*N+c-N]){
                    tiles[r*N+c] *= 2;
                    tiles[r*N+c-N] = 0;
                    setScore(score+tiles[r*N+c]);
                    collapsedIndexes.push(r*N+c);
                    res = true;
                }
            }
            //3.Move Top
            for(let i=0 ;i< N; i+=1){
                 for(let r = N-1; r > 0; r -= 1){
                    if( tiles[r*N+c] == 0 && tiles[r*N+c-N] !=0){
                        let index = collapsedIndexes.indexOf(r*N+c-N);
                        tiles[r*N+c] = tiles[r*N+c-N];
                        tiles[r*N+c-N] = 0;
                        collapsedIndexes[index] = r*N+c;
                    }
                }
            }
       }
       animateScales(collapsedIndexes, scaleValues);
    //    if(collapsedIndexes.length >0){
    //     Animated.parallel(collapsedIndexes.map(index=>
    //          Animated.sequence([
    //             Animated.timing(scaleValues[index], {
    //                 toValue: 1.2,
    //                 duration: 150,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(scaleValues[index], {
    //                 toValue: 1.0,
    //                 duration: 150,
    //                 useNativeDriver: true,
    //              }),
    //             ])
    //         )).start();
    //    }
       return res;
    }

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
                        if(moveRight()){
                            setText("Right - OK")
                            spawnTile();
                            setTiles([...tiles]);
                        }
                        else{
                            setText("Right - NO")
                        }
                    }
                    else{
                         if(moveLeft()){
                            setText("Left - OK")
                            spawnTile();
                            setTiles([...tiles]);
                        }
                        else{
                            setText("Left - NO")
                        }
                    }
                }
            }
            else{
                if(Math.abs(dy)>distanceThreshold){
                    if(dy>0){
                         if(moveDown()){
                            setText("Down - OK")
                            spawnTile();
                            setTiles([...tiles]);
                        }
                        else{
                            setText("Down - NO")
                        }
                        // Animated.sequence([
                        //     Animated.timing(animaValue, {
                        //         toValue: 0,
                        //         duration: 20,
                        //         useNativeDriver: true,
                        //     }),
                        //       Animated.timing(animaValue, {
                        //         toValue: 1,
                        //         duration: 500,
                        //         useNativeDriver: true,
                        //     })
                        // ]).start(); 
                    }
                    else{
                        if(moveTop()){
                            setText("Top - OK")
                            spawnTile();
                            setTiles([...tiles]);
                        }
                        else{
                            setText("Top - NO")
                        }
                    }
                }
            }
        }
    }
    
    

    return <View style={styles.container}>
        <View style={[styles.topBlock, {width: width*0.95}]}>
            <Text style={styles.topBlockText}>2048</Text>
            <View style={styles.topBlockSub}>
                <View style={styles.topBlockScores}>
                    <View style={styles.topBlockScore}>
                        <Text style={styles.topBlockScoreText}>SCORE</Text>
                        { <Animated.View style={{transform: [
                            { scale },
                            { rotate: rotateInterpolate }
                        ]}}>
                            <Text style={styles.topBlockScoreText}>{score}</Text>
                        </Animated.View> }
                    </View>
                    <View style={styles.topBlockScore}>
                        <Text style={styles.topBlockScoreText}>BEST</Text>
                        <Text style={styles.topBlockScoreText}>1005000</Text>
                    </View>
                </View>
                <View style={styles.topBlockButtons}>
                    <Pressable style={styles.topBlockButton} onPress={newGame}><Text style={styles.topBlockButtonText}>NEW</Text></Pressable>
                    <Pressable style={styles.topBlockButton}><Text style={styles.topBlockButtonText}>UNDO</Text></Pressable>
                </View>
            </View>
        </View>

        <Text>Набери 2048</Text>

        <TouchableWithoutFeedback
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

            <View style={[styles.field, {width: width*0.95, height:width*0.95}]}>
               {tiles.map((tile, index) => <Animated.View key ={index}
                style={{
                opacity: opacityValues[index],
                transform: [{scale: scaleValues[index]}],
                }}>
                <Text style={[styles.tile,{
                    backgroundColor: tileBackground(tile),
                    color: tileForeground(tile),
                    width: width*0.21,
                    height: width*0.21,
                    fontWeight: 900,
                    marginLeft: width*0.022,
                    marginTop: width*0.022,
                    fontSize: tileFontSize(tile),
                } ]}>{tile}</Text>
                </Animated.View>)}
            </View>
        </TouchableWithoutFeedback>

        <Animated.View style={{opacity:animaValue}}>
            <Text>{text}</Text>
        </Animated.View>
    </View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCF7F0",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%"
  },
  topBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockText: {
    backgroundColor: "gold",
    borderRadius: 7,
    color: "white",
    fontSize: 32,
    marginVertical: 5,
    paddingHorizontal: 10,
    verticalAlign: "middle",
    fontWeight: 900,
  },
  topBlockSub: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBlockScores: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockScore: {
    backgroundColor: "#3C3A34",
    borderRadius: 7,
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    padding: 5,
  },
  topBlockScoreText: {
    color: "white",
    textAlign: "center",
    fontWeight: 700,
    fontSize: 16
  },
  topBlockButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

  },
  topBlockButton: {
    backgroundColor: "#E06849",
    borderRadius: 7,
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    padding: 10,

  },
  topBlockButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: 700,
  },
  field: {
    borderRadius: 10,
    backgroundColor: "#A29383",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile:{
    borderRadius: 5,
    textAlign: "center",
    verticalAlign: "middle",

  },

});