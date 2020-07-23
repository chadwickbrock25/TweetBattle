import React, { Component } from 'react'

let baseURL = 'http://localhost:3003';

console.log('current base URL:', baseURL);


export default class App extends Component {
  state = {
    trumpURL: 'https://api.whatdoestrumpthink.com/api/v1/quotes/random',
    kanyeURL: 'https://api.kanye.rest/',
    tweet: '',
    //if 0 then Kanye if 1 then Trump
    kanyeOrTrump: 0,
    score: 0,
    signUp:false,
    login:false,
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value})
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

  componentDidMount() {
    this.handleClick();
  }
  
  //Sasi - added signup function
  signUp = (event) => {
    event.preventDefault();
    this.setState({signUp: true});
  }

  //Sasi - added home function
    home = (event) => {
      event.preventDefault();
      this.setState({signUp: false});
    }

  //Sasi - create route function
  createUser = (event) => {
    event.preventDefault();

    fetch(baseURL + '/tweetbattle', {
      method: 'POST',
      body: JSON.stringify({firstName: this.state.firstName, 
                            lastName: this.state.lastName, 
                            username: this.state.username, 
                            password: this.state.password}
                            ),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then (res => res.json())
      .then (resJson => {
        this.setState({
          signUp:false,
          firstName: "",
          lastName: "",
          username: "",
          password: ""
        })
    }).catch (error => console.error({'Error': error}))

  }

  render() {
    return (
      <div>
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link"><button onClick={this.home}>Home</button></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" ><button>Login</button></a>
          </li>
          <li class="nav-item">
            <a class="nav-link"><button onClick={this.signUp}>Signup</button></a>
          </li>
        </ul>
        {/* Sasi - START Toggle for Signup */}
        {this.state.signUp? 
          <form className="form" style={{width:"50%"}} onSubmit={this.createUser}>
            <div className="form-group">
                <input className="form-control" type="text" onChange={this.handleChange} value={this.state.name} placeholder="First name" id="firstName" name="firstName"/>
            </div>
            <div className="form-group">
                <input className="form-control" type="text"  onChange={this.handleChange} value={this.state.name} placeholder="Last name" id="lastName" name="lastName"/>
            </div>
            <div className="form-group">
                <input className="form-control" type="text" onChange={this.handleChange} value={this.state.name} id="username" name="username" placeholder="email (Username)"/>
            </div>
            <div className="form-group"> 
                <input  className="form-control" type="password" onChange={this.handleChange} value={this.state.name} id="password" name="password" placeholder="Password"/>
            </div>
            <div className="form-group">
                <input className="btn btn-primary form-control" type="submit" value="Sign up"/>
            </div>  
          </form>
          :    
          <>
            <h1>Trump vs. Kanye: Who Done It?</h1>
            <div>Score: { this.state.score }</div>
            {
              this.state.tweet.quote
              ? <div>{ this.state.tweet.quote }</div>
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
          </>
        
        }
        {/* Sasi - END Toggle for Signup */}
      </div>
    )
  }
}
