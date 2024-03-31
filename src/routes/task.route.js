const router = require("express").Router();
const jwt = require("jsonwebtoken");
const controller = require("../controller/task.controller");
const { connection } = require("../db/mysql");
const { auth } = require("../../auth");
router.get("/grouplist", auth, controller.getAllTaskGroups);
router.post("/createtask", auth, controller.createTask);
router.post("/createtaskgroup", auth, controller.createTaskGroup);
router.post("/delete", auth, controller.deleteTask);
router.post("/deletegroup", auth, controller.deleteTaskGroup);
router.post("/updatetask", auth, controller.updateTask);
router.post("/getdetail", auth, controller.getTaskDetail);
router.post("/test", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token, { complete: true });
  const userEmail = decodedToken.payload.email;
  const imageFile = req.files.file;
  const imageName = userEmail + "." + imageFile.name.split(".")[1];
  let uploadPath = __dirname + "/.." + "/user_folders/" + imageName;
  console.log(decodedToken);
  imageFile.mv(uploadPath, (err) => {
    if (err) return res.status(500);
    const sql = "update USERS set img = ? where email = ?";
    const timestamp =
      new Date().getTime() + Math.floor(Math.random() * 1000000);

    const updatedimgName = imageName + "?tm=" + timestamp;

    const values = [updatedimgName, userEmail];
    connection.query(sql, values, (err, result) => {
      if (err) return res.status(500);
      return res
        .status(200)
        .json({ result: "success", message: "画像の保存に成功しました" });
    });
  });
  if (!req.files) {
    console.log("no file data");
    return res.status(400).json({ message: "ファイルが見つかりませんでした" });
  }
});
module.exports = router;
