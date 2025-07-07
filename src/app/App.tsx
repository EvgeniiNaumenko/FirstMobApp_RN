import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import { AppContext } from '../shared/context/appContext';

function App() {
  /*
  Навигация в мобильных приложениях
  Идея такая - вести свою историю переходов между страницами
  */
 
  // type PageInfo = {                 //  /calc/scientific/hyper?arg=1234&operation=exp
  //   slug:string,                    //  calc
  //   pathParams:Array<string>,       //  ["scientific", "hyper"]
  //   queryParams: object,            //  {arg:1234, operation "exp"}
  // }

  const [page, setPage] = useState("calc");
  const [history, setHistory] = useState([] as Array<string>);

  const navigate = (href:string) => { // добавление в историю и переход
    if(href == page){
      return;
    }
    history.push(page);
    // console.log(history)
    setHistory(history);
    setPage(href);
  };

  const popRoute = () => { // движение назад по истории 
    if(history.length>0){
      const page = history.pop() ?? "calc";
      // console.log(history)
      setHistory(history);
      setPage(page);
    }
    else{
      BackHandler.exitApp();
    }
  };
  
  useEffect(() => {
    // перехватываем обработку апаратной кнопки НАЗАД и terern True  говорит о том что обработка не нужна
    const listener = BackHandler.addEventListener('hardwareBackPress', ()=>{
        popRoute();
        return true;
      });
    return ()=>{  
      listener.remove();
    };
  }, []);


  return (
    <SafeAreaProvider>
      <AppContext.Provider value={{navigate}}>
        <SafeAreaView style={styles.container}>

          <View style={styles.content}>
            {page =="calc"? <Calc /> : <Game/>}
          </View>

          <View style={styles.bottomNav}>
            <Pressable onPress={() => navigate("calc")} style={styles.bottomNavItem}>
              <Text style={{color: "#ffffff"}}>Calc</Text>
            </Pressable>

            <Pressable onPress={() => navigate("game")} style={styles.bottomNavItem}>
              <Text style={{color: "#ffffff"}}>Game</Text>
            </Pressable>
          </View>

        </SafeAreaView>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#999999', 
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%"
  },
  content:{
    flex: 1,
    width: "100%"
  },
  bottomNav:{
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 50,
    width: "100%"
  },
  bottomNavItem:{
    borderWidth:1,
    borderColor: "grey",
    padding: 5,
    borderRadius: 7,
    backgroundColor: "#3B3B3B",
  }
});

export default App;
