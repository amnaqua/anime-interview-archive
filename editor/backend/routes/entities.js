import express from "express";

import {
    list,
    get,
    create,
    update
} from "../services/entityService.js";

const router = express.Router();

router.get(
    "/:entity",
    async (req, res) =>
    {
        try {
            res.json(
                await list(
                    req.params.entity
                )
            );
        } catch (e) {
            console.error(e);

            res.status(500)
                .json({
                    error: e.message
                });
        }
    }
);

router.get(
    "/:entity/:slug",
    async (req, res) =>
    {
        const item =
            await get(
                req.params.entity,
                req.params.slug
            );

        if (!item) {
            return res
                .status(404)
                .json({
                    error: "Not found"
                });
        }

        res.json(item);
    }
);

router.post(
    "/:entity",
    async (req, res) =>
    {
        try {
            res.json(
                await create(
                    req.params.entity,
                    req.body
                )
            );
        } catch (e) {
            res.status(400)
                .json({
                    error: e.message
                });

        }
    }
);

router.put(
    "/:entity/:slug",
    async (req, res) =>
    {
        const result =
            await update(
                req.params.entity,
                req.params.slug,
                req.body
            );

        if (!result) {
            return res
                .status(404)
                .json({
                    error: "Not found"
                });
        }

        res.json(result);
    }
);

export default router;