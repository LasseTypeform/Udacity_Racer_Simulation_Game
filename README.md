## Student Introduction

This project emphasizes the use of async code and handling the errors around it, by building a race.

I've chosen to write my code to handle promises by using async/await functions containing try/catch for response and error handling.

I've was supplied with the following code:

1. An API in the form of a binary held in the bin folder, so I could not make any changes to it. My work has be 100% in the front end.

2. HTML Views. The focus of this course is not UI development or styling practice, so I've already been provided pieces of UI, all I had to do was write the apropiate functions/API calls to make the race functional.


## Game Functionalities 

The game mechanics are this: you select a player and track, the game begins and you accelerate your racer by clicking an acceleration button. As you accelerate so do the other players and the leaderboard live-updates as players change position on the track. The final view is a results page displaying all players' rankings.

The game has three main views:

1. The form to create a race
2. The race progress view (this includes the live-updating leaderboard and acceleration button)
3. The race results view


## Getting Started
To test this project start by using git clone https://github.com/LasseTypeform/Udacity_Racer_Simulation_Game.git then follow the steps below. 

In order to start the game, you will needed to run two things: the game engine API and the front end.

### Start the Server

To run the server, locate your operating system and run the associated command in your terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

### Start the Frontend

First, run your preference of `npm start` or `yarn start` at the root of this project. Then you should be able to access the race on http://localhost:3000.

