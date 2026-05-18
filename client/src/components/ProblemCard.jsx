import { BookOpen, Code2, PlayCircle } from 'lucide-react'

const difficultyClass = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}

function ResourceLink({ href, icon: Icon, label, problemTitle }) {
  if (!href) {
    return null
  }

  return (
    <a
      className="resource-link"
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`${label}: ${problemTitle}`}
      aria-label={`Open ${label.toLowerCase()} for ${problemTitle}`}
    >
      <Icon size={16} />
      {label}
    </a>
  )
}

function ProblemCard({ problem, onToggle, isSaving }) {
  return (
    <article className={`problem-card ${problem.completed ? 'completed' : ''}`}>
      <div className="problem-main">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={problem.completed}
            disabled={isSaving}
            aria-label={`${problem.completed ? 'Mark incomplete' : 'Mark complete'}: ${problem.title}`}
            onChange={(event) => onToggle(problem.id, event.target.checked)}
          />
          <span>
            <strong title={problem.title}>{problem.title}</strong>
            <small aria-live="polite">
              {isSaving ? 'Saving...' : problem.completed ? 'Completed' : 'Not solved yet'}
            </small>
          </span>
        </label>
      </div>

      <span className={`difficulty ${difficultyClass[problem.difficulty]}`}>
        {problem.difficulty}
      </span>

      <div className="resources">
        <ResourceLink
          href={problem.resources?.youtube}
          icon={PlayCircle}
          label="Tutorial"
          problemTitle={problem.title}
        />
        <ResourceLink
          href={problem.resources?.practice}
          icon={Code2}
          label="Practice"
          problemTitle={problem.title}
        />
        <ResourceLink
          href={problem.resources?.article}
          icon={BookOpen}
          label="Article"
          problemTitle={problem.title}
        />
      </div>
    </article>
  )
}

export default ProblemCard
