import { Router } from "express";
import { home, form, list, company, compare } from "../handlers/financialData";

const router = Router();


router.get("/", home);
router.get("/:type", form);
router.post("/list", list);
router.post("/company", company);
router.post("/compare", compare);
export default router;
