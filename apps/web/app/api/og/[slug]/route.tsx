import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'Study Abroad with Endow Global'
  const subtitle = searchParams.get('subtitle') || 'Find your perfect university match'
  const country = searchParams.get('country') || ''

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0A0A0A',
        padding: '60px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: '#C41E3A',
        }}
      />
      <div
        style={{
          color: '#C41E3A',
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          letterSpacing: '0.1em',
        }}
      >
        ENDOW GLOBAL EDUCATION
      </div>
      <div
        style={{
          color: '#FFFFFF',
          fontSize: '52px',
          fontWeight: '700',
          lineHeight: 1.1,
          marginBottom: '16px',
        }}
      >
        {title}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: '28px' }}>
        {subtitle} {country && `· ${country}`}
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
