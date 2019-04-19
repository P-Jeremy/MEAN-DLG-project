module.exports = (to, post, comment, user) => {
  return {
    from: ` DLG <${process.env.EMAIL}>`, // sender address
    to: to, // list of receivers
    subject: "Nouveau commentaire", // Subject line
    html: `<p>${user} à repondu: "${comment}"<br> à votre post: "${post}" </p><br>
    <p>Si vous ne souhaitez pas recevoir de notification, pensez à désactiver cette option dans votre profile</p>`
  };
};
