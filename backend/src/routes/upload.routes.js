import { Router } from "express";
import { upload } from "../controllers/upload.controller.js";

const router = Router();

router.get("/signed-url", upload);

export default router;
