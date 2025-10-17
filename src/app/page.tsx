'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [isManualClick, setIsManualClick] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  const sections = [
    {
      title: "The Scattering",
      content: {
        title: "Your On-Chain Life is Fragmented",
        description: "Your DeFi achievements are on one chain, your governance history on another, your social capital locked in web2. Each wallet is a separate, anonymous actor.",
        illustration: "S",
        accent: "01",
        principles: [
          {
            title: "Fragmented Identity",
            description: "Your true reputation is invisible and unrecognized."
          },
          {
            title: "Scattered Achievements",
            description: "You've done the work, but have nothing to show for it."
          },
          {
            title: "Anonymous Actors",
            description: "Each wallet is a separate, unconnected identity."
          }
        ]
      }
    },
    {
      title: "The Forge",
      content: {
        title: "Unify Your Digital Self",
        description: "Porta gives you the tools to forge a comprehensive, private passport from the scattered pieces of your on-chain life. Connect your wallets, link your socials, and mint a single, verifiable asset.",
        illustration: "F",
        accent: "02",
        features: [
          {
            title: "Connect Your Wallets",
            description: "Unify all your on-chain activity into one identity."
          },
          {
            title: "Link Your Socials",
            description: "Bridge your web2 social capital to web3."
          },
          {
            title: "Mint Your Passport",
            description: "Create a single, verifiable asset representing your reputation."
          }
        ]
      }
    },
    {
      title: "The Ledger",
      content: {
        title: "A Living Ledger of Your Reputation",
        description: "This passport is more than proof-of-humanity; it's the foundational layer for a more meritocratic web3. A future where trust is verifiable, access is earned, and your history is your most valuable asset.",
        illustration: "L",
        accent: "03",
        principles: [
          {
            title: "Verifiable Trust",
            description: "Build a future where trust is earned and proven."
          },
          {
            title: "Meritocratic Access",
            description: "Access based on your verifiable reputation and history."
          },
          {
            title: "Your History as Asset",
            description: "Your on-chain history becomes your most valuable asset."
          }
        ]
      }
    },
    {
      title: "The Foundry",
      content: {
        title: "The Foundry is Open",
        description: "This is not a finished product. This is an invitation to the ground floor. We are seeking pioneers to help forge the first generation of sovereign identities.",
        illustration: "F",
        accent: "04",
        cta: "The future is invite-only. Join the pioneers."
      }
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Separate useEffect for Intersection Observer - runs after DOM is ready
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualClick) return; // Don't update during manual clicks

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId === 'hero') {
              setActiveSection(-1);
            } else if (sectionId.startsWith('section-')) {
              const index = parseInt(sectionId.split('-')[1]);
              setActiveSection(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const heroSection = document.getElementById('hero');
      if (heroSection) observer.observe(heroSection);

      sections.forEach((_, index) => {
        const section = document.getElementById(`section-${index}`);
        if (section) observer.observe(section);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [sections, isManualClick]);

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      backgroundColor: '#FAFAFA'
    }}>
      {/* Mobile Navigation */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E5E5E5',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <img
              src="/porta_logo.png"
              alt="PORTA"
              style={{
                height: '3rem',
                width: 'auto'
              }}
            />
            <div style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {sections.map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  style={{
                    color: activeSection === index ? '#000000' : '#666666',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                >
                  {section.title.split(' ')[1]}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '320px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E5E5',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <div>
            <img
              src="/porta_logo.png"
              alt="PORTA"
              onClick={() => {
                setIsManualClick(true);
                setActiveSection(-1);
                const element = document.getElementById('hero');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // Re-enable observer after scroll completes
                setTimeout(() => {
                  setIsManualClick(false);
                }, 800);
              }}
              style={{
                height: activeSection === -1 ? '5.5rem' : '5rem',
                width: 'auto',
                marginBottom: '3rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />

            <div style={{ marginBottom: '2rem' }}>
              {sections.map((section, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setIsManualClick(true);
                    setActiveSection(index);
                    const element = document.getElementById(`section-${index}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    // Re-enable observer after scroll completes
                    setTimeout(() => {
                      setIsManualClick(false);
                    }, 800);
                  }}
                  style={{
                    marginBottom: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: '1rem 0',
                    borderRadius: '0.5rem',
                    backgroundColor: activeSection === index ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                    paddingLeft: '1rem',
                    marginLeft: '-1rem'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: activeSection === index ? '700' : '500',
                    fontSize: activeSection === index ? '1.375rem' : '1.125rem',
                    color: activeSection === index ? '#FF6B35' : '#333333',
                    marginBottom: '0.25rem',
                    transition: 'all 0.3s ease',
                    letterSpacing: '-0.02em'
                  }}>
                    {section.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '0.875rem',
                    color: activeSection === index ? '#FF6B35' : '#666666',
                    lineHeight: 1.4,
                    transition: 'all 0.3s ease'
                  }}>
                    {section.content.accent}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #E5E5E5',
            paddingTop: '2rem'
          }}>
            <div style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#000000',
              lineHeight: 1.4,
              marginBottom: '0.5rem'
            }}>
              © 2025 PORTA
            </div>
            <div style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#666666',
              lineHeight: 1.4
            }}>
              Future of on-chain identity
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div style={{
        marginLeft: isMobile ? '0' : '320px',
        minHeight: '100vh',
        paddingTop: isMobile ? '4rem' : '0'
      }}>
        {/* Hero Section */}
        <section
          id="hero"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '2rem 1rem' : '3rem 2rem',
            backgroundColor: '#FFFFFF'
          }}>
          <div style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '1450px',
            textAlign: 'left',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1rem',
              height: '730px',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '4rem 3rem',
            }}>
              <h1 style={{
                fontFamily: 'var(--font-outfit), sans-serif',
                fontWeight: '800',
                fontSize: isMobile ? '4rem' : '5.5rem',
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                lineHeight: 1.0,
                letterSpacing: '-0.03em'
              }}>
                One Identity.<br />
                Every Chain.<br />
                <span style={{ color: '#FF6B35' }}>Your Control.</span>
              </h1>

              <p style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: '400',
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.4,
                marginBottom: '2.5rem',
                maxWidth: isMobile ? '100%' : '600px'
              }}>
                Forge your on-chain identity. Unify your wallets, socials, and achievements into a single, sovereign passport, powered by zero-knowledge proofs.
              </p>
            </div>
          </div>
        </section>

        {sections.map((section, index) => (
          <section
            key={index}
            id={`section-${index}`}
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '2rem 1rem' : '4rem 2rem',
              backgroundColor: '#FFFFFF',
              position: 'relative',
              borderTop: index > 0 ? '1px solid #F0F0F0' : 'none'
            }}
          >
            <div style={{
              width: '100%',
              maxWidth: isMobile ? '100%' : '1450px',
              textAlign: 'left',
              position: 'relative'
            }}>


              {/* Content - Skip for The Foundry section */}
              {index !== sections.length - 1 && (
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '1rem',
                  height: '730px',
                  background: index === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                    index === 1 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '4rem 3rem',
                }}>
                  {/* Content Overlay */}
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%'
                  }}>
                    <h2 style={{
                      fontFamily: 'var(--font-outfit), sans-serif',
                      fontWeight: '800',
                      fontSize: isMobile ? '4rem' : '5.5rem',
                      color: '#FFFFFF',
                      marginBottom: '1.5rem',
                      lineHeight: 1.0,
                      letterSpacing: '-0.03em'
                    }}>
                      {section.content.title}
                    </h2>

                    <p style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: '400',
                      fontSize: isMobile ? '1.125rem' : '1.25rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.4,
                      marginBottom: '2.5rem',
                      maxWidth: isMobile ? '100%' : '600px'
                    }}>
                      {section.content.description}
                    </p>
                  </div>
                </div>
              )}


              {/* Special Banner Card for The Foundry section */}
              {index === sections.length - 1 && (
                <div style={{
                  width: '100%',
                  margin: '0 auto',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '1rem',
                  height: '730px'
                }}>
                  {/* Banner Background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(/banner.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(4px)',
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                  }}></div>


                  {/* Content Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    padding: '4rem 3rem',
                    textAlign: 'left',
                    zIndex: 2
                  }}>
                    <h2 style={{
                      fontFamily: 'var(--font-outfit), sans-serif',
                      fontWeight: '800',
                      fontSize: isMobile ? '4rem' : '5.5rem',
                      color: '#FFFFFF',
                      marginBottom: '0.5rem',
                      lineHeight: 1.0,
                      letterSpacing: '-0.05em'
                    }}>
                      The Foundry is Open
                    </h2>

                    <div style={{
                      fontFamily: 'var(--font-outfit), sans-serif',
                      fontWeight: '700',
                      fontSize: isMobile ? '2.25rem' : '3.25rem',
                      color: '#FFFFFF',
                      marginBottom: '3rem',
                      lineHeight: 1.0,
                      letterSpacing: '-0.04em'
                    }}>
                      The future is invite-only
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <style jsx>{`
        input:focus {
          border-color: #FF6B35 !important;
        }
        
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
        
        @media (max-width: 768px) {
          button:hover {
            transform: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
