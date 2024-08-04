/* ========== IMPORTS ========== */
// Import environment variable
require('dotenv').config();

//Import express, parser and routes
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routes/index');

// Redis imports
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

//Import security packages
const cors = require('cors');
const helmet = require('helmet');

//Import auth packages
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Import authentication functions
const auth = require('./db/authenticate')


/* ========== APPLICATION ========== */

//Initialize express
const app = express();

app.set('trust proxy', 1)


// Redis store
// const RedisStore = connectRedis(session);

// Configure Redis
// const redisClient = redis.createClient({
    //     port: process.env.REDIS_PORT,
    //     host: process.env.REDIS_HOST,
    // });
    
    // ===== DEVELOPMENT STORE =====
    // const store = new session.MemoryStore(); 
    
    // ===== PRODUCTION STORE =====
    // const store = new RedisStore({client: redisClient});
    
    
// Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

// Setup CORs

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
};

app.use(cors(corsOptions));

//Setup session cookies
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
            sameSite: process.env.RUN_ENV == "development" ? 'lax' : 'none', // lax for development
            secure: process.env.RUN_ENV == "development" ? false : true, // false for development
            httpOnly: true
        },
        store: redisStore,
    })
);


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Initializing passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log("Serializing: " + user.id)
    process.nextTick(function() {
        return done(null, user.id);
    });
});

passport.deserializeUser((id, done) => {
    console.log("Deserializing ID: " + id)
    process.nextTick(function () {
        auth.findById(id, (err, user) => {
            if (err) return done(err);
            return done(null, user);
        });
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Finding user...")
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
