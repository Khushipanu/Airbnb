


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


const listings=require("./routes/listing.routes.js")
const reviews=require("./routes/review.routes.js")
const userRouter=require("./routes/user.routes.js")


const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

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
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }

}
app.get("/",(req,res)=>{
    res.send("hi,i am root")
})

app.use(session(sessionOptions))
app.use(flash())  //iska kaam hota hai temporary messages ko store krna

//session ke baad password
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })
//    let registeredUser=await User.register(fakeUser,"helloworld")
//    res.send(registeredUser)

// })
//routes
app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter)






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