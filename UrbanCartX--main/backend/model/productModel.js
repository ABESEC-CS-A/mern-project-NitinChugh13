import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    image1:{
        type: String,
        required : true
    },
    image2:{
        type: String,
        
    },
    image3:{
        type: String,
        
    },
    image4:{
        type: String,
        
    },
    description:{
        type: String,
        required : true
    },
    price:{
        type: Number,
        required : true
    },
    category:{
        type: String,
        required : true
    },
    subCategory:{
        type: String,
        required : true
    },
    sizes:{
        type: Array,
        required : true
    },
    date:{
        type: Number,
        required : true
    },
    bestSeller:{
        type: Boolean,
    }
    

},{timestamps:true , minimize:false});

const product = new mongoose.model("Product" , productSchema)



export default product