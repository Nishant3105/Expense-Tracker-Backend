const User = require('../model/user')

const Expense=require('../model/expense')

const bcrypt = require('bcrypt')

const jwt=require('jsonwebtoken')

function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,username:name,ispremiumuser},'secretkey')
}

const postUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (name == "" || email == "" || password == "") {
            res.status(500).send('please fill all the details')
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({
                username: name,
                email,
                password: hash,
                totalexpense: 0
            })

            res.status(201).json({ message: 'Successfully created new user' })
        })
    }
    catch (err) {
        console.log(err)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        console.log(email, password)
        if (email == "" || password == "") {
            res.status(400).json({ message: 'please fill all the details', success: false })
        }
        const user = await User.findAll({ where: { email } })
        console.log(user)
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, response) => {
                if (err) {
                    throw new Error('Something went wrong!')
                }
                if (response === true) {
                    res.status(200).json({ 
                        success: true, 
                        message: "User logged in successfully",
                        token: generateAccessToken(user[0].id,user[0].username,user[0].ispremiumuser) 
                    })
                }
                else {
                    res.status(400).json({ success: true, message: "Password is incorrect" })
                }
            })
        } else {
            res.status(404).json({ success: true, message: "User doesn't exist" })
        }

    }
    catch (err) {
        res.status(404).json('SORRY! user not found!')
    }
}

module.exports = {postUser,
                 generateAccessToken,
                 userLogin
                }

  
  