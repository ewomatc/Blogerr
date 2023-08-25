const userController = require('../controllers/user-controller')
const express = require('express')
const router = express.Router()
const {verifyAccessToken} = require('../auth/jwt-auth')
const {checkRole} = require('../auth/jwt-auth')




router.get('/all', verifyAccessToken, checkRole('admin'), userController.get_user_list)

router.post('/register', userController.register_user)

router.post('/login', userController.login_user)

router.get('/:idOrName', userController.get_user_profile)

router.get('/get/count', verifyAccessToken, checkRole('admin'), userController.get_user_count)

router.put('/me/:id', verifyAccessToken, userController.update_profile)


module.exports = router