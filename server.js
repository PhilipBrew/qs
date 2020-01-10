const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');

const app = express();
app.options('*', cors());

//ROUTES
const users = require('./routes/api/users');
const qsserver = require('./routes/api/qsserver');
const pages = require('./routes/api/pages');
const sendmail = require('./routes/api/nodemailer');
const settings = require('./routes/api/settings');
const groups = require('./routes/api/security-groups');
const qlik = require('./routes/api/qlik');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//CONFIGURE AND CONNECT TO MongoDB
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('db connected'))
    .catch((err) => {
        console.log(err);
        // Error Connecting to Database
    });


//CONGIFURE PASSPORT
app.use(passport.initialize());
require('./config/passport')(passport);

//USE ROUTES
app.use('/api/users', users);
app.use('/api/qsserver', qsserver);
app.use('/api/pages/', pages);
app.use('/api/sendmail/', sendmail);
app.use('/api/settings/', settings);
app.use('/api/groups/', groups);
app.use('/api/qlik/', qlik);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req,res) => {
       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
