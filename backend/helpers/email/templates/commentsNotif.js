module.exports = (to, post, user) => {
  return {
      from: ` DLG <${process.env.EMAIL}>`, // sender address
      to: to, // list of receivers
      subject: "Nouveau commentaire", // Subject line
      html: `<p>${user} à repondu à votre post '${post}'</a> </p>`
  };
};
