'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Zap } from 'lucide-react';

const mockImages = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1514525253361-b83f85df6f5c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
];

const highlights = [
  {
    title: 'Live capture',
    description: 'Event-ready media systems designed for fast turnaround.',
  },
  {
    title: 'Production friendly',
    description: 'No beta-only phone mockup or face-search dependency in the launch build.',
  },
  {
    title: 'Service focused',
    description: 'Photography, social, and web support in one streamlined stack.',
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-28">
      <div className="absolute -left-20 top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -right-20 bottom-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-secondary/10 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary"
          >
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </div>
            Production-ready creative systems
          </motion.div>

          <h1 className="mb-10 text-6xl font-bold leading-[0.95] tracking-tighter text-white md:text-8xl lg:text-[6rem]">
            Immortalize <br />
            <span className="bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text italic text-transparent">Your Story</span>
          </h1>

          <p className="mb-12 max-w-xl text-xl leading-relaxed text-foreground/70 md:text-2xl">
            Snapvior is a polished launch experience for photography, delivery, and digital growth without the beta-only phone animation.
          </p>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <button className="gradient-primary w-full rounded-full px-10 py-5 text-xl font-bold text-surface-container-lowest transition-all hover:scale-105 hover:brightness-110 active:scale-95 sm:w-auto shadow-[0_0_40px_rgba(202,190,255,0.2)]">
              Build Your Sanctuary
            </button>
            <button className="glass flex w-full items-center justify-center gap-3 rounded-full border border-white/10 px-10 py-5 text-xl font-bold text-white transition-all hover:bg-white/10 sm:w-auto">
              <Zap className="h-5 w-5 text-secondary" />
              Watch Showcase
            </button>
          </div>

          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-12 overflow-hidden rounded-full border-[3px] border-background bg-surface-container-high">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm font-manrope">
              <p className="text-lg font-bold text-white">24,000+</p>
              <p className="lowercase tracking-widest text-foreground/50">Active Sanctuaries</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Launch ready</p>
                <p className="mt-1 text-sm text-foreground/50">Static hero panel, no phone mockup</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="grid gap-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                      <Camera className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wide text-white">{item.title}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-foreground/60">
              The old scrolling phone stack has been removed for the production build.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
);
};


export default Hero;
