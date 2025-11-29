import express from 'express';

import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getMyProjects,
    assignTeamToProject,
} from '../controllers/projectController.js';

import { protect } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.get("/",protect,getAllProjects);
router.post("/",protect,createProject);
router.get("/my-projects",protect,getMyProjects);
router.get("/:id",protect,getProjectById);
router.put("/:id/assign-team",protect,assignTeamToProject);
router.put("/:id",protect,updateProject);
router.delete("/:id",protect,deleteProject);

export default router;