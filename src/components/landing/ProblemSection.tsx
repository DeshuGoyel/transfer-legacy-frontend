import React from 'react';

export default function ProblemSection() {
  return (
    <section id="problem" className="py-32 px-6 md:px-16 bg-blueprint-bg relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block border border-blueprint-or/30 text-blueprint-or px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          The crisis nobody talks about
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-medium text-white leading-tight mb-8">
          The estate planning industry was built for a world that no longer exists.
        </h2>
        <p className="font-sans text-xl text-blueprint-muted2 leading-relaxed">
          This isn't just a crypto problem. Every person who dies leaves behind bank accounts, passwords, photos, subscriptions, online businesses - with no plan. Their family spends months fighting to access what was built. Most of it is lost.
        </p>
      </div>
    </section>
  );
}
