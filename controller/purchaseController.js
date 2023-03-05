const Razorpay=require('razorpay')

const Order=require('../model/order')

const userController = require('./userController');

exports.purchasePremium=(req,res,next)=>{
    try{
        console.log('premiumpurchase')
        var rzp=new Razorpay({
            key_id: process.env.Razorpay_KEY_ID,
            key_secret: process.env.Razorpay_KEY_SECRET
        })
        var amount=2500
        console.log("this is the obj",rzp)
        rzp.orders.create({amount, currency:"INR"}, (err,order)=>{
            if(err){
                console.log(err)
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({orderid: order.id,status: "pending"}).then(()=>{
                return res.status(201).json({order, keyid: rzp.key_id})
            })
            .catch(err=>{throw new Error(err)})
        })
    }
    catch(err){
        res.status(401).json({message: 'Something went wrong!',error: err})
    }
}

exports.updateTransactionStatus=async (req,res,next)=>{
    try{
       const userId=req.user.id
       console.log("updatetransStatus",req.body)
       const {order_id,payment_id}=req.body
       const order=await Order.findOne({where: {orderid: order_id}})
       const promise1 = order.update({
        paymentid: payment_id,
        status: "SUCCESSFUL",
      });
      const promise2 = req.user.update({ ispremiumuser: true });
  
      Promise.all([promise1, promise2])
        .then(() => {
          return res.status(202).json({
            success: true,
            message: "Transaction Successful",
            token: userController.generateAccessToken(userId,undefined,true),
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (err) {
      console.log(err);
      res
        .status(403)
        .json({ error: JSON.stringify(err), message: "Something went wrong" });
    }
}