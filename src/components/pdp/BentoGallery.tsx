"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Images, Rotate3d, X } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";

interface BentoGalleryProps {
  images: string[];
  title: string;
  has3dTour?: boolean;
  onLaunch3d?: () => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

export const BentoGallery: React.FC<BentoGalleryProps> = ({ images, title, has3dTour = false, onLaunch3d }) => {
  const photos = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setLightboxOpen(true);
  };
  const step = (delta: number) => setIndex((prev) => (prev + delta + photos.length) % photos.length);
  const thumbs = photos.slice(1, 5);

  return (
    <div className="flex flex-col gap-2">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2">
        <button type="button" onClick={() => openAt(0)} className="absolute inset-0 cursor-zoom-in" aria-label="Open photo gallery">
          <img src={photos[0]} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        </button>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
          {has3dTour && onLaunch3d ? (
            <button type="button" onClick={onLaunch3d} className="btn btn-sm pointer-events-auto bg-white/95 text-ink shadow-md hover:bg-white">
              <Rotate3d className="h-4 w-4 text-brand" />
              3D walkthrough
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={() => openAt(0)} className="btn btn-sm pointer-events-auto bg-white/95 text-ink shadow-md hover:bg-white">
            <Images className="h-4 w-4" />
            All {photos.length} photos
          </button>
        </div>
      </div>

      {thumbs.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbs.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => openAt(i + 1)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2 cursor-zoom-in"
              aria-label={`Open photo ${i + 2}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} title={`${title} — photos`} bare variant="fullscreen">
        <div
          className="flex h-full flex-col p-4 sm:p-6"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <div className="flex items-center justify-between gap-4 text-sm text-white/80">
            <span className="tabular-nums">
              {index + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/10 cursor-pointer"
              aria-label="Close gallery"
              autoFocus
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative my-4 flex min-h-0 flex-1 items-center justify-center">
            <img src={photos[index]} alt={`${title} — photo ${index + 1}`} className="max-h-full max-w-full rounded-lg object-contain" />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-0 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 cursor-pointer sm:left-4"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-0 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 cursor-pointer sm:right-4"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto">
            {photos.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-md transition-opacity cursor-pointer ${
                  i === index ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
