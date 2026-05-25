import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, GitFork, Link2, MapPin, Send, ArrowUpRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { contact } from '../data/portfolio';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const contactLinks = [
  { icon: Mail,   label: 'Email',    value: contact.email,                  href: `mailto:${contact.email}` },
  { icon: GitFork,label: 'GitHub',   value: 'github.com/vansrzb',           href: contact.github },
  { icon: Link2,  label: 'LinkedIn', value: 'linkedin.com/in/vansrzb',      href: contact.linkedin },
  { icon: MapPin, label: 'Location', value: contact.location,               href: null },
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus('sent');
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionHeading label="// 05. Let's Connect" title="Contact" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left — message */}
        <motion.div variants={fadeUpVariants} custom={1}>
          <h3 className="font-display font-bold text-2xl text-white mb-4">
            Ready to build something{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              great
            </span>
            ?
          </h3>
          <p className="text-slate-400 leading-relaxed mb-8">
            Whether you're looking for a systems analyst, a junior software engineer, or just want to geek out about tech —
            my inbox is always open. Let's talk.
          </p>

          <div className="space-y-4">
            {contactLinks.map(({ icon: Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                variants={fadeUpVariants}
                custom={i + 2}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shrink-0">
                  <Icon size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-600 text-xs font-mono uppercase tracking-wider">{label}</p>
                  {href ? (
                    <a href={href} className="text-slate-300 text-sm hover:text-blue-400 transition-colors flex items-center gap-1 group/link">
                      {value}
                      <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <p className="text-slate-300 text-sm">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — email form */}
        <motion.div variants={fadeUpVariants} custom={2}>
          <div className="card-glass rounded-2xl p-7">
            <div className="flex gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="font-mono text-xs text-slate-600 ml-2">new_message.ts</span>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-1.5 uppercase tracking-wider">Name</label>
                <input
                  name="from_name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full bg-navy-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  name="from_email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-navy-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-1.5 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full bg-navy-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none font-mono"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
              >
                <Send size={14} />
                {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message Sent!' : 'Send Message'}
              </motion.button>

              {status === 'error' && (
                <p className="text-red-400 text-xs font-mono text-center mt-2">
                  Something went wrong. Try emailing me at{' '}
                  <a href={`mailto:${contact.email}`} className="underline hover:text-red-300">
                    {contact.email}
                  </a>
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}