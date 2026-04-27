'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, LayoutGrid, Heart } from 'lucide-react';

// Re-defining Relive since I don't have a specific Lucide icon named Relive
const Relive = (props: any) => <Zap {...props} />;

const features = [
  {
    icon: Camera,
    title: 'Snap',
    description: 'Lightning-fast uploads with auto-categorization for effortless organization.',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    icon: Relive,
    title: 'Relive',
    description: 'Experience your events in high-definition brilliance with our cinematic galleries.',
    color: 'from-purple-400 to-pink-400'
  },
  {
    icon: LayoutGrid,
    title: 'Master',
    description: 'Take full control with powerful curation tools and AI-driven enhancements.',
    color: 'from-primary to-primary-container'
  },
  {
    icon: Heart,
    title: 'Savor',
    description: 'Keep the memories forever with secure, long-term digital preservation.',
    color: 'from-secondary to-teal-400'
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-surface-container-low/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-inter font-bold text-white mb-6"
          >
            Memories in <span className="text-secondary italic">Motion</span>
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground/60 font-manrope"
          >
            The Snapvior suite provides everything you need to transform a collection of photos 
            into a living, breathing story of your most important events.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-3xl glass border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.08]"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] mb-6 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full rounded-2xl bg-surface-container-high flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-inter font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-foreground/60 font-manrope leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
