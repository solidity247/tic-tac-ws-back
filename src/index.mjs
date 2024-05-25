import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import WebSocket from "ws";
import { mockUsers } from "./utils/constants.mjs";

const app = express();
// const wss = new WebSocket.Server({ noServer: true });

app.use(cors());
app.use(express.json());
app.use(cookieParser("abc"));
app.use(session({
    secret: "session key",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));
app.use(routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Running on port ${PORT}`);
});

app.get("/", (request, responce)=>{
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;
    responce.cookie("hello", "user", { maxAge: 60000 * 60, signed: true });
    responce.send({message: "Hi User"});
});

app.post("/api/auth", (request, response)=>{
    const { body: { username, password } } = request;
    const foundUser = mockUsers.find( u=> u.username === username );
    if(!foundUser || foundUser.password !== password) {
        return response.status(401).send({ msg: "Invalid credentials" });
    }
    request.session.user = foundUser;
    return response.status(200).send(foundUser);
});

app.get("/api/auth/status", (request, response)=>{
    if(request.session.user) {
        console.log(request.session.user)
        response.status(200).send(request.session.user);
    } else {
        response.status(401).send( { msg: "Not Authenticated"} );
    }
}
);

app.get("/api/cart", (request, response)=>{
    if(!request.session.user) return response.sendStatus(401);
    return response.status(200).send(request.session.cart ?? []);
})

app.post("/api/cart", (request, response)=>{
    console.log("CART")
    if(!request.session.user) return response.sendStatus(401);
    const { body } = request;
    const { cart } = request.session;
    if(cart) {
        cart.push(item);
    } else {
        request.session.cart = [item];
    }
    response.status(201).send(item);
})