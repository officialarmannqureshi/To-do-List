module.exports=getdate;      // to export the module 
function getdate(){
    var today=new Date();
    var options ={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-US",options);
    return day;

}

// for many objects then module.exports.getdata
