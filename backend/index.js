//creating an express application
const exp=require('express');
const app=exp();
require('dotenv').config();
const mongoose=require('mongoose');
const path=require('path');
//selecting port
const port=process.env.PORT||5000;

//importing api Apps
const userApp = require('./API/userApi');
const driverApp = require('./API/driverApi');
const operatorApp = require('./API/operatorApi');
const adminApp = require('./API/adminApi');

app.use(exp.static(path.join(__dirname,'../client/dist')));
//selecting api route
app.use('/user',userApp);
app.use('/driver',driverApp);
app.use('/operator',operatorApp);
app.use('/admin',adminApp)

//connecting to database
mongoose.connect('mongodb://localhost:27017/busapp')
.then(()=>{

    //listening on the port
    app.listen(port,()=>{
        console.log(`listening on PORT ${port}`);   
    })

    //successful connection
    console.log('DB connection success');

})
//error handling in db connection
.catch(err=>{
    console.log(err);
})

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/dist/index.html'));
})

//error handling
app.use((err,req,res,next)=>{
    res.send({message:"error occured",problem:err.message});
})