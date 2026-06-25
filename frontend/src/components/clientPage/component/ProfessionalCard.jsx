import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaBuilding, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfessionalCard = ({ professional }) => {
  const { name, role, description, image, email, companyName, phone } = professional;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="bg-base-100 border border-base-content/10 rounded-3xl transition-all duration-300 ease-in-out h-full flex flex-col overflow-hidden group hover:border-primary/30"
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Soft, premium gradient header */}
        <div className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 h-28 transition-all duration-500 group-hover:h-32"></div>
        
        <motion.figure 
          className="px-8 -mt-14 relative z-10 flex justify-center"
          animate={{ scale: isHovered ? 1.02 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {image ? (
            <img 
              src={image} 
              alt={`Photo of ${name}`} 
              className="rounded-full w-28 h-28 object-cover ring-4 ring-base-100 transition-all duration-300 group-hover:ring-primary/20" 
            />
          ) : (
            <div className="rounded-full w-28 h-28 bg-base-200 flex items-center justify-center ring-4 ring-base-100 transition-all duration-300 group-hover:ring-primary/20">
              <FaUserCircle className="text-6xl text-base-content/20" />
            </div>
          )}
        </motion.figure>
      </div>

      <div className="flex flex-col flex-grow p-8 pt-4 items-center text-center">
        <motion.h2 
          className="text-base-content font-bold text-xl tracking-tight"
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {name}
        </motion.h2>
        
        <div className="flex flex-col items-center gap-3 mt-2 mb-4">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            {role}
          </span>
          {companyName && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/60">
              <FaBuilding className="text-base-content/40" />
              <span>{companyName}</span>
            </div>
          )}
        </div>
        
        <motion.p 
          className="text-base-content/70 text-sm leading-relaxed flex-grow mt-2"
          animate={{ opacity: isHovered ? 1 : 0.85 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>

        <div className="mt-6 w-full flex flex-col gap-3">
          {email && (
            <motion.a 
              href={`mailto:${email}`}
              className="btn btn-primary rounded-full btn-sm gap-2 w-full font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEnvelope className="opacity-80" /> <span>Contact</span>
            </motion.a>
          )}
          {phone && (
            <motion.a
              href={`tel:${phone}`}
              className="btn btn-outline border-base-content/20 text-base-content hover:bg-base-content/5 hover:border-base-content/30 rounded-full btn-sm gap-2 w-full font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPhone className="opacity-70" /> <span>{phone}</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessionalCard;
