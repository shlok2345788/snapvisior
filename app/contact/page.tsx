'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Camera, Play, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-background selection:bg-primary/30 selection:text-primary overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <section className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-inter font-bold text-white mb-8 leading-tight">
                Get In <span className="text-primary italic">Touch</span>
              </h1>
              
              <p className="text-xl text-foreground/60 font-manrope mb-12 leading-relaxed">
                Snapvior is here to redefine how you preserve your most cherished memories. 
                Our mission is to blend AI precision with glassmorphic elegance to create 
                digital relics for the modern era.
              </p>

              <div className="space-y-8">
                {/* Email Item */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Email Us</p>
                    <a href="mailto:snapvior23@gmail.com" className="text-xl text-white font-inter font-bold hover:text-primary transition-colors">
                      snapvior23@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary/10 transition-all">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Call Us</p>
                    <a href="tel:+919987527499" className="text-xl text-white font-inter font-bold hover:text-secondary transition-colors">
                      +91 99875 27499
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Social & Links */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass p-10 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden shadow-2xl"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-inter font-bold text-white mb-8">Follow Our Journey</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Instagram Card */}
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer h-40 flex flex-col justify-between">
                    <Camera className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-white font-bold">Instagram</p>
                      <p className="text-xs text-foreground/40 font-manrope">@snapvior.gallery</p>
                    </div>
                  </div>

                  {/* YouTube Card */}
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-secondary/20 hover:bg-secondary/5 transition-all group cursor-pointer h-40 flex flex-col justify-between">
                    <Play className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-white font-bold">YouTube</p>
                      <p className="text-xs text-foreground/40 font-manrope">Snapvior Official</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-8 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <MessageSquare className="w-6 h-6 text-white/40" />
                      <span className="text-white font-bold">Live Chat Support</span>
                   </div>
                   <ArrowRight className="w-5 h-5 text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
