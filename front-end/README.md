# Frontend of the evcharge platform

The frontend contains the web-based app. It is built with NodeJS and ReactJS and a variety of npm modules.

## Usage

First of all you need to install NodeJS with npm. Run the command

```
npm install
```
for the necessary packages to be installed. 

Then using mkcert you have to create the key.pem and cert.pem files in order to use https (the files are stored in the front-end/.cert folder)

The app is ready! Type

```
npm start
```

in the terminal and it will open up in your browser.

## Project Structure

When the app is launched, index.js (of folder /src) is first called. It in turn calls App.js with handles the navigation and loading of the various pages.

There are two other folders: /pages and /components. Inside the /pages folder there are the "home" pages that handle the navigation and loading of the different account type pages (user, parkingowner, energyemployee), as well as the 404 and admin page. Inside the /compomnents folder there are all the different components and pages that are used depending on the account type of the user that is logged in. Also, there is the /images folder that has all the images used on the website (except for the favicon.ico).

## Creators

* Mitropoulos Marios
* Panagiotidis Kyriakos
