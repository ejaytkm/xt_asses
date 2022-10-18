
import React from "react";
import Moment from "moment";
import "./App.css";

import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false,
      id: "",
      city: "",
      date: "",
      genre: "",
      image: "https://via.placeholder.com/600x400/182c34",
      name: "",
      ...props
    };

    // console.log(this.state.data)

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState((prevState) => ({ bookmarked: !prevState.bookmarked }))
  }

  handleClick() {
    this.setState(prevState => ({
      bookmarked: !prevState.bookmarked
    }));
    this.props.onFavouriteEvent(this.state.data.id)
  }

  render() {
    let convertDate = this.state.data.date;
    if (convertDate) {
      convertDate = Moment(this.state.data.date, 'DD-MM-YYYY').format('DD')
    }

    let boomarkIcon
    if (this.state.bookmarked) {
      boomarkIcon = <BookmarkBorderIcon style={{fontSize: "30px", fill: "white"}}/>
    } else {
      boomarkIcon = <BookmarkIcon style={{fontSize: "30px", fill: "white"}}/>
    }

    return (
      <div
        style={{ backgroundImage: `url(${this.state.data.image})`}}
        className="card"
      >
        <div className="card-event-date">
          <span>{convertDate}</span>
        </div>

        <div className="card-event-name">
          {this.state.data.name}
        </div>

        <div  className="action-bookmark">
          <span
            onClick={this.handleClick}
            className="action-bookmark-icon">
            {boomarkIcon}
          </span>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      favEventIds: [],
      cityList: [],
      monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
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
    console.log("Emitting favourite event", event)
    // this.setState({language: langValue});
  }

  render() {
    console.log(this.state.data)

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
        return false;
      }

      return data
    });

    const CardLoop = filteredData.map((data, index) =>{
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