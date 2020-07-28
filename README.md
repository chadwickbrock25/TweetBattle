https://tweetbattle-sei.herokuapp.com/

## Collaborators
* Chad
* Lenny
* Sasi

# Description
This is a full-CRUD app built using React & Express. Kanye West & Donald Trump quotes are randomly generated and the user has to decide who said it (very difficult we know). Users can also create accounts to save their favourite quotes. When a user guesses who said it a GIF is generated in response to their answer.

#Technologies Used
This has been built using React, Express, Node, Bootstrap, Mongo as well as pulling data from the Kanye West, Donald Trump & Giphy APIs

#Using the App
In order to use the app, download the full folder for the site to work. You will need a baseline understanding of Express, MongoDB/Mongoose, & React to understand how it is put together and what changes can be made.

#Still Unsolved
1. Upon signup, the user is asked to login. Ideally the signup should automatically log them in to reduce friction. This can easily be achieved by running the login script at the same time as the signup script.

2. Implementing a sharing feature for favourited quotes.

3. Sometimes the Giphy api does not find a matching Giph. This seems to be an issue with dotenv encrypting the API key and not serving it quickly enough.

4. Heroku Deployment Steps - https://github.com/Sasi-Koramutla/mernstackdeploy

## Built With
- [Node](https://nodejs.org) - JavaScript Runtime Environment
- [Npm](https://www.npmjs.com) - Package Manager
- [Express](https://expressjs.com/en/starter/installing.html) - Web Framework
- [React](https://reactjs.org/) - Frontend Framework
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Authorization Package
- [MongoDB](https://www.mongodb.com) - Database
- [Mongoose](http://mongoosejs.com) - Database ORM
- [Bootstrap](https://getbootstrap.com/) - Fron End Toolkit
- [VS Code](https://code.visualstudio.com) - Code Editor
