const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app =express();
const currentdate=require( __dirname+"/date.js");    // using modules
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
// const mongoose=require("mongoose");

// mongoose.connect("mongodb://localhost:27017/todolist");
// mongoose.set("strictQuery", false);
// const todoSchema=new mongoose.Schema({
//     itemadded:String,
//     rating:Number
// });
// const todo =mongoose.model("todo",todoSchema);
// const tododata = new todo({
//     itemadded:"Apple",
//     rating:9
// })
// tododata.save();
mongoose.set('strictQuery', false);

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true,useUnifiedTopology: true });

mongoose.connect("mongodb+srv://Armann:786Aq786@cluster0.yjdtpyw.mongodb.net/todolistDB");




const itemSchema = new mongoose.Schema({
  name: {
    type:String,
    required:['true','Data is not entered in database']
    },
    
  
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Apple",
    
});
const personalitem = mongoose.model("personalitem", itemSchema);



// const personSchema = new mongoose.Schema({                           // data directed to dbs
//     name:String,                                                       //format to store data
//     _id:Number,
//     rating:Number,
//     favfruit:fruitSchema

// });
// const Person= mongoose.model("Person",personSchema);                              // to use schema defined earlier
// const Pineapple = new Fruit({
//     name:"Pineapple",
//     rating:8,
//     review:"Great fruit",
//     _id:4
// });
// // Pineapple.save();
// const person = new Person({                                                 //data passes
//     name:"Ravi",
//     rating:8,
//     _id:1,
//     favfruit:Pineapple
// });
// person.save();                                                              //data to be saved 


const item2 = new Item({
    name: "Kiwi",
    
});
const item3 = new Item({
    name: "Banana",
    
});
const Itemarray =[item1,item2,item3];


// Item.find(function (err,items) {
//     if(err){
//         console.log("Error in fetching data from dbs.");
//     }
//     else{
        
//         console.log(items);
        
//         items.forEach(function(item){
//             console.log(item.name);
//         })
//     }
        
// });


// Fruit.updateOne({_id:1},{name:"Pomegranate"},function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Successfully updated");
//     }
//     // mongoose.connection.close();
// });
// Fruit.deleteOne({_id:1},function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Successfully deleted");
//     }
//     // mongoose.connection.close();
// });

var items=new Array("Buy food","Drink water","Eat Apple");
// var personalitems=[];
const ListSchema ={
    name: {
      type:String,
      required:['true','Data is not entered in database']
      },
    itemlist:[itemSchema]
    
  };
const Lists=mongoose.model("Lists",ListSchema);


app.get("/",function(req,res){
    let date=currentdate();
    Item.find({},function(err,founditems){
        if(founditems.length === 0){           // condition not to add many many times same data to dbs
            Item.insertMany (Itemarray,function (err) {                             //reason to comment out as it will save into dbs many many times
                if(err){
                    console.log(err);
                }
                else {
                    console.log("Successfully saved to dbs ...");
                }  
            
            });
            res.redirect("/");                             // it will redirect again to get after that founditems len !=0
        }
        else{

            res.render("list",{
                listtitle:date,
                newlistitems:founditems
            });

        }
        
    })
    

});
app.get("/:customListName",function(req,res){
    const location=_.capitalize(req.params.customListName) ;
    console.log(location);
    Lists.findOne({name:location},function(err,foundlist){
        if(!foundlist){
            const list = new Lists({
                name:location,
                itemlist:Itemarray
            });
            list.save();
            res.redirect("/"+location);
        }
        else{
            res.render("list",{                                // rendering for list ejs file in view
                listtitle:location,
                newlistitems:foundlist.itemlist
            });
        }
        
    })
    // Lists.find({},function (err,pitems) {
    //     res.render("list",{
    //         listtitle:location,
    //         newlistitems:pitems.itemlist
    
    //     });
    // });
    
    

    
});
app.get("/personal",function(req,res){
    personalitem.find({},function (err,pitems) {
        res.render("list",{
            listtitle:"Personal Note",
            newlistitems:pitems
    
        });
    });
    
})
// app.post("/",function (req,res) {
//     let item=req.body.newitems;
//     if(req.body.add ==='Personal Note'){
//         personalitems.push(item);
//         res.redirect("/personal");
//     }
//     else{
//     items.push(item);
//     res.redirect("/");
//     }
// })
//       ----> Using MongoDB and Mongoose


app.post("/",function (req,res) {
    
    let itemName=req.body.newitems;
    let listname=req.body.add;
    
    const item = new Item({
        name:itemName,
    });
    if(req.body.add === 'Personal Note'){
        
        item.save();
        res.redirect("/personal");
    }
    else{
        Lists.findOne({name:listname},function(err,foundlist){
            foundlist.itemlist.push(item);
            foundlist.save();
        });
    
        res.redirect("/" + listname);
    }
});

app.post("/delete" ,function (req,res) {
    
    const id = req.body.checkbox;
    const listname=req.body.listname;
    let date=currentdate();

    if(date===listname){
        Item.findByIdAndRemove(id,function (err) {
            if(!err){
             console.log("Successfully deleted");
                 res.redirect("/");
            }
                     
         });
    }
    else{
        Lists.findOneAndUpdate({name:listname},{$pull: {itemlist:{_id:id}}},function(err,found){
            if(!err){
                res.redirect("/"+listname);
            }
        })
    }

    
        
    
    
    
});



app.listen(3005,function () {
    console.log("Server started on port 3005");
});
