const express=require('express')

const routes=express.Router()

const forgotPasswordController=require('../controller/forgotpasswordController')

routes.post('/password/forgotpassword', forgotPasswordController.forgotpassword)

routes.get('/password/updatepassword/:resetpasswordid', forgotPasswordController.updatepassword)

routes.get('/password/resetpassword/:id', forgotPasswordController.resetpassword)



module.exports = routes