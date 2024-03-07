import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config({ path: "./config/config.env" });
          
cloudinary.config({ 
  cloud_name: 'dh12ax7cz', 
  api_key: '535164961237435', 
  api_secret: 'A8ajNbWo19l2k6Qo3-CWRT9SOc4' 
});

export default cloudinary