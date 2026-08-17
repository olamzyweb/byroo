import type { LinkType } from "@/lib/types";

export function getLinkIconKind(type: LinkType, url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("tiktok.com")) return "tiktok";
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.me") || urlLower.includes("fb.com")) return "facebook";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
  if (urlLower.includes("linkedin.com")) return "linkedin";
  if (urlLower.includes("spotify.com")) return "spotify";
  if (urlLower.includes("pinterest.com") || urlLower.includes("pin.it")) return "pinterest";
  if (urlLower.includes("github.com")) return "github";
  if (urlLower.includes("whatsapp.com") || urlLower.includes("wa.me")) return "whatsapp";
  if (urlLower.includes("snapchat.com")) return "snapchat";
  if (urlLower.includes("threads.net")) return "threads";
  if (urlLower.startsWith("mailto:")) return "email";
  if (urlLower.startsWith("tel:")) return "phone";
  
  if (type === "whatsapp") return "whatsapp";
  if (type === "instagram") return "instagram";
  if (type === "email") return "email";
  if (type === "github") return "github";
  if (type === "linkedin") return "linkedin";
  if (type === "booking") return "booking";
  
  return "website";
}

export function LinkIcon({ type, url, className = "h-4 w-4 shrink-0" }: { type: LinkType; url: string; className?: string }) {
  const kind = getLinkIconKind(type, url);

  if (kind === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.79 13.5L3 21l4.66-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8.8c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.3l1 2.3c.1.2.1.4 0 .6l-.4.7c-.1.2-.2.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.7-.4c.2-.1.4-.1.6 0l2.2 1.5c.3.1.3.3.3.5v.6c0 .3 0 .5-.5.7-.5.2-1.4.4-2.8-.1-1.2-.4-2.3-1.3-3.3-2.3s-1.9-2.1-2.3-3.3c-.5-1.4-.3-2.3-.1-2.8Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.58-.67v6.52c-.04 2.11-.83 4.28-2.48 5.61-1.61 1.35-3.86 1.84-5.9 1.54-2.22-.31-4.28-1.72-5.26-3.77-1.12-2.27-.88-5.17.65-7.19 1.34-1.78 3.6-2.69 5.81-2.42v4.06c-1.18-.18-2.43.2-3.19 1.12-.76.9-.76 2.33-.03 3.26.71.95 1.95 1.33 3.1 1.05.9-.22 1.61-.98 1.83-1.87.05-.2.07-.4.07-.61V.02z" />
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (kind === "twitter") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    );
  }
  if (kind === "spotify") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.1-10.561-1.14-.418.096-.779-.18-.879-.599-.1-.42.18-.78.599-.879 4.62-1.08 8.58-.6 11.76 1.379.361.24.48.66.241 1.02zm1.5-3.3c-.3.42-.839.6-1.26.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.56 18.72 12.84c.36.24.54.78.3 1.2zm.12-3.42C15.24 8.22 8.88 8.04 5.16 9.12c-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32C8.76 6.06 15.84 6.3 19.8 8.64c.48.3.66.9.36 1.38-.3.48-.9.66-1.38.36z"/>
      </svg>
    );
  }
  if (kind === "pinterest") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.168 1.777 2.168 2.13 0 3.762-2.245 3.762-5.486 0-2.87-2.061-4.869-5.004-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.21-.174.25-.404.141-1.51-.703-2.457-2.917-2.457-4.69 0-3.818 2.774-7.324 7.994-7.324 4.197 0 7.454 2.992 7.454 6.985 0 4.171-2.625 7.527-6.27 7.527-1.217 0-2.36-.634-2.752-1.378l-.752 2.863c-.272 1.035-1.011 2.331-1.503 3.127 1.118.347 2.302.535 3.527.535 6.622 0 11.988-5.365 11.988-11.987C24.012 5.367 18.643 0 12.017 0z" />
      </svg>
    );
  }
  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    );
  }
  if (kind === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (kind === "booking") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    );
  }
  if (kind === "snapchat") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2c-.62 0-1.42.27-2.1.8-1.05.82-1.42 2.37-1.42 3.66 0 .42.06.87.18 1.3-.23.16-.54.26-.94.26-.26 0-.6-.05-.98-.16a1.18 1.18 0 0 0-.64.08c-.28.14-.4.49-.24.78.18.32.48.56.78.71.3.15.54.22.71.22.1 0 .22-.03.35-.06-.11.45-.16.94-.16 1.48 0 2.21 1.5 4.3 4.14 4.88-.13.3-.43.51-.83.56-.25.03-.5.05-.75.05a.8.8 0 0 0-.58.26c-.19.22-.19.56-.02.79.28.37.75.64 1.25.76.5.12 1 .15 1.36.15.21 0 .41-.01.59-.03.22.56.74 1 1.38 1.03h.08c.64-.03 1.16-.47 1.38-1.03.18.02.38.03.59.03.36 0 .86-.03 1.36-.15.5-.12.97-.39 1.25-.76.17-.23.17-.57-.02-.79a.8.8 0 0 0-.58-.26c-.25 0-.5-.02-.75-.05-.4-.05-.7-.26-.83-.56 2.64-.58 4.14-2.67 4.14-4.88 0-.54-.05-1.03-.16-1.48.13.03.25.06.35.06.17 0 .41-.07.71-.22.3-.15.6-.39.78-.71.16-.29.04-.64-.24-.78a1.18 1.18 0 0 0-.64-.08c-.38.11-.72.16-.98.16-.4 0-.71-.1-.94-.26.12-.43.18-.88.18-1.3 0-1.29-.37-2.84-1.42-3.66C13.42 2.27 12.62 2 12 2z" />
      </svg>
    );
  }
  if (kind === "threads") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12.753.003c-2.316.035-4.526 1.002-6.096 2.709C5.076 4.417 4.258 6.7 4.316 9.027c.057 2.327.994 4.544 2.617 6.185l.024.024c1.606 1.579 3.793 2.457 6.07 2.457 2.261 0 4.433-.865 6.035-2.428l.024-.024c1.621-1.637 2.56-3.85 2.62-6.177.062-2.327-.75-4.613-2.31-6.326-1.567-1.716-3.774-2.697-6.096-2.738zm-.736 14.945c-2.846 0-5.161-2.28-5.215-5.088-.055-2.808 2.155-5.132 5.001-5.187 2.846-.055 5.215 2.167 5.269 4.975.054 2.808-2.155 5.132-5.001 5.187l-.054.013zm1.617-5.048c.038.995-.733 1.833-1.745 1.871-1.012.038-1.875-.724-1.913-1.719-.038-.995.733-1.833 1.745-1.871 1.012-.038 1.875.724 1.913 1.719z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
