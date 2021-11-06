let express = require('express');
const { authJwt } = require("../Middleware/authJwt");
let router = express.Router();
 
const user = require('../controllers/user.controllers');
router.post('/api/user/login', user.signin);
router.post('/api/user/create', user.createUser);
router.get('/api/user/all', user.retrieveAllUser);
router.get('/api/user/onebyid/:id', user.getUserById);
router.put('/api/user/update/:id', user.updateById);
// router.delete('/api/user/:id', authJwt.verifyToken, user.deleteById);


module.exports = router;
