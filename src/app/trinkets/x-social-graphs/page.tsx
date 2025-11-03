import Link from 'next/link';
import XSocialGraphsTrinket from './XSocialGraphsTrinket';

export default function XSocialGraphsPage() {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            background: '#FAFAFA',
            color: '#1A1A1A',
            fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: '#FFFFFF',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #E5E5E5',
                padding: '1rem 2rem'
            }}>
                <Link href="/" style={{
                    color: '#1A1A1A',
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
            <div style={{
                height: 'calc(100vh - 4rem)',
                width: '100%',
                margin: 0,
                padding: 0,
                marginTop: '4rem',
            }}>
                <XSocialGraphsTrinket />
            </div>
        </div>
    );
}
