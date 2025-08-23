import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareButtonProps {
  referralCode: string;
}

function ShareButton({ referralCode }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const message = `Join PRNV with my referral code: ${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={copyToClipboard}
        className="bg-white/20 hover:bg-white/30 px-6 py-4 rounded-xl flex items-center gap-3"
      >
        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
      <button
        onClick={shareViaWhatsApp}
        className="bg-white/20 hover:bg-white/30 px-6 py-4 rounded-xl flex items-center gap-3"
      >
        <Share2 className="w-5 h-5" />
        Share via WhatsApp
      </button>
    </div>
  );
}

export default ShareButton;