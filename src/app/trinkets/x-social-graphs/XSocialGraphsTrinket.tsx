'use client';

import { useState } from 'react';
import { useXGraphData } from './useXGraphData';
import NetworkGraph from './NetworkGraph';

interface XSocialGraphsTrinketProps {
    onClose?: () => void;
}

export default function XSocialGraphsTrinket({ onClose }: XSocialGraphsTrinketProps = {}) {
    const [searchUsername, setSearchUsername] = useState('');
    const { searchUser, data, isLoading, error } = useXGraphData();

    const handleSearch = () => {
        if (searchUsername.trim()) {
            searchUser(searchUsername);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
                padding: '0',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Search Header */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #E5E5E5',
                    position: 'relative',
                    zIndex: 10,
                    alignItems: 'center',
                }}
            >
                <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Twitter username..."
                    style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        border: '1px solid #E5E5E5',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        color: '#1A1A1A',
                        background: '#FFFFFF',
                    }}
                    className="placeholder:text-gray-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchUsername.trim()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: isLoading || !searchUsername.trim() ? '#ccc' : '#FF6B35',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: isLoading || !searchUsername.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'background 0.2s ease',
                    }}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
                {/* Close Button - Only show if onClose is provided */}
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '1px solid #E5E5E5',
                            borderRadius: '0.5rem',
                            width: '2.5rem',
                            height: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#666666',
                            fontSize: '1.5rem',
                            fontWeight: '300',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FF6B35';
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#FF6B35';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#666666';
                            e.currentTarget.style.borderColor = '#E5E5E5';
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div
                    style={{
                        padding: '0.75rem 1rem',
                        background: '#fee',
                        color: '#c00',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #E5E5E5',
                    }}
                >
                    {error}
                </div>
            )}

            {/* Graph Container */}
            {data && (
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <NetworkGraph
                        username={data.user.screen_name}
                        userData={data.user}
                        engagements={data.engagements}
                    />
                </div>
            )}

            {/* Empty State */}
            {!data && !isLoading && (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666666',
                        fontSize: '0.875rem',
                    }}
                >
                    Enter a username to visualize the social graph
                </div>
            )}
        </div>
    );
}
