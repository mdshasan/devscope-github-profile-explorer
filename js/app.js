import {getUser,getRepositories} from "./api.js";
import {showState,showLoading,renderProfile,renderRepositories,showLoadMore,setSearchLoading} from "./ui.js";
const form=document.querySelector("#search-form"),input=document.querySelector("#username"),sort=document.querySelector("#sort"),more=document.querySelector("#load-more");
const state={username:"",items:[],page:1,hasMore:false};
async function search(username){
  const clean=username.trim().replace(/^@/,"");
  if(!clean){showState("Enter a username","Type a GitHub username to explore its public profile.",true);input.focus();return;}
  state.username=clean;state.items=[];state.page=1;showLoading();setSearchLoading(true);showLoadMore(false);
  try{
    const [user,items]=await Promise.all([getUser(clean),getRepositories(clean,1)]);
    state.items=items;state.hasMore=items.length===12;renderProfile(user);sortAndRender();showLoadMore(state.hasMore);sort.value="updated";
  }catch(error){showState("Unable to load profile",error.message||"Something went wrong. Please try again.",true);}
  finally{setSearchLoading(false);}
}
function sortAndRender(){
  const items=[...state.items];
  if(sort.value==="stars")items.sort((a,b)=>b.stargazers_count-a.stargazers_count);
  else if(sort.value==="name")items.sort((a,b)=>a.name.localeCompare(b.name));
  else items.sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));
  renderRepositories(items,state.items.length);
}
form.addEventListener("submit",event=>{event.preventDefault();search(input.value);});
document.querySelectorAll(".sample").forEach(button=>button.addEventListener("click",()=>{input.value=button.textContent;search(input.value);}));
sort.addEventListener("change",sortAndRender);
more.addEventListener("click",async()=>{
  if(!state.username||!state.hasMore)return;
  more.disabled=true;more.textContent="Loading…";
  try{const next=state.page+1,items=await getRepositories(state.username,next);state.page=next;state.items.push(...items);state.hasMore=items.length===12;sortAndRender();showLoadMore(state.hasMore);}
  catch(error){showState("Couldn't load more repositories",error.message,true);}
  finally{more.disabled=false;more.textContent="Load more repositories ↓";}
});
