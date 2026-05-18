import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Target } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/dashboard">
          <span className="brand-icon">
            <Target size={22} />
          </span>
          <span>
            <strong>DSA Sheet</strong>
            <small>Interview Prep Tracker</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/sheet">Sheet</NavLink>
        </nav>

        <div className="profile-chip">
          <span>{user?.name}</span>
          <button className="ghost-button" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
