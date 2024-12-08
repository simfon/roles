const nodemailer = require('nodemailer');

const sendRegistration = (address, code) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: '',
    },
  });

  const htmlBody = `
  <center><h2><a img="https://www.roles.pw/img/logos/dicePink128.png"><br/>
  Roles.pw</h2><br/>
  <p>Grazie per  la vostra iscrizione. Per procedere con l'attivazione dell'account<br/>seguite il link sottostante<br/>
  <a href="http://role-gdr-app.herokuapp.com/verify/${code}">Verifica Account</a></center>`;

  /*   const tempBody = `<body background="black"><white>
  <center><a img="http://roles.pw/img/logos/dicePink128.png"><br/>
  Roles.pw<br/>
  <p>Grazie per  la vostra iscrizione. Il vostro Account è già attivo,
  la conferma degli account è temporaneamente sospesa nella fase alpha.</center></white></body>`;
  */

  const mailOptions = {
    from: '', // sender address
    to: address, // list of receivers
    subject: '', // Subject line
    html: htmlBody,
  };

  transporter.sendMail(mailOptions);
};

module.exports = sendRegistration;
