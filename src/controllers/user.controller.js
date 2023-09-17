const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail')
const EmailCode = require('../models/EmailCode');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { firstName, lastName, email, password, country, image, frontBaseUrl } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
        firstName, 
        lastName, 
        email, 
        password: encryptedPassword,
         country, 
         image 
    });

    const code = require('crypto').randomBytes(32).toString("hex");
    const link = `${frontBaseUrl}/auth/verify_email/${code}`;

    await EmailCode.create({
        code,
        userId: result.id,
      });

    await sendEmail({
    to: email,
    subject: "Verificate email for user app",
    html: `
      <h1>Hello ${firstName} ${lastName}</h1>
      <b>Thanks for signing up in user app</b> <br>
      <a href="${link}">${link}</a>
    `

  });
   
    return res.status(201).json(result);
});



const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const verifyEmail = catchError(async (req, res) => {
    const { code } = req.params;
    const emailCode = await EmailCode.findOne({ where: { code } });
    if (!emailCode) return res.status(401).json({ message: "Invalid code" });
    const user = await User.update(
      { isVerified: true }, 
      { where: { id: emailCode.userId }, returning: true }
    );
    await emailCode.destroy();
    return res.json(user);
  });

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    verifyEmail
   
}