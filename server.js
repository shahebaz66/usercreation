const express = require('express');
const bodyParser = require('body-parser');
const validator=require('validator')
const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose
  .connect(`mongodb://127.0.0.1:27017/data`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successfull!'));
const userSchema = new Schema({
    name: {type:String, default: 'John', enum: ['John', 'roshan', 'Doe'] },
    phone: Number,
    address: {
        contactName: String,
        detailAddress: {
            line1: String,
            line2: String,
            line3: String
        },
        pin: Number,
        country: String
    },
    cart: [
        {
            id: String,
            count: Number
        }
    ]
});

const User= mongoose.model('User', userSchema);

app.post('/data',async (req,res)=>{
    if(req.body.name in ['John', 'roshan', 'Doe']){
        if(validator.isMobilePhone(req.body.phone.toString())){
            await User.create(req.body);
            res.json({message:"created user"});
        }else{
        res.json({message:"enter correct phone number"});
        };
    }else{
        res.json({message:"not a valid name"});
    };
});
app.get('/data',async (req,res)=>{
    const data=await User.find({});
    res.json(data)
});
app.listen(3000,()=>{
    console.log("server listening at 3000");
})