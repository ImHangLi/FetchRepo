import { useState } from "react"
import { Octokit } from "@octokit/rest"
import RepoViewer from "./components/RepoViewer"
import TokenInput from "./components/TokenInput"
import "./App.css"

// Initialize Octokit with the token from environment variables (if available)
const createOctokit = token => {
  return new Octokit({
    auth: token,
    userAgent: "GitHub-Content-Viewer-React v1.0",
  })
}

function App() {
  // State for GitHub token
  const [token, setToken] = useState(import.meta.env.VITE_GITHUB_TOKEN || "")
  const [octokit, setOctokit] = useState(() =>
    createOctokit(import.meta.env.VITE_GITHUB_TOKEN || "")
  )

  // Handle token update
  const handleTokenUpdate = newToken => {
    setToken(newToken)
    setOctokit(createOctokit(newToken))
  }

  return (
    <div className="app">
      <header>
        <h1>GitHub Repository Content Viewer</h1>
        <TokenInput token={token} onTokenUpdate={handleTokenUpdate} />
      </header>
      <main>
        <RepoViewer octokit={octokit} />
      </main>
      <footer>
        <p>
          Built with React + Vite using{" "}
          <a
            href="https://docs.github.com/en/rest/repos/contents"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Contents API
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
