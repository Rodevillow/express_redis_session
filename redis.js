const redis = require("redis");
const connectRedis = require("connect-redis");
const session = require("express-session");

const RedisStore = connectRedis(session);
//Configure redis client
const redisClient = redis.createClient({
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", function (err) {
	console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
	console.log("Connected to redis successfully");

	setTimeout(() => {
		console.log("SET KEY VALUE");
		redisClient.set("TEST:KEY", "some renadom text", 30);
	}, 5000);

	setTimeout(() => {
		console.log("GET KEY VALUE");
		redisClient.get("*");
	}, 10000);
});

//Configure session middleware
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: "secret$%^134",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false, // if true only transmit cookie over https
			httpOnly: false, // if true prevent client side JS from reading the cookie
			// maxAge: 1000 * 60 * 10, // session max age in miliseconds
			maxAge: 60,
		},
	}),
);
