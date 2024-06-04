import { Router } from "express";
import GameStack from "../game_engine/index.mjs";
// import { mockProducts } from "../utils/constants.mjs";

const router = Router();

router.get("/api/games", (request, responce) => {
	// console.log(request);
	responce.status(200).send({ message: "Games are here" });
	// responce.status(200).send(GameStack.getOpenSessions());
});

router.post("/api/games", (request, responce) => {
	const playerName = "";
	GameStack.startNewSession();
	responce.status(200).send();
});

// PUSH API

// router.get("/api/push", (request, responce) => {
// 	// console.log(request);
// 	console.log("Push called");
// 	responce.status(200).send(GameStack.getOpenSessions());
// });

export default router;
