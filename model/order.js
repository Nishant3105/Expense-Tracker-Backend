const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Order=sequelize.define('order',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true
    },
    orderid: Sequelize.STRING,
    paymentid: Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports=Order