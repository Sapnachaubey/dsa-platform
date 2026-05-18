import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { getApiError, sheetApi } from '../api/client'
import ProblemCard from '../components/ProblemCard'
import ProgressSummary from '../components/ProgressSummary'
import TopicSidebar from '../components/TopicSidebar'

const difficulties = ['All', 'Easy', 'Medium', 'Hard']

const getOverallSummary = (topics) => {
  const totals = topics.reduce(
    (acc, topic) => ({
      completed: acc.completed + topic.progress.completed,
      total: acc.total + topic.progress.total,
    }),
    { completed: 0, total: 0 },
  )

  return {
    ...totals,
    percentage: totals.total ? Math.round((totals.completed / totals.total) * 100) : 0,
  }
}

const updateProblemInTopics = (topics, problemId, completed) =>
  topics.map((topic) => {
    const problems = topic.problems.map((problem) =>
      problem.id === problemId ? { ...problem, completed } : problem,
    )
    const completedCount = problems.filter((problem) => problem.completed).length

    return {
      ...topic,
      problems,
      progress: {
        completed: completedCount,
        total: problems.length,
        percentage: problems.length ? Math.round((completedCount / problems.length) * 100) : 0,
      },
    }
  })

function Sheet() {
  const [topics, setTopics] = useState([])
  const [activeTopicId, setActiveTopicId] = useState('')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [savingProblemId, setSavingProblemId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    sheetApi
      .getTopics()
      .then((data) => {
        setTopics(data.topics)
        setActiveTopicId(data.topics[0]?.id || '')
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) || topics[0]
  const summary = useMemo(() => getOverallSummary(topics), [topics])
  const activeTopicProgress = activeTopic?.progress || { completed: 0, total: 0, percentage: 0 }
  const visibleProblems = useMemo(() => {
    if (!activeTopic) {
      return []
    }

    return activeTopic.problems.filter((problem) => {
      const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase())
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty

      return matchesSearch && matchesDifficulty
    })
  }, [activeTopic, difficulty, search])

  const handleToggle = async (problemId, completed) => {
    const previousTopics = topics
    setSavingProblemId(problemId)
    setTopics((current) => updateProblemInTopics(current, problemId, completed))

    try {
      await sheetApi.updateProgress(problemId, completed)
    } catch (err) {
      setTopics(previousTopics)
      setError(getApiError(err))
    } finally {
      setSavingProblemId('')
    }
  }

  const resetFilters = () => {
    setSearch('')
    setDifficulty('All')
  }

  if (loading) {
    return (
      <div className="state-card loading-state" role="status" aria-live="polite">
        <strong>Loading DSA sheet</strong>
        <span>Fetching topics, problems, resources, and saved checkbox state.</span>
        <div className="loading-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (error && !topics.length) {
    return (
      <div className="state-card error" role="alert">
        <strong>Could not load the sheet</strong>
        <span>{error}</span>
        <button className="ghost-button" type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    )
  }

  if (!topics.length) {
    return (
      <div className="state-card empty-state">
        <strong>No topics available</strong>
        <span>The DSA curriculum has not been seeded yet. Run the seed command and refresh.</span>
      </div>
    )
  }

  return (
    <div className="sheet-page">
      <section className="page-hero sheet-hero">
        <div>
          <p className="eyebrow">Practice Sheet</p>
          <h1>Topic-wise DSA practice.</h1>
          <p>
            Problems are grouped by chapter with difficulty tags, resource links,
            and saved completion checkboxes.
          </p>
        </div>
      </section>

      <ProgressSummary summary={summary} compact />

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <section className="sheet-layout">
        <TopicSidebar
          topics={topics}
          activeTopicId={activeTopic?.id}
          onSelectTopic={setActiveTopicId}
        />

        <div className="problem-panel" aria-busy={Boolean(savingProblemId)}>
          <div className="problem-toolbar">
            <div>
              <p className="eyebrow">Topic</p>
              <h2>{activeTopic?.title}</h2>
              <p className="muted">{activeTopic?.description}</p>
              <div className="topic-inline-progress">
                <span>
                  {activeTopicProgress.completed}/{activeTopicProgress.total} solved
                </span>
                <div className="meter-track">
                  <span style={{ width: `${activeTopicProgress.percentage}%` }} />
                </div>
              </div>
            </div>

            <div className="filters">
              <label className="search-box">
                <span className="sr-only">Search problems</span>
                <Search size={17} />
                <input
                  type="search"
                  placeholder="Search problems"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <label className="filter-select">
                <span>Difficulty</span>
                <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                  {difficulties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="problem-table-header" aria-hidden="true">
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Resources</span>
          </div>

          <div className="problem-list">
            {visibleProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onToggle={handleToggle}
                isSaving={savingProblemId === problem.id}
              />
            ))}
          </div>

          {!visibleProblems.length && (
            <div className="state-card empty-state compact-state">
              <strong>No matching problems</strong>
              <span>Try a different search term or difficulty level.</span>
              <button className="ghost-button" type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Sheet
