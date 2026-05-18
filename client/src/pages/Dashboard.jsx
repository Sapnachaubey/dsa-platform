import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, Layers3 } from 'lucide-react'
import { getApiError, sheetApi } from '../api/client'
import ProgressSummary from '../components/ProgressSummary'

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    sheetApi
      .getDashboard()
      .then(setDashboard)
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="state-card loading-state" role="status" aria-live="polite">
        <strong>Loading dashboard</strong>
        <span>Fetching your saved progress and topic summary.</span>
        <div className="loading-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-card error" role="alert">
        <strong>Could not load dashboard</strong>
        <span>{error}</span>
        <button className="ghost-button" type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    )
  }

  if (!dashboard?.summary || !dashboard.topicStats?.length) {
    return (
      <div className="state-card empty-state">
        <strong>No DSA progress yet</strong>
        <span>Open the sheet, choose a topic, and mark problems as solved.</span>
        <Link className="primary-button inline-button" to="/sheet">
          Open DSA Sheet
          <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Your DSA progress at a glance.</h1>
          <p>
            Review completed problems, spot weak topics, and continue from the
            chapter that needs attention.
          </p>
        </div>
        <Link className="primary-button inline-button" to="/sheet">
          Open DSA Sheet
          <ArrowRight size={18} />
        </Link>
      </section>

      <ProgressSummary summary={dashboard.summary} />

      <section className="grid-two">
        <div className="panel">
          <div className="panel-heading">
            <Layers3 size={20} />
            <h2>Topic Progress</h2>
          </div>
          <div className="progress-list">
            {dashboard.topicStats.map((topic) => (
              <div className="progress-row" key={topic.id}>
                <div>
                  <strong title={topic.title}>{topic.title}</strong>
                  <small>
                    {topic.completed}/{topic.total} completed
                  </small>
                </div>
                <div className="bar">
                  <span style={{ width: `${topic.percentage}%` }} />
                </div>
                <b>{topic.percentage}%</b>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <BookOpenCheck size={20} />
            <h2>Difficulty Split</h2>
          </div>
          <div className="difficulty-stack">
            {dashboard.difficultyStats.map((item) => (
              <div className="difficulty-tile" key={item.difficulty}>
                <span className={`difficulty ${item.difficulty.toLowerCase()}`}>
                  {item.difficulty}
                </span>
                <strong>
                  {item.completed}/{item.total}
                </strong>
                <small>completed</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
