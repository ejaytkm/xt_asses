
import React from "react";
import Moment from "moment";
import "./App.css";

import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

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
      ...props.data
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    await this.setState(prevState => ({
      bookmarked: !prevState.bookmarked
    }));

    this.props.onFavouriteEvent({
      id: this.state.id,
      v: this.state.bookmarked
    })
  }

  render() {
    let convertDate = this.state.date;
    if (convertDate) {
      convertDate = Moment(this.state.date, 'DD-MM-YYYY').format('DD')
    }

    let boomarkIcon
    if (this.state.bookmarked === true) {
      boomarkIcon = <BookmarkIcon style={{fontSize: "30px", fill: "white"}}/>
    } else {
      boomarkIcon = <BookmarkBorderIcon style={{fontSize: "30px", fill: "white"}}/>
    }

    return (
      <div
        style={{ backgroundImage: `url(${this.state.image})`}}
        className="card"
      >
        <div className="card-event-date">
          <span>{convertDate}</span>
        </div>

        <div className="card-event-name">
          {this.state.name}
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

export default Card
