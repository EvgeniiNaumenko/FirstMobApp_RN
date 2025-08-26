import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Alert, BackHandler, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import { AppContext } from '../shared/context/appContext';
import Auth from '../pages/auth/Auth';
import Rates from '../pages/rates/Rates';
import Chat from '../pages/chat/Chat';
import ModelData from '../shared/types/ModalData';
import ModalView from './ui/ModalView';
import User from '../shared/types/User';

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
  const [user, setUser] = useState(null as User|null);
  const [history, setHistory] = useState([] as Array<string>);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modelData, setModalData] = useState({message:""} as ModelData);

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
        // ini.headers['Authorization'] = "Bearer " +   Buffer.from(`${login}:${password}`, 'base64').toString('utf8');
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
    if(href == "-1"){
      popRoute();
      return;
    }
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
  //modal window
  const showModal = (data: ModelData) =>{
    setModalData(data);
    setModalVisible(true);
  }

  return (
    <SafeAreaProvider>
      {/* передаем через контекст на все дочерние єлементы */}
      <AppContext.Provider value={{navigate, user, setUser, request, showModal}}>
        <SafeAreaView style={styles.container}>

          <ModalView
            isModalVisible = {isModalVisible}
            setModalVisible={setModalVisible}
            modalData={modelData}
            />


          {/* Модальное окно
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!isModalVisible);
              }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{modelData.title}</Text>
                <Text style={styles.modalText}>{modelData.message}</Text>
                {!!modelData.positiveButtonText && <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!isModalVisible)}>
                  <Text style={styles.textStyle}>{modelData.positiveButtonText}</Text>
                </Pressable>}
                {!!modelData.negativeButtonText && <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!isModalVisible)}>
                  <Text style={styles.textStyle}>{modelData.negativeButtonText}</Text>
                </Pressable>}
              </View>
            </View>
          </Modal> */}

          <View style={styles.content}>
            {  page =="calc"?  <Calc   /> 
             : page =="auth"?  <Auth   />
             : page =="rates"? <Rates  />
             : page =="chat"?  <Chat   />
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

            <Pressable onPress={() => navigate("rates")} style={styles.bottomNavItem}>
              <Image source={require("../shared/assets/images/coin25.png")} style={[styles.bottomNavImages, {width: 34}]} />
              {/* <Text style={{color: "#ffffff"}}>Game</Text> */}
            </Pressable>

            <Pressable onPress={() => navigate("chat")} style={styles.bottomNavItem}>
              <Image source={require("../shared/assets/images/chat.png")} style={[styles.bottomNavImages, {width: 34}]} />
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
   // modal window 
   centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
