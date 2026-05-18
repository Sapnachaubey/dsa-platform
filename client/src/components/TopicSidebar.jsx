function TopicSidebar({ topics, activeTopicId, onSelectTopic }) {
  return (
    <aside className="topic-sidebar" aria-label="DSA topics">
      <p className="eyebrow">Chapters</p>

      <label className="topic-select">
        <span>Choose chapter</span>
        <select
          value={activeTopicId || ''}
          disabled={!topics.length}
          onChange={(event) => onSelectTopic(event.target.value)}
        >
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title} ({topic.progress.completed}/{topic.progress.total})
            </option>
          ))}
        </select>
      </label>

      <div className="topic-list">
        {topics.map((topic) => (
          <button
            className={`topic-button ${activeTopicId === topic.id ? 'active' : ''}`}
            key={topic.id}
            type="button"
            aria-pressed={activeTopicId === topic.id}
            title={`${topic.title}: ${topic.progress.completed}/${topic.progress.total} solved`}
            onClick={() => onSelectTopic(topic.id)}
          >
            <span>
              <strong>{topic.title}</strong>
              <small>
                {topic.progress.completed}/{topic.progress.total} solved
              </small>
            </span>
            <span className="topic-progress">
              <span className="topic-track">
                <span style={{ width: `${topic.progress.percentage}%` }} />
              </span>
              <span className="topic-percent">{topic.progress.percentage}%</span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default TopicSidebar
