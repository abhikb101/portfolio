import Link from 'next/link';
import AptosScoreTrinket from './AptosScoreTrinket';

export default function AptosScorePage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1rem 2rem'
            }}>
                <Link href="/" style={{
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    ← Back to Portfolio
                </Link>
            </div>

            {/* Main Content */}
            <div style={{ paddingTop: '4rem' }}>
                <AptosScoreTrinket />
            </div>
        </div>
    );
}
