'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Camera, Play, ArrowRight } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[3rem] border-white/10 p-12 md:p-20 relative overflow-hidden">
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-inter font-bold text-white mb-6 leading-tight"
              >
                Let's Make Your <br />
                <span className="text-primary italic">Events Unforgettable</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-foreground/60 font-manrope mb-12 max-w-md"
              >
                Ready to bring Snapvior to your next event? Get in touch with us for partnerships, 
                premium access, or just to say hello.
              </motion.p>

              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl glass border-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <a href="mailto:snapvior23@gmail.com" className="text-white font-inter font-bold hover:text-primary transition-colors">
                    snapvior23@gmail.com
                  </a>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 }}
                   className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl glass border-white/5 flex items-center justify-center group-hover:bg-secondary/10 transition-all">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <a href="tel:+919987527499" className="text-white font-inter font-bold hover:text-secondary transition-colors">
                    +91 99875 27499
                  </a>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-8 rounded-3xl glass border-white/5 hover:border-primary/20 transition-all group flex flex-col justify-between h-48"
              >
                <Camera className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white font-bold">Instagram</p>
                  <p className="text-xs text-white/40 font-manrope">@snapvior.gallery</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="p-8 rounded-3xl glass border-white/5 hover:border-secondary/20 transition-all group flex flex-col justify-between h-48"
              >
                <Play className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white font-bold">YouTube</p>
                  <p className="text-xs text-white/40 font-manrope">Snapvior Official</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="col-span-2 p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-white font-bold">Inquire Now</span>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
