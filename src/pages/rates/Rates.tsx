import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import rateItem from "./components/rateItem";
import RatesModel from "./models/RatesModel";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import { Dayjs } from "dayjs"; 

export default function Rates() {
  const [rates, setRates] = useState(RatesModel.instance.rates);
  const [shownRates, setShownRates] = useState(RatesModel.instance.shownRates);
  const [searchText, setSearchText] = useState(RatesModel.instance.searchText);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const defaultStyles = useDefaultStyles();
  
  const today = new Date();
  const initialDate = RatesModel.instance.loadedDate 
    ? new Date(
        Number(RatesModel.instance.loadedDate.slice(0, 4)),
        Number(RatesModel.instance.loadedDate.slice(4, 6)) - 1,
        Number(RatesModel.instance.loadedDate.slice(6, 8))
        )
        : today;
  const [selected, setSelected] = useState<DateType>(initialDate);

  const dateObj: Date = selected instanceof Date ? selected
    : (selected && (selected as Dayjs).toDate ? (selected as Dayjs).toDate() : new Date(selected as any));

  const getRequestDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return { day, month, year };
  };

  const fetchRates = (d: Date) => {
    const { day, month, year } = getRequestDate(d);
    const requestDate = `${year}${month}${day}`;

    if (RatesModel.instance.loadedDate === requestDate) {
      console.log("used cache Data");
      setRates(RatesModel.instance.rates);
      setShownRates(RatesModel.instance.shownRates);
      setSearchText(RatesModel.instance.searchText);
      return;
    }

    console.log("Loading Data");
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${requestDate}&json`)
      .then(r => r.json())
      .then(j => {
        RatesModel.instance.rates = j;
        RatesModel.instance.loadedDate = requestDate;
        setRates(j);
      })
      .catch(err => console.log("Fetch error:", err));
  };

  useEffect(() => {
    fetchRates(dateObj);
  }, [selected]);

  useEffect(() => {
    if (searchText.length > 0) {
      setShownRates(rates.filter(rate =>
        rate.cc.includes(searchText.toUpperCase()) ||
        rate.txt.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      ));
    } else {
      setShownRates(rates);
    }
    RatesModel.instance.searchText = searchText;
  }, [searchText, rates]);

  const changeDate = () => setCalendarVisible(true);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.searchButton}>
          <Image source={require("../../shared/assets/images/Search_Icon.png")} style={styles.searchButtonImg} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          value={searchText}
        />

        <TouchableOpacity style={styles.searchButton} onPress={() => setSearchText("")}>
          <Image source={require("../../shared/assets/images/close.png")} style={styles.searchButtonImg} />
        </TouchableOpacity>

        <TouchableOpacity onPress={changeDate}>
          <View style={styles.dateCard}>
            <Text style={styles.dateNumber}>{String(dateObj.getDate()).padStart(2, "0")}</Text>
            <Text style={styles.dateNumber}>{String(dateObj.getMonth() + 1).padStart(2, "0")}</Text>
            <Text style={styles.dateNumber}>{dateObj.getFullYear()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {isCalendarVisible && (
        <View>
          <DateTimePicker
            mode="single"
            date={selected}
            maxDate={today}
            onChange={({ date }) => {
              if (date) setSelected(date);
              setCalendarVisible(false);
            }}
            styles={defaultStyles}
          />
        </View>
      )}

      <FlatList
        data={shownRates}
        renderItem={rateItem}
        keyExtractor={rate => rate.cc}
        style={styles.ratesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#727070ff',
    borderRadius: 10,
    marginHorizontal: 5,
    borderColor: "#ffffff",
    borderWidth: 2,
    color: '#ffffffff',
    fontSize: 16
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#727070ff',
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonImg: {
    width: 45,
    height: 45,
    tintColor: '#ffffffff',
  },
  ratesList: {
    flex: 1
  },
  dateCard: {
    backgroundColor: "#757373ff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  dateNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f5ededff",
    lineHeight: 14,
  },
});
