import express from 'express';

import {
    createProject,
   
    getProjectById,
    updateProject,
    deleteProject,
   
} from '../controllers/projectController.js';

import { protect } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post("/",protect,createProject);
router.get("/:id",protect,getProjectById);
router.put("/:id",protect,updateProject);
router.delete("/:id",protect,deleteProject);

export default router;