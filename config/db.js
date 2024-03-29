const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : false
        })

        console.log(`MongoDB Connceted : ${conn.connection.host}`)

    }catch(err){
        console.log('DB NOT CONNECTED!!!');
        console.error(err);
        // If there is an error then, stop the program.
        process.exit(1);
    }
}

module.exports = connectDB;