// Import environment variable
require('dotenv').config();

//Import express, parser and routes
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/index');

//Import security measures
const cors = require('cors');
const helmet = require('helmet');

//Import authentication functions
const auth = require('./db/authenticate')

//Import express-session
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const store = new session.MemoryStore();

//Initialize express
const app = express();



//Setup session cookies
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'lax',
            secure: false,
            httpOnly: true
        },
        resave: false,
        saveUninitialized: false,
        store,
    })
);

const corsOptions = {
    origin: "http://localhost:3001",
    credentials: true
  };
app.use(cors(corsOptions));
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Initializing passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    auth.findById(id, (err, user) => {
        if (err) return done(err);
        done(null, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        auth.findByUsername(username, async (err, user) => {
            // If error.

            if (err) return done(err);

            // If user is not found
            if (!user) return done(null, false);

            // Check compare password against hashed password in DB
            const passwordCheck = await auth.comparePasswords(password, user.password)
            // If user is found but password is invalid.
            if (!passwordCheck) return done(null, false);

            // If user is found and password is valid.
            return done(null, user);
        });
    }
));

app.use('/', apiRouter);

app.listen(process.env.PORT, () => {
    console.log(`E-Commerce App is listening on PORT ${process.env.PORT} `);
});
