const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const FilesDownloaded=sequelize.define('filesdownloaded',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fileUrl:{
        type: Sequelize.STRING,
        allowNull: false
    }

})


module.exports=FilesDownloaded