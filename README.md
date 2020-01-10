
![alt text](https://catalyst-it.co.uk/wp-content/themes/catalyst/images/opt/logo.svg "Catalyst IT")  

### Mashup Portal

>  Creating a Qlik Sense mashup from nothing can be a painful process, the prefabrication is intended to remove the headache of most of the difficult tasks related to creating an initial Qlik mashup application.  
  This application is a prefabricated QAP portal that will allow the follow functionality:
  
- Self-Contained (Standalone portal) with __CREATE, READ, UPDATE, DELETE__ functionality for :
    - Pages
    - Objects
    - Users
    - Security Groups
- User Self Service Authentication and Password Reset Functionality.
- Flexible Menu (based from pages)

### Technology
> The portal is a MERN (MongoDB, ExpressJs, ReactJs, NodeJs) Application. All the data for the application is saved in a 
Mongo Database which can be hosted on-premise or in the cloud. The frontend client was built with `npx create-react-app` and 
the qlik visualisations are displayed through `QDT Components` a JavaScript library created by (Qlik Demo Team) for mashups.
Express Js facilitates the communication between the ReactJs Client and MongoDB with some API's performing CRUD actions against the database.  

### High Level App Structure 

```text
|--   mern-qlik-application         //Application Root
|-- --  client                      //ReactJS (Frontend)
|-- --  models                      //Mongoose Schema
|-- --  router                      //ExpressJS APIs 
|-- --  validation                  //Database Input Validation
|-- --  Server.js                   //Node.Js Epress App Entry File 
``` 

### Setup

> Install the backend api node modules  
- `npm install` in the root directory `mern-qlik-application`

> Install the frontend api node modules
- `npm install --prefix client` in the root directory `mern-qlik-application`

> Update environmental Variable in the `/config/keys_dev.js` file 

| Development Variable       | Description                                                           |
|----------------------------|:----------------------------------------------------------------------|
| mongoURI                   | - The MongoDB location url with the username, password and database   |
| secretKey                  | - The Salt for the Encrypting the user password for passport.js       |
| cryptr                     | - The Salt for encrypting the smpt password using the `crypty` npm lib|

-  The production key reference are in the `/config/keys_prod` file

> To authenticate the Mashup with Qlik Sense certificate key in __platform extended format__ (.PEM) 
need to be exported and placed in the `config` directory with
the file must be named `client_key.pem` 


### Development Runtime
> Once everything is set to start the development environment, in the root directory `npm run` any of the following

| Command       | Description                                                               |
|---------------|:--------------------------------------------------------------------------|
| `server`      | to start server.js with `nodemon`                                         |
| `client`      | to start the ReactJs Client application alone                             |
| `ssl-client`  | to start the React Client application in https                          |  
| `dev`         | to `concurrently` start the `server` and the `client` together            |
| `dev-ssl`     | to `concurrently` start the `server` and the `client` together in https   |


### Production Runtime
> In the your production environment is it recommended to compress the ReactJs `client` directory 
> When Deploying in Azure this can be automated for continuous builds. 
> The `server.js` file is set to use the `/client/build/index.html` in production. 
