'use client';

import { useState } from 'react';

export default function XSocialGraphsTrinket() {
    const [followers, setFollowers] = useState(1247);
    const [following, setFollowing] = useState(89);
    const [posts, setPosts] = useState(156);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Network Visualization */}
            <div style={{
                background: 'rgba(29, 161, 242, 0.1)',
                border: '2px solid #1da1f2',
                borderRadius: '1rem',
                padding: '3rem 2rem',
                marginBottom: '3rem',
                textAlign: 'center',
                maxWidth: '800px',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: '#1da1f2',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-outfit), sans-serif'
                }}>
                    Network Analysis
                </div>
                <div style={{
                    fontSize: '1.25rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem'
                }}>
                    Interactive social network visualization
                </div>

                {/* Mock Network Graph */}
                <div style={{
                    width: '100%',
                    height: '300px',
                    background: 'rgba(29, 161, 242, 0.05)',
                    border: '1px solid rgba(29, 161, 242, 0.2)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.125rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    Interactive Network Graph Visualization
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem',
                width: '100%',
                maxWidth: '800px'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#1da1f2', marginBottom: '0.5rem' }}>
                        {followers.toLocaleString()}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Followers</div>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#1da1f2', marginBottom: '0.5rem' }}>
                        {following}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Following</div>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#1da1f2', marginBottom: '0.5rem' }}>
                        {posts}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Posts</div>
                </div>
            </div>

            {/* Analytics */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '2rem',
                width: '100%',
                maxWidth: '800px'
            }}>
                <h3 style={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: '700',
                    fontSize: '1.5rem',
                    color: '#FFFFFF',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    Engagement Analytics
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1da1f2' }}>2.4K</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>Avg Likes</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1da1f2' }}>156</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>Avg Retweets</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1da1f2' }}>89</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>Avg Comments</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1da1f2' }}>4.2%</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>Engagement Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

