const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser  = require('body-parser');
const nodemailer  = require('nodemailer');

app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use('/sendEmail', (req, res, next)=>{
    let body = req.body;
    let email = req.headers.email;
    let password = req.headers.password;
    let service = req.headers.service;
    let custom = req.headers.custom;
    console.log(email)
    console.log(body.content)
    let transporter;
    if(service === "gmail"){
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        })
    }
    else if(service === 'custom'){
        transporter = nodemailer.createTransport({
            host: `mail.${custom}`,
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        })
    }else{
        res.send({status: 'service not correct'})
    }

    let message = {
        from: email,
        to: body.email,
        subject: body.subject,
        html: `<p>${body.content}</p>`
    }

    transporter.sendMail(message, (error, info)=>{
        if(error){
            console.log(error);
            res.send({status: 'not', email: body.email, content: body.content});
        }else{
            res.send({status: 'done'})
        }
    })

})


app.listen(3004, ()=>{
    console.log('The Server Is Started')
})