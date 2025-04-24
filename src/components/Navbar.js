'use client'

export default function Navbar() {
    return (
        <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>KYC-Nexus</div>
        </nav>
    );
}