import { Router } from "express";
import userRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import gamesRouter from "./games.mjs";

const router = Router();

router.use(userRouter);
router.use(productsRouter);
router.use(gamesRouter);

export default router;
