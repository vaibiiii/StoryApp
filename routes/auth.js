const express = require('express');
const router = express.Router();
const passport = require('passport');

//Description of Route => Authenticate with Google
router.get('/google', passport.authenticate('google',{scope : ['profile','email']}))

//Description of Route => Google auth Callback 
//GET request to /auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', {  failureRedirect: '/' }),
  function(req, res) {
    console.log('Auth Routes callback')
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});

// Description => For LogOut
router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})


module.exports = router;