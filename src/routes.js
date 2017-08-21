import { Router } from 'express';

import report from "./report/report.controller";
import dailyReport from "./report/dailyReport.controller";



const router = Router();

router.use('/report', report);
router.use('/status', dailyReport);

export default router;
