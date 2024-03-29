const express = require('express')
const router = express.Router();
const {ensureAuth,ensureGuest} = require('../middleware/auth');

const Story = require('../models/Story');


router.get('/add',ensureAuth,(req,res) => {
    res.render('stories/add')
})

router.post('/',ensureAuth,async (req,res) => {
    try{
        //With every request i have a user attached to it therefor, req.user
        req.body.user = req.user.id ;
        await Story.create(req.body);
        res.redirect('/dashboard');
    }
    catch(err) {
        console.log(err);
        res.render('error/500');
    }
});

//Show all stories
router.get('/',ensureAuth , async (req,res)=>{
    try{
        const stories = await Story.find({status : 'public'})
                                    .populate('user')
                                    .sort({createdAt: 'desc'})
                                    .lean()
        
        res.render('index',{
            stories
        })

    }catch(err){
        console.log(err);
        res.render('error/500');
    }
});

//Show single story
router.get('/:id' , async (req,res) =>{
    try{
        let story = await Story.findById(req.params.id)
                                .populate('user')
                                .lean()
        if(!story){
            return res.render('error/404');
        }
        
        res.render('stories/show' , {
            story
        })

    }
    catch(err){
        console.log(err)
        res.render('error/404');
    }
})


// showing the edit story
router.get( '/edit/:id' ,ensureAuth , async (req,res) => {
    try{
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();

        if(!story){
            return res.render('error/404');
        }

        if(story.user != req.user.id){
            res.redirect('/stories');
        }
        else{
            res.render('stories/edit',{
                story
            })
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('error/500');
    }
})

// Description => Update the story
router.put('/:id',async (req,res) => {
    try{

        let story = await Story.findById(req.params.id).lean();
    

        if(!story){
            res.render('error/404');
        }

        if(story.user != req.user.id){
            res.redirect('/stories');
        }
        else{
            story = await Story.findOneAndUpdate({_id : req.params.id} , req.body ,{
                new : true,
                runValidators : true
            });

            
            res.redirect('/dashboard');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('error/500');
    }

})


//Delete story
router.delete('/:id' , ensureAuth , async (req,res) => {
    try{
        await Story.remove({_id : req.params.id})
        res.redirect('/dashboard');
    }
    catch(err){
        console.log(err);
        return res.redirect('error/500');
    }
});


//User Stories
router.get('/user/:userId' , ensureAuth , async (req,res) => {
    try{
        const stories = await Story.find({    
            user : req.params.userId,
            status : 'public'
        })
        .populate('user')
        .lean()

        res.render('index' , {
            stories
        })
        
    }
    catch(err) {
        console.log(err);
        res.render('error/500');
    }
})




module.exports = router;