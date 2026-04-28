import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Footer } from '@/components/Footer';
import { Camera, Grid3X3, ArrowLeft, WifiOff, CalendarDays, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getB2SignedReadUrl } from '@/lib/b2';

interface GalleryPageProps {
  params: {
    code: string;
  };
}

import GalleryClient from '@/components/GalleryClient';

function isDatabaseUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("Can't reach database server") ||
    error.message.includes('PrismaClientInitializationError') ||
    error.message.includes('P1001')
  );
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { code } = await params;

  let event: Prisma.EventGetPayload<{ include: { media: true } }> | null = null;
  let dbUnavailable = false;

  try {
    event = await prisma.event.findUnique({
      where: { code },
      include: {
        media: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      dbUnavailable = true;
    } else {
      throw error;
    }
  }

  if (dbUnavailable) {
    return (
      <main className="min-h-screen bg-[#f9f3ea] text-[#1f1b16]">
        <section className="px-6 pb-24 pt-16">
          <div className="mx-auto max-w-4xl">
            <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[#6e5a48] transition hover:text-[#1f1b16]">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <div className="rounded-[2rem] border border-[#e7cdb0] bg-white/80 p-8 shadow-[0_20px_60px_rgba(90,60,30,0.08)] md:p-12">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe8d2] text-[#ff6a3d]">
                <WifiOff className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#281b12] md:text-5xl">Gallery is temporarily unavailable</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6d5948]">
                We are currently unable to connect to the photo database. Please try again in a moment.
                Your event code <span className="font-bold text-[#3b2b1f]">{code}</span> is safe and will work once the service reconnects.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#1f1b16] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#ff6a3d]"
                >
                  Contact Support
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-[#2a1c12] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#2a1c12] transition hover:bg-[#2a1c12] hover:text-white"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  if (!event) {
    notFound();
  }

  const media = await Promise.all(
    event.media.map(async (item) => ({
      id: item.id,
      url: await getB2SignedReadUrl(item.url),
    }))
  );

  return (
    <main className="min-h-screen bg-[#f9f3ea] text-[#1f1b16] selection:bg-[#ff6a3d]/20">
      <section className="relative overflow-hidden px-6 pb-12 pt-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(255,194,143,0.35),transparent_42%),radial-gradient(circle_at_90%_25%,rgba(0,166,166,0.18),transparent_35%)]" />
        
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-[#705b49] transition hover:text-[#1f1b16]">
             <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe8d2]">
                    <Camera className="h-5 w-5 text-[#ff6a3d]" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest text-[#a55f3f]">Snapvisor Event Gallery</span>
              </div>
              <h1 className="mb-3 text-4xl font-black tracking-tight text-[#22160d] md:text-6xl">
                {event.name}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[#5f4d3f] md:text-lg">
                Instant memories from your event. Browse and download moments that matter.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e6ccb0] bg-white/85 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8e6d54]">Photos</p>
                <p className="mt-1 text-xl font-black text-[#2a1c12]">{event.media.length}</p>
              </div>
              <div className="rounded-2xl border border-[#e6ccb0] bg-white/85 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8e6d54]">Event Code</p>
                <p className="mt-1 text-xl font-black text-[#2a1c12]">{code}</p>
              </div>
              <div className="rounded-2xl border border-[#e6ccb0] bg-white/85 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8e6d54]">Status</p>
                <p className="mt-1 text-xl font-black text-[#0e7b62]">Live</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
           {event.media.length === 0 ? (
             <div className="rounded-[2rem] border-2 border-dashed border-[#e5c8aa] bg-white/75 py-28 text-center">
                <Grid3X3 className="mx-auto mb-5 h-12 w-12 text-[#c09371]" />
                <h3 className="text-2xl font-black text-[#2a1c12]">Gallery is being prepared</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#6d5948]">Uploads are in progress. Please check back soon for the latest captures.</p>
                <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-[#fff4e7] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#a36544]">
                  <ImageIcon className="h-4 w-4" /> Syncing media
                </div>
             </div>
           ) : (
             <GalleryClient eventCode={code} initialMedia={media} />
           )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
