import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (request, responce)=>{
    console.log(request.headers.cookie);
    console.log(request.signedCookies);
    if(request.signedCookies.hello && request.signedCookies.hello == "user")
        responce.status(200).send(mockProducts)
    return responce.status(403).send({msg: "Need a right cookies"}) 
});

export default router;