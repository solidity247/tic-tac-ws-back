import { mockUsers } from "./constants.mjs";

const resolveIndexUserByID = (request, responce, next) =>{
    console.log("MDLW")
    const { params : {id}} = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return responce.status(400).send("Wrong Id");
    const foundUserIndex = mockUsers.findIndex(u=>u.id==parsedId);
    if(foundUserIndex == -1) return responce.status(404).send("Id not exist");
    request.foundUserIndex = foundUserIndex;
    request.parsedId = parsedId;
    next();
};

export { resolveIndexUserByID };