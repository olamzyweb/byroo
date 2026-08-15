"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, RotateCw, Copy, Check } from "lucide-react";

interface StorefrontPreviewFABProps {
  username: string;
}

export function StorefrontPreviewFAB({ username }: StorefrontPreviewFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const storefrontUrl = `/${username}`;

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsRefreshing(true);
      // Reload iframe by resetting its src
      iframeRef.current.src = storefrontUrl;
    }
  };

  const handleIframeLoad = () => {
    setIsRefreshing(false);
  };

  const handleCopy = () => {
    const fullUrl = window.location.origin + storefrontUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Action Button (Only visible on screens, floating at bottom-right) */}
      <motion.button
        id="step-storefront-preview"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:shadow-indigo-900/50 transition duration-200"
        aria-label="Preview store"
      >
        <Eye className="h-6 w-6" />
      </motion.button>

      {/* Slide-up Bottom Sheet Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop with fade-in and click-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Bottom Sheet Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative z-10 flex h-[92vh] w-full flex-col rounded-t-2xl border-t border-slate-100 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
            >
              {/* Top Drag Handle (Just visual to indicate bottom sheet) */}
              <div className="flex justify-center py-2 bg-slate-50 dark:bg-slate-800/40">
                <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Live Preview
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    /{username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Copy Link Button */}
                  <button
                    onClick={handleCopy}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Copy live link"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
                    title="Refresh preview"
                  >
                    <RotateCw
                      className={`h-4 w-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`}
                    />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Close preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Embedded Iframe Storefront */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
                {isRefreshing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                      <span className="text-xs text-slate-500 font-medium">Updating preview...</span>
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={storefrontUrl}
                  onLoad={handleIframeLoad}
                  className="h-full w-full border-none bg-white dark:bg-slate-900"
                  title="Storefront Preview"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
