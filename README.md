# spotify-matcher
Spring 2022 Dev Intern Project

## Prerequisites

Install [Node.js](https://nodejs.org/en/download/), [MongoDB](https://www.mongodb.com/docs/manual/installation/), [Git](https://git-scm.com/downloads), and an IDE of your choice for your platform. I prefer using [WebStorm](https://www.jetbrains.com/webstorm/) because it has built-in Node.js and React functionality, and the Ultimate version is free for students. [VS Code](https://code.visualstudio.com/) is also a good option, although you have to install plugins to support JavaScript, MongoDB, etc.

## Repository Setup

Clone the repository. Open a Git Bash shell in the directory in which you want to store the project (on Windows, this can be done by right clicking and clicking `Git Bash Here`). Run the command `git clone https://github.com/tomaskalj/spotify-matcher.git`. You have now cloned the repository onto your system. Then, run the following commands:
```
cd spotify-matcher
npm install express mongoose body-parser cors --save
mkdir data
cd data
mkdir db
cd ..
npm install react-crud axios
```

Drag and drop the `.env` file that I provided you with into the spotify-matcher directory.

## Startup

In the spotify-matcher directory:  
`mongod --dbpath data/db/`  
In the spotify-matcher directory in a second tab (open a new Git Bash shell without closing the other one):  
`node server.js`  
In the spotify-matcher directory in a third tab:  
`npm start`

The website will be accessible from:  
`http://localhost:3000/`