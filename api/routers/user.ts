/**
 * Express router providing user related routes.
 * @module routers/user
 */

// @ts-types="@types/express"
import express from "express";
import { supabase } from "#api/supabase.ts";

const router = express.Router();

/**
 * PATCH / route to update user information.
 * @name PATCH/
 * @function
 * @memberof module:routers/user
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.patch("/", async (req, res) => {
    if (req.body.user_id !== res.locals.user.user_id) {
        res.status(403).send();
        return;
    }

    const { error } = await supabase
        .from("users")
        .update(req.body)
        .eq("user_id", req.body.user_id);

    if (error) {
        res.status(500).send(error);
    }

    res.send();
});

/**
 * Express router to mount user related functions on.
 * @type {Object}
 * @memberof module:routers/user
 */
export default router;