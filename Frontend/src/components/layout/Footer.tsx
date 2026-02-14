import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, MessageCircle } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Admin discret */}
          <Link
            to="/admin"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors md:order-2"
          >
            Administration
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mx-auto md:order-1">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EKM Blog. Read tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
