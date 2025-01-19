// @ts-types="@types/express"
import express from "express";
import user from "#api/routers/user.ts";
import userAuth from "#api/middleware/userAuth.ts";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.on("finish", function () {
        console.log(`[${new Date().toLocaleString()}]`, req.method, req.path, res.statusCode)
    });

    next();
});
app.use(userAuth);

app.use("/user", user);

app.listen(8000, () => {
    console.log("Server started on port 8000");
});
