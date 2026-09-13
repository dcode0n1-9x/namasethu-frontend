"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Building2, Check, Globe, Heart, HelpCircle, KeyRound, Menu, User } from "lucide-react";
import { ListingMode } from "@/types/property";
import { BrandLogo } from "./BrandLogo";
import { Dialog } from "@/components/ui/Dialog";

interface GlobalHeaderProps {
  /** Highlighted discovery mode; omit on pages that aren't part of discovery. */
  activeMode?: ListingMode;
  onModeChange?: (mode: ListingMode) => void;
}

const MODES: { id: ListingMode; label: string }[] = [
  { id: "BUY", label: "Buy" },
  { id: "RENT", label: "Rent" },
  { id: "3D_TWINS", label: "3D tours" },
];

const LANGUAGES = [
  { code: "en-IN", label: "English", native: "English (India)" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian rupee" },
  { code: "USD", symbol: "$", label: "US dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "AED", symbol: "د.إ", label: "UAE dirham" },
];

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ activeMode, onModeChange }) => {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [currency, setCurrency] = useState("INR");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handlePointer = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setUserMenuOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [userMenuOpen]);

  const handleModeClick = (mode: ListingMode) => {
    setUserMenuOpen(false);
    if (onModeChange) onModeChange(mode);
    else router.push(`/?mode=${mode}`);
  };

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1760px] items-center justify-between gap-4 px-4 sm:px-8 md:px-12">
        <BrandLogo />

        <nav aria-label="Browse homes" className="hidden items-center gap-1 md:flex">
          {MODES.map((mode) => {
            const active = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeClick(mode.id)}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2.5 text-[15px] transition-colors cursor-pointer ${
                  active ? "font-semibold text-ink" : "font-medium text-muted hover:bg-neutral-100 hover:text-ink"
                }`}
              >
                {mode.label}
                {active && <span className="absolute inset-x-4 -bottom-[17px] h-0.5 rounded-full bg-ink" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NextLink
            href="/list-property"
            className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-neutral-100 lg:inline-flex"
          >
            List your property
          </NextLink>

          <NextLink
            href="/trust-pass"
            className="hidden items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-neutral-100 sm:inline-flex"
          >
            <KeyRound className="h-4 w-4 text-brand" />
            Trust Pass
          </NextLink>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink transition-colors hover:bg-neutral-100 cursor-pointer"
            aria-label="Language and currency"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden text-xs font-semibold sm:inline">{currencySymbol}</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="Account menu"
              className="flex items-center gap-2.5 rounded-full border border-neutral-300 bg-white py-1.5 pl-3 pr-1.5 transition-shadow hover:shadow-md cursor-pointer"
            >
              <Menu className="h-4 w-4 text-ink" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-500 text-white">
                <User className="h-4 w-4" />
              </span>
            </button>

            {userMenuOpen && (
              <div
                role="menu"
                className="floating-shadow absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-hairline bg-white py-2 text-sm text-ink"
              >
                <div className="border-b border-hairline px-4 pb-3 pt-1 md:hidden">
                  <p className="eyebrow mb-2">Browse</p>
                  <div className="flex gap-2">
                    {MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={activeMode === mode.id}
                        aria-pressed={activeMode === mode.id}
                        onClick={() => handleModeClick(mode.id)}
                        className="chip px-3 py-1.5 text-xs"
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-b border-hairline px-4 py-3">
                  <p className="font-semibold">Welcome, guest</p>
                  <p className="text-xs text-muted">Sign in with DigiLocker to contact owners</p>
                </div>

                <div className="py-1" onClick={() => setUserMenuOpen(false)}>
                  <MenuLink href="/trust-pass" icon={<KeyRound className="h-4 w-4" />} label="Trust Pass" />
                  <MenuLink href="/#saved" icon={<Heart className="h-4 w-4" />} label="Saved homes" />
                  <MenuLink href="/list-property" icon={<Building2 className="h-4 w-4" />} label="List your property" />
                </div>
                <div className="border-t border-hairline py-1" onClick={() => setUserMenuOpen(false)}>
                  <MenuLink href="/trust-pass#faq" icon={<HelpCircle className="h-4 w-4" />} label="Help centre" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Language and currency"
        size="md"
        footer={
          <div className="flex justify-end">
            <button type="button" onClick={() => setSettingsOpen(false)} className="btn btn-dark">
              Save
            </button>
          </div>
        }
      >
        <div className="space-y-7 px-6 py-6">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Language</legend>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <OptionTile
                  key={lang.code}
                  selected={language === lang.code}
                  onSelect={() => setLanguage(lang.code)}
                  title={lang.native}
                  subtitle={lang.label}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Currency</legend>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.map((curr) => (
                <OptionTile
                  key={curr.code}
                  selected={currency === curr.code}
                  onSelect={() => setCurrency(curr.code)}
                  title={`${curr.code} – ${curr.symbol}`}
                  subtitle={curr.label}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </Dialog>
    </header>
  );
};

const MenuLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <NextLink role="menuitem" href={href} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface">
    <span className="text-muted">{icon}</span>
    {label}
  </NextLink>
);

const OptionTile: React.FC<{ selected: boolean; onSelect: () => void; title: string; subtitle: string }> = ({
  selected,
  onSelect,
  title,
  subtitle,
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={selected}
    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-shadow cursor-pointer ${
      selected ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "shadow-[inset_0_0_0_1px_#dddddd] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"
    }`}
  >
    <span>
      <span className="block text-sm font-medium text-ink">{title}</span>
      <span className="block text-xs text-muted">{subtitle}</span>
    </span>
    {selected && <Check className="h-4 w-4 text-ink" />}
  </button>
);
