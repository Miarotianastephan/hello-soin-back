const { Speciality } = require('../models');

exports.findAll = async () => {
  const data = await Speciality.findAll();
  return data;
};

exports.findDesignationById = async (id) => {
  return Speciality.findByPk(id, {
    attributes: ['designation']
  });
};

// ✨ Nouvelle méthode : créer une spécialité
exports.create = async (payload) => {
  // payload devrait contenir au minimum { designation: '...' }
  const newSpec = await Speciality.create(payload);
  return newSpec;
};
