import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexUserByID } from "../utils/middlewares.mjs";
const router = Router();

router.get(
    "/api/users",
    query("filter")
        .isString()
        .withMessage("must be string")
        .notEmpty()
        .withMessage("Must not be empty")
        .isLength({min: 3, max: 10})
        .withMessage("Must be at least 3-10 chars"),
    (request, responce)=>{
        console.log(request.session);
        console.log(request.session.id);
        request.sessionStore.get(
            request.session.id,
            (err, sessioData)=>{
                if(err) {
                    console.log(err);
                    throw err;
                }
                console.log("sessionData***", sessioData);
            }
        )
        const result = validationResult(request);
        const { query: { filter, value } } = request;
        if(filter && value) {
            return responce.status(200).send(mockUsers.filter(u=>u.username.includes(value)));
        }
        return responce.status(200).send(mockUsers);
    }
);

router.get("/api/users/:id", resolveIndexUserByID, (request, responce)=>{
    const { foundUserIndex } = request;
    responce.status(200).send(mockUsers[foundUserIndex]);
});

router.post("/api/users",
    checkSchema(createUserValidationSchema),
    (request, response)=>{
        const result = validationResult(request);
        if(!result.isEmpty()) {
            return response.status(400).send({ errors: result.array() })
        }
        const data = matchedData(request);
        const newUser = {id: mockUsers[mockUsers.length-1].id+1, ...data};
        mockUsers.push(newUser);
        response.status(200).send(newUser)
    }
);

router.put(
    "/api/users/:id",
    resolveIndexUserByID,
    checkSchema(createUserValidationSchema),
    (request, responce)=>{
        const { foundUserIndex, parsedId } = request;
        const updatedUser = { id: parsedId, ...request.body };
        mockUsers[foundUserIndex] = updatedUser;
        responce.status(200).send(updatedUser)
    }
);

router.delete("/api/users/:id", resolveIndexUserByID, (request, responce)=>{
    const { foundUserIndex, parsedId } = request;
    mockUsers.splice(foundUserIndex, 1);
    const msg = "Successfully removed user with id: " + parsedId; 
    responce.status(200).send({msg})

});

export default router;