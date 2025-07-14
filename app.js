


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/review.js")
const listings=require("./routes/listing.routes")
const reviews=require("./routes/review.routes")


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//routes
app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews);



app.get("/",(req,res)=>{
    res.send("hi,i am root")
})



// validateListing
// Yeh middleware hai – yani code chalega request handle hone se pehle. Iska kaam hai check karna ki listing valid hai ya 
// nahi (validation logic).
//khud se validation if else krke likhne ki jrrort nhi hai 






// Catch-all for 404 errors

app.all('/{*any}' , (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// router.use((err,req,res,next)=>{
//     let {status=500,message="some error"}=err;
//     res.status(status).render("error.ejs",{err})
//     // res.status(status).send(message)
// })

// Error-handling middleware
app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || "Something went wrong!";
    res.status(status).render("error.ejs", { err });
});

app.listen(8080,(req,res)=>{
    console.log(`server is listening to port 8080`);
})