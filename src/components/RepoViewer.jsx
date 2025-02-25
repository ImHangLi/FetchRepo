import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { FaFolder, FaFile, FaChevronRight } from "react-icons/fa"

/**
 * Main component for viewing repository contents
 * Handles fetching and displaying both public and private repository contents
 * Uses the GitHub Contents API via Octokit
 */
const RepoViewer = ({ octokit }) => {
  const [repoPath, setRepoPath] = useState("")
  const [currentPath, setCurrentPath] = useState([])
  const [contents, setContents] = useState(null)
  const [fileContent, setFileContent] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastApiCall, setLastApiCall] = useState(null)
  const [lastApiResponse, setLastApiResponse] = useState(null)

  // Fetch example content on mount
  useEffect(() => {
    const loadInitialContent = async () => {
      const owner = "imhangli"
      const repo = "fetchrepo"
      const path = "README.md"

      setCurrentPath([owner, repo])
      await fetchFileContent(owner, repo, path)
    }
    loadInitialContent()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Format file size for display
  const formatSize = bytes => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Format JSON for display
  const formatJson = obj => {
    return JSON.stringify(obj, null, 2)
  }

  // Fetch repository contents
  const fetchContents = async (owner, repo, path = "") => {
    setLoading(true)
    setError(null)
    setFileContent(null)

    const apiCall = {
      endpoint: `GET /repos/${owner}/${repo}/contents/${path}`,
      parameters: { owner, repo, path },
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
    setLastApiCall(apiCall)

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      })

      setLastApiResponse({
        status: response.status,
        headers: response.headers,
        data: response.data,
      })
      setContents(
        Array.isArray(response.data) ? response.data : [response.data]
      )
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching repository contents"
      )
      setContents(null)
      setLastApiResponse({
        status: err.response?.status,
        headers: err.response?.headers,
        error: err.response?.data,
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch file content
  const fetchFileContent = async (owner, repo, path) => {
    setLoading(true)
    setError(null)

    const apiCall = {
      endpoint: `GET /repos/${owner}/${repo}/contents/${path}`,
      parameters: { owner, repo, path },
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
    setLastApiCall(apiCall)

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      })

      setLastApiResponse({
        status: response.status,
        headers: response.headers,
        data: response.data,
      })

      // For files larger than 1MB, display a message instead of content
      if (response.data.size > 1024 * 1024) {
        setFileContent({
          content:
            "File is too large to display. Please download it directly from GitHub.",
          name: response.data.name,
        })
        return
      }

      // Decode base64 content
      const content = atob(response.data.content)
      setFileContent({
        content,
        name: response.data.name,
      })
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching file content")
      setLastApiResponse({
        status: err.response?.status,
        headers: err.response?.headers,
        error: err.response?.data,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle repository path submission
  const handleSubmit = async e => {
    e.preventDefault()
    const [owner, repo] = repoPath.split("/")

    if (!owner || !repo) {
      setError("Please enter a valid repository path (owner/repo)")
      return
    }

    setCurrentPath([owner, repo])
    await fetchContents(owner, repo)
  }

  // Handle directory navigation
  const handleNavigate = async item => {
    const [owner, repo] = currentPath
    const path = item.path

    if (item.type === "dir") {
      setCurrentPath([owner, repo, ...path.split("/")])
      await fetchContents(owner, repo, path)
    } else {
      await fetchFileContent(owner, repo, path)
    }
  }

  // Render breadcrumb navigation
  const renderBreadcrumb = () => {
    if (currentPath.length < 2) return null

    return (
      <div className="breadcrumb">
        {currentPath.map((item, index) => (
          <span key={index}>
            {index > 0 && <FaChevronRight className="breadcrumb-separator" />}
            <button
              onClick={() => {
                const newPath = currentPath.slice(0, index + 1)
                setCurrentPath(newPath)
                if (index < 2) {
                  fetchContents(currentPath[0], currentPath[1])
                } else {
                  fetchContents(
                    currentPath[0],
                    currentPath[1],
                    newPath.slice(2).join("/")
                  )
                }
              }}
              className="breadcrumb-button"
            >
              {item}
            </button>
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="repo-viewer">
      <form onSubmit={handleSubmit} className="repo-form">
        <input
          type="text"
          value={repoPath}
          onChange={e => setRepoPath(e.target.value)}
          placeholder="Enter repository path (e.g., octocat/Hello-World)"
          required
        />
        <button type="submit">View Repository</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="viewer-left">
        <h2>API Documentation</h2>
        {lastApiCall && (
          <div className="api-docs">
            <div className="api-section">
              <h3>Request</h3>
              <pre className="code-block">{formatJson(lastApiCall)}</pre>
            </div>
            {lastApiResponse && (
              <div className="api-section">
                <h3>Response</h3>
                <pre className="code-block">{formatJson(lastApiResponse)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="viewer-right">
        <h2>Repository Contents</h2>
        {currentPath.length > 0 && renderBreadcrumb()}

        {contents && !fileContent && (
          <div className="contents">
            {contents.map(item => (
              <div
                key={item.sha}
                className="content-item"
                onClick={() => handleNavigate(item)}
              >
                {item.type === "dir" ? <FaFolder /> : <FaFile />}
                <span className="item-name">{item.name}</span>
                {item.type === "file" && (
                  <span className="item-size">{formatSize(item.size)}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {fileContent && (
          <div className="file-viewer">
            <div className="file-header">
              <h3>{fileContent.name}</h3>
              <button onClick={() => setFileContent(null)}>Close</button>
            </div>
            <pre className="file-content">{fileContent.content}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

RepoViewer.propTypes = {
  octokit: PropTypes.object.isRequired,
}

export default RepoViewer
