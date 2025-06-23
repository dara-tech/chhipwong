import React, { useEffect, useState } from 'react'
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaTwitter, FaTelegram, FaDiscord } from 'react-icons/fa'
import { MdLocationOn, MdPhone, MdEmail, MdArrowForward } from 'react-icons/md'
import { HiOutlineMail } from 'react-icons/hi'
import useCompanies from '../../hooks/useCompanies'

const Footer = () => {
  const { companies, loading, error, getCompanies } = useCompanies()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    getCompanies()
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription logic
    setIsSubscribed(true)
    setEmail('')
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  if (loading) {
    return (
      <footer className="bg-gradient-to-b from-base-200 to-base-300 text-base-content">
        <div className="container mx-auto p-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-48 bg-base-300 rounded"></div>
                <div className="h-4 w-32 bg-base-300 rounded"></div>
                <div className="h-4 w-32 bg-base-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  if (error) {
    return (
      <footer className="bg-gradient-to-b from-base-200 to-base-300 text-base-content p-8">
        <div className="text-center text-error">
          Error loading footer content: {error}
        </div>
      </footer>
    )
  }

  const company = companies[0]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ]

  return (
    <footer className="bg-gradient-to-b from-base-200/50 to-base-300 text-base-content">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {company?.logo && (
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-12 h-12 object-contain rounded-xl bg-base-100/50 p-2 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              )}
              <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{company?.name}</h3>
            </div>
            <p className="text-base-content/70 leading-relaxed">{company?.about}</p>
            <div className="flex gap-4 pt-2">
              {company?.socialMedia?.facebook && (
                <a href={company.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaFacebook className="text-primary" size={20} />
                </a>
              )}
              {company?.socialMedia?.instagram && (
                <a href={company.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaInstagram className="text-primary" size={20} />
                </a>
              )}
              {company?.socialMedia?.youtube && (
                <a href={company.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaYoutube className="text-primary" size={20} />
                </a>
              )}
              {company?.socialMedia?.linkedin && (
                <a href={company.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaLinkedin className="text-primary" size={20} />
                </a>
              )}
              {company?.socialMedia?.twitter && (
                <a href={company.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaTwitter className="text-primary" size={20} />
                </a>
              )}
              {company?.socialMedia?.telegram && (
                <a href={company.socialMedia.telegram} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaTelegram className="text-primary" size={20} />
                </a>
              )}
              {company?.socialMedia?.discord && (
                <a href={company.socialMedia.discord} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-base-100/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <FaDiscord className="text-primary" size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-all duration-300 hover:translate-x-1"
                  >
                    <MdArrowForward className="w-4 h-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100/50 transition-all duration-300">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MdLocationOn className="text-primary w-5 h-5" />
                </div>
                <span className="text-base-content/70">{company?.contact?.address}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100/50 transition-all duration-300">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MdPhone className="text-primary w-5 h-5" />
                </div>
                <span className="text-base-content/70">{company?.contact?.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100/50 transition-all duration-300">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MdEmail className="text-primary w-5 h-5" />
                </div>
                <span className="text-base-content/70">{company?.contact?.email}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Newsletter</h4>
            <p className="text-base-content/70 mb-4">Subscribe to our newsletter for the latest updates and news.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-10 bg-base-100/50 backdrop-blur-sm hover:border-primary focus:border-primary transition-all duration-300"
                  required
                />
                <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              </div>
              <button 
                type="submit"
                className="btn btn-primary w-full hover:btn-secondary transition-all duration-300 shadow-lg hover:shadow-primary/20"
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base-content/70">
              © {new Date().getFullYear()} {company?.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-base-content/70 hover:text-primary transition-all duration-300 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer