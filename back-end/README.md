# Backend of the evcharge platform

The backend contains the server and handles the requests coming from the clients

The server is built with NodeJs and Express and a variety of npm modules while for a database we use MongoDB

## Usage
First of all you need to install NodeJs with npm and the MongoDb community client
After that you run the command
```
npm install
```
to install all the necessary packages and then fill out your config files, config/dev.json and config/test.json

Finally using mkcert you have to create the key.pem and cert.pem files in order to use https (the files are stored in the back-end/.cert folder)

You are ready to start the server! Just type in terminal
```
npm start
```
And if you want to test the code just type:
```
npm test
```

## Project structure
The server.js file initiates the server and starts listening to the requests.
After that in the api/routes folder there are many routers that redirect the message to the correct endpoint and call the right function. In the api/models folder we keep the models of our entities in the database while the api/services and api/utils folders contain code necessary to handle the requests and send back the appropriate response.
Finally the test folder contains files that test all the enpoints to check if they return the right properties.

## Creators
The backend side of the project was created by:
* Giortzis Ioannis
* Kazelidis Ioannis Michail
* Kerasiotis Marios
* Rizavas Konstantinos
