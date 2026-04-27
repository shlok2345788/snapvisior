'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass p-12 md:p-20 rounded-[3rem] border-white/10 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />

          <h2 className="text-4xl md:text-6xl font-inter font-bold text-white mb-8">
            Ready to Build Your <br /> 
            <span className="text-secondary italic">Digital Relic?</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 font-manrope mb-12 max-w-2xl mx-auto">
            Join thousands of event organizers who trust Snapvior to preserve 
            and showcase their most precious moments with cinematic elegance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="gradient-primary w-full sm:w-auto px-10 py-5 rounded-full text-xl font-bold text-surface-container-lowest hover:brightness-110 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
              Get Started for Free
            </button>
            <button className="w-full sm:w-auto px-10 py-5 rounded-full text-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-all">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-6 h-6 rounded-full bg-primary" />
               <span className="text-xl font-inter font-bold text-white uppercase tracking-tighter">Snapvior</span>
            </div>
            <p className="text-sm text-foreground/50 font-manrope">
              Redefining event photography through AI-driven cinematic experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Curator AI</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mobile App</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-white transition-colors text-sm font-manrope">Terms of Service</a></li>
              <li><a href="/worker/login" className="text-primary/60 hover:text-primary transition-colors text-sm font-manrope font-bold">Worker Login</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4 text-xs tracking-widest uppercase text-foreground/30">
          <p>© 2024 Snapvior Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Dribbble</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
