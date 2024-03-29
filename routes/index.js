const express = require('express')
const router = express.Router();
const {ensureAuth,ensureGuest} = require('../middleware/auth');

const Story = require('../models/Story');


//Description of Route => Login Landing Page

router.get('/',ensureGuest,(req,res) => {
    //changin the layout from main to login
    //layouts are stored inside layouts folder in views folder 
    res.render('login' , {
        layout : 'login'
    });
})

//Description of Route => Dashboard Page
router.get('/dashboard' , ensureAuth, async (req,res) => {


    try{
        //.lean is used because for handlebar we fetch data with it
        const stories = await Story.find({user : req.user.id}).lean();
        
        res.render('dashboard' , {
            name : req.user.firstName,
            stories
        });
        
    }catch(err){
        console.log(err);
        res.render('error/500')
    }

})


//Description => 


module.exports = router;