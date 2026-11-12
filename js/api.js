const BASE = "https://api.github.com";
async function request(url) {
  const response = await fetch(url, {headers:{Accept:"application/vnd.github+json"}});
  if (response.status === 404) throw new Error("We couldn't find that GitHub user. Check the username and try again.");
  if (response.status === 403) throw new Error("GitHub API rate limit reached. Wait a little and try again.");
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}). Please try again.`);
  return response.json();
}
export const getUser = username => request(`${BASE}/users/${encodeURIComponent(username)}`);
export function getRepositories(username,page=1,perPage=12) {
  const params = new URLSearchParams({sort:"updated",direction:"desc",per_page:String(perPage),page:String(page)});
  return request(`${BASE}/users/${encodeURIComponent(username)}/repos?${params}`);
}
