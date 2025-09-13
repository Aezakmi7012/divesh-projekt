import React from 'react';

// Features section component - converted from the features section in index.html
const Features = () => {
  // Features data extracted from the original HTML
  const features = [
    {
      icon: "🛠",
      title: "Made by You",
      description: "Every Mavick watch is one-of-a-kind — not because we made it, but because you did. Select, sketch, assemble, and style your own unique timepiece with our intuitive design tools."
    },
    {
      icon: "🎨",
      title: "Your Style, No Limits",
      description: "Minimal or bold? Sleek metal or raw leather? You decide every detail. No pre-made combos. No rules."
    },
    {
      icon: "🚀",
      title: "Built for Mavericks",
      description: "This isn't just another watch brand. This is a movement — for the rebels, the rule-breakers, the originals. You're not following time; you're redefining it."
    }
  ];

  return (
    <section className="features-section container">
      <h2>Why Mavick?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <article key={index} className="feature-card">
            <h3>{feature.icon} {feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Features;