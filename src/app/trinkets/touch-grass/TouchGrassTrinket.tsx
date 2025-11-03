'use client';

import { useState } from 'react';

export default function TouchGrassTrinket() {
    const [streak, setStreak] = useState(47);
    const [lastChecked, setLastChecked] = useState('2024-01-15');

    const checkIn = () => {
        setStreak(streak + 1);
        setLastChecked(new Date().toISOString().split('T')[0]);
    };

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
            {/* Streak Display */}
            <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '2px solid #00ff88',
                borderRadius: '1rem',
                padding: '3rem 2rem',
                marginBottom: '3rem',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '6rem',
                    fontWeight: '800',
                    color: '#00ff88',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-outfit), sans-serif'
                }}>
                    {streak}
                </div>
                <div style={{
                    fontSize: '1.5rem',
                    color: '#FFFFFF',
                    marginBottom: '2rem'
                }}>
                    Day Streak
                </div>
                <button
                    onClick={checkIn}
                    style={{
                        background: '#00ff88',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '1rem 2rem',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Check In Today
                </button>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem',
                width: '100%',
                maxWidth: '600px'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88', marginBottom: '0.5rem' }}>
                        {Math.floor(streak / 7)}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Weeks</div>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88', marginBottom: '0.5rem' }}>
                        {lastChecked}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Last Check-in</div>
                </div>
            </div>

            {/* Motivational Quote */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '2rem',
                fontStyle: 'italic',
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                "The best time to plant a tree was 20 years ago. The second best time is now."
            </div>
        </div>
    );
}

