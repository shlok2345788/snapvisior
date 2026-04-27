'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const images = [
  { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', size: 'large', title: 'Grand Finale' },
  { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', size: 'small', title: 'Summer Fest 2024' },
  { url: 'https://images.unsplash.com/photo-1514525253361-b83f85df6f5c?auto=format&fit=crop&q=80&w=800', size: 'small', title: 'Cozy Acoustics' },
  { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', size: 'medium', title: 'Techno Night' },
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', size: 'small', title: 'Ceremonial Vows' },
];

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section id="gallery" className="section-padding overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-[1px] bg-primary" />
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Experience</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-white">The Spotlight Gallery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[200px]">
          {/* Large Spotlight */}
          <motion.div 
            style={{ y: y1 }}
            className="md:col-span-8 md:row-span-3 rounded-3xl overflow-hidden relative group"
          >
            <img src={images[0].url} alt={images[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white">{images[0].title}</h3>
              <p className="text-white/70">Main Floor Performance</p>
            </div>
          </motion.div>

          {/* Smaller Snapshot 1 */}
          <motion.div 
            style={{ y: y2 }}
            className="md:col-span-4 md:row-span-2 rounded-3xl overflow-hidden relative group"
          >
            <img src={images[1].url} alt={images[1].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white">{images[1].title}</h3>
            </div>
          </motion.div>

          {/* Smaller Snapshot 2 */}
          <motion.div 
            className="md:col-span-4 md:row-span-2 rounded-3xl overflow-hidden relative group"
          >
            <img src={images[2].url} alt={images[2].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </motion.div>

          {/* Medium Snapshot */}
          <motion.div 
            style={{ y: y1 }}
            className="md:col-span-4 md:row-span-2 rounded-3xl overflow-hidden relative group"
          >
            <img src={images[3].url} alt={images[3].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </motion.div>

          {/* Smaller Snapshot 3 */}
          <motion.div 
            style={{ y: y2 }}
            className="md:col-span-4 md:row-span-1 rounded-3xl overflow-hidden relative group"
          >
            <img src={images[4].url} alt={images[4].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
