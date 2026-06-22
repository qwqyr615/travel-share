export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border-cream)',
      padding: 'var(--space-xl) var(--space-md)',
      marginTop: 'var(--space-2xl)',
      textAlign: 'center',
      color: 'var(--color-stone-gray)',
      fontSize: 'var(--fs-small)',
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-serif)', marginBottom: 4 }}>
          🏔️ Travel Share — 旅游游记分享平台
        </p>
        <p>© {new Date().getFullYear()} Travel Share. 记录旅途的每一刻精彩。</p>
      </div>
    </footer>
  )
}
