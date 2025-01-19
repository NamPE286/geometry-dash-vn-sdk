// @ts-types="@types/express"
import express from "express";
import { supabase } from "#api/supabase.ts";

const router = express.Router();

router.patch("/", async (req, res) => {
    const { user } = res.locals;

    if (req.body.user_id !== user.user_id || !user.user_role.edit_own_profile) {
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
