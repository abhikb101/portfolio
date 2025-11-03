'use client';

import { useState } from 'react';

export default function AptosScoreTrinket() {
    const [score, setScore] = useState(847);
    const [rank, setRank] = useState(1247);
    const [transactions, setTransactions] = useState(156);

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
            {/* Score Display */}
            <div style={{
                background: 'rgba(255, 107, 53, 0.1)',
                border: '2px solid #ff6b35',
                borderRadius: '1rem',
                padding: '3rem 2rem',
                marginBottom: '3rem',
                textAlign: 'center',
                maxWidth: '800px',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '6rem',
                    fontWeight: '800',
                    color: '#ff6b35',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-outfit), sans-serif'
                }}>
                    {score}
                </div>
                <div style={{
                    fontSize: '1.5rem',
                    color: '#FFFFFF',
                    marginBottom: '2rem'
                }}>
                    On-Chain Reputation Score
                </div>
                <div style={{
                    fontSize: '1.125rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem'
                }}>
                    Ranked #{rank.toLocaleString()} globally
                </div>

                {/* Score Breakdown */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '2rem'
                }}>
                    <div style={{
                        background: 'rgba(255, 107, 53, 0.1)',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        borderRadius: '0.5rem',
                        padding: '1rem'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ff6b35' }}>Activity</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FFFFFF' }}>92%</div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 107, 53, 0.1)',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        borderRadius: '0.5rem',
                        padding: '1rem'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ff6b35' }}>Trust</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FFFFFF' }}>88%</div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 107, 53, 0.1)',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        borderRadius: '0.5rem',
                        padding: '1rem'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ff6b35' }}>Network</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FFFFFF' }}>76%</div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
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
                    Recent Activity
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ff6b35' }}>{transactions}</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Transactions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ff6b35' }}>23</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>DeFi Interactions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ff6b35' }}>12</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>NFT Transactions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ff6b35' }}>8</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Governance Votes</div>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
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
                    Global Leaderboard
                </h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff6b35' }}>#{rank}</div>
                        <div style={{ color: '#FFFFFF' }}>Your Position</div>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ff6b35' }}>{score} pts</div>
                </div>
                <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                }}>
                    Top 15% of all Aptos users
                </div>
            </div>
        </div>
    );
}

