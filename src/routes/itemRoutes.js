import {
  createItemController,
  getAllItensController,
  getItemByIdController,
  updateItemController,
  deleteItemController,
} from "../controllers/itemController.js";
import { Router } from "express";
import { upload } from "../config/multerConfig.js";

const itemRouter = Router();

itemRouter.post("/", upload.single("image"), createItemController);
itemRouter.get("/:id", getItemByIdController);
itemRouter.get("/", getAllItensController);
itemRouter.patch("/:id", upload.single("image"), updateItemController);
itemRouter.delete("/:id", deleteItemController);

export default itemRouter;
