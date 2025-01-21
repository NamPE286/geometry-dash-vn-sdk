// @ts-types="@types/express"
import express from "express";
import { supabase } from "#api/supabase.ts";

const router = express.Router();

router.post("/", async (req, res) => {
    delete req.body.user_role;

    req.body.user_id = res.locals.user_id;

    const { error } = await supabase
        .from("users")
        .insert(req.body);

    if (error) {
        console.error(error);
        res.status(500).send();
    }

    res.status(201).send();
});

router.patch("/", async (req, res) => {
    const { user } = res.locals;

    if (!user.user_role.edit_own_profile) {
        res.status(403).send();
        return;
    }

    delete req.body.role;
    delete req.body.user_id;

    const { error } = await supabase
        .from("users")
        .update(req.body)
        .eq("user_id", user.user_id);

    if (error) {
        console.error(error);
        res.status(500).send();
    }

    res.send();
});

export default router;
