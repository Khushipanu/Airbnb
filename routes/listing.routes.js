const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js")
const Listing=require("../models/listing.js");
const Review=require("../models/review.js")
const {isLoggedIn}=require("../middleware.js")


const validateListing=(err,req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>  el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

router.get("/",async (req,res)=>{
    const allListings=await Listing.find({});  //iska mtlb hai sara data lao without any filter
    res.render("listings/index.ejs",{allListings});
})
//new route
router.get("/new",isLoggedIn,(req,res)=>{   //listings/new wala route pehle rkho baad mai listingsid wala rkhna otherwise error aaega
    
    res.render("listings/new.ejs");

})


//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner")
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}))

//create route-> data save hora hai 
router.post("/",
    isLoggedIn,
    validateListing,wrapAsync(async (req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing created!")
    res.redirect("/listings");
}

))
//edit
router.get("/:id/edit",
    isLoggedIn,
    validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});


}))



//update
router.put("/:id",
    isLoggedIn,
    validateListing,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("sucess",("Listing updated!"))
    res.redirect(`/listings/${id}`); 
}))
//delete
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing deleted!")
    res.redirect("/listings")
}))



module.exports=router;