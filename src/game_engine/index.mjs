import { defaultStartSessionstate } from "./constants.mjs";
import { findWinner } from "../utils/patternUtil.mjs";

class GameSession {
	constructor(id, hostPlayer, hostClient) {
		this.id = id;
		this.sessionState = defaultStartSessionstate;
		this.hostPlayer = hostPlayer || "Player1";
		this.hostClient = hostClient;
		this.player2 = null;
		this.palyer2Client = null;
		this.isOpen = true;
		this.ready = false;
		this.turn = "hostPlayer";
		this.winner = null;
	}
	updateSessionState(newState) {
		this.sessionState = newState;
	}
	switchTurn() {
		if (this.turn === "hostPlayer") {
			this.turn = "secondPlayer";
		} else if (this.turn === "secondPlayer") {
			this.turn = "hostPlayer";
		}
	}
	move(cellId, value, role) {
		const player = role === "hostPlayer" ? this.hostPlayer : this.player2;
		this.updateSessionState(
			this.sessionState.map(c => {
				if (c.id == cellId) return { ...c, value, player };
				return c;
			})
		);
		this.checkWinner(role);
		this.switchTurn();
	}
	checkWinner(role) {
		if (findWinner(this.sessionState)) {
			this.winner = role === "hostPlayer" ? this.hostPlayer : this.player2;
		} else if (this.sessionState.every(c => c.value)) {
			this.winner = "DRAW";
		}
	}
	setPlayer2(player2 = "Player2", palyer2Client) {
		this.player2 = player2;
		this.palyer2Client = palyer2Client;
		this.isOpen = false;
		this.ready = true;
	}
	restart() {
		this.sessionState = defaultStartSessionstate;
		this.winner = null;
	}
	sendToAll(message) {
		this.hostClient.send(message);
		this.palyer2Client.send(message);
	}
}

class GameStack {
	constructor() {
		this.gameStack = [];
	}
	startNewSession() {
		const id = Date.now();
		const sessionGame = new GameSession(id);
		this.gameStack.push(sessionGame);
		return sessionGame;
	}
	getSessionById(id) {
		return this.gameStack.find(gs => gs.id === id);
	}
	getOpenSessions() {
		return this.gameStack.filter(gs => gs && gs.isOpen);
	}
}

export default new GameStack();
export { GameSession };
