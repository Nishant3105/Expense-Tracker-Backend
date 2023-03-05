const jwt=require('jsonwebtoken')

const User=require('../model/user')

exports.authenticate=(req,res,next)=>{
    try{
      const token=req.header('Authorization')
      console.log(token)
      const user=jwt.verify(token,'secretkey')
      console.log(user.userId)
      User.findByPk(user.userId).then(user=>{
        req.user=user
        next()
      })
      .catch(err=>console.log(err))
    }
    catch(err){
       return res.status(401).json({success: false})
    }
}
