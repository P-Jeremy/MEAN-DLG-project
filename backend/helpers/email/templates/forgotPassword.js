module.exports = (to, url) => {
  return {
      from: ` DLG <${process.env.EMAIL}>`, // sender address
      to: to, // list of receivers
      subject: "Demande de nouveau mot de passe", // Subject line
      html: `<p>Modifiez votre mot de passe cliquant sur le lien suivant : <a href="${url}">CLIQUEZ ICI</a> </p>`
  };
};
