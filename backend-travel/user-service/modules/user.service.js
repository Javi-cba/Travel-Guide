const userModel = require('../models/MUser');

async function crear(user) {
  try {
    const userGuardado = await userModel.create(user);
    return userGuardado;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

async function findAll() {
  try {
    const resp = await userModel.find();
    return resp;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
}

async function existUserByMail(mail) {
  try {
    const user = await userModel.findOne({ email: mail }).lean();
    return !!user; // Devuelve true si el usuario existe, false si no
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

async function userByMail(mail) {
  try {
    const user = await userModel.findOne({ email: mail });
    return user;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

async function modificar(user) {
  try {
    console.log(user);

    const resp = await userModel.updateOne({ email: user.email }, user);
    return resp;
  } catch (error) {
    console.error('Error al modificar usuario:', error);
    throw error;
  }
}

module.exports = { crear, findAll, existUserByMail, userByMail, modificar };
