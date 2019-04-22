module.exports = (to, user, post) => {
  return {
    from: ` DLG <${process.env.EMAIL}>`, // sender address
    to: to, // list of receivers
    subject: "Nouveau post dans la taverne :)", // Subject line
    html: `<p>${user} à posté ${post} dans la taverne </p><br>
    <p>Si vous ne souhaitez pas recevoir de notification, pensez à désactiver cette option dans votre profil</p>`
  };
};
