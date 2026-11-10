import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Share2, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function BlogPage() {
  const posts = [
    {
      title: "The Future of Digital Inheritance: Web3 & Beyond",
      excerpt: "How decentralized protocols are reshaping how we think about generational wealth transfer.",
      author: "Dr. Elena Vance",
      date: "May 10, 2026",
      readTime: "8 min",
      category: "Future Tech",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Securing Institutional Assets in the Age of AI",
      excerpt: "The critical role of zero-knowledge architecture in protecting against automated threat vectors.",
      author: "Marcus Thorne",
      date: "May 05, 2026",
      readTime: "12 min",
      category: "Security",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "The Psychological Impact of Digital Succession Planning",
      excerpt: "Why starting your digital legacy plan today can provide immense peace of mind for tomorrow.",
      author: "Sarah Jenkins",
      date: "April 28, 2026",
      readTime: "6 min",
      category: "Life & Legacy",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Developer Journal & Research | Transfer Legacy"
        description="Read the latest technical insights on decentralized custody, post-mortem cryptographic recovery, and digital estate architecture."
        canonicalUrl="https://transferlegacy.com/resources/blog"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} className="text-brand-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Legacy Insights & Intelligence
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Institutional <span className="italic text-brand-primary">Journal</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Expert analysis on digital assets, cryptography, and the future of institutional succession.
          </motion.p>
        </div>

        {/* Featured Post */}
        <motion.div {...fadeUp(0.3)} className="mb-32">
           <Card className="p-0 overflow-hidden bg-surface/40 hover:border-brand-primary/30 transition-all cursor-pointer group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
                      alt="Featured Post" 
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-page/80 to-transparent" />
                 </div>
                 <div className="p-8 md:p-16 space-y-8">
                    <div className="flex items-center gap-4">
                       <span className="px-4 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-[10px] font-bold uppercase tracking-widest text-brand-gold">Editor's Choice</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-obsidian-700">Protocol Analysis</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight group-hover:text-vault-50 transition-colors">
                       The 2026 Global <span className="text-brand-primary italic">Digital Wealth</span> Report
                    </h2>
                    <p className="text-muted text-lg leading-relaxed font-medium">
                       An exhaustive audit of the $2.4T digital asset landscape and why decentralized succession is now a requirement for institutional portfolios.
                    </p>
                    <div className="flex items-center justify-between pt-8 border-t border-base">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface border border-base" />
                          <div>
                             <p className="text-sm font-bold">Protocol Research Team</p>
                             <p className="text-[10px] text-muted font-bold uppercase">May 12, 2026</p>
                          </div>
                       </div>
                       <Button variant="primary" className="h-12 px-10 text-[10px] font-bold uppercase tracking-widest">
                          Read Report <ArrowRight size={16} className="ml-2" />
                       </Button>
                    </div>
                 </div>
              </div>
           </Card>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
           {posts.map((post, i) => (
             <motion.div key={i} {...fadeUp(0.4 + i * 0.1)} className="group cursor-pointer">
                <div className="relative aspect-video rounded-[32px] overflow-hidden mb-8 border border-base group-hover:border-brand-primary/40 transition-all duration-500">
                   <img 
                     src={post.image} 
                     alt={post.title} 
                     className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                   />
                   <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 rounded-full bg-page/90 backdrop-blur-xl border border-base text-[9px] font-bold uppercase tracking-widest text-primary">
                        {post.category}
                      </span>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-6 text-[10px] font-bold text-obsidian-700 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
                      <span className="flex items-center gap-2"><Clock size={14} /> {post.readTime}</span>
                   </div>
                   <h3 className="text-2xl font-display font-bold leading-snug group-hover:text-brand-primary transition-colors">
                      {post.title}
                   </h3>
                   <p className="text-muted leading-relaxed font-medium line-clamp-3">
                      {post.excerpt}
                   </p>
                   <div className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-surface border border-base" />
                         <span className="text-xs font-bold text-primary0">{post.author}</span>
                      </div>
                      <button className="p-2 text-obsidian-700 hover:text-brand-primary transition-colors">
                         <Share2 size={18} />
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Newsletter Section */}
        <motion.div {...fadeUp(0.8)} className="bg-surface/30 border border-base rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-dot-matrix opacity-10 pointer-events-none" />
           <div className="max-w-xl mx-auto space-y-8 relative">
              <h3 className="text-3xl md:text-5xl font-display font-bold">Secure Your <span className="text-brand-gold italic">Intelligence</span></h3>
              <p className="text-muted font-medium">Join 50,000+ institutional investors receiving our weekly brief on digital succession and cryptographic security.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <input 
                   type="email" 
                   placeholder="Enter your email protocol..."
                   className="flex-grow bg-page border border-base rounded-2xl px-6 py-4 text-sm focus:border-brand-primary/50 transition-all"
                 />
                 <Button variant="primary" className="h-14 px-12 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">Subscribe Now</Button>
              </div>
              <p className="text-[10px] text-obsidian-700 uppercase tracking-widest">Zero-spam commitment · Institutional privacy assured</p>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
