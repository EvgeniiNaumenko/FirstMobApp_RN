import { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native"
import FirmButton from "../../features/buttons/ui/FirmButton";
import { ButtonTypes } from "../../features/buttons/model/ButtonTypes";
// import { Base64 } from "../../shared/services/base_64";
import base64 from 'react-native-base64'; // подключили типы и кодировку // npm i react-native-base64  // npm i @types/react-native-base64
import { AppContext } from "../../shared/context/appContext";


export default function Auth(){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const {request, user, setUser} = useContext(AppContext);
    const [userName, setUserName] =useState (null as string|null);

    useEffect(() => {
      if(user != null){
        console.log(base64.decode(user.split(".")[1]))
        const payload = base64.decode(user.split(".")[1]);
        const data = JSON.parse(payload);
        console.log(data.nam);
      }
        // setUserName(user == null? null 
        //   : JSON.parse(base64.decode(user.split(".")[1])).nam);
    }, [user]);

    const onRequestPress = () => {
      request("/Cosmos/SignIn");
    };

    const onExitPress = () => {
      setUser(null);
    };

    const onEnterPress =() =>{
        console.log(login, password);
        request("/Cosmos/SignIn/",{
          headers: {
            'Authorization': 'Basic ' + base64.encode(`${login}:${password}`)
            }
        }).then(setUser);

        // fetch("https://pv311num6-b9hbdbfsc3gdbfer.canadacentral-01.azurewebsites.net/Cosmos/SignIn/",{
        //   headers: {
        //     'Authorization': 'Basic ' + base64.encode(`${login}:${password}`)
        //     }
        // }).then(r=> r.json())
        // .then(console.log);
    };

    const isFormValid =() => login.length>1 && password.length > 2
    
    const anonView = () =><View>

        <Text style={{textAlign: "center"}}>AUTH</Text>

        <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Login:</Text>
            <TextInput style={styles.textInput}
                value={login}
                onChangeText={setLogin}
            />
        </View>

        <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Password:</Text>
            <TextInput style={styles.textInput}
                secureTextEntry ={true}
                value={password}
                onChangeText={setPassword}
            />
        </View>
        <FirmButton type={isFormValid()? ButtonTypes.primary: ButtonTypes.secondary} 
                action={isFormValid()? onEnterPress : ()=>{}}
                title={"Enter"} 
        />
    </View>;

    const userView = () => <View>
      <Text style={{textAlign: "center"}}>USER : {userName}</Text>
      <FirmButton type={ButtonTypes.primary} 
                action={onRequestPress}
                title={"Request"} 
        />
            <FirmButton type={ButtonTypes.primary} 
                action={onExitPress}
                title={"Exit"} 
        />
    </View>;

    return user == null? anonView() :userView();
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 8,
    margin: 10,
    backgroundColor: "#fff"
  },
  textInputContainer: {
    borderColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 8,
    margin: 10,
    backgroundColor: "#807b7bff",
  },
  textInputTitle:{
    color: "#eee",
    marginLeft:10,
    marginTop: 10,
  },
});