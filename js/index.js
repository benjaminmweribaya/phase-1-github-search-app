document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("github-form"); // Updated to match HTML
    const searchInput = document.getElementById("search"); // Updated to match HTML
    const userResults = document.getElementById("user-list"); // Updated to match HTML
    const repoResults = document.getElementById("repos-list"); // Updated to match HTML
    const toggleButton = document.getElementById("toggle-search-type");
    let searchType = 'user'; // Default search type

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            if (searchType === 'user') {
                fetchUsers(query);
            } else {
                fetchRepos(query);
            }
        }
    });

    const fetchUsers = async (query) => {
        try {
            const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            const data = await response.json();
            displayUsers(data.items);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const displayUsers = (users) => {
        userResults.innerHTML = ""; // Clear previous results
        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50" />
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            userDiv.addEventListener("click", () => fetchUserRepos(user.login));
            userResults.appendChild(userDiv);
        });
    };

    const fetchUserRepos = async (username) => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            const repos = await response.json();
            displayRepos(repos);
        } catch (error) {
            console.error("Error fetching repos:", error);
        }
    };

    const displayRepos = (repos) => {
        repoResults.innerHTML = ""; // Clear previous results
        repos.forEach(repo => {
            const repoDiv = document.createElement("div");
            repoDiv.classList.add("repo");
            repoDiv.innerHTML = `
                <strong>${repo.name}</strong>: <a href="${repo.html_url}" target="_blank">View Repo</a>
            `;
            repoResults.appendChild(repoDiv);
        });
    };

    const fetchRepos = async (query) => {
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            const data = await response.json();
            displayRepos(data.items);
        } catch (error) {
            console.error("Error fetching repositories:", error);
        }
    };

    toggleButton.addEventListener('click', () => {
        // Toggle search type
        searchType = searchType === 'user' ? 'repo' : 'user';
        toggleButton.innerText = searchType === 'user' ? 'Search Repositories' : 'Search Users'; // Change button text
    });
});
