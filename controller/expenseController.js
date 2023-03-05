const Expense = require('../model/expense')
const User = require('../model/user')
const sequelize = require('../util/database')
const FilesDownloaded=require('../model/filedownloaded')
const UserServices=require('../services/userservices')
const S3Service=require('../services/s3services')

exports.downloadexpense = async (req, res) => {
    try {
      const t = await sequelize.transaction()
      console.log('reached here')
      const expenses = await UserServices.getExpenses(req); // here expenses are array
      console.log(expenses);
      const stringifiedExpenses = JSON.stringify(expenses);
      const userId = req.user.id;
      //res.status(200).json({fileURL,success: true})
      const filename = `Expense${userId}/${new Date()}.txt`;
      const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
      await FilesDownloaded.create({
        fileUrl:fileURL,
        userId,
      },
      )
      const downloadedFiles=await FilesDownloaded.findAll({attributes:['fileUrl','createdAt'],where: {userId:userId}})
      res.status(200).json({ fileURL, downloadedFiles, success: true });
    } catch (err) {
      console.log(err);
      t.rollback()
      res.status(500).json({ fileURL: "", success: false, error: err });
    }
  };


exports.addExpense = async (req, res, next) => {
    //const t = await sequelize.transaction()
    try {
        const { expenseprice, description, typeofexpense } = req.body
        if (expenseprice == "" || description == "" || typeofexpense == "") {
            res.status(400).json({ message: 'Please fill all the details' })
        }
        console.log(req.user)
        const expdata = await Expense.create({
            expenseprice,
            description,
            typeofexpense,
            userId: req.user.id
        },
            //{ transaction: t }
        )
        const totalExpense = Number(req.user.totalexpense) + Number(expenseprice)
        await User.update({
            totalexpense: totalExpense
        }, {
            where: { id: req.user.id }
        }, 
        //{ transaction: t }
        )
        //await t.commit()
        res.status(200).json(expdata)

    }
    catch (err) {
        console.log(err)
        //await t.rollback()
        res.status(500).json({ success: false })
    }

}


exports.getExpense = (req, res, next) => {
    try {
        //req.user.getExpense().then.....
        const uId=req.user.id
        console.log(req.query)
        const limit=req.query.limit ? parseInt(req.query.limit) : 2
        const page=req.query.page ? parseInt(req.query.page) : 1
        Expense.findAndCountAll({ where: { userId: uId } })
            .then(data => {
                const pages=Math.ceil(data.count / limit)
                req.user.getExpenses({attributes:['expenseprice','description','typeofexpense'],offset: (page-1) * limit, limit:limit})
                .then((expense)=>{
                    console.log(expense)
                    res.status(200).json({expense, pages:pages})
                })
                .catch((err)=>console.log(err))
            })
            .catch((err)=>console.log(err))
    }
    catch (err) {
        res.status(500).json({ error: err ,success: false })
    }
}

exports.deleteExpense = async (req, res, next) => {
    //const t = await sequelize.transaction()
    try {
        const id = req.params.id
        const expense = await Expense.findAll({ where: { id } }, 
            //{ transaction: t }
            )
        const expamt = expense[0].expenseprice
        console.log(expamt)
        const response = await Expense.destroy({ where: { id } }, 
            //{ transaction: t }
            )
        if (response == true) {
            const totalExpense = Number(req.user.totalexpense) - Number(expamt)
            await User.update({
                totalexpense: totalExpense
            }, {
                where: { id: req.user.id }
            },
                //{ transaction: t }
            )
            //await t.commit()
            res.json({ message: 'expense deleted successfully!' })
        }
    }
    catch (err) {
        console.log(err)
        //await t.rollback()
        res.status(500).json({ message: 'Something went wrong' })
    }
}