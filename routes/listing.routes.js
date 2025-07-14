const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js")
const Listing=require("../models/listing.js");
const Review=require("../models/review.js")


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
router.get("/new",(req,res)=>{   //listings/new wala route pehle rkho baad mai listingsid wala rkhna otherwise error aaega
    res.render("listings/new.ejs");

})


//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
}))

//create route-> data save hora hai 
router.post("/",validateListing,wrapAsync(async (req,res)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400,error.message);
    }
  
      // let listing=req.body.listing;
    //   if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    //   }
    const newListing=new Listing(req.body.listing);
    //  if(!newListing.title){
    //     throw new ExpressError(400,"Title is missing")  since joi aagya to inki no need
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Descrioption is missing")
    // }
    //  if(!newListing.location){
    //     throw new ExpressError(400,"Location is missing")
    // }
    await newListing.save();
    res.redirect("/listings");
}

))
//edit
router.get("/:id/edit",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});


}))



//update
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
}))
//delete
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))



module.exports=router;