  import React, { Component} from 'react';
  import Footer from './components/footer';

  export default class App extends Component {
    state = {
      trumpURL: 'https://api.whatdoestrumpthink.com/api/v1/quotes/random',
      kanyeURL: 'https://api.kanye.rest/',
      gif: '',
      tweet: '',
      //if 0 then Kanye if 1 then Trump
      kanyeOrTrump: 0,
      score: 0,
      answer: false,
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
      savedTweets:[]
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
                answer: false,
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
                answer: false,
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

            fetch('https://api.giphy.com/v1/gifs/random?api_key=' + process.env.REACT_APP_SECRET + '&tag=kanye-west&rating=r').then(res =>  {
              return res.json();
            }).then(data => {
              console.log(data);
              this.setState({
                score: newScore,
                gif: data.data.embed_url,
                kanyeOrTrump: 1,
                answer: false,
              });
            })
            } else {
              this.setState({
                gif: 'https://giphy.com/gifs/kanye-west-shrug-shrugging-UUvaW1L0SK9Mc',
                answer: !this.state.answer,
              })
            }
            this.refs.trump.setAttribute("disabled", "disabled");
            this.refs.kanye.setAttribute("disabled", "disabled");
          }

        checkScoreTrump = () => {
          if (this.state.kanyeOrTrump === 1) {
            let newScore = this.state.score + 1;
            
            fetch('https://api.giphy.com/v1/gifs/random?api_key=' + process.env.REACT_APP_SECRET + '&tag=donald-trump&rating=r').then(res =>  {
              return res.json();
            }).then(data => {
              console.log(data);
              this.setState({
                score: newScore,
                gif: data.data.embed_url,
                kanyeOrTrump: 1,
                answer: false,
              });
            })
          } else {
            fetch('https://api.giphy.com/v1/gifs/random?api_key=' + process.env.REACT_APP_SECRET + '&tag=incorrect&rating=r').then(res =>  {
              return res.json();
            }).then(data => {
              console.log(data);
              this.setState({
                gif: data.data.embed_url,
                answer: !this.state.answer,
              });
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
            
        delete = (index) => {
         //event.preventDefault();
          console.log('this is the id: ', this.state.userid);
          console.log('index: ', index);
          let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
              fetch(this.state.baseURL + '/tweetbattle/', {
                  method: 'DELETE',
                  body: JSON.stringify({ 
                      index: index,
                      id: this.state.userid,
                      password:loginInfo.loginPassword,
                      token:loginInfo.token
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
            userid:resJson.id,
            savedTweets:resJson.savedTweets
          })
          localStorage.setItem("loginInfo",JSON.stringify({id:resJson.id, loginPassword: resJson.password, loginUsername:resJson.username, token:resJson.token}));
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

    //Sasi - added cancel function
    cancel = (event) => {
      event.preventDefault();
      this.setState({signUp: false, login:false});
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
        <div className="main">

          <div className="loggedIn">
          {this.state.login? <button className="btn btn-dark float-right" onClick={this.logout}>Logout</button>:""}
          </div>
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
                  <input className="btn btn-primary form-control" style={{width:"70%"}} type="submit" value="Sign up"/>
                  <input className="btn btn-danger form-control" style={{width:"25%", marginLeft: "6px"}} onClick={this.cancel} value="Cancel"/>
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
              <p>It's a true battle of the intellect. Can you guess who said what?</p>
              <h2> <div className="score">Score: { this.state.score }</div> </h2>

              <iframe src={ this.state.gif } width="480" height="222" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

              <div className="container">
              {
                this.state.answer
                ? <div className="answer">Better luck next time! Don't worry you are still the greatest</div>
                : ''
              } 

              

              <h3 className="quote">
              {
                this.state.tweet.quote
                ? <div>"{ this.state.tweet.quote }"</div>
                : ''
              }
              {
                this.state.tweet.message
                ? <div>"{ this.state.tweet.message }"</div>
                : ''
              }
              </h3><br/>
              <button ref="kanye" className="btn btn-primary" style={{marginLeft:"6px"}} onClick={ () => this.checkScoreKanye() }>Kanye</button>
              <button ref="trump" className="btn btn-primary" style={{marginLeft:"6px"}} onClick={ () => this.checkScoreTrump() }>Trump</button>
              <button className="btn btn-primary" style={{marginLeft:"6px"}} onClick={ () => this.handleClick() }>New Quote</button>
              
              { 
              ( this.state.login && this.state.tweet.quote )
              ? 
              <button ref="chad" className="btn btn-success" style={{marginLeft:"6px"}} onClick={ () => this.saveTweet(this.state.tweet.quote) }>Save Quote</button>
              :
              ( this.state.login && this.state.tweet.message )
              ?
              <button ref="chad" className="btn btn-success" style={{marginLeft:"6px"}} onClick={ () => this.saveTweet(this.state.tweet.message) }>Save Quote</button>
              : ""
              }

            </div>

              <div className="row justify-content-center allSavedTweets">
              {
                (this.state.savedTweets && this.state.login)
                ?
                this.state.savedTweets.map((tweet,index) => {
                  return (
                  <div className="w-25 p-3 savedTweet">
                    <button style={{marginLeft:"80%", border:"none", backgroundColor:"white"}} onClick={e => this.delete(index)} key={index} value={index}>
                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                    <br/>
                    { tweet }
                    </div>
                  )
                })
                
                : ''
                
              }
              </div>

              

            </>
          }
        <Footer />

          {/* Sasi - END Toggle for Signup */}
        </div>
      )
    }
  }
