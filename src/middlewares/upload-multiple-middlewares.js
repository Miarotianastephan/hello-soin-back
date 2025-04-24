const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage pour les documents
const docStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'documents');
    
        // Vérifier si le répertoire existe, sinon le créer
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
            return cb(err, uploadPath);
            }
            cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    }
});
  
  // Filtrer les fichiers acceptés (PDF, DOCX, etc.)
const docFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Seuls les fichiers document sont autorisés !"));
    }
};

// Instance Multer pour les documents
const uploadDocs = multer({
    storage: docStorage,
    fileFilter: docFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

module.exports= uploadDocs
  