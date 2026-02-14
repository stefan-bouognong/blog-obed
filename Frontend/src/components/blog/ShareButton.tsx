import { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Échec de la copie');
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:text-[#1877F2]' },
    { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:text-[#1DA1F2]' },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:text-[#0A66C2]' },
    { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:text-[#25D366]' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Partager cet article</p>

          {/* Copier le lien */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4 text-primary" />}
            </div>
            <span className="text-sm font-medium text-foreground">{copied ? 'Copié !' : 'Copier le lien'}</span>
          </button>

          {/* Réseaux sociaux */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors ${social.color}`}
                title={`Partager sur ${social.name}`}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
