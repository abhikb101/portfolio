'use client';

import { useState } from 'react';

export default function CodeTrackerTrinket() {
    const [todayHours, setTodayHours] = useState(6.5);
    const [weekHours, setWeekHours] = useState(42.3);
    const [languages, setLanguages] = useState([
        { name: 'TypeScript', hours: 24.5, color: '#3178c6' },
        { name: 'Python', hours: 18.2, color: '#3776ab' },
        { name: 'JavaScript', hours: 12.8, color: '#f7df1e' },
        { name: 'Rust', hours: 8.7, color: '#000000' }
    ]);

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
            {/* Today's Stats */}
            <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '2px solid #6366f1',
                borderRadius: '1rem',
                padding: '3rem 2rem',
                marginBottom: '3rem',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    color: '#6366f1',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-outfit), sans-serif'
                }}>
                    {todayHours}h
                </div>
                <div style={{
                    fontSize: '1.5rem',
                    color: '#FFFFFF',
                    marginBottom: '2rem'
                }}>
                    Today's Coding Time
                </div>

                {/* Progress Bar */}
                <div style={{
                    width: '100%',
                    height: '20px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        width: `${(todayHours / 8) * 100}%`,
                        height: '100%',
                        background: '#6366f1',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
                <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem'
                }}>
                    {Math.round((todayHours / 8) * 100)}% of daily goal (8h)
                </div>
            </div>

            {/* Weekly Overview */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '2rem',
                marginBottom: '2rem',
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
                    This Week
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#6366f1' }}>{weekHours}h</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Time</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#6366f1' }}>6</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Active Days</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#6366f1' }}>7.1h</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Daily Average</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#6366f1' }}>4</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Languages</div>
                    </div>
                </div>
            </div>

            {/* Language Breakdown */}
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
                    Language Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {languages.map((lang, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: lang.color
                                }}></div>
                                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{lang.name}</div>
                            </div>
                            <div style={{ color: '#6366f1', fontWeight: '600' }}>{lang.hours}h</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Productivity Tips */}
            <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '0.75rem',
                padding: '2rem',
                marginTop: '2rem',
                width: '100%',
                maxWidth: '800px'
            }}>
                <h3 style={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                    color: '#6366f1',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    💡 Productivity Tip
                </h3>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    margin: 0,
                    textAlign: 'center'
                }}>
                    You're coding {Math.round((todayHours / 8) * 100)}% of your daily goal!
                    {todayHours < 6 ? ' Try the Pomodoro technique to boost your focus.' :
                        todayHours >= 8 ? ' Great job hitting your daily target!' :
                            ' You\'re on track to reach your goal today.'}
                </p>
            </div>
        </div>
    );
}

