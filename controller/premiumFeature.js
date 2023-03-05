const Expense=require('../model/expense')

const User=require('../model/user')

const sequelize=require('../util/database')


exports.getUserLeaderBoard=async (req,res,next)=>{
    try{
        const leaderBoardDetails=await User.findAll({
            attributes:['id','username',[sequelize.fn('sum',sequelize.col('expenses.expenseprice')),'total_cost']],
            include:[
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost',"DESC"]]
        })
        res.status(200).json(leaderBoardDetails)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
        
    }