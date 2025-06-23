import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaBuilding, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfessionalCard = ({ professional }) => {
  const { name, role, description, image, email, companyName, phone } = professional;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out h-full flex flex-col overflow-hidden group"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-24 transition-all duration-300 group-hover:h-32"></div>
        <motion.figure 
          className="px-10 -mt-12 relative z-10 "
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {image ? (
            <img 
              src={image} 
              alt={`Photo of ${name}`} 
              className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:border-primary/50" 
            />
          ) : (
            <div className="rounded-full w-32 h-32 bg-base-200 flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 group-hover:border-primary/50">
              <FaUserCircle className="text-6xl text-base-content/30" />
            </div>
          )}
        </motion.figure>
      </div>

      <div className="card-body items-center text-center flex-grow p-6">
        <motion.h2 
          className="card-title text-base-content font-bold text-xl"
          animate={{ y: isHovered ? -2 : 0 }}
        >
          {name}
        </motion.h2>
        
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="badge badge-primary badge-lg text-xs">{role}</div>
          {companyName && (
            <div className="flex items-center gap-1 text-xs text-base-content/70">
              <FaBuilding className="text-primary" />
              <span>{companyName}</span>
            </div>
          )}
        </div>

        <div className="divider my-2"></div>
        
        <motion.p 
          className="text-base-content/80 text-xs flex-grow"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          {description}
        </motion.p>

        <div className="card-actions justify-center mt-4 w-full flex flex-col gap-2">
          {email && (
            <motion.a 
              href={`mailto:${email}`}
              className="btn btn-primary btn-sm gap-2 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope /> <span>Contact</span>
            </motion.a>
          )}
          {phone && (
            <motion.a
              href={`tel:${phone}`}
              className="btn btn-outline btn-primary btn-sm gap-2 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPhone /> <span>{phone}</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessionalCard;
