import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Sparkles, Search, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import SEO from '../../components/seo/SEO';
import { blogPosts } from '../../data/blogPosts';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Security & Keys', 'Exchange Succession', 'Estate Planning'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Transfer Legacy Intelligence & Cryptographic Research Journal',
    description: 'Expert research, guides, and analysis on digital asset inheritance, zero-knowledge security, and self-custody estate planning.',
    url: 'https://transferlegacy.com/blog',
    hasPart: blogPosts.map((post) => ({
      '@type': 'Article',
      headline: post.title,
      url: `https://transferlegacy.com/blog/${post.slug}`,
      datePublished: post.date,
      description: post.excerpt,
    })),
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-28 pb-24">
      <SEO
        title="Cryptographic Estate Planning & Security Journal | Transfer Legacy"
        description="Read technical research, institutional analysis, and practical succession blueprints for self-custody crypto, hardware wallets, and digital estates."
        canonicalUrl="https://transferlegacy.com/blog"
        schema={collectionSchema}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Sparkles size={14} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Research & Cryptographic Intelligence</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Institutional <span className="italic text-brand-primary">Knowledge Hub</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-secondary text-lg max-w-2xl mx-auto font-medium">
            Actionable succession blueprints, exchange protocol audits, and mathematical zero-knowledge recovery guides.
          </motion.p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div {...fadeUp(0.25)} className="mb-20">
            <Link to={`/blog/${featuredPost.slug}`}>
              <Card className="p-0 overflow-hidden bg-surface/40 hover:border-brand-primary/40 transition-all group">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-page/80 to-transparent" />
                  </div>
                  <div className="p-8 md:p-12 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                          Featured Guide
                        </span>
                        <span className="text-xs text-muted font-semibold">{featuredPost.category}</span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-display font-bold leading-tight group-hover:text-brand-primary transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-secondary text-base leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-base/60">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-xs">
                          {featuredPost.author.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{featuredPost.author.name}</p>
                          <p className="text-[10px] text-muted">{featuredPost.author.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-primary group-hover:translate-x-1 transition-transform">
                        Read Blueprint <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-obsidian-950 shadow-md shadow-brand-primary/20'
                    : 'bg-surface/50 text-secondary hover:text-primary border border-base/40 hover:border-base'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search guides, exchanges, keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/50 border border-base/60 rounded-xl pl-10 pr-4 py-2 text-xs text-primary placeholder-muted focus:outline-none focus:border-brand-primary/60 transition-colors"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.div key={post.slug} {...fadeUp(idx * 0.05)}>
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col justify-between p-6 bg-surface/30 hover:border-brand-primary/40 transition-all hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-obsidian-950/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-brand-primary border border-base/40">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold leading-snug group-hover:text-brand-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-secondary text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-base/40 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted flex items-center gap-1">
                      <ShieldCheck size={12} className="text-brand-primary" /> Verified Protocol
                    </span>
                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
