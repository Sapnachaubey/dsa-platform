function ProgressSummary({ summary, compact = false }) {
  const completed = summary?.completed || 0
  const total = summary?.total || 0
  const percentage = summary?.percentage || 0
  const remaining = Math.max(total - completed, 0)

  return (
    <section className={`summary-card ${compact ? 'compact' : ''}`}>
      <div className="summary-copy">
        <p className="eyebrow">Overall</p>
        <h2>{completed} solved</h2>
        <p className="muted">
          {remaining} problems left in this sheet
        </p>
      </div>

      <div className="summary-meter" aria-label={`${percentage}% complete`}>
        <div className="meter-label">
          <span>{percentage}% complete</span>
          <span>
            {completed}/{total}
          </span>
        </div>
        <div className="meter-track">
          <span style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {!compact && (
        <div className="summary-stats">
          <span>{total} total problems</span>
          <span>{remaining} remaining</span>
          <span>Progress saves automatically</span>
        </div>
      )}
    </section>
  )
}

export default ProgressSummary
