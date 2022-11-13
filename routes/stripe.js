const express = require('express');
// const app = express();
require("dotenv").config();

// 
// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').load();
// }
// 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // fix this issue
// const bodyParser = require("body-parser");
const cors = require("cors");

// console.log(`secret key is ${process.env.STRIPE_SECRET_KEY}`); // works

const router = new express.Router();

/*
router.post('/payment', cors(), async (req, res) => {
  console.log("stripe-routes.js 9 | route reached", req.body);
    let { amount, id } = req.body;
//   let {amount, id, firstName, lastName, phone} = req.body;

//   amount: 999, // make this dynamic
//   id: id,
//   firstName: "Nabin",
//   lastName: "Niroula",
//   phone: '720-499-3220'
//   console.log("stripe-routes.js 10 | amount and id", amount, id);
    console.log(`Amount and Id are ${amount}, ${id}`);
    // console.log(`INfo from UI is ${amount}, ${id}, ${firstName}, ${lastName}, ${phone}`);
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment); // check this in console
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    // console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});
*/


router.post('/payment', cors(), async (req, res) => {
    console.log('ARRIVED IN server !!!!!!');

    //   const { token, amount } = req.body;
    const { token, amount } = req.body;
        console.log(`Token ID is ======== ${token.id}`);
        console.log(`amount is ${amount}`);
        console.log(`req body is ${req.body}`);
        console.log(`Email in req body is ${token.email}`); // works
        console.log(` Token Name is ${token.billingAddress.name}`);
        console.log(`Body name is ${req.body.name}`);
        console.log(`Token address is ${token.billingAddress}`);
        console.log(req.body.billingAddress)
        console.log(`token billing add ${token.billingAddress['state']}`);

    try {
        await stripe.charges.create({source: token.id, amount, currency: 'USD'});
        Status = "success"
        // console.log(Status);
    } catch (error) {
      // console.log("stripe-routes.js 17 | error", error);
      Status = "Failure"
        res.json({error, Status});
    }
  });


module.exports = router;