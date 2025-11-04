'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import XSocialGraphsTrinket from './trinkets/x-social-graphs/XSocialGraphsTrinket';

gsap.registerPlugin(Draggable);

export default function Home() {
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [isManualClick, setIsManualClick] = useState(false);
  const [expandedTrinket, setExpandedTrinket] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Default widget data
  const defaultWidgetData = [
    { x: 50, y: 50, width: 405, height: 720 },
    { x: 580, y: 50, width: 450, height: 450 }
  ];

  // Initialize widgetData - will be set after loading from localStorage
  const [widgetData, setWidgetData] = useState<Array<{ x: number; y: number; width: number; height: number }>>(defaultWidgetData);
  const [widgetsReady, setWidgetsReady] = useState(false);
  const [positionsInitialized, setPositionsInitialized] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const trinketRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resizeHandlesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const draggableInstances = useRef<(Draggable | null)[]>([]);
  const resizeInstances = useRef<(Draggable | null)[]>([]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  const expandTrinket = (index: number) => {
    if (isFullscreen) return;

    const clickedTrinket = trinketRefs.current[index];
    if (!clickedTrinket) return;

    // Get the position and size of the clicked trinket
    const rect = clickedTrinket.getBoundingClientRect();

    // Create a clone for animation
    const clone = clickedTrinket.cloneNode(true) as HTMLDivElement;
    clone.style.position = 'fixed';
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.borderRadius = '0';
    // Keep the exact same styling as the original card
    clone.style.background = 'rgba(255, 255, 255, 0.05)';
    clone.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    // Make sure the clone content is visible
    const titleElement = clone.querySelector('h3');
    if (titleElement) {
      titleElement.style.color = '#FFFFFF';
      titleElement.style.fontFamily = 'var(--font-outfit), sans-serif';
      titleElement.style.fontWeight = '700';
      titleElement.style.fontSize = isMobile ? '1.5rem' : '2rem';
      titleElement.style.lineHeight = '1.2';
      titleElement.style.margin = '0';
    }
    document.body.appendChild(clone);

    // Hide original trinket
    gsap.set(clickedTrinket, { opacity: 0 });

    // Set state immediately but keep fullscreen hidden
    setExpandedTrinket(index);
    setIsFullscreen(true);

    // Animate clone to fullscreen - FASTER
    gsap.to(clone, {
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      duration: 0.4, // Much faster - was 0.8s
      ease: 'power2.out', // Snappier easing
      onComplete: () => {
        // Remove clone and show fullscreen content with a small delay
        document.body.removeChild(clone);

        // Add a small delay before showing fullscreen content for smoother transition
        setTimeout(() => {
          if (fullscreenRef.current) {
            gsap.fromTo(fullscreenRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.2, ease: 'power2.out' }
            );
          }
        }, 100); // Small delay to make transition smoother
      }
    });
  };

  const closeFullscreen = () => {
    if (!isFullscreen) return;

    if (fullscreenRef.current) {
      gsap.to(fullscreenRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setIsFullscreen(false);
          setExpandedTrinket(null);

          // Show original trinket
          const originalTrinket = trinketRefs.current[expandedTrinket!];
          if (originalTrinket) {
            gsap.to(originalTrinket, { opacity: 1, duration: 0.3 });
          }
        }
      });
    }
  };

  const sections = [
    {
      title: "The Workshop",
      content: {
        title: "Live Experiments & Proofs",
        description: "This is a digital workbench. A collection of live experiments, passion projects, and technical deep-dives. Each 'trinket' is a functional piece of code you can interact with right now.",
        illustration: "T",
        accent: "01",
        trinkets: [
          {
            title: "IBW Insidr",
            description: "India Blockchain Week Insidr",
            status: "LIVE",
            color: "#00ff88"
          },
          {
            title: "X Social Graphs",
            description: "Social network visualization and analytics",
            status: "LIVE",
            color: "#1da1f2"
          }
        ]
      }
    }
  ];

  // Enhanced mobile detection using industry standard (user agent + dimensions + touch)
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') {
        setIsMobile(false);
        return;
      }

      // Check user agent
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUA = mobileRegex.test(userAgent);

      // Check screen dimensions (industry standard: < 768px width)
      const isSmallScreen = window.innerWidth < 768;

      // Check for touch device
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Mobile if: mobile user agent OR (small screen AND touch device)
      setIsMobile(isMobileUA || (isSmallScreen && hasTouchScreen));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);


  // Set active section to 0 (The Workshop) by default
  useEffect(() => {
    setActiveSection(0);
  }, []);

  // Load widget data from localStorage on mount - only render widgets after this
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('widgetData');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 2) {
            setWidgetData(parsed);
          }
        } catch {
          // Ignore parse errors, use defaults
        }
      }
      // Mark widgets as ready after loading (or if no saved data, use defaults)
      setWidgetsReady(true);
    }
  }, []);

  // Save widget data to localStorage (only after initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && widgetsReady) {
      localStorage.setItem('widgetData', JSON.stringify(widgetData));
    }
  }, [widgetData, widgetsReady]);

  // Initialize drag and resize with GSAP (only after widgets are ready)
  useEffect(() => {
    const container = gridRef.current;
    if (!container || !widgetsReady) return;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const dragInstances: (Draggable | null)[] = [];
      const resInstances: (Draggable | null)[] = [];

      trinketRefs.current.forEach((widget, index) => {
        if (!widget || index >= widgetData.length) return;

        const data = widgetData[index];

        // Set initial position and size
        gsap.set(widget, {
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height
        });

        // Create draggable instance for the widget
        const dragHandle = widget.querySelector('.drag-handle') as HTMLElement;
        const resizeHandle = resizeHandlesRefs.current[index];

        // Cache iframe reference once to avoid repeated DOM queries
        const iframe = widget.querySelector('iframe') as HTMLIFrameElement | null;

        const drag = Draggable.create(widget, {
          type: 'x,y',
          handle: dragHandle || widget,
          bounds: container,
          edgeResistance: 0.65,
          allowContextMenu: false,
          // Reduce drag sensitivity for smoother performance
          force3D: true,
          onPress: function () {
            // Disable iframe interactions during drag
            if (iframe) {
              iframe.style.pointerEvents = 'none';
            }
            // Add hardware acceleration hint
            gsap.set(widget, { willChange: 'transform' });
          },
          onDrag: function () {
            // Don't update state during drag - only update on drag end for performance
            // GSAP handles the transform updates directly, no React re-render needed
          },
          onDragEnd: function () {
            // Re-enable iframe interactions
            if (iframe) {
              iframe.style.pointerEvents = 'auto';
            }
            // Remove hardware acceleration hint
            gsap.set(widget, { willChange: 'auto' });
            // Update state only once at the end using requestAnimationFrame for smoothness
            requestAnimationFrame(() => {
              setWidgetData(prev => {
                const newData = [...prev];
                newData[index] = {
                  ...newData[index],
                  x: this.x,
                  y: this.y
                };
                return newData;
              });
            });
          },
          onRelease: function () {
            // Re-enable iframe if released without dragging
            if (iframe) {
              iframe.style.pointerEvents = 'auto';
            }
            gsap.set(widget, { willChange: 'auto' });
          }
        })[0];

        dragInstances[index] = drag;

        // Create resize handle
        if (resizeHandle) {
          // Initialize resize handle position to bottom-right (0,0 relative to parent)
          gsap.set(resizeHandle, { x: 0, y: 0 });

          let startPointerX = 0;
          let startPointerY = 0;
          let startWidth = 0;
          let startHeight = 0;
          let rafId: number | null = null;

          const resize = Draggable.create(resizeHandle, {
            type: 'x,y',
            // Prevent resize from triggering widget drag
            allowContextMenu: false,
            force3D: true,
            onPress: function () {
              // Disable widget dragging while resizing
              if (drag) drag.disable();
              // Disable iframe interactions during resize
              if (iframe) {
                iframe.style.pointerEvents = 'none';
              }
              // Add hardware acceleration hint
              gsap.set(widget, { willChange: 'width, height, transform' });
              // Cache initial values - avoid getBoundingClientRect during drag
              const widgetRect = widget.getBoundingClientRect();
              startPointerX = this.pointerX;
              startPointerY = this.pointerY;
              startWidth = widgetRect.width;
              startHeight = widgetRect.height;
              // Reset resize handle position to ensure it stays anchored
              gsap.set(resizeHandle, { x: 0, y: 0 });
            },
            onDrag: function () {
              // Cancel any pending RAF updates
              if (rafId !== null) {
                cancelAnimationFrame(rafId);
              }

              // Throttle resize updates using requestAnimationFrame
              rafId = requestAnimationFrame(() => {
                const deltaX = this.pointerX - startPointerX;
                const deltaY = this.pointerY - startPointerY;

                const newWidth = Math.max(200, startWidth + deltaX);
                const newHeight = Math.max(150, startHeight + deltaY);

                // Batch GSAP updates for better performance
                gsap.set(widget, {
                  width: newWidth,
                  height: newHeight
                });

                // Keep resize handle anchored to bottom-right corner
                gsap.set(resizeHandle, { x: 0, y: 0 });
              });

              // Don't update state during drag - only update on drag end
            },
            onDragEnd: function () {
              // Cancel any pending RAF updates
              if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }

              const deltaX = this.pointerX - startPointerX;
              const deltaY = this.pointerY - startPointerY;

              const newWidth = Math.max(200, startWidth + deltaX);
              const newHeight = Math.max(150, startHeight + deltaY);

              // Ensure resize handle is anchored to bottom-right
              gsap.set(resizeHandle, { x: 0, y: 0 });

              // Re-enable iframe interactions
              if (iframe) {
                iframe.style.pointerEvents = 'auto';
              }

              // Remove hardware acceleration hint
              gsap.set(widget, { willChange: 'auto' });

              // Update state only once at the end using requestAnimationFrame
              requestAnimationFrame(() => {
                setWidgetData(prev => {
                  const newData = [...prev];
                  newData[index] = {
                    ...newData[index],
                    width: newWidth,
                    height: newHeight
                  };
                  return newData;
                });
              });
              // Re-enable widget dragging after resize
              if (drag) drag.enable();
            },
            onRelease: function () {
              // Cancel any pending RAF updates
              if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }
              // Reset resize handle position
              gsap.set(resizeHandle, { x: 0, y: 0 });
              // Re-enable iframe if released without dragging
              if (iframe) {
                iframe.style.pointerEvents = 'auto';
              }
              gsap.set(widget, { willChange: 'auto' });
              // Re-enable widget dragging if released without dragging
              if (drag) drag.enable();
            }
          })[0];

          resInstances[index] = resize;
        }
      });

      draggableInstances.current = dragInstances;
      resizeInstances.current = resInstances;
    }, 100);

    return () => {
      clearTimeout(timer);
      draggableInstances.current.forEach(instance => instance?.kill());
      resizeInstances.current.forEach(instance => instance?.kill());
    };
  }, [widgetsReady, widgetData.length]);

  // Update widget positions when widgetData changes from localStorage (only once after load)
  useEffect(() => {
    if (!positionsInitialized && draggableInstances.current.length > 0) {
      const allReady = trinketRefs.current.every((widget, index) => {
        if (!widget || index >= widgetData.length) return true;
        const instance = draggableInstances.current[index];
        return instance && !instance.isDragging;
      });

      if (allReady) {
        trinketRefs.current.forEach((widget, index) => {
          if (!widget || index >= widgetData.length) return;
          const data = widgetData[index];
          const instance = draggableInstances.current[index];

          if (instance) {
            gsap.set(widget, {
              x: data.x,
              y: data.y,
              width: data.width,
              height: data.height
            });
            instance.update();
          }
        });
        setPositionsInitialized(true);
      }
    }
  }, [widgetData, positionsInitialized]);

  // Mobile lock screen - show if mobile device detected
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#FFFFFF',
        fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '500px'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1.5rem'
          }}>
            🔒
          </div>
          <h1 style={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontWeight: '700',
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#FFFFFF'
          }}>
            Desktop Experience Required
          </h1>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: '#CCCCCC',
            marginBottom: '2rem'
          }}>
            This interactive workspace is optimized for desktop browsers. Please visit on a laptop or desktop computer for the full experience.
          </p>
          <div style={{
            fontSize: '0.875rem',
            color: '#999999',
            fontStyle: 'italic'
          }}>
            Best experienced on screens 768px and wider
          </div>
        </div>
      </div>
    );
  }

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
              src="/site_logo.png"
              alt="PORTA"
              style={{
                height: '3rem',
                width: 'auto'
              }}
            />
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
              src="/site_logo.png"
              alt="PORTA"
              style={{
                height: '5rem',
                width: 'auto',
                marginBottom: '3rem',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
            />

            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                marginBottom: '2rem',
                padding: '1rem 0',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                paddingLeft: '1rem',
                marginLeft: '-1rem'
              }}>
                <div style={{
                  fontFamily: 'var(--font-outfit), sans-serif',
                  fontWeight: '700',
                  fontSize: '1.375rem',
                  color: '#FF6B35',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.02em'
                }}>
                  {sections[0].title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '0.875rem',
                  color: '#FF6B35',
                  lineHeight: 1.4
                }}>
                  {sections[0].content.accent}
                </div>
              </div>
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
              © 2025 Abhishek
            </div>
            <div style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#666666',
              lineHeight: 1.4
            }}>
              Structure. Creativity. Execution.
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
            {/* Twitter Link - Bottom Right (Workshop Section Only) */}
            {index === 0 && (
              <a
                href="https://twitter.com/VapourMafia"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  right: '2rem',
                  fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#000000',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                  zIndex: 100
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                @VapourMafia
              </a>
            )}
            <div style={{
              width: '100%',
              maxWidth: isMobile ? '100%' : '1450px',
              textAlign: 'left',
              position: 'relative'
            }}>


              {/* Live Trinkets Widgets - First Section */}
              {index === 0 && section.content.trinkets && (
                <div
                  ref={gridRef}
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '800px',
                    padding: '2rem',
                    borderRadius: '1rem',
                    backgroundImage: `
                      radial-gradient(circle, #ccc 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0',
                    backgroundColor: '#FAFAFA',
                    overflow: 'visible'
                  }}>
                  {/* Mobile Dimension Widget */}
                  {widgetsReady && section.content.trinkets[0] && (
                    <div
                      ref={(el) => { trinketRefs.current[0] = el; }}
                      style={{
                        position: 'absolute',
                        transform: `translate3d(${widgetData[0].x}px, ${widgetData[0].y}px, 0)`,
                        width: `${widgetData[0].width}px`,
                        height: `${widgetData[0].height}px`,
                        background: '#FFFFFF',
                        border: '2px solid #E5E5E5',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        cursor: 'move',
                        zIndex: 1,
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        // CSS containment to isolate rendering and prevent layout thrashing
                        contain: 'layout style paint',
                        isolation: 'isolate'
                      }}
                      onMouseEnter={(e) => {
                        if (!draggableInstances.current[0]?.isDragging) {
                          e.currentTarget.style.borderColor = '#FF6B35';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
                          e.currentTarget.style.zIndex = '10';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!draggableInstances.current[0]?.isDragging) {
                          e.currentTarget.style.borderColor = '#E5E5E5';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.zIndex = '1';
                        }
                      }}
                    >
                      <div
                        className="drag-handle"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '1rem 1rem 0.5rem 1rem',
                          cursor: 'move'
                        }}
                      >
                        <h3 style={{
                          fontFamily: 'var(--font-outfit), sans-serif',
                          fontWeight: '700',
                          fontSize: '2rem',
                          color: '#000000',
                          lineHeight: 1.2,
                          margin: '0',
                          flex: 1
                        }}>
                          {section.content.trinkets[0].title}
                        </h3>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('https://insidr.indiablockchainweek.com/?skip=true', '_blank');
                          }}
                          style={{
                            fontSize: '1.5rem',
                            color: '#666666',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease',
                            marginLeft: '1rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#FF6B35';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#666666';
                          }}
                        >
                          ↗
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'stretch',
                          justifyContent: 'stretch',
                          overflow: 'hidden',
                          padding: 0,
                          margin: 0,
                          position: 'relative'
                        }}
                      >
                        <iframe
                          src="https://insidr.indiablockchainweek.com/?skip=true"
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '1rem',
                            pointerEvents: 'auto'
                          }}
                          allow="fullscreen"
                          loading="lazy"
                          onClick={(e) => {
                            // Allow iframe interaction, but also allow expanding
                            e.stopPropagation();
                          }}
                        />
                        {/* Overlay for expanding - clickable area outside iframe */}
                        <div
                          onClick={() => expandTrinket(0)}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: 'none',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      {/* Resize Handle */}
                      <div
                        ref={(el) => { resizeHandlesRefs.current[0] = el; }}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '20px',
                          height: '20px',
                          cursor: 'nwse-resize',
                          backgroundColor: '#FF6B35',
                          borderBottomRightRadius: '1rem',
                          zIndex: 100
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}

                  {/* Simple Card Widget */}
                  {widgetsReady && section.content.trinkets[1] && (
                    <div
                      ref={(el) => { trinketRefs.current[1] = el; }}
                      style={{
                        position: 'absolute',
                        transform: `translate3d(${widgetData[1].x}px, ${widgetData[1].y}px, 0)`,
                        width: `${widgetData[1].width}px`,
                        height: `${widgetData[1].height}px`,
                        background: '#FFFFFF',
                        border: '2px solid #E5E5E5',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        cursor: 'move',
                        zIndex: 1,
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        // CSS containment to isolate rendering and prevent layout thrashing
                        contain: 'layout style paint',
                        isolation: 'isolate'
                      }}
                      onMouseEnter={(e) => {
                        if (!draggableInstances.current[1]?.isDragging) {
                          e.currentTarget.style.borderColor = '#FF6B35';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
                          e.currentTarget.style.zIndex = '10';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!draggableInstances.current[1]?.isDragging) {
                          e.currentTarget.style.borderColor = '#E5E5E5';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.zIndex = '1';
                        }
                      }}
                    >
                      <div
                        className="drag-handle"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          marginBottom: '1rem',
                          cursor: 'move'
                        }}
                      >
                        <h3 style={{
                          fontFamily: 'var(--font-outfit), sans-serif',
                          fontWeight: '700',
                          fontSize: '2rem',
                          color: '#000000',
                          lineHeight: 1.2,
                          margin: '0',
                          flex: 1
                        }}>
                          {section.content.trinkets[1].title}
                        </h3>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/trinkets/x-social-graphs', '_blank');
                          }}
                          style={{
                            fontSize: '1.5rem',
                            color: '#666666',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease',
                            marginLeft: '1rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#FF6B35';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#666666';
                          }}
                        >
                          ↗
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#666666',
                          fontSize: '1rem',
                          fontFamily: 'var(--font-inter), sans-serif',
                          textAlign: 'center',
                          padding: '1rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => expandTrinket(1)}
                      >
                        {section.content.trinkets[1].description}
                      </div>
                      {/* Resize Handle */}
                      <div
                        ref={(el) => { resizeHandlesRefs.current[1] = el; }}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '20px',
                          height: '20px',
                          cursor: 'nwse-resize',
                          backgroundColor: '#FF6B35',
                          borderBottomRightRadius: '1rem',
                          zIndex: 100
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          ref={fullscreenRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0a0a0a',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            opacity: 0
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ×
          </button>

          {/* Fullscreen Content - Render Actual Trinket Component */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {expandedTrinket === 0 && (
              <iframe
                src="https://insidr.indiablockchainweek.com/?skip=true"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="fullscreen"
              />
            )}
            {expandedTrinket === 1 && <XSocialGraphsTrinket onClose={closeFullscreen} />}
          </div>
        </div>
      )}

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
