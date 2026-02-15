import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { authMiddleware } from "../../../../shared/middlewares/user.middleware";


const authRouter = Router();
const userController =  new UserController();

authRouter.post('/login-user', (req, res) => userController.create(req, res));
authRouter.get('/profile',authMiddleware, userController.getUserProfile)
authRouter.patch('/update-profile', authMiddleware,userController.updateUserProfile)

export default authRouter;
