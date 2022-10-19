
import React from "react";
import Moment from "moment";
import "./App.css";

import Card from "./Card"
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      favEventIds: [],
      cityList: [],
      monthList: [1,2,3,4,5,6,7,8,9,10,11,12], // jan - dec available
      selectedCity: "", // string
      selectedMonth: "", // int - denotes month or string - denotes 'none' ~
    };

    this.handleFilterCity = this.handleFilterCity.bind(this);
    this.handleFilterMonth = this.handleFilterMonth.bind(this);
  }

  async componentDidMount() {
    let currentDate = Moment().format("MM");
    const data = await fetch("https://raw.githubusercontent.com/xsolla/test-task-frontend/master/events.json")
      .then((response) => response.json())

    const cities = {}
    for (let i = 0; i < data.length; i++) {
      cities[data[i].city] = null
    }

    // Define local storage
    let storageS = localStorage.getItem("settings")
    let storageO = {
      favEvent: {
      }
    }

    if (!storageS) { // init
      localStorage.setItem("settings", JSON.stringify(storageO))
    }

    // Set data
    this.setState({data: data});
    this.setState({filteredData: data});
    this.setState({selectedMonth: currentDate})
    this.setState({selectedCity: data[0].city})
    this.setState({cityList: Object.keys(cities)})
  }

  handleFilterCity(event) {
    this.setState({selectedCity: event.target.value})
  }

  handleFilterMonth(event) {
    this.setState({selectedMonth: event.target.value})
  }

  handleFavouriteEvent = (event) => {
    let storageS = localStorage.getItem("settings")
    let storageO = JSON.parse(storageS)

    storageO.favEvent[event.id] = event.v
    localStorage.setItem("settings", JSON.stringify(storageO))
  }

  render() {
    let storageS = localStorage.getItem("settings")
    let {favEvent} = JSON.parse(storageS)

    // filter -
    var filteredData = this.state.data.filter((data) => {
      let currentMonth = Moment(data.date, 'DD-MM-YYYY').month()
      if (
        this.state.selectedMonth !== "none" &&
        this.state.selectedMonth &&
        parseInt(this.state.selectedMonth) !== parseInt(currentMonth)
      ) {
        return false
      }

      if (
        this.state.selectedCity !== "none" &&
        this.state.selectedCity &&
        this.state.selectedCity !== data.city
      ) {
        return false
      }

      return data
    });

    // sort -
    filteredData.sort((a, b) => {
      let momentA = Moment(a.date, 'DD-MM-YYYY')
      let momentB = Moment(b.date, 'DD-MM-YYYY')
      return (momentA.isSameOrAfter(momentB)) ? 1 : -1
    })

    // build -
    const CardLoop = filteredData.map((data, index) =>{
      if (favEvent[data.id]) {
        data.bookmarked = favEvent[data.id]
      } else {
        data.bookmarked = false
      }

      // console.log("Lopp: ", favEvent)
      return <Card onFavouriteEvent={this.handleFavouriteEvent} key={data.id} data={data}/>;
    })

    const SelectLoop = this.state.cityList.map((data, index) =>{
      return <MenuItem key={index} value={data}>{data}</MenuItem>
    })

    let PlaceHolder = ""
    if (filteredData.length <= 0) {
      PlaceHolder = <div className="card no-event-placeholder">
        <h2>No events on this month</h2>
      </div>
    }

    return (
      <div className="App">
        <div className="container">
          <h1>Event Listing</h1>

          <div className="search-navigations">
            <div className="control-nav">
              <div className="control-nav-title">City:</div>
              <div className="dropdownbox">
                <Select
                    value={this.state.selectedCity}
                    onChange={this.handleFilterCity}
                    autoWidth
                  >
                  <MenuItem value={"none"}>None</MenuItem>
                  {SelectLoop}
                </Select>
              </div>
            </div>
            <div className="control-nav">
              <div className="control-nav-title">Month: </div>
              <div className="dropdownbox">
                <Select
                  value={this.state.selectedMonth}
                  onChange={this.handleFilterMonth}
                  autoWidth
                >
                  <MenuItem value={"none"}>None</MenuItem>
                  <MenuItem value={1}>January</MenuItem>
                  <MenuItem value={2}>Febuary</MenuItem>
                  <MenuItem value={3}>March</MenuItem>
                  <MenuItem value={4}>April</MenuItem>
                  <MenuItem value={5}>May</MenuItem>
                  <MenuItem value={6}>June</MenuItem>
                  <MenuItem value={7}>July</MenuItem>
                  <MenuItem value={8}>August</MenuItem>
                  <MenuItem value={9}>September</MenuItem>
                  <MenuItem value={10}>October</MenuItem>
                  <MenuItem value={11}>November</MenuItem>
                  <MenuItem value={12}>December</MenuItem>
                </Select>
              </div>
            </div>
          </div>

          <div className="search-event-list">
            {PlaceHolder}
            {CardLoop}
          </div>
        </div>
      </div>
    );
  }
}

export default App;