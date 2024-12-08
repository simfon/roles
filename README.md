## Dev Start
`npm install`  
`npm run server`  
(new terminal)  
`npm run client`  
test
## Linting
(Aribnb, destructuring-assignment and prop-types silenced. Silence locally other stuff, as no-underscore-dangle for MongoDB _id fields)  
`npm run lint-client`  
`npm run lint-server`  

## Heroku stuff
Simulate a deployment with  
`npm run localstart`  
Never remove "heroku-postbuild" from package.json  

# Changes
## 0.1.4
    Socket-io is now refractored in a more readable api
    Changes to User and Story models
    Privay Policy, Cookie Policy and management in index.html
    Google Analytics IP anonymized
    Changes to pc-creator, cliché names support templating
    Changes to Combat, clichés play a rock-paper-scissor like game for bonuses
    Experimenting with dicebear/avatars to auto-generate PC avatars
    
## 0.1.2
    Added web-push management, User model changed to host the subscription endpoints;
    Session Cookie: username removed;
    Stories: added a 20 players test story;
    Socket.io: fixed the Connect / leave behaviour;