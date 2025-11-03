'use client';

import { useEffect, useRef, useState } from 'react';

interface NetworkGraphProps {
    username: string;
    userData: any;
    engagements: Record<string, any[]>;
}

export default function NetworkGraph({ username, userData, engagements }: NetworkGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<any>(null);
    const nodesRef = useRef<any>(null);
    const edgesRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    // Calculate statistics
    const calculateStats = () => {
        const totalEngagements = Object.values(engagements).reduce((sum, interactions) => sum + interactions.length, 0);
        const totalUsers = Object.keys(engagements).length;
        const engagementTypes: Record<string, number> = {};
        const verifiedCount = Object.values(engagements).filter((interactions) =>
            interactions[0]?.verified
        ).length;

        Object.values(engagements).forEach((interactions) => {
            interactions.forEach((interaction) => {
                const type = interaction.engagement_type || 'unknown';
                engagementTypes[type] = (engagementTypes[type] || 0) + 1;
            });
        });

        const topEngagementType = Object.entries(engagementTypes).sort((a, b) => b[1] - a[1])[0];
        const mostConnected = Object.entries(engagements)
            .sort((a, b) => b[1].length - a[1].length)[0];

        return {
            totalEngagements,
            totalUsers,
            verifiedCount,
            topEngagementType: topEngagementType ? `${topEngagementType[0]} (${topEngagementType[1]})` : 'N/A',
            mostConnected: mostConnected ? `${mostConnected[0]} (${mostConnected[1].length})` : 'N/A',
        };
    };

    const stats = calculateStats();

    useEffect(() => {
        if (!containerRef.current || !userData || !engagements) return;

        let isMounted = true;

        const handleResize = () => {
            if (networkRef.current && containerRef.current && isMounted) {
                networkRef.current.setSize(
                    containerRef.current.clientWidth,
                    containerRef.current.clientHeight
                );
            }
        };

        const initNetwork = async () => {
            try {
                // Clean up existing network if username changed
                if (networkRef.current) {
                    try {
                        networkRef.current.destroy();
                    } catch (e) {
                        // Ignore
                    }
                    networkRef.current = null;
                    // Clear container before creating new network
                    if (containerRef.current) {
                        containerRef.current.innerHTML = '';
                    }
                }

                const { Network, DataSet } = await import('vis-network/standalone');

                if (!isMounted || !containerRef.current) return;

                const nodes = new DataSet([
                    {
                        id: username,
                        label: username,
                        value: 10,
                        shape: 'circularImage',
                        image: userData.profile_image_url,
                        borderWidth: 4,
                        size: 50,
                        color: {
                            border: '#FF6B35',
                            background: '#FFFFFF',
                            highlight: {
                                border: '#FF6B35',
                                background: '#FFFFFF',
                            },
                        },
                        font: {
                            color: '#1A1A1A',
                            size: 14,
                            face: 'var(--font-inter), system-ui, sans-serif',
                            strokeWidth: 2,
                            strokeColor: '#FFFFFF',
                        },
                        shadow: {
                            enabled: true,
                            color: 'rgba(255, 107, 53, 0.3)',
                            size: 8,
                            x: 2,
                            y: 2,
                        },
                    },
                ]);

                const edges = new DataSet([]);

                // Store references for later manipulation
                nodesRef.current = nodes;
                edgesRef.current = edges;

                Object.entries(engagements).forEach(([engagedWith, interactions]) => {
                    const userInfo = interactions[0];
                    const interactionCount = interactions.length;
                    const edgeWidth = Math.max(1, Math.min(4, Math.log(interactionCount) / 2 + 1));

                    nodes.add({
                        id: engagedWith,
                        label: engagedWith,
                        value: interactionCount,
                        shape: 'circularImage',
                        image: userInfo.engaged_user_profile_image,
                        borderWidth: 3,
                        size: Math.max(25, Math.min(40, 25 + interactionCount * 2)),
                        color: {
                            border: '#0052FF',
                            background: '#FFFFFF',
                            highlight: {
                                border: '#0052FF',
                                background: '#FFFFFF',
                            },
                        },
                        font: {
                            color: '#1A1A1A',
                            size: 12,
                            face: 'var(--font-inter), system-ui, sans-serif',
                            strokeWidth: 2,
                            strokeColor: '#FFFFFF',
                        },
                        shadow: {
                            enabled: true,
                            color: 'rgba(0, 82, 255, 0.25)',
                            size: 6,
                            x: 1,
                            y: 1,
                        },
                    });

                    edges.add({
                        id: `${username}-${engagedWith}`,
                        from: username,
                        to: engagedWith,
                        value: interactionCount,
                        color: {
                            color: '#0052FF',
                            highlight: '#FF6B35',
                            opacity: 0.6,
                        },
                        width: edgeWidth,
                        smooth: {
                            type: 'continuous',
                            roundness: 0.5,
                        },
                        shadow: {
                            enabled: true,
                            color: 'rgba(0, 82, 255, 0.2)',
                            size: 3,
                        },
                    });
                });

                const data = { nodes, edges };

                const options = {
                    nodes: {
                        scaling: {
                            min: 20,
                            max: 50,
                        },
                        font: {
                            size: 14,
                            face: 'var(--font-inter), system-ui, sans-serif',
                            strokeWidth: 2,
                            strokeColor: '#FFFFFF',
                        },
                        borderWidth: 3,
                        shadow: {
                            enabled: true,
                        },
                        chosen: {
                            node: (values: any, id: string, selected: boolean) => {
                                if (selected) {
                                    values.borderWidth = 5;
                                    values.shadow = {
                                        enabled: true,
                                        color: '#FF6B35',
                                        size: 12,
                                    };
                                }
                            },
                        },
                    },
                    edges: {
                        smooth: {
                            type: 'continuous',
                            roundness: 0.5,
                        },
                        color: {
                            opacity: 0.6,
                        },
                        shadow: {
                            enabled: true,
                        },
                        arrows: {
                            to: {
                                enabled: false,
                            },
                        },
                    },
                    interaction: {
                        hover: true,
                        tooltipDelay: 100,
                        zoomView: true,
                        dragView: true,
                        selectConnectedEdges: true,
                        selectable: true,
                        multiselect: 'ctrlKey', // Require Ctrl for multi-select
                    },
                    physics: {
                        forceAtlas2Based: {
                            gravitationalConstant: -80,
                            centralGravity: 0.01,
                            springLength: 150,
                            springConstant: 0.08,
                            damping: 0.4,
                        },
                        maxVelocity: 50,
                        solver: 'forceAtlas2Based',
                        timestep: 0.35,
                        stabilization: {
                            iterations: 200,
                            updateInterval: 25,
                        },
                    },
                };

                networkRef.current = new Network(containerRef.current, data, options);

                // Handle node selection
                networkRef.current.on('selectNode', (params: any) => {
                    if (isMounted) {
                        setSelectedNodes(params.nodes);
                    }
                });

                networkRef.current.on('deselectNode', () => {
                    if (isMounted) {
                        setSelectedNodes([]);
                    }
                });

                // Resize after mount
                setTimeout(() => {
                    if (isMounted && networkRef.current && containerRef.current) {
                        networkRef.current.setSize(
                            containerRef.current.clientWidth,
                            containerRef.current.clientHeight
                        );
                    }
                }, 100);

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load vis-network:', error);
                setIsLoading(false);
            }
        };

        initNetwork();
        window.addEventListener('resize', handleResize);

        return () => {
            isMounted = false;
            window.removeEventListener('resize', handleResize);

            if (networkRef.current) {
                try {
                    networkRef.current.destroy();
                } catch (e) {
                    // Ignore - network may already be destroyed
                }
                networkRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]); // Re-run when username changes

    // Handle delete key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodes.length > 0 && networkRef.current && nodesRef.current && edgesRef.current) {
                    selectedNodes.forEach((nodeId) => {
                        // Don't allow deleting the main user
                        if (nodeId !== username) {
                            // Remove connected edges
                            const edgesToRemove = edgesRef.current.get({
                                filter: (edge: any) => edge.from === nodeId || edge.to === nodeId
                            });
                            if (edgesToRemove && edgesToRemove.length > 0) {
                                edgesRef.current.remove(edgesToRemove);
                            }

                            // Remove node
                            nodesRef.current.remove(nodeId);
                        }
                    });
                    setSelectedNodes([]);
                    networkRef.current.setSelection({ nodes: [], edges: [] });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedNodes, username]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundImage: `
                    radial-gradient(circle, #ccc 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0',
                backgroundColor: '#FAFAFA',
                position: 'relative',
            }}
        >
            {/* Controls Panel */}
            <div
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}
            >
                {/* Statistics Panel */}
                {showStats && (
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #E5E5E5',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            minWidth: '200px',
                            fontSize: '0.875rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#1A1A1A',
                                }}
                            >
                                Statistics
                            </h3>
                            <button
                                onClick={() => setShowStats(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666666',
                                    fontSize: '1rem',
                                    padding: 0,
                                    width: '1.5rem',
                                    height: '1.5rem',
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666666' }}>Total Users:</span>
                                <span style={{ fontWeight: '600' }}>{stats.totalUsers}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666666' }}>Total Engagements:</span>
                                <span style={{ fontWeight: '600' }}>{stats.totalEngagements}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666666' }}>Verified:</span>
                                <span style={{ fontWeight: '600' }}>{stats.verifiedCount}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #E5E5E5' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666666' }}>Top Type:</div>
                                <div style={{ fontWeight: '600' }}>{stats.topEngagementType}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666666' }}>Most Connected:</div>
                                <div style={{ fontWeight: '600' }}>{stats.mostConnected}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show Stats Button (when hidden) */}
                {!showStats && (
                    <button
                        onClick={() => setShowStats(true)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #E5E5E5',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#666666',
                        }}
                    >
                        Show Stats
                    </button>
                )}
            </div>

            {/* Delete Hint */}
            {selectedNodes.length > 0 && selectedNodes.every(nodeId => nodeId !== username) && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255, 107, 53, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #FF6B35',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        color: '#FFFFFF',
                        zIndex: 100,
                        pointerEvents: 'none',
                        textAlign: 'center',
                    }}
                >
                    {selectedNodes.length === 1 ? (
                        <>
                            Press <kbd style={{ background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', margin: '0 0.25rem' }}>Delete</kbd> to remove node
                            <br />
                            <span style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.25rem', display: 'block' }}>
                                Hold <kbd style={{ background: 'rgba(0,0,0,0.2)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', margin: '0 0.125rem' }}>Ctrl</kbd> + Click to select multiple
                            </span>
                        </>
                    ) : (
                        <>
                            {selectedNodes.length} nodes selected. Press <kbd style={{ background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', margin: '0 0.25rem' }}>Delete</kbd> to remove all
                        </>
                    )}
                </div>
            )}

            {/* Selection Hint (when no nodes selected) */}
            {selectedNodes.length === 0 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '0.75rem',
                        color: '#FFFFFF',
                        zIndex: 100,
                        pointerEvents: 'none',
                        textAlign: 'center',
                        opacity: 0.7,
                    }}
                >
                    Click to select nodes • Hold <kbd style={{ background: 'rgba(255,255,255,0.2)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', margin: '0 0.125rem' }}>Ctrl</kbd> + Click for multi-select • Press <kbd style={{ background: 'rgba(255,255,255,0.2)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', margin: '0 0.125rem' }}>Delete</kbd> to remove
                </div>
            )}

            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#666666',
                        fontSize: '0.875rem',
                        pointerEvents: 'none',
                    }}
                >
                    Loading graph...
                </div>
            )}
        </div>
    );
}

