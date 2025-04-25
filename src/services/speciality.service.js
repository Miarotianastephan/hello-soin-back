const { 
    Speciality,
    PractSpeciality
} = require('../models');

exports.findAll = async() => {
    const data = await Speciality.findAll();
    return data;
}

// exports.findSpecialityByPraticien = async(id_user) => {
//     const data = await PractSpeciality.findAll({
//         where:
//     });
// }