import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import RNFS from 'react-native-fs';
import FirmButton from "../../features/buttons/ui/FirmButton";
import { ButtonTypes } from "../../features/buttons/model/ButtonTypes";
import base64 from 'react-native-base64';
import { AppContext } from "../../shared/context/appContext";

export default function Auth() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { request, user, setUser, showModal } = useContext(AppContext);
  const [userName, setUserName] = useState<string | null>(null);

  const tokenPath = RNFS.DocumentDirectoryPath + '/token.txt';

  useEffect(() => {
    RNFS.readFile(tokenPath, 'utf8')
      .then(content => {
        if (content) {
          setUser(content);
        }
      })
      .catch(err => {
        console.log("Token not found:", err.message);
      });
  }, []);

  useEffect(() => {
    if (user != null) {
      try {
        const payload = base64.decode(user.split(".")[1]);
        const data = JSON.parse(payload);
        setUserName(data.nam);
        console.log("Decoded user:", data.nam);
      } catch (err) {
        console.error("Token decode error", err);
      }
    }
  }, [user]);

  const onEnterPress = () => {
    console.log(login, password);
    if(login.length == 0){
      showModal({title: "Avtorization", message: "Enter Login"})
      return;
    }
    if(password.length == 0){
      showModal({title: "Avtorization", message: "Enter Password"})
      return;
    }
    request("/Cosmos/SignIn/", {
      headers: {
        'Authorization': 'Basic ' + base64.encode(`${login}:${password}`)
      }
    }).then(user => {
      setUser(user);
      if (remember) {
        RNFS.writeFile(tokenPath, user, 'utf8')
          .then(() => console.log("Token saved"))
          .catch(err => console.error("Token save failed", err));
      }
    });
  };

  const onExitPress = () => {
    setUser(null);
    RNFS.unlink(tokenPath)
      .then(() => console.log("Token deleted"))
      .catch(err => console.log("No token to delete", err.message));
  };

  const onRequestPress = () => {
    request("/Cosmos/SignIn");
  };

  const isFormValid = () => login.length > 1 && password.length > 2;

  const anonView = () => (
    <View>
      <Text style={{ textAlign: "center" }}>AUTH</Text>

      <View style={styles.textInputContainer}>
        <Text style={styles.textInputTitle}>Login:</Text>
        <TextInput
          style={styles.textInput}
          value={login}
          onChangeText={setLogin}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.textInputTitle}>Password:</Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox value={remember} onValueChange={setRemember} />
        <Text style={styles.checkboxLabel}>Запам’ятати мене</Text>
      </View>

      <FirmButton
        type={isFormValid() ? ButtonTypes.primary : ButtonTypes.secondary}
        // action={isFormValid() ? onEnterPress : () => {}}
        action={onEnterPress}
        title={"Enter"}
      />
    </View>
  );

  const userView = () => (
    <View>
      <Text style={{ textAlign: "center" }}>USER : {userName}</Text>
      <FirmButton
        type={ButtonTypes.primary}
        action={onRequestPress}
        title={"Request"}
      />
      <FirmButton
        type={ButtonTypes.primary}
        action={onExitPress}
        title={"Exit"}
      />
    </View>
  );

  return user == null ? anonView() : userView();
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
  textInputTitle: {
    color: "#eee",
    marginLeft: 10,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10
  },
  checkboxLabel: {
    color: "#eee",
    marginLeft: 8
  }
});
