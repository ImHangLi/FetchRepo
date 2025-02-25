# GitHub Repository Content Viewer (React)

A modern React application demonstrating how to fetch and display GitHub repository contents using the GitHub REST API. This application supports both public and private repositories.

## Features

- View public repository contents without authentication
- Access private repositories using a GitHub Personal Access Token
- Navigate through repository directories
- View file contents
- Modern React components with hooks
- Clean, responsive UI

## Setup and Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your GitHub token (optional, for private repos):

```bash
VITE_GITHUB_TOKEN=your_personal_access_token
```

## Usage

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`
3. Enter a repository in the format "owner/repository"
4. For private repositories, ensure you've added your GitHub token in the `.env` file

## GitHub Token Setup (for private repositories)

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with the following scopes:
   - `repo` (Full control of private repositories)
   - `read:packages` (Optional, for accessing package contents)
3. Copy the token and add it to your `.env` file

## API Reference

This project uses the GitHub REST API v2022-11-28. For more information, see:

- [GitHub Contents API Documentation](https://docs.github.com/en/rest/repos/contents)

## Technical Details

- Built with React + Vite
- Uses Octokit REST client for GitHub API
- Modern ES6+ syntax
- Environment variables for secure token management

## Limitations

- Rate limiting applies (60 requests/hour for unauthenticated requests, 5000 requests/hour with authentication)
- File size limitations apply as per GitHub API
- Binary files are not displayed (only text-based files)

## License

MIT License - Feel free to use and modify as needed.
