"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CircleCheck, Heart, Share } from "lucide-react";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { BentoGallery } from "@/components/pdp/BentoGallery";
import { PropertySummary } from "@/components/pdp/PropertySummary";
import { InspectionRadar } from "@/components/pdp/InspectionRadar";
import { ValuationCard } from "@/components/pdp/ValuationCard";
import { EncumbranceDeedChain } from "@/components/pdp/EncumbranceDeedChain";
import { BuyingProcessCard } from "@/components/pdp/BuyingProcessCard";
import { ThreeTwinViewer } from "@/components/pdp/ThreeTwinViewer";
import { NeighbourhoodIntelligence } from "@/components/pdp/NeighbourhoodIntelligence";
import { ContactActions } from "@/components/pdp/ContactActions";
import { GatedUnlockModal } from "@/components/paywall/GatedUnlockModal";
import { MOCK_PROPERTIES } from "@/data/mockProperties";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = use(params);
  const property = MOCK_PROPERTIES.find((p) => p.slug === slug);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showActionBar, setShowActionBar] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Show the sticky action bar once the summary panel (and its buttons) scrolls out of view.
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowActionBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!property) notFound();

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const scrollToTour = () => document.getElementById("tour")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openUnlock = () => setUnlockModalOpen(true);

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      <div className="h-20" />

      <main className="mx-auto max-w-[1320px] px-4 pb-8 pt-6 sm:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" />
            All homes
          </Link>
          <div className="flex items-center gap-1">
            <button type="button" onClick={handleShare} className="btn btn-sm text-ink hover:bg-surface-2">
              {copiedShare ? <Check className="h-4 w-4 text-verified" /> : <Share className="h-4 w-4" />}
              <span className="underline underline-offset-4">{copiedShare ? "Link copied" : "Share"}</span>
            </button>
            <button type="button" onClick={() => setIsSaved((v) => !v)} aria-pressed={isSaved} className="btn btn-sm text-ink hover:bg-surface-2">
              <Heart className={`h-4 w-4 ${isSaved ? "fill-brand text-brand" : ""}`} />
              <span className="underline underline-offset-4">{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BentoGallery images={property.images} title={property.title} has3dTour={property.has3dTour} onLaunch3d={scrollToTour} />
          </div>
          <div ref={summaryRef} className="lg:col-span-5 lg:self-stretch">
            <PropertySummary
              property={property}
              isUnlocked={isUnlocked}
              onUnlockClick={openUnlock}
              onLaunch3d={property.has3dTour ? scrollToTour : undefined}
            />
          </div>
        </section>

        {/* Two independent stacks so tall and short cards don't leave gaps. */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <InspectionRadar inspection={property.inspection} isUnlocked={isUnlocked} onUnlockReport={openUnlock} />
            <EncumbranceDeedChain
              deedHistory={property.deedHistory}
              ulpin={property.ulpin}
              hasActiveLiens={property.inspection.activeLiens}
              reraNumber={property.reraNumber}
              isUnlocked={isUnlocked}
              onUnlock={openUnlock}
            />
          </div>
          <div className="flex flex-col gap-6">
            <ValuationCard property={property} />
            <BuyingProcessCard property={property} />
            <NeighbourhoodIntelligence neighbourhood={property.neighbourhood} locality={property.locality} city={property.city} />
          </div>
        </div>

        {property.has3dTour && (
          <div id="tour" className="mt-6 scroll-mt-28">
            <ThreeTwinViewer
              rooms={property.spatialRooms}
              propertyTitle={property.title}
              conditionScore={Math.round((property.inspection.scores.composite / 10) * 10) / 10}
              carpetSqft={property.carpetAreaSqft}
              builtUpSqft={property.superBuiltUpAreaSqft}
              efficiency={Math.round((property.carpetAreaSqft / property.superBuiltUpAreaSqft) * 100)}
              orientation={property.facing}
            />
          </div>
        )}

        <section className="panel mt-6 p-6 sm:p-7" aria-labelledby="amenities-heading">
          <p className="eyebrow">Amenities</p>
          <h2 id="amenities-heading" className="mt-1 text-xl font-semibold text-ink">
            What&apos;s included
          </h2>
          <p className="mt-1 text-sm text-muted">Confirmed by our engineer during the inspection.</p>
          <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {property.amenities.map((amenity) => (
              <li key={amenity} className="flex items-start gap-2.5 text-sm text-ink">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                {amenity}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />

      <div
        inert={!showActionBar}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-white/95 backdrop-blur-md transition-transform duration-200 ${
          showActionBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{property.title}</p>
            <p className="text-sm text-muted">
              <span className="font-semibold tabular-nums text-ink">{property.formattedPrice}</span> · 0% brokerage
            </p>
          </div>
          <ContactActions property={property} isUnlocked={isUnlocked} onUnlockClick={openUnlock} compact />
        </div>
      </div>

      <GatedUnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        propertyTitle={property.title}
        ulpin={property.ulpin}
        onSuccess={() => setIsUnlocked(true)}
      />
    </div>
  );
}
