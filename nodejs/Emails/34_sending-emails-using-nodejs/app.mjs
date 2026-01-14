import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "anuragprocodrr@gmail.com",
    pass: "tstw irvt aoyo tnja",
  },
});

const info = await transporter.sendMail({
  from: "Anurag Singh <anuragprocodrr@gmail.com>",
  to: "contact@procodrr.com",
  subject: "Hello World 2",
  html: `<h2 style="color: orange;">Hello world?</h2>`,
});

console.log("Message sent: %s", info.messageId);
