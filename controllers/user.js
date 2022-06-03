const users = require('../model/usermodel');
const { registerValidation, loginValidation } = require('../middlewares/validatebody');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var newOTP = require('otp-generators');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

exports.get_all = async (req, res) => {
    const found = await users.find();
    res.status(200).send(found);
}

exports.user_register = async (req, res) => {

    const { error } = await registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    var otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false });
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const found = await users.findOne({ email: req.body.email })
    if (found != null) return res.status(400).send('This email is already registered please try with another email');

    try {
        var email = req.body.email;
        var mailOptions = {
            from: process.env.email,
            to: email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) return console.log(error);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            const user_data = new users({ "name": req.body.name, "email": req.body.email, "password": hashedPassword, "otp": otp, "activation": false })
            const user1 = await user_data.save()
            res.status(200).json({ message: "Otp is sent to your email.. please verify", data: user1.email })
        });

    } catch (err) { res.status(400).send(err) }

}

exports.verify_otp = async (req, res) => {
    try{
    const found = await users.findOne({ otp: req.body.otp })
    if (found == null) return res.send('otp is incorrect');

    await found.updateOne({ activation: true })
    res.status(200).send("You has been successfully registered and your account is activated.");

    }catch(err){ res.status(400).send(err); }
}

exports.resend_otp = async (req, res) => {
    var email = req.query.email
    var otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false });
    var mailOptions = {
        from: process.env.email,
        to: email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) return res.status(400).send(error);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        const found = await users.findOne({ email: email })
        await found.update({ otp: otp, activation: false })

        res.status(200).send("Otp is sent to your email.. please verify")
    });
}

exports.user_login = async (req, res) => {

    const { error1 } = await loginValidation(req.body);
    if (error1) return res.status(400).send(error.details[0].message);

    const user = await users.findOne({ email: req.body.email })
    if (!(user.activation)) return res.status(400).send('You have not done otp verification');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Email or password is wrong. data not found")

    res.status(200).send("Logged in successfully..");

}

