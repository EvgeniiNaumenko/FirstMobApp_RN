import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import { AppContext } from '../shared/context/appContext';
import Auth from '../pages/auth/Auth';

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

  const [page, setPage] = useState("game");
  const [user, setUser] = useState(null as string|null);
  const [history, setHistory] = useState([] as Array<string>);

  const request = (url:string, ini?:any) => {
    if(url.startsWith('/')) {
      url = "https://pv311num6-b9hbdbfsc3gdbfer.canadacentral-01.azurewebsites.net" + url;
      // url = "https://localhost:7224" + url;
    }
    if(user != null) {
      if(typeof ini == 'undefined') {
        ini = {};
      }
      if(typeof ini.headers == 'undefined') {
        ini.headers = {};
      }
      if(typeof ini.headers['Authorization'] == 'undefined') {
        ini.headers['Authorization'] = "Bearer " + user; //.token;
      }
      ini.headers['Authentication-Control'] = "Mobile";
    }

    console.log("Request", url, ini);

    return new Promise((resolve, reject) => {
      fetch(url, ini).then(r => r.json()).then(j => {
        if (j.status.isOk) {
          resolve(j.data);
        }
        else {
          console.error(j);
          reject(j);
        }
      });
    })
  }

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
      {/* передаем через контекст на все дочерние єлементы */}
      <AppContext.Provider value={{navigate, user, setUser, request}}>
        <SafeAreaView style={styles.container}>

          <View style={styles.content}>
            {  page =="calc"? <Calc /> 
             : page =="auth"? <Auth />
             : <Game/>}
          </View>

          <View style={styles.bottomNav}>
            <Pressable onPress={() => navigate("calc")} style={styles.bottomNavItem}>
              <Image source={require("../shared/assets/images/calc.png")} style={[styles.bottomNavImages, {tintColor: "#fff"}]}/>
              {/* <Text style={{color: "#ffffff"}}>Calc</Text> */}
            </Pressable>

            <Pressable onPress={() => navigate("game")} style={styles.bottomNavItem}>
              <Image source={require("../shared/assets/images/game.jpg")} style={styles.bottomNavImages} />
              {/* <Text style={{color: "#ffffff"}}>Game</Text> */}
            </Pressable>

            <Pressable onPress={() => navigate("auth")} style={styles.bottomNavItem}>
              <Image source={require("../shared/assets/images/auth.png")} style={styles.bottomNavImages} />
              {/* <Text style={{color: "#ffffff"}}>Game</Text> */}
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
    // borderColor: "grey",
    padding: 5,
    borderRadius: 7,
    // backgroundColor: "#3B3B3B",
  },
   bottomNavImages:{
    height: 32,
    width: 32,
   },

});

export default App;
