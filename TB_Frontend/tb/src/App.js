import React, { Component} from 'react';

export default class App extends Component {
  state = {
    trumpURL: 'https://api.whatdoestrumpthink.com/api/v1/quotes/random',
    kanyeURL: 'https://api.kanye.rest/',
    gif: '',
    tweet: '',
    //if 0 then Kanye if 1 then Trump
    kanyeOrTrump: 0,
    score: 0,
    //Sasi - added the below variables
    signUp:false,
    login:false,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    loginUsername: "",
    loginPassword: "",
    token:"",
    userid:"",
    baseURL: 'http://localhost:3003',
  }

  handleChange = (event) => {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value})
  }

      handleClick = () => {
        console.log(this.refs)
        if(this.state.login) {
          this.refs.chad.removeAttribute("disabled");
        }
        this.refs.kanye.removeAttribute("disabled");
        this.refs.trump.removeAttribute("disabled");
        
        let randomiser = () => {
          return Math.floor(Math.random() * Math.floor(2))
        }

        if (randomiser() === 0) {
          fetch(this.state.kanyeURL).then(res =>  {
            return res.json();
          }).then(data => {
            this.setState({
              tweet: data,
              kanyeOrTrump: 0,
            });
          }).catch(err => {
            console.log('error:', err);
          })
        } else {
          fetch(this.state.trumpURL).then(res =>  {
            return res.json();
          }).then(data => {
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

          fetch('https://api.giphy.com/v1/gifs/random?' + process.env.SECRET + '=kanye-west&rating=g').then(res =>  {
            return res.json();
          }).then(data => {
            console.log(data);
            this.setState({
              score: newScore,
              gif: data,
              kanyeOrTrump: 1,
            });
          })
          }
          this.refs.trump.setAttribute("disabled", "disabled");
          this.refs.kanye.setAttribute("disabled", "disabled");
        }

      checkScoreTrump = () => {
        if (this.state.kanyeOrTrump === 1) {
          let newScore = this.state.score + 1;
          
          this.setState({
            score: newScore,
        })
        }
        this.refs.trump.setAttribute("disabled", "disabled");
        this.refs.kanye.setAttribute("disabled", "disabled");
      }

      saveTweet = (tweet) => {
        console.log('frontend-tweet', tweet);
        console.log('this is the id: ', this.state.userid);
            fetch(this.state.baseURL + '/tweetbattle/' + this.state.userid, {
                method: 'PUT',
                body: JSON.stringify({ 
                    savedTweet: tweet,
                    id: this.state.userid,
                }),
                headers:  {
                    'Content-Type': 'application/json'
                }
            }).then(res =>  {
                return res.json()
            }).then(data =>  {
                this.setState({
                    savedTweets: data,
                })
            }).catch(error =>  console.log({'Error': error}))
            if(this.state.login) {
              this.refs.chad.setAttribute("disabled", "disabled");
            }
            
        }
      

  //Sasi - added signup function
  signUp = (event) => {
    event.preventDefault();
    this.setState({signUp: true, login:false});
  }

 //Sasi - added login function
 login = (event) => {
    event.preventDefault();
    fetch(this.state.baseURL + '/tweetbattle/login', {
      method: 'POST',
      body: JSON.stringify({username: this.state.loginUsername, 
                            password: this.state.loginPassword}
                            ),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then (res => res.json())
      .then (resJson => {console.log(resJson);
        this.setState({
          login:true,
          loginUsername: resJson.username,
          loginPassword: "",
          token:resJson.token,
          userid:resJson.id
        })
        localStorage.setItem("loginInfo",JSON.stringify({id:resJson.id, loginUsername:resJson.username, token:resJson.token}));
    }).catch (error => console.error({'Error': error}))
    
  }

  //Sasi - create route function
  createUser = (event) => {
    event.preventDefault();

    fetch(this.state.baseURL + '/tweetbattle', {
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

  //Sasi - added logout function
  logout = (event) => {
    event.preventDefault();
    this.setState({login: false, token:""});
  }

  componentDidMount() {
    this.handleClick();
    //Sasi = Storing token and userid
    let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    console.log(loginInfo);
    if(loginInfo && loginInfo.token)
    this.setState({token:loginInfo.token, userid:loginInfo.id, loginUsername:loginInfo.loginUsername, login:true});
  }
  

  render() {
    return (
      <div style={{margin:"50px"}}>


        {this.state.login? <div style={{color:"purple", fontSize:"20px"}}>User Name - {this.state.loginUsername} <button className="btn btn-dark" onClick={this.logout}>Logout</button></div>:""}
        {/* Sasi - START Toggle for Signup */}
        {this.state.signUp? 
          <form className="form" style={{width:"50%"}} onSubmit={this.createUser}>
           <div className="form-group">
                <input className="form-control" type="text" onChange={this.handleChange} value={this.state.firstName} placeholder="First name" id="firstName" name="firstName"/>
            </div>
            <div className="form-group">
                <input className="form-control" type="text"  onChange={this.handleChange} value={this.state.lastName} placeholder="Last name" id="lastName" name="lastName"/>
            </div>
            <div className="form-group">
                <input className="form-control" type="text" onChange={this.handleChange} value={this.state.username} id="username" name="username" placeholder="email (Username)"/>
            </div>
            <div className="form-group"> 
                <input  className="form-control" type="password" onChange={this.handleChange} value={this.state.password} id="password" name="password" placeholder="Password"/>
            </div>
            <div className="form-group">
                <input className="btn btn-primary form-control" type="submit" value="Sign up"/>
            </div>  
          </form>
          :    
          <>
            {this.state.login? "":
                  <ul className="nav">
                  <li className="nav-item">
                    <input className="form-control" type="text" onChange={this.handleChange} value={this.state.loginUsername} id="loginUsername" name="loginUsername" placeholder="email (Username)"/>
                  </li>
                  <li className="nav-item">
                      <input  className="form-control" type="password" onChange={this.handleChange} value={this.state.loginPassword} id="loginPassword" name="loginPassword" placeholder="Password"/>
                  </li>
                  <li className="nav-item">    
                   <button className="btn btn-primary form-control" style={{marginLeft:"6px"}}onClick={this.login}>Login</button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-primary form-control" style={{marginLeft:"12px"}} onClick={this.signUp}>Signup</button>
                  </li>
                </ul>
            }          
            <h1>Trump vs. Kanye: Who Done It?</h1>
            <h2> <div>Score: { this.state.score }</div> </h2>
            <h3 style={{color:"red"}}>
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
            </h3><br/>
            <button ref="kanye" className="btn btn-primary" style={{marginLeft:"6px"}} onClick={ () => this.checkScoreKanye() }>Kanye</button>
            <button ref="trump" className="btn btn-primary" style={{marginLeft:"6px"}} onClick={ () => this.checkScoreTrump() }>Trump</button>
            <button className="btn btn-primary" style={{marginLeft:"6px"}} onClick={ () => this.handleClick() }>New Quote</button>
            
            { 
            ( this.state.login && this.state.tweet.quote )
            ? 
            <button ref="chad" className="btn btn-success" style={{marginLeft:"6px"}} onClick={ () => this.saveTweet(this.state.tweet.quote) }>Save Tweet</button>
            :
            ( this.state.login && this.state.tweet.message )
            ?
            <button ref="chad" className="btn btn-success" style={{marginLeft:"6px"}} onClick={ () => this.saveTweet(this.state.tweet.message) }>Save Tweet</button>
            : ""
            }

            <div className="row justify-content-center allSavedTweets">
            {
              this.state.savedTweets
              ?
              this.state.savedTweets.map(tweet => {
                return (
                <div className="w-25 p-3 savedTweet">{ tweet }</div>
                )
              })
              
              : ''
            }
            </div>

          </>
        
        }
        {/* Sasi - END Toggle for Signup */}
      </div>
    )
  }
}
