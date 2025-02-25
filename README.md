# FetchRepo

A minimal web application to fetch and view GitHub repository contents using the [GitHub Contents API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28).

## Features

- View public and private GitHub repository contents
- Navigate through directories with breadcrumb navigation
- Real-time API request/response visualization
- Modern, minimal user interface

## Setup

1. Clone the repository
   ```bash
   git clone git@github.com:ImHangLi/FetchRepo.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## GitHub Token Setup

To access private repositories, you need a GitHub Personal Access Token (fine-grained). You can create one at [GitHub Token Settings](https://github.com/settings/personal-access-tokens):

1. Go to [GitHub Token Settings](https://github.com/settings/personal-access-tokens) → Fine-grained tokens
2. Click "Generate new token"
3. Configure the token:
   - Token name: Give it a descriptive name
   - Expiration: Choose as needed
   - Repository access: Select specific repositories you want to access
   - Permissions: Under "Repository permissions", select:
     - Contents: Read access (Required for viewing repository contents)
4. Click "Generate token" and copy it
5. Paste the token in the application's token input field when needed

## How It Works

Here's a minimal example of how to fetch repository contents using the [GitHub Contents API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28):

```javascript
// 1. Initialize Octokit with your token
import { Octokit } from "@octokit/rest"
const octokit = new Octokit({ auth: token }) // token from user input

// 2. Fetch repository contents
async function fetchContents(owner, repo, path = "") {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    })

    // Response will be either a file or an array of files/directories
    const contents = Array.isArray(response.data)
      ? response.data // Directory contents
      : [response.data] // Single file

    return contents
  } catch (error) {
    console.error("Error fetching contents:", error)
    throw error
  }
}

// 3. Fetch and decode file content
async function fetchFileContent(owner, repo, path) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    })

    // GitHub API returns content in base64
    const content = atob(response.data.content)
    return content
  } catch (error) {
    console.error("Error fetching file:", error)
    throw error
  }
}

// Example usage:
// List repository contents
const contents = await fetchContents("owner", "repo")

// Get file content
const fileContent = await fetchFileContent("owner", "repo", "path/to/file.txt")
```

The GitHub API endpoints used:

- [`GET /repos/{owner}/{repo}/contents/{path}`](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content): Fetch repository contents or file content
- Response includes:
  - For directories: Array of file/directory objects
  - For files: Single file object with base64-encoded content
