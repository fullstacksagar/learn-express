const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection Successfull");
}).catch((e)=>{
    console.log("No Connection");
})
