import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { GameSession } from "./game_engine/index.mjs";
import { type } from "os";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json());

const games = [];

app.get("/", (req, res) => {
	res.send({ message: "Hello from the server!" });
});
app.get("/api/games", (request, responce) => {
	responce.send({ games });
});

let req = 0;

wss.on("connection", ws => {
	console.log("New WebSocket connection");
	ws.on("open", () => {
		const respMessage = { type: "openGames" };
		ws.send(JSON.stringify(respMessage));
	});
	const session = {};
	ws.on("message", m => {
		const message = JSON.parse(m.toString());

		if (message.type === "setUserName") {
			session.userName = message.payload.userName;
			const respMessage = {
				type: "userNameResponse",
				payload: { success: true, userName: session.userName }
			};
			ws.send(JSON.stringify(respMessage));
		} else if (message.type === "createGame") {
			session.name = message.payload.name;
			session.role = "hostPlayer";
			session.oponentRole = "secondPlayer";
			const id = Math.ceil(Math.random() * 100 % 100);
			const newGame = new GameSession(id, session.name, ws);
			session.game = newGame;
			games.push(newGame);
			const respMessage = {
				type: "createGameResponse",
				payload: { success: true, id, role: "hostPlayer" }
			};
			ws.send(JSON.stringify(respMessage));
		} else if (message.type === "joinGame") {
			const id = message.payload.id;
			const player2Name = message.payload.playerName;
			session.role = "secondPlayer";
			session.oponentRole = "hostPlayer";
			const game = games.find(g => g.id && g.id === id);
			game.setPlayer2(player2Name, ws);
			session.game = game;
			const respMessage = {
				type: "joinGameResponse",
				payload: { success: true, id, role: "secondPlayer" }
			};
			ws.send(JSON.stringify(respMessage));
			const startMessageToJoiner = {
				type: "gameRuning",
				payload: {
					gamestate: {
						boardState: session.game.sessionState,
						turn: session.game.turn,
						oponentUserName: session.game.hostPlayer
					}
				}
			};
			console.log("Sending to Joiner:", startMessageToJoiner);
			ws.send(JSON.stringify(startMessageToJoiner));
			const startMessageToHost = {
				type: "gameRuning",
				payload: {
					gamestate: {
						boardState: session.game.sessionState,
						turn: session.game.turn,
						oponentUserName: player2Name
					}
				}
			};
			console.log("Sending to Host:", startMessageToJoiner);
			game.hostClient.send(JSON.stringify(startMessageToHost));
		} else if (message.type === "requestOpenGames") {
			const list = games.filter(g => g.isOpen).map(({ id, hostPlayer }) => ({
				id,
				name: hostPlayer
			}));
			const respMessage = {
				type: "requestOpenGamesResponse",
				payload: { listOfGames: list }
			};
			ws.send(JSON.stringify(respMessage));
		} else if (message.type === "cancelGame") {
			const id = message.payload.id;
			const gIndex = games.findIndex(g => g.id && g.id === id);
			if (gIndex >= 0) {
				games.splice(gIndex, 1);
				const respMessage = {
					type: "cancelGameResponse",
					payload: { success: true, id }
				};
				ws.send(JSON.stringify(respMessage));
			}
		} else if (message.type === "move") {
			const role = message.payload.role;
			const cellId = message.payload.cellId;
			const value = message.payload.value;
			session.game.move(cellId, value, role);
			const response = {
				type: "gameStateUpdate",
				payload: {
					gamestate: {
						boardState: session.game.sessionState,
						turn: session.game.turn
					}
				}
			};
			session.game.sendToAll(JSON.stringify(response));
			if (session.game.winner) {
				const winnerResponse = {
					type: "gameOver",
					payload: {
						winner: session.game.winner
					}
				};
				session.game.sendToAll(JSON.stringify(winnerResponse));
			}
		} else if (message.type === "restartGame") {
			session.game.restart();
			const restartGameResponse = { type: "restartGameResponse", payload: {} };
			session.game.sendToAll(JSON.stringify(restartGameResponse));
			const response = {
				type: "gameStateUpdate",
				payload: {
					gamestate: {
						boardState: session.game.sessionState,
						turn: session.game.turn
					}
				}
			};
			session.game.sendToAll(JSON.stringify(response));
		}

		console.log("Received:", message);
		// console.log("Received:", session);
		// ws.send(JSON.stringify({ req, session }));
	});

	ws.on("close", () => {
		console.log("WebSocket connection closed");
	});
});

server.on("upgrade", (request, socket, head) => {
	const pathname = request.url;

	if (pathname === "/api/push") {
		wss.handleUpgrade(request, socket, head, ws => {
			wss.emit("connection", ws, request);
		});
	} else {
		socket.destroy();
	}
});

// const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
