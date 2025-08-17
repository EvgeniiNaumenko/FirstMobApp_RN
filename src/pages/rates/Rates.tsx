import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import rateItem from "./components/rateItem";
import RatesModel from "./models/RatesModel";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
 
 

export default function Rates(){
    // const [rates, setRates] = useState([] as Array<NbuRate>);
    // const [shownRates, setShownRates] = useState([] as Array<NbuRate>);
    // const [searchText, setSearchText] = useState("");
    const [rates, setRates] = useState(RatesModel.instance.rates);
    const [shownRates, setShownRates] = useState(RatesModel.instance.shownRates);
    const [searchText, setSearchText] = useState(RatesModel.instance.searchText);
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const defaultStyles = useDefaultStyles();
    const [selected, setSelected] = useState<DateType>();


    useEffect(()=>{
        
         if(RatesModel.instance.rates.length == 0){
            console.log("Loading Data")
            fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
            .then(r => r.json())
            .then(j => {
                console.log("Loaded Data")
                RatesModel.instance.rates = j;
                setRates(j);
            });
        }
        else{
            console.log("used cache Data")
            // setRates(RatesModel.instance.rates);
            // setShownRates(RatesModel.instance.shownRates);
            // setSearchText(RatesModel.instance.searchText);
        }
    },[]);

    useEffect(()=>{
        if(searchText.length>0){
            setShownRates(rates.filter(rate => 
                rate.cc.includes(searchText.toUpperCase()) ||
                rate.txt.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
            ));
        }
        else{
            setShownRates(rates);
        }
        RatesModel.instance.searchText = searchText;
    },[searchText, rates]);

    // useEffect(()=>{
    // });
    const changeDate = () =>{
        setCalendarVisible(true);
    };

    return <View style= {styles.container}>
        <View style={styles.searchBar}>
            <TouchableOpacity style={styles.searchButton}>
                <Image source={require("../../shared/assets/images/Search_Icon.png")} style={styles.searchButtonImg}/>
            </TouchableOpacity>
            <TextInput
                style={styles.searchInput}
                onChangeText={setSearchText}
                value={searchText}
            />
            <TouchableOpacity style={styles.searchButton}  onPress={() => setSearchText("")}>
                <Image source={require("../../shared/assets/images/close.png")} style={styles.searchButtonImg}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={changeDate}>
                <Text>{selected?.toString()?? "13.08.2025"}</Text>
            </TouchableOpacity>
        </View>
        <View style={{display:isCalendarVisible? "contents":"none"}}>
            <DateTimePicker
                mode="single"
                date={selected}
                onChange={({ date }) =>  {
                    setSelected(date);
                    setCalendarVisible(false);
                }}
                styles={defaultStyles}
                />
        </View>
       <FlatList 
            // data={searchText.length!=0? shownRates : rates}
            data={shownRates}
            renderItem={rateItem}
            keyExtractor={rate => rate.cc}
            style={styles.ratesList}
        />
    </View>;
}



const styles = StyleSheet.create({
    container:{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%"
    },
    searchBar:{
        width: "100%",
        height: 60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
    },
    searchInput:{
        flex: 1,
        backgroundColor: '#727070ff',
        borderRadius: 10,
        marginLeft: 5,
        borderColor: "#ffffff",
        borderWidth: 2,
        color: '#ffffffff',
        fontSize: 16
    },
    searchButton:{
        width: 50,
        height: 50,
        marginHorizontal: 5,
        backgroundColor: '#727070ff',
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    searchButtonImg:{
        width: 45,
        height: 45,
        tintColor: '#ffffffff',
    },
    ratesList:{
        flex: 1
    },
});