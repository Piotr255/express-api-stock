import { Router } from "express";
import { home, form, list, compare } from "../handlers/financialData";
import { errorHandler } from "../middlewares/error";

const router = Router();


router.get("/home", home);
router.get("/form/:type", form);
router.get("/list", list);
router.get("/compare", compare);

export default router;
