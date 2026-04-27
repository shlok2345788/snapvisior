'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import AccessEventModal from '@/components/AccessEventModal';
import { Mail, MessageCircle, Phone } from 'lucide-react';

const services = [
  {
    title: 'Instant iPhone Delivery',
    description:
      'Our photographers shoot live on iPhone and deliver optimized event photos in seconds, not days.',
  },
  {
    title: 'Pro Camera Coverage',
    description:
      'DSLR and mirrorless camera workflows for premium events, portraits, and brand campaigns.',
  },
  {
    title: 'Social Media Management',
    description:
      'We run your social accounts with content planning, posting, and visual storytelling that drives growth.',
  },
  {
    title: 'Website & App Development',
    description:
      'From booking flows to gallery apps, we build digital products that support your business end-to-end.',
  },
];

const process = [
  {
    step: '01',
    title: 'Shoot Live',
    description: 'Snapvisor photographers capture your event on iPhone and camera setups.',
  },
  {
    step: '02',
    title: 'Deliver in Seconds',
    description: 'Images are selected, optimized, and delivered rapidly for instant use and sharing.',
  },
  {
    step: '03',
    title: 'Scale Your Brand',
    description: 'We convert event content into social media assets and digital experiences.',
  },
];

const phoneImages = [
  {
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80',
    alt: 'Wedding stage with lights',
  },
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80',
    alt: 'Brand launch event crowd',
  },
  {
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=500&q=80',
    alt: 'Concert performance moment',
  },
  {
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80',
    alt: 'Live stage with audience energy',
  },
  {
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80',
    alt: 'People celebrating at event',
  },
  {
    src: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=500&q=80',
    alt: 'Night event lights and mood',
  },
];

export default function HomeClient() {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const phoneYRaw = useTransform(scrollYProgress, [0, 0.45], [12, 52]);
  const phoneY = useSpring(phoneYRaw, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001,
  });
  const phoneFeedYRaw = useTransform(scrollYProgress, [0, 0.4, 0.9], [0, -180, -460]);
  const phoneFeedY = useSpring(phoneFeedYRaw, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#fffdf7] text-[#1f1b16]">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#ff6a3d] via-[#f9ad39] to-[#00a6a6]"
        style={{ scaleX }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,202,122,0.35),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(0,166,166,0.18),transparent_38%),radial-gradient(circle_at_40%_90%,rgba(255,106,61,0.16),transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#8e7f6b33_1px,transparent_1px),linear-gradient(to_bottom,#8e7f6b33_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-10">
        <Link href="/" className="relative block h-14 w-36 sm:h-16 sm:w-44 md:h-20 md:w-56" aria-label="Snapvisor home">
          <Image
            src="/snapvisor.png"
            alt="Snapvisor logo"
            fill
            priority
            sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 224px"
            className="object-contain object-left"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <a href="#services" className="transition hover:text-[#ff6a3d]">Services</a>
          <a href="#process" className="transition hover:text-[#ff6a3d]">How It Works</a>
          <a href="#contact" className="transition hover:text-[#ff6a3d]">Contact</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAccessModalOpen(true)}
            className="rounded-full bg-[#1f1b16] px-3 py-2 text-xs font-bold text-[#fffdf7] transition hover:bg-[#00a6a6] sm:px-5 sm:text-sm"
          >
            Access Event
          </button>
          <a
            href="https://wa.me/919987527499?text=Hi%20Snapvisor!%20I%20would%20like%20to%20book%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#2c2016] px-3 py-2 text-xs font-bold transition hover:bg-[#2c2016] hover:text-[#fffdf7] sm:px-5 sm:text-sm"
            aria-label="Book now via WhatsApp"
          >
            Book Now
          </a>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-7"
        >
          <p className="inline-flex rounded-full border border-[#f2d9bc] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8d4b33]">
            Instant Event Media System
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.03] tracking-tight text-[#20140d] md:text-6xl">
            We Shoot. You Post.
            <span className="block text-[#ff6a3d]">Photos Delivered in Seconds.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#58483b] md:text-lg">
            Snapvisor combines real-time event photography, camera-grade production, social media management,
            and website/app development. One team for content, delivery, and growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/919987527499?text=Hi%20Snapvisor!%20I%20would%20like%20to%20book%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#1f1b16] px-7 py-3 text-sm font-extrabold uppercase tracking-wide text-[#fffdf7] transition hover:bg-[#ff6a3d]"
              aria-label="Start your project via WhatsApp"
            >
              Start Your Project
            </a>
            <a
              href="#services"
              className="rounded-full border border-[#d8b998] bg-white/70 px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#2b2016] transition hover:border-[#ff6a3d] hover:text-[#ff6a3d]"
            >
              Explore Services
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{ y: phoneY, rotate: 0 }}
          className="relative flex items-center justify-center"
        >
          <div className="pointer-events-none absolute -right-4 top-6 h-56 w-56 rounded-full bg-[#ffdcbf] blur-3xl" />
          <div className="relative mx-auto h-[430px] w-[230px] rounded-[2.3rem] border border-[#e8d0b6] bg-[#20140d] p-2 shadow-[0_25px_45px_rgba(32,20,13,0.32)]">
            <div className="h-full overflow-hidden rounded-[1.8rem] bg-[#fff7ec] p-2.5">
              <motion.div
                className="space-y-2.5"
                style={{ y: phoneFeedY }}
              >
                {[...phoneImages, ...phoneImages].map((item, index) => (
                  <div key={`${item.src}-${index}`} className="overflow-hidden rounded-xl border border-[#f1dbc4] bg-white shadow-sm">
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#3b2a1d]" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-[#f1d9be] bg-[#fff3df] px-5 py-4 text-sm font-bold text-[#8d4b33] shadow-lg">
            iPhone + Camera Hybrid Team
          </div>
        </motion.div>
      </section>

      <section id="services" className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tight text-[#23170f] md:text-4xl">Everything You Need, Under One Roof</h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#5f4c3e] md:text-base">
            Built for photographers, creators, event agencies, and businesses that need fast delivery plus long-term digital growth.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-3xl border border-[#ecd8c2] bg-white/80 p-6 shadow-[0_10px_40px_rgba(146,95,57,0.08)]"
            >
              <h3 className="mb-3 text-xl font-black text-[#2b1e13]">{service.title}</h3>
              <p className="text-sm leading-relaxed text-[#5a483a] md:text-base">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10">
        <div className="rounded-[2rem] border border-[#efd7bc] bg-[#2a1e14] p-8 text-[#fff8ef] md:p-12">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">How Snapvisor Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="rounded-2xl border border-[#4f3c2c] bg-[#332517] p-5"
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f5c899]">Step {item.step}</p>
                <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#efddcb]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 md:px-10">
        <div className="rounded-3xl border border-[#eac9a9] bg-gradient-to-r from-[#ffefe0] via-[#fff8ed] to-[#e9fffe] p-8 md:p-12">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-[#2a1c12] md:text-5xl">
            Need a photo team that delivers in real time and builds your digital presence too?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5f4a39]">
            Tell us your event date, content goals, and business scope. We will craft a custom Snapvisor plan for photography, social media, and product development.
          </p>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <a
              href="mailto:snapvisor23@gmail.com"
              className="flex items-center gap-3 rounded-2xl border border-[#e7c9ac] bg-white/80 px-4 py-3 text-sm font-semibold text-[#2a1c12] transition hover:border-[#ff6a3d]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff3e4] text-[#ff6a3d]">
                <Mail className="h-4 w-4" />
              </span>
              snapvisor23@gmail.com
            </a>
            <a
              href="tel:+919987527499"
              className="flex items-center gap-3 rounded-2xl border border-[#e7c9ac] bg-white/80 px-4 py-3 text-sm font-semibold text-[#2a1c12] transition hover:border-[#ff6a3d]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff3e4] text-[#ff6a3d]">
                <Phone className="h-4 w-4" />
              </span>
              +91 99875 27499
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-dashed border-[#e7c9ac] bg-white/70 px-4 py-3 text-sm font-semibold text-[#7a5c47] transition hover:border-[#ff6a3d]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff3e4] text-[#ff6a3d]">
                <MessageCircle className="h-4 w-4" />
              </span>
              Add Instagram Handle
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://wa.me/919987527499?text=Hi%20Snapvisor!%20I%20would%20like%20to%20get%20a%20proposal%20for%20my%20event."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#ff6a3d] px-7 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-[#de5428]"
              aria-label="Get proposal via WhatsApp"
            >
              Get Proposal
            </a>
            <Link
              href="/worker/login"
              className="rounded-full border border-[#2a1c12] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#2a1c12] transition hover:bg-[#2a1c12] hover:text-white"
            >
              Team Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ebcfb4] bg-[#fff6ea]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:px-10">
          <div>
            <p className="text-lg font-black tracking-tight text-[#2a1c12]">SNAPVISOR</p>
            <p className="mt-1 text-sm text-[#6b5544]">Instant photography delivery and digital growth services.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAccessModalOpen(true)}
              className="rounded-full bg-[#1f1b16] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#00a6a6]"
            >
              Access Event
            </button>
            <Link
              href="/worker/login"
              className="rounded-full border border-[#2a1c12] px-5 py-2 text-sm font-bold text-[#2a1c12] transition hover:bg-[#2a1c12] hover:text-white"
            >
              Worker Login
            </Link>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-20 right-5 z-[70] flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="rounded-2xl border border-[#edd4bb] bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#2a1c12] shadow-[0_10px_25px_rgba(42,28,18,0.16)]"
        >
          How Snapvisor can help you
        </motion.div>

        <motion.a
          href="https://wa.me/919987527499?text=Hi%20Snapvisor!%20I%20would%20like%20to%20book%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="rounded-full border border-white/40 bg-[#25d366] p-3 text-white shadow-[0_14px_30px_rgba(37,211,102,0.35)] backdrop-blur-md transition-all hover:scale-110 hover:bg-[#1da851]"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.a>
      </div>

      <AccessEventModal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} />
    </main>
  );
}
