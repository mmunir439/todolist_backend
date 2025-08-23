const userController=require("../controller/user");
const express = require('express');
const { requireAuth } = require('../middleware/Auth');
const router = express.Router();
router.get("/", (req, res) => {
    res.send("hello user side");
});
router.post('/registeruser', userController.registeruser);
router.get('/getuser', requireAuth, userController.getuser);
router.post('/loginuser', userController.loginuser);
router.post('/forgotPassword', requireAuth, userController.forgotPassword);
router.post('/reset-password', requireAuth, userController.resetPassword);
router.put('/updateuser', requireAuth, userController.updateuser);
router.delete('/deleteuser', requireAuth, userController.deleteuser);
module.exports = router;