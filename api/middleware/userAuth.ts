// @ts-types="@types/express"
import type { NextFunction, Request, Response } from "express";
import jwt from "npm:jsonwebtoken";
import { supabase } from "#api/supabase.ts";

export default async function (req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer ")) {
        res.status(401).send();
        return;
    }

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, Deno.env.get("JWT_SECRET")!);
        const uid = String(decoded.sub);
        const { data, error } = await supabase
            .from("users")
            .select("*, user_role(*)")
            .eq("user_id", uid)
            .single();

        if (error) {
            if (req.path == "/user" && req.method == "POST") {
                next();
                return;
            }

            console.error(error);
            res.status(500).send();
            return;
        }

        res.locals.user = data;
    } catch {
        console.error("Invalid token");
        res.status(401).send();
        return;
    }

    next();
}
