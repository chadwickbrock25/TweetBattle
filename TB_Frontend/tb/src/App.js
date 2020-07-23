    import React, { Component } from 'react'

    export default class App extends Component {
      state = {
        trumpURL: 'https://api.whatdoestrumpthink.com/api/v1/quotes/random',
        kanyeURL: 'https://api.kanye.rest/',
        tweet: '',
        //if 0 then Kanye if 1 then Trump
        kanyeOrTrump: 0,
        score: 0,
        baseURL: 'http://localhost:3003',
        savedTweets: [],
      }

      handleClick = () => {

        let randomiser = () => {
          return Math.floor(Math.random() * Math.floor(2))
        }

        if (randomiser() === 0) {
          fetch(this.state.kanyeURL).then(res =>  {
            console.log(res);
            return res.json();
          }).then(data => {
            console.log(data);
            this.setState({
              tweet: data,
              kanyeOrTrump: 0,
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
              kanyeOrTrump: 1,
            });
          }).catch(err => {
            console.log('error:', err);
          })
        }
      }

      //Need to figure out how to only allow one click ie for score to only be added once on click
      checkScoreKanye = () => {
        if (this.state.kanyeOrTrump === 0) {
          let newScore = this.state.score + 1;
          this.setState({
            score: newScore,
        })
        }
      }

      checkScoreTrump = () => {
        if (this.state.kanyeOrTrump === 1) {
          let newScore = this.state.score + 1;
          this.setState({
            score: newScore,
        })
        }
      }

      saveTweet = (event) => {
        const copySavedTweets = [ ...this.state.savedTweets ];
        copySavedTweets.push(event);
        console.log(copySavedTweets);
            fetch(this.state.baseURL + '/tweetbattle', {
                method: 'POST',
                body: JSON.stringify({ 
                    savedTweets: copySavedTweets,
                }),
                headers:  {
                    'Content-Type': 'application/json'
                }
            }).then(res =>  {
                return res.json()
            }).then(data =>  {
              console.log('this is the data:', data);
                this.setState({
                    savedTweets: copySavedTweets,
                })
            }).catch(error =>  console.log({'Error': error}))
        }
      

      componentDidMount() {
        this.handleClick();
      }

      render() {
        return (
          <div>
            <h1>Trump vs. Kanye: Who Done It?</h1>
            <div>Score: { this.state.score }</div>
            {
              this.state.tweet.quote
              ? <div>
                { this.state.tweet.quote }
                <button onClick={ () => this.saveTweet(this.state.tweet.quote) }>Save Tweet</button>
                </div>
              : ''
            }
            {
              this.state.tweet.message
              ? <div>{ this.state.tweet.message }</div>
              : ''
            }
            <button onClick={ () => this.checkScoreKanye() }>Kanye</button>
            <button onClick={ () => this.checkScoreTrump() }>Trump</button>
            <button onClick={ () => this.handleClick() }>New Quote</button>

            <div>Login</div>
          </div>
        )
      }
    }
