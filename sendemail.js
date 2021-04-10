"use strict";
const nodemailer = require("nodemailer");
const fs = require('fs');

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();
  let readContent = process.argv[2];
  let cmdArgs = JSON.parse(readContent);
  const toEmails = fs.readFileSync(cmdArgs.to.emailAddressPath, 'utf8').split(/\r?\n/);
  //console.log(toEmails);
  if(toEmails && toEmails.length>0) {
  toEmails.map(ele=> ele.trim());
  if(cmdArgs.from.username && cmdArgs.from.password) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
//        service: 'gmail',
   auth: {
      user: cmdArgs.from.username, // generated ethereal user
      pass: cmdArgs.from.password, // generated ethereal password
    },
  });
 
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: cmdArgs.from.displayname+'<' + cmdArgs.from.username+'>',//'"K K Naidu" <kknaidumailbox@gmail.com>', // sender address
    to: toEmails, // list of receivers
    subject: cmdArgs.subject, // Subject line
    html: await fs.readFileSync(cmdArgs.mailContentFilepath, 'utf8')
  //   attachments: [{   // file on disk as an attachment
  //     filename: 'text3.txt',
  //     path: cmdArgs.mailContentFilepath // stream this file
  // }]
  });

  console.log("Email sent: %s", info.messageId);
} else {
  console.warn('invalid from email or password');
}
} else {
  console.warn('Email list is empty');
}
}

main().catch(console.error);