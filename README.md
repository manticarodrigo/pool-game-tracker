## Pool Gamer Tracker

Packages & Frameworks: `React.js, Node.js, Apollo, Prisma`

This app allows you to create games and keep the scores. Create a game, publish it, and begin submitting scores. You can see the score history in the game detail page (click on a game in the games page).

Installation steps:
  1. Enter repo directory: `cd pool-game-tracker`
  2. Install dependencies: `npm install`
  3. Change to server directory: `cd server`
  4. Deploy prisma to docker: `prisma deploy`

Deployment steps:
  1. Start local server: `npm start` (you can now open a Playground at http://localhost:4000)
  2. Change to root directory `cd ..`
  3. Start React app: `npm start`
  4. Open browser: http://localhost:3000
