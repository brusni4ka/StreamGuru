const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: '___',
    auth: {
        user: '___',
        pass: '___'
    }
});

const getMailOptions = ({
    receiver,
    message=''
}) => ({
    from: 'streamguru@email.com', // sender address
    subject: 'password', // Subject line
    to: receiver,
    html: `<p>Hi there, it is seem like you forget your password></p></br></br>
        <p>Here you are ${message}</p>`// plain text body
})


module.exports = function (receiver, message) {
    transporter.sendMail(getMailOptions({receiver, message}), (err, info) => {
        if(err)
            console.log(err)
        else
            console.log(info);
    });
}