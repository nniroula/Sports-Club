const express = require('express');
require("dotenv").config();

// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').load();
// }

const stripe = require("stripe")(process.env.stripesecretkey);
const cors = require("cors");
const router = new express.Router();

router.post('/payment', cors(), async (req, res) => {
    const { token, amount } = req.body;
    try {
        await stripe.charges.create({source: token.id, amount, currency: 'USD'});
        Status = "success"
    } catch (error) {
      Status = "Failure"
        res.json({error, Status});
    }
  });


module.exports = router;