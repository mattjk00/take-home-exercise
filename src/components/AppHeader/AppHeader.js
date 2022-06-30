import "./AppHeader.css"

export default function AppHeader({handleSortChange}) {
    return (
      <div className="header-container">
        <div className="header-title">Team Members</div>

        <div className="sortBox">
          <p className="sortLabel">Sort by:</p>
          <select className="dropdown" onChange={handleSortChange}>
            <option value={0}>Date Joined ↑</option>
            <option value={1}>Date Joined ↓</option>
            <option value={2}>Last Name A-Z</option>
            <option value={3}>Last Name Z-A</option>
          </select>
        </div>
      </div>
    );
}