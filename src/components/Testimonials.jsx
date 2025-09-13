import React from 'react';

// Testimonials section component - converted from the testimonials section in index.html
const Testimonials = () => {
  // Testimonials data extracted from the original HTML
  const testimonials = [
    {
      quote: "Designing my Mavick felt like creating a piece of my own identity.",
      author: "Aarav M., Chennai"
    },
    {
      quote: "Finally, a watch brand that lets me do me.",
      author: "Kavya R., Bangalore"
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        {testimonials.map((testimonial, index) => (
          <blockquote key={index}>
            <p>"{testimonial.quote}"</p>
            <div className="attribution">— {testimonial.author}</div>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;