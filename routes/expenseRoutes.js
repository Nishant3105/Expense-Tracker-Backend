const express=require('express')

const expenseRoutes=express.Router()

const expenseController=require('../controller/expenseController')

const userAuthentication=require('../middleware/auth')

expenseRoutes.post('/expense/addexpense', userAuthentication.authenticate , expenseController.addExpense)

expenseRoutes.get('/expense/getexpense', userAuthentication.authenticate , expenseController.getExpense)

expenseRoutes.delete('/expense/deleteexpense/:id', userAuthentication.authenticate, expenseController.deleteExpense)


module.exports = expenseRoutes