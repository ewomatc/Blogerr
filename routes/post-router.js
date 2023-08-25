const express = require('express')
const router = express.Router()
const postController = require('../controllers/post-controller')
const {verifyAccessToken} = require('../auth/jwt-auth')


router.get('/', postController.get_all_posts)

router.get('/:id', postController.get_one_post)

module.exports = router