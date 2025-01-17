import { Router } from "express";
import { upload } from "../controllers/upload.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyLogin);

router.get("/signed-url", upload);

export default router;
