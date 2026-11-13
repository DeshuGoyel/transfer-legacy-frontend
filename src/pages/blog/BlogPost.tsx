import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import SEO from '../../components/seo/SEO';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { blogPosts } from '../../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Transfer Legacy',
      url: 'https://transferlegacy.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://transferlegacy.com/logo-light.jpeg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://transferlegacy.com/blog/${post.slug}`,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://transferlegacy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://transferlegacy.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://transferlegacy.com/blog/${post.slug}`,
      },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, faqSchema, breadcrumbSchema],
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-28 pb-24">
      <SEO
        title={`${post.title} | Transfer Legacy`}
        description={post.excerpt}
        canonicalUrl={`https://transferlegacy.com/blog/${post.slug}`}
        type="article"
        imageUrl={post.image}
        schema={combinedSchema}
      />

      <article className="max-w-4xl mx-auto px-6">
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back to Knowledge Hub
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold">
              {post.category}
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight tracking-tight text-primary">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-base/60 text-xs text-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary font-bold">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-primary">{post.author.name}</p>
                <p className="text-[11px] text-muted">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-base/60">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* AI Overview / Key Takeaways Box */}
        <div className="bg-surface/60 border border-brand-primary/30 rounded-2xl p-6 md:p-8 mb-12 backdrop-blur-md">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles size={16} /> Key Takeaways (Executive Summary)
          </div>
          <ul className="space-y-3">
            {post.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-secondary leading-relaxed">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Content */}
        <div className="space-y-12 text-secondary text-base md:text-lg leading-relaxed font-normal">
          {post.content.map((section, idx) => (
            <section key={idx} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {p}
                </p>
              ))}

              {section.listItems && (
                <ul className="list-disc pl-6 space-y-2 text-base">
                  {section.listItems.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              )}

              {section.table && (
                <div className="my-8 overflow-x-auto rounded-xl border border-base/60 bg-surface/30">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-obsidian-950/60 border-b border-base/60 text-primary font-bold">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base/40 text-secondary">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface/40 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-4 font-medium">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* FAQs Section */}
        {post.faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-base/60 space-y-6">
            <h3 className="text-2xl font-display font-bold text-primary">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {post.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="border border-base/60 rounded-xl bg-surface/30 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-primary"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform ${openFaq === fIdx ? 'rotate-180 text-brand-primary' : 'text-muted'}`}
                    />
                  </button>
                  {openFaq === fIdx && (
                    <div className="p-5 pt-0 text-xs md:text-sm text-secondary leading-relaxed border-t border-base/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-br from-brand-primary/10 via-surface/60 to-surface/20 border border-brand-primary/30 rounded-3xl p-8 md:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold">
            <Lock size={14} /> Zero-Knowledge Autonomous Protection
          </div>
          <h3 className="text-2xl md:text-4xl font-display font-bold text-primary">
            Never Let Your Digital Assets Be Lost to the Void
          </h3>
          <p className="text-secondary text-sm md:text-base max-w-xl mx-auto">
            Create your decentralized vault in under 2 minutes. Free sovereign tier with Shamir shard recovery.
          </p>
          <div className="pt-2">
            <Link to="/onboarding">
              <Button size="lg" className="px-8 shadow-xl shadow-brand-primary/25">
                Set Up Sovereign Vault <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Guides */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-base/60">
            <h3 className="text-xl font-display font-bold text-primary mb-8">Related Succession Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <Link key={rPost.slug} to={`/blog/${rPost.slug}`} className="group">
                  <Card className="p-5 bg-surface/30 hover:border-brand-primary/40 transition-all h-full flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-brand-primary tracking-widest mb-2">
                        {rPost.category}
                      </p>
                      <h4 className="text-base font-bold text-primary group-hover:text-brand-primary transition-colors mb-2">
                        {rPost.title}
                      </h4>
                      <p className="text-xs text-secondary line-clamp-2">{rPost.excerpt}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-base/40 flex items-center justify-between text-xs text-brand-primary font-bold">
                      <span>Read Guide</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
