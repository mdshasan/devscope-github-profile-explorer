const $ = selector => document.querySelector(selector);
const message = $("#message"), results = $("#results"), profile = $("#profile"), repos = $("#repos");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const number = value => new Intl.NumberFormat().format(value ?? 0);
export function showState(title,description,error=false) {
  results.classList.add("hidden"); message.classList.remove("hidden");
  message.innerHTML = `<div class="state ${error?"error":""}"><div class="state-icon">${error?"!":"…"}</div><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p></div>`;
}
export function showLoading(){showState("Looking up profile…","Fetching public GitHub data. This should only take a moment.");}
function externalUrl(value) {
  try { const url = new URL(/^https?:\/\//i.test(value)?value:`https://${value}`); return ["http:","https:"].includes(url.protocol)?escapeHTML(url.href):"#"; }
  catch { return "#"; }
}
export function renderProfile(user) {
  message.classList.add("hidden"); results.classList.remove("hidden");
  const meta = [
    user.location ? `<span>⌖ ${escapeHTML(user.location)}</span>` : "",
    user.company ? `<span>▦ ${escapeHTML(user.company)}</span>` : "",
    user.blog ? `<span><a href="${externalUrl(user.blog)}" target="_blank" rel="noreferrer">↗ Website</a></span>` : "",
    `<span>Joined ${new Date(user.created_at).toLocaleDateString(undefined,{month:"short",year:"numeric"})}</span>`
  ].filter(Boolean).join("");
  profile.innerHTML = `<img class="avatar" src="${escapeHTML(user.avatar_url)}" alt="${escapeHTML(user.login)} avatar">
  <div><h2>${escapeHTML(user.name||user.login)}</h2><div class="login">@${escapeHTML(user.login)}</div>
  <p class="bio">${escapeHTML(user.bio||"This developer hasn't added a bio yet.")}</p><div class="meta">${meta}</div>
  <div class="stats"><div class="stat"><strong>${number(user.public_repos)}</strong><span>Repositories</span></div><div class="stat"><strong>${number(user.followers)}</strong><span>Followers</span></div><div class="stat"><strong>${number(user.following)}</strong><span>Following</span></div></div></div>
  <a class="profile-link" href="${escapeHTML(user.html_url)}" target="_blank" rel="noreferrer">View on GitHub ↗</a>`;
}
export function renderRepositories(items,total) {
  $("#repo-count").textContent=number(total);
  if(!items.length){repos.innerHTML='<div class="state"><h2>No public repositories</h2><p>This account has no public repositories to display.</p></div>';return;}
  repos.innerHTML=items.map(repo=>`<article class="repo">
  <a class="repo-title" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer">${escapeHTML(repo.name)}</a>
  <p>${escapeHTML(repo.description||"No description provided.")}</p>
  <div class="repo-meta">${repo.language?`<span>● ${escapeHTML(repo.language)}</span>`:""}<span>★ ${number(repo.stargazers_count)}</span><span>⑂ ${number(repo.forks_count)}</span><span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span></div>
  <a class="repo-link" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer">Explore repository ↗</a></article>`).join("");
}
export const showLoadMore = visible => $("#load-more").classList.toggle("hidden",!visible);
export function setSearchLoading(loading){const button=$("#search-button");button.disabled=loading;button.textContent=loading?"Searching…":"Explore profile →";}
