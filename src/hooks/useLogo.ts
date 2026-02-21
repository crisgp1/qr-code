'use client';

import { useState, useRef, useCallback } from 'react';

export function useLogo() {
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoPreviewURL, setLogoPreviewURL] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setLogoPreviewURL(url);
      const img = new Image();
      img.onload = () => setLogoImg(img);
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  const removeLogo = useCallback(() => {
    setLogoImg(null);
    setLogoPreviewURL(null);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  return { logoImg, logoPreviewURL, fileRef, handleLogoUpload, removeLogo };
}
