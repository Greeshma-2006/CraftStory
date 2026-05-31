import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Users, Heart, Shield } from 'lucide-react';

const LandingPage = () => {

  const heroImage =
    'https://static.prod-images.emergentagent.com/jobs/59bc0f4e-21cb-4028-8c28-3975d2677acd/images/1786680f5a8a1ea806ab2354bd3cb7681ed2b58bc9b987cf1a761990fbc40d46.png';

  const textureImage =
    'https://static.prod-images.emergentagent.com/jobs/59bc0f4e-21cb-4028-8c28-3975d2677acd/images/740e1280d9e7775f7bb8410e03ad9cf8f601bf6744583cfd9e8fc771217dc935.png';

  const categories = [
    {
      name: 'Pottery',
      image:
        'https://images.unsplash.com/photo-1768052272552-0b7193787d72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBjcmFmdHNtYW4lMjBydXJhbHxlbnwwfHx8fDE3Nzk4MjA5MjV8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      name: 'Textiles',
      image:
        'https://images.pexels.com/photos/29497912/pexels-photo-29497912.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      name: 'Baskets',
      image:
        'https://images.unsplash.com/photo-1768102365643-2afa10b70f31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwyfHx3b3ZlbiUyMGJhc2tldCUyMGFydGlzYW4lMjBjcmFmdHNtYW5zaGlwfGVufDB8fHx8MTc3OTgyMDkyNXww&ixlib=rb-4.1.0&q=85',
    },
    {
      name: 'Jewelry',
      image:
        'https://images.pexels.com/photos/36779010/pexels-photo-36779010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
  ];

  const features = [
    {
      icon: Heart,
      title: 'Handcrafted with Love',
      description:
        'Every creation carries emotions, heritage, passion, and authentic handmade artistry.',
    },
    {
      icon: Users,
      title: 'Empower Rural Artisans',
      description:
        'Support traditional artisans and preserve generations of cultural craftsmanship.',
    },
    {
      icon: Shield,
      title: 'Authentic Heritage',
      description:
        'Verified artisan stories and genuine handmade creations rooted in tradition.',
    },
    {
      icon: Package,
      title: 'Premium Experience',
      description:
        'Elegant packaging, secure delivery, and meaningful handcrafted experiences.',
    },
  ];

  return (

    <div className="min-h-screen bg-[#FFF9F3]">

      {/* HERO SECTION */}

      <section
        className="hero-section relative overflow-hidden"
        data-testid="hero-section"
      >

        <div className="hero-texture-bg"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">

            {/* HERO TEXT */}

            <div className="space-y-6 fade-in-up">

              <div className="inline-block px-5 py-2 rounded-full bg-[#F5E6D3] text-[#A44A32] font-semibold tracking-wide">

                Handcrafted Heritage Platform

              </div>

              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#6B3E2E] tracking-tight leading-none">

                Every Craft
                <br />

                Tells a
                <span className="text-[#C96A4A]">
                  {' '}Story
                </span>

              </h1>

              <p className="text-lg text-[#6B3E2E]/80 leading-relaxed">

                Discover authentic handmade treasures from rural artisans.
                Every handmade creation carries the soul, culture,
                and journey of its creator.

              </p>

              {/* ONLY ONE BUTTON */}

              <div className="pt-4">

                <Link
                  to="/explore"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white text-lg shadow-xl transition-all"
                >

                  <span>
                    Explore Artisans & Crafts
                  </span>

                  <ArrowRight className="w-5 h-5" />

                </Link>

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="relative">

              <div className="rounded-3xl overflow-hidden shadow-2xl">

                <img
                  src={heroImage}
                  alt="Artisan at work"
                  className="w-full h-auto object-cover"
                />

              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-[#E7D5C7]">

                <p className="text-sm text-[#6B3E2E]/70">
                  Supporting
                </p>

                <p className="text-3xl font-heading font-semibold text-[#C96A4A]">
                  500+
                </p>

                <p className="text-sm text-[#6B3E2E] font-medium">
                  Rural Artisans
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}

      <section
        className="py-20 bg-[#F5E6D3]"
        data-testid="categories-section"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="font-heading text-4xl font-semibold text-[#6B3E2E] mb-4">

              Explore Handmade Traditions

            </h2>

            <p className="text-[#6B3E2E]/70 text-lg">

              Discover cultural craftsmanship and artisan heritage

            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {categories.map((category) => (

              <div
                key={category.name}
                className="group cursor-pointer"
              >

                <div className="relative aspect-square rounded-full overflow-hidden shadow-xl">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-6">

                    <h3 className="text-white font-heading text-2xl font-semibold">

                      {category.name}

                    </h3>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        className="py-20"
        data-testid="features-section"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">

            <h2 className="font-heading text-4xl font-semibold text-[#6B3E2E] mb-4">

              Why CraftStory Matters

            </h2>

            <p className="text-[#6B3E2E]/70 text-lg max-w-2xl mx-auto">

              Preserving cultural identity through authentic handmade storytelling

            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((feature, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-8 text-center"
              >

                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5E6D3] rounded-full mb-6">

                  <feature.icon className="w-8 h-8 text-[#C96A4A]" />

                </div>

                <h3 className="font-heading text-xl font-semibold text-[#6B3E2E] mb-3">

                  {feature.title}

                </h3>

                <p className="text-[#6B3E2E]/70 leading-relaxed">

                  {feature.description}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${textureImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        <div className="absolute inset-0 bg-[#A44A32]/90"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          <h2 className="font-heading text-4xl sm:text-5xl font-semibold text-white mb-6">

            Become Part of a Handcrafted Heritage Ecosystem

          </h2>

          <p className="text-white/90 text-lg mb-8 leading-relaxed">

            Celebrate artisan identity, cultural stories,
            and meaningful handmade craftsmanship.

          </p>

          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-full bg-white text-[#A44A32] hover:bg-[#F5E6D3] text-lg font-semibold transition-all"
          >

            Create Your Account

          </Link>

        </div>

      </section>

    </div>
  );
};

export default LandingPage;