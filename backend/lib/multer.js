import multer from 'multer';

const storage = multer.memoryStorage();  // Store files in memory temporarily
const upload = multer({ storage: storage });


export default upload;
