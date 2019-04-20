module.exports = (to, title) => {
  return {
    from: ` DLG <${process.env.EMAIL}>`, // sender address
    to: to, // list of receivers
    subject: "Nouveau titre dans la playlist", // Subject line
    html: `<p>${title} à été ajouté à la playlist.</p><br>
    <p>Si vous ne souhaitez pas recevoir de notification, pensez à désactiver cette option dans votre profil</p>`
  };
};
