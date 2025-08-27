import React from 'react'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
  minimal?: boolean
}

export function ErrorFallback({ error, resetError, minimal = false }: ErrorFallbackProps) {
  if (minimal) {
    return (
      <div style={{
        width: '500px',
        minHeight: '600px',
        padding: '20px',
        background: 'hsl(220 15% 6%)',
        color: 'hsl(213 31% 91%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <div style={{ fontSize: '24px' }}>⚠️</div>
        <p style={{ fontSize: '14px', textAlign: 'center', opacity: 0.8 }}>
          Extension loading error
        </p>
        {resetError && (
          <button 
            onClick={resetError}
            style={{
              background: 'hsl(213 93% 68%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{
      width: '500px',
      minHeight: '600px',
      padding: '20px',
      background: 'hsl(220 15% 6%)',
      color: 'hsl(0 84% 60%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <h1 style={{ color: 'hsl(0 84% 60%)', marginBottom: '16px' }}>
        🚨 Extension Error
      </h1>
      <p style={{ marginBottom: '16px', fontSize: '14px', opacity: 0.9 }}>
        Something went wrong while loading the extension.
      </p>
      
      {error && (
        <details style={{ marginBottom: '16px' }}>
          <summary style={{ 
            cursor: 'pointer', 
            fontSize: '12px', 
            color: 'hsl(213 31% 91%)',
            marginBottom: '8px'
          }}>
            Error Details
          </summary>
          <pre style={{ 
            background: 'hsl(220 15% 9%)', 
            padding: '12px', 
            borderRadius: '6px',
            fontSize: '11px',
            overflow: 'auto',
            maxHeight: '200px',
            color: 'hsl(213 31% 91%)',
            border: '1px solid hsl(220 15% 15%)'
          }}>
            {error.toString()}
          </pre>
        </details>
      )}
      
      <div style={{ display: 'flex', gap: '8px' }}>
        {resetError && (
          <button 
            onClick={resetError}
            style={{
              background: 'hsl(213 93% 68%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Try Again
          </button>
        )}
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: 'hsl(0 84% 60%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reload Extension
        </button>
      </div>
    </div>
  )
}