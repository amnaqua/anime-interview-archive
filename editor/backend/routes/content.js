import express from "express";

import {
    generateInterview
} from "../services/contentGenerator.js";


const router =
    express.Router();


router.post(
    "/generate",
    async(req,res)=>{

        try {

            const result =
                await generateInterview(
                    req.body
                );


            res.json(result);


        } catch(e){

            res.status(500)
                .json({
                    error:e.message
                });

        }

    }
);


export default router;