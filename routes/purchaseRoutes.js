const express=require('express')

const purchaseMiddleware=require('../middleware/auth')

const purchaseController=require('../controller/purchaseController')

const route=express.Router()

route.get('/purchase/premiummembership', purchaseMiddleware.authenticate, purchaseController.purchasePremium )

route.post('/purchase/updatetransactionstatus', purchaseMiddleware.authenticate, purchaseController.updateTransactionStatus )

module.exports=route