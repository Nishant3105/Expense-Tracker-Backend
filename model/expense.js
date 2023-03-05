const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Expense=sequelize.define('expense',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    expenseprice:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false
    },
    typeofexpense:{
        type: Sequelize.STRING,
        allowNull: false
    }

})

module.exports=Expense