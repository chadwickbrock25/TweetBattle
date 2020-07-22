import React, { Component } from 'react'

export default class App extends Component {
  state = {
    trumpURL: '',
    kanyeURL: 'https://api.kanye.rest/',
    tweet: '',
  }

  handleClick = () => {
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
