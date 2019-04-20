module.exports = (to, user) => {
  return {
    from: ` DLG <${process.env.EMAIL}>`, // sender address
    to: to, // list of receivers
    subject: "Nouveau post dans la taverne :)", // Subject line
    html: `<p>${user} à posté dans la taverne </p><br>
    <p>Si vous ne souhaitez pas recevoir de notification, pensez à désactiver cette option dans votre profile</p>`
  };
};
