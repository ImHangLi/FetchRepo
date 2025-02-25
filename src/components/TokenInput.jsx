import { useState } from "react"
import PropTypes from "prop-types"

/**
 * Component for handling GitHub personal access token input
 * Allows users to input and update their GitHub token for accessing private repositories
 */
const TokenInput = ({ token, onTokenUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputToken, setInputToken] = useState(token)

  const handleSubmit = e => {
    e.preventDefault()
    onTokenUpdate(inputToken)
    setIsEditing(false)
  }

  if (!isEditing && !token) {
    return (
      <div className="token-input">
        <button onClick={() => setIsEditing(true)}>
          Add GitHub Token (for private repos)
        </button>
        <small>
          Note: You can access public repositories without a token. For private
          repositories,{" "}
          <a
            href="https://github.com/settings/personal-access-tokens"
            target="_blank"
            rel="noopener noreferrer"
          >
            generate a token
          </a>
          .
        </small>
      </div>
    )
  }

  if (!isEditing) {
    return (
      <div className="token-input">
        <span>GitHub Token: ••••••••{token.slice(-4)}</span>
        <button onClick={() => setIsEditing(true)}>Change</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="token-input">
      <input
        type="password"
        value={inputToken}
        onChange={e => setInputToken(e.target.value)}
        placeholder="Enter GitHub Personal Access Token"
      />
      <button type="submit">Save Token</button>
      <button type="button" onClick={() => setIsEditing(false)}>
        Cancel
      </button>
      <small>
        <a
          href="https://github.com/settings/personal-access-tokens"
          target="_blank"
          rel="noopener noreferrer"
        >
          Generate a new token
        </a>{" "}
        with Contents read permission.
      </small>
    </form>
  )
}

TokenInput.propTypes = {
  token: PropTypes.string.isRequired,
  onTokenUpdate: PropTypes.func.isRequired,
}

export default TokenInput
