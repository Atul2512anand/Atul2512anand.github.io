import React from 'react';
import { Github, Linkedin, Mail, Phone, Send, MapPin } from 'lucide-react';
import { PROFILE } from '../constants';

const Contact: React.FC = () => {
  const meta = PROFILE.meta;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const subject = String(form.get('subject') || 'Portfolio enquiry');
    const message = String(form.get('message') || '');
    const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');
    window.location.href = `mailto:${meta.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
          <p className="text-gray-600">Reach out for collaborations or just a friendly hello</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl overflow-hidden shadow-xl">
          
          {/* Left: Info Panel */}
          <div className="w-full lg:w-5/12 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

            <div>
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm mb-1">Location</p>
                    <p className="font-semibold text-lg">{meta.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white/10 rounded-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm mb-1">Call Me</p>
                    <a href={`tel:${meta.phone.replace(/\s+/g, '')}`} className="font-semibold text-lg hover:text-secondary transition-colors">
                      {meta.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white/10 rounded-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm mb-1">Email Me</p>
                    <a href={`mailto:${meta.email}`} className="font-semibold text-lg break-all hover:text-secondary transition-colors">
                      {meta.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-indigo-200 mb-4">Follow me</p>
              <div className="flex gap-4">
                {meta.links.github && (
                  <a href={meta.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-all">
                    <Github size={20} />
                  </a>
                )}
                {meta.links.linkedin && (
                  <a href={meta.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-all">
                    <Linkedin size={20} />
                  </a>
                )}
                <a href={`mailto:${meta.email}`} aria-label="Email" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-all">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-7/12 p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-gray-700">Your Name</label>
                  <input 
                    id="contact-name"
                    name="name"
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">Your Email</label>
                  <input 
                    id="contact-email"
                    name="email"
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-sm font-medium text-gray-700">Subject</label>
                <input 
                  id="contact-subject"
                  name="subject"
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  id="contact-message"
                  name="message"
                  rows={4} 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-secondary text-indigo-900 font-bold rounded-lg shadow-lg shadow-yellow-100 hover:shadow-yellow-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Send Message <Send size={18} />
              </button>
              <p className="text-xs text-gray-400">This opens your default email app with the message pre-filled.</p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
