import React, { Component } from 'react'

export default class App extends Component {
  state = {
    trumpURL: 'https://api.whatdoestrumpthink.com/api/v1/quotes/random',
    kanyeURL: 'https://api.kanye.rest/',
    tweet: '',
  }

  handleClick = () => {
    let randomiser = () => {
      return Math.floor(Math.random() * Math.floor(2))
    }

    console.log(randomiser());
    
    if (randomiser() === 0) {
      fetch(this.state.kanyeURL).then(res =>  {
        console.log(res);
        return res.json();
      }).then(data => {
        console.log(data);
        this.setState({
          tweet: data,
        });
      }).catch(err => {
        console.log('error:', err);
      })
    } else {
      fetch(this.state.trumpURL).then(res =>  {
        console.log(res);
        return res.json();
      }).then(data => {
        console.log(data);
        this.setState({
          tweet: data,
        });
      }).catch(err => {
        console.log('error:', err);
      })
    }

  }

  componentDidMount() {
    this.handleClick();
  }

  render() {
    return (
      <div>
        <h1>Trump vs. Kanye: Who Done It?</h1>
        {
          this.state.tweet
          ? <div>{ this.state.tweet.quote }</div>
          : ''
        }
        <button onClick={ () => this.handleClick() }>Kanye</button>
        <button>Trump</button>
      </div>
    )
  }
}
