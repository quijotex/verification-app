const EmailCode = require('./EmailCode');
const User = require('./User');

EmailCode.belongsTo(User);
User.hasOne(EmailCode);  //Relación de 1 a 1