const { 
    Speciality,
    PractSpeciality
} = require('../models');

exports.findAll = async() => {
    const data = await Speciality.findAll();
    return data;
}

// New: Fetch only the 'designation' attribute by primary key
exports.findDesignationById = async (id) => {
    return Speciality.findByPk(id, {
      attributes: ['designation']
    });
  };