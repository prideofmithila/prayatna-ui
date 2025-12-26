import{a as H,c as I,e as E,n as D}from"./chunk-52JGG3VS.js";import{j as z}from"./chunk-7IN67ZTX.js";import{$ as f,$b as T,Da as s,La as _,Qa as b,Ua as d,Xb as v,Yb as w,_ as u,ab as a,bb as t,cb as n,db as M,ib as O,jb as h,kb as m,rb as P,tb as r,ub as g,vb as x,wb as S,xb as y,yb as k,za as C}from"./chunk-ZNSDKUAS.js";function A(o,l){if(o&1){let e=O();t(0,"button",15),h("click",function(){let p=u(e).$implicit,c=m();return f(c.selectSection(p))}),t(1,"span",16),r(2),n(),t(3,"span",17),r(4),n()()}if(o&2){let e=l.$implicit,i=m();P("active",(i.selectedSection==null?null:i.selectedSection.id)===e.id),s(2),g(e.icon),s(2),g(e.title)}}function W(o,l){o&1&&(t(0,"div",18),r(1," No topics found matching your search. "),n())}function B(o,l){if(o&1&&(t(0,"div",19)(1,"div",20)(2,"h2"),r(3),n(),t(4,"p",21),r(5),n()(),M(6,"div",22),t(7,"div",23)(8,"p",24)(9,"span",3),r(10,"info"),n(),r(11),n()()()),o&2){let e=m();s(3),g(e.selectedSection.title),s(2),g(e.selectedSection.description),s(),a("innerHTML",e.selectedSection.content,C),s(5),x(" Last updated: ",e.selectedSection.lastUpdated," ")}}function F(o,l){o&1&&(t(0,"div",25)(1,"p"),r(2,"Select a topic from the sidebar to get started."),n()())}var U=class o{constructor(l){this.router=l;this.filteredSections=this.helpSections}selectedSection=null;searchTerm="";helpSections=[{id:"getting-started",title:"Getting Started",icon:"rocket_launch",description:"Learn the basics of Prayatna and how to create your first session",lastUpdated:"December 26, 2025",content:`
        <h3>Welcome to Prayatna!</h3>
        <p>Prayatna is a powerful study session planner and timer. Here's how to get started:</p>
        <ol>
          <li><strong>Create Your Account</strong> (Optional) - Sign in to sync sessions across devices</li>
          <li><strong>Create a Session</strong> - Define your study topic and tasks</li>
          <li><strong>Add Tasks</strong> - Break down your session into manageable tasks</li>
          <li><strong>Start the Timer</strong> - Begin tracking your study time</li>
          <li><strong>Monitor Progress</strong> - Watch your task and session progress in real-time</li>
        </ol>
        <p>Sessions are stored locally on your device by default. Sign in to sync them to your account.</p>
      `},{id:"create-sessions",title:"How to Create Sessions",icon:"add_circle",description:"Step-by-step guide for creating and managing study sessions",lastUpdated:"December 26, 2025",content:`
        <h3>Creating a Session</h3>
        <ol>
          <li><strong>Click the "+" button</strong> on the Sessions page</li>
          <li><strong>Enter Session Name</strong> - Give your session a clear, descriptive name</li>
          <li><strong>Set Duration</strong> (Optional) - Set how long you plan to study</li>
          <li><strong>Add Tasks</strong> - Click "Add Task" to break down your session</li>
          <li><strong>Add Subtasks</strong> (Optional) - Further break down complex tasks</li>
          <li><strong>Save Session</strong> - Click "Save" to create your session</li>
        </ol>
        <h4>Task vs Subtask</h4>
        <ul>
          <li><strong>Tasks</strong> - Main topics (e.g., "Read Chapter 3")</li>
          <li><strong>Subtasks</strong> - Detailed breakdowns (e.g., "Introduction", "Main Points", "Summary")</li>
        </ul>
        <p><em>Use subtasks for complex tasks to track granular progress.</em></p>
      `},{id:"session-timer",title:"Using the Session Timer",icon:"timer",description:"Master the session timer for effective time tracking",lastUpdated:"December 26, 2025",content:`
        <h3>Session Timer Overview</h3>
        <p>The timer tracks time at multiple levels:</p>
        <ul>
          <li><strong>Session Timer</strong> - Total time for entire session</li>
          <li><strong>Task Timer</strong> - Time spent on current task</li>
          <li><strong>Subtask Timer</strong> - Time for current subtask (if applicable)</li>
        </ul>
        <h4>How to Use</h4>
        <ol>
          <li>Click the <strong>Play button</strong> to start the timer</li>
          <li><strong>Select a task</strong> (if your session has tasks)</li>
          <li>All timers will start counting</li>
          <li>Click <strong>Pause</strong> to pause the timer</li>
          <li>Click <strong>Stop</strong> to end the session</li>
        </ol>
        <h4>Switching Tasks</h4>
        <p>While the timer is running, click a different task card to switch. The task timer resets but the session timer continues.</p>
      `},{id:"system-generated",title:"System-Generated Sessions",icon:"star",description:"Understanding platform templates and how to customize them",lastUpdated:"December 26, 2025",content:`
        <h3>What are System-Generated Sessions?</h3>
        <p>System-generated sessions are study templates created by Prayatna to help you get started. They're labeled with a "System Generated" tag.</p>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Read-Only Original</strong> - Templates cannot be directly edited</li>
          <li><strong>Create Your Copy</strong> - When you click Edit, a personal copy is created</li>
          <li><strong>Customize Freely</strong> - Your copy is fully editable without affecting the original template</li>
          <li><strong>Hide from Profile</strong> - Remove templates from your session list (signed-in users)</li>
        </ul>
        <h4>How to Edit a System-Generated Session</h4>
        <ol>
          <li>Open the system-generated session</li>
          <li>Click the <strong>Edit button</strong></li>
          <li>A confirmation dialog appears explaining the copy process</li>
          <li>Click <strong>"Continue Editing"</strong></li>
          <li>Your personal copy opens for editing</li>
          <li>Make your changes and save</li>
        </ol>
      `},{id:"account-sync",title:"Account & Syncing",icon:"cloud_sync",description:"Managing your account and syncing sessions across devices",lastUpdated:"December 26, 2025",content:`
        <h3>Session Storage</h3>
        <h4>Without Account (Guest)</h4>
        <ul>
          <li>Sessions stored on current device only</li>
          <li>Not accessible from other devices</li>
          <li>Lost if browser cache is cleared</li>
          <li>Useful for quick, temporary sessions</li>
        </ul>
        <h4>With Account (Signed In)</h4>
        <ul>
          <li>Sessions saved to your Prayatna account</li>
          <li>Accessible from any device</li>
          <li>Automatic syncing across devices</li>
          <li>Permanent backup of your sessions</li>
        </ul>
        <h4>How to Sign In</h4>
        <ol>
          <li>Click the <strong>Sign In button</strong> in the header</li>
          <li>Enter your email and password</li>
          <li>Your sessions will sync automatically</li>
        </ol>
        <p><em>System-generated sessions can only be hidden by signed-in users.</em></p>
      `},{id:"editing-sessions",title:"Editing & Managing Sessions",icon:"edit",description:"How to modify and manage your existing sessions",lastUpdated:"December 26, 2025",content:`
        <h3>Editing Sessions</h3>
        <h4>Your Own Sessions</h4>
        <ol>
          <li>Open the session in view mode</li>
          <li>Click the <strong>Edit button</strong> (pencil icon)</li>
          <li>Modify the session name, duration, tasks, or subtasks</li>
          <li>Click <strong>"Save Session"</strong></li>
          <li>Changes are applied immediately</li>
        </ol>
        <h4>System-Generated Sessions</h4>
        <p>See the <strong>System-Generated Sessions</strong> section for detailed steps.</p>
        <h3>Deleting Sessions</h3>
        <h4>Your Sessions</h4>
        <ol>
          <li>From the Sessions list, find the session</li>
          <li>Click the <strong>Delete button</strong> or option</li>
          <li>Confirm the deletion in the modal</li>
          <li>Session is permanently removed</li>
        </ol>
        <h4>What You Can Delete</h4>
        <ul>
          <li>\u2705 Sessions you created</li>
          <li>\u2705 Local-only sessions (guest users)</li>
          <li>\u274C System-generated sessions (hidden instead of deleted)</li>
        </ul>
      `},{id:"best-practices",title:"Best Practices",icon:"lightbulb",description:"Tips and tricks for getting the most out of Prayatna",lastUpdated:"December 26, 2025",content:`
        <h3>Session Planning Tips</h3>
        <ul>
          <li><strong>Be Specific</strong> - Use clear, descriptive session and task names</li>
          <li><strong>Break It Down</strong> - Use subtasks for complex topics</li>
          <li><strong>Realistic Timing</strong> - Set time estimates based on experience</li>
          <li><strong>Review & Adjust</strong> - Update sessions based on actual time taken</li>
          <li><strong>Reuse Templates</strong> - Duplicate successful sessions for similar topics</li>
        </ul>
        <h3>Study Effectiveness</h3>
        <ul>
          <li><strong>Focus on One Task</strong> - Select a task before starting the timer</li>
          <li><strong>Minimize Distractions</strong> - Keep the timer page visible during study</li>
          <li><strong>Use Subtasks as Checkpoints</strong> - Track micro-progress within larger tasks</li>
          <li><strong>Take Breaks</strong> - Stop and start new sessions for natural breaks</li>
          <li><strong>Analyze Patterns</strong> - Review which tasks take longest and plan accordingly</li>
        </ul>
        <h3>Session Management</h3>
        <ul>
          <li><strong>Organize by Subject</strong> - Group related sessions together</li>
          <li><strong>Archive Old Sessions</strong> - Delete completed sessions to reduce clutter</li>
          <li><strong>Create Recurring Sessions</strong> - Duplicate templates for daily/weekly study</li>
          <li><strong>Sign In for Backup</strong> - Ensure your sessions sync to your account</li>
        </ul>
      `},{id:"troubleshooting",title:"Troubleshooting",icon:"help_outline",description:"Common issues and their solutions",lastUpdated:"December 26, 2025",content:`
        <h3>Session Creation Issues</h3>
        <h4>Session Won't Save</h4>
        <ul>
          <li>Check that <strong>Session Name</strong> is filled (required field)</li>
          <li>Ensure all tasks have been saved (not just in the modal)</li>
          <li>Look for error messages in red text</li>
          <li>Try refreshing and creating again</li>
        </ul>
        <h4>Tasks Aren't Showing</h4>
        <ul>
          <li>Click <strong>"Save Task"</strong> button in the modal</li>
          <li>Ensure the modal closed after saving</li>
          <li>Task should appear as a card after successful save</li>
        </ul>
        <h3>Timer Issues</h3>
        <h4>Timer Won't Start</h4>
        <ul>
          <li>If session has tasks, <strong>select a task first</strong></li>
          <li>Wait for task selection modal and click a task</li>
          <li>Sessions with no tasks should start immediately</li>
        </ul>
        <h4>Screen Keeps Dimming</h4>
        <ul>
          <li>Some browsers/devices don't support wake lock</li>
          <li>Use a modern browser (Chrome, Firefox, Safari)</li>
          <li>Manually adjust device screen timeout settings</li>
        </ul>
        <h3>Data & Sync Issues</h3>
        <h4>Sessions Lost After Closing Browser</h4>
        <ul>
          <li><strong>If signed in</strong> - Sessions auto-save to account</li>
          <li><strong>If guest</strong> - Sessions stored locally only</li>
          <li><strong>Solution</strong> - Sign in to ensure sessions persist</li>
        </ul>
        <h4>Sessions Not Syncing</h4>
        <ul>
          <li>Check your internet connection</li>
          <li>Verify you're signed in to your account</li>
          <li>Try refreshing the page</li>
          <li>Sign out and back in to force sync</li>
        </ul>
      `}];filteredSections=[];ngOnInit(){this.helpSections.length>0&&(this.selectedSection=this.helpSections[0])}selectSection(l){this.selectedSection=l}searchHelp(l){this.searchTerm=l.toLowerCase(),this.searchTerm?this.filteredSections=this.helpSections.filter(e=>e.title.toLowerCase().includes(this.searchTerm)||e.description.toLowerCase().includes(this.searchTerm)||e.content.toLowerCase().includes(this.searchTerm)):this.filteredSections=this.helpSections,this.filteredSections.length>0&&!this.filteredSections.includes(this.selectedSection)&&(this.selectedSection=this.filteredSections[0])}goBack(){this.router.navigate(["/sessions"])}static \u0275fac=function(e){return new(e||o)(_(z))};static \u0275cmp=b({type:o,selectors:[["app-help"]],decls:19,vars:5,consts:[[1,"help-container"],[1,"help-header"],["title","Back to Sessions",1,"btn-back",3,"click"],[1,"material-icons"],[1,"help-search"],["type","text","placeholder","Search help topics...","aria-label","Search help topics",1,"search-input",3,"ngModelChange","input","ngModel"],[1,"help-content"],[1,"help-sidebar"],[1,"sidebar-title"],[1,"help-nav"],["class","nav-item","type","button",3,"active","click",4,"ngFor","ngForOf"],["class","no-results",4,"ngIf"],[1,"help-main"],["class","help-article",4,"ngIf"],["class","no-content",4,"ngIf"],["type","button",1,"nav-item",3,"click"],[1,"nav-icon","material-icons"],[1,"nav-text"],[1,"no-results"],[1,"help-article"],[1,"article-header"],[1,"article-description"],[1,"article-content",3,"innerHTML"],[1,"article-footer"],[1,"article-updated"],[1,"no-content"]],template:function(e,i){e&1&&(t(0,"div",0)(1,"div",1)(2,"button",2),h("click",function(){return i.goBack()}),t(3,"span",3),r(4,"arrow_back"),n()(),t(5,"h1"),r(6,"Help & Documentation"),n()(),t(7,"div",4)(8,"input",5),k("ngModelChange",function(c){return y(i.searchTerm,c)||(i.searchTerm=c),c}),h("input",function(){return i.searchHelp(i.searchTerm)}),n()(),t(9,"div",6)(10,"aside",7)(11,"div",8),r(12,"Topics"),n(),t(13,"nav",9),d(14,A,5,4,"button",10),n(),d(15,W,2,0,"div",11),n(),t(16,"main",12),d(17,B,12,4,"div",13)(18,F,3,0,"div",14),n()()()),e&2&&(s(8),S("ngModel",i.searchTerm),s(6),a("ngForOf",i.filteredSections),s(),a("ngIf",i.filteredSections.length===0),s(2),a("ngIf",i.selectedSection),s(),a("ngIf",!i.selectedSection))},dependencies:[T,v,w,D,H,I,E],styles:[".help-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;min-height:100vh;background:linear-gradient(180deg,#fff,#f8fbff,#eef2ff);color:#0f172a;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif}.help-header[_ngcontent-%COMP%]{background:linear-gradient(180deg,#fff,#f8fafc);padding:20px;display:flex;align-items:center;gap:15px;box-shadow:0 10px 30px #0f172a14;border-bottom:1px solid rgba(16,24,40,.06);position:sticky;top:0;z-index:100}.help-header[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]{background:none;border:none;cursor:pointer;padding:8px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#0b4bb4;transition:background-color .2s}.help-header[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]:hover{background-color:#0b4bb41a}.help-header[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%]{font-size:24px}.help-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{margin:0;font-size:28px;color:#0f172a;font-weight:700;flex:1}.help-search[_ngcontent-%COMP%]{padding:15px 20px;background:#fff;border-bottom:1px solid #e2e8f0}.help-search[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]{width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:500;color:#0f172a;background:#fff;box-shadow:0 2px 8px #0f172a0f;transition:all .18s ease}.help-search[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]::placeholder{color:#94a3b8}.help-search[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]:focus{outline:none;border-color:#0b4bb4;box-shadow:0 4px 12px #0b4bb41f}.help-content[_ngcontent-%COMP%]{display:flex;flex:1;overflow:hidden;gap:0}.help-sidebar[_ngcontent-%COMP%]{width:280px;background:#fff;border-right:1px solid #e2e8f0;overflow-y:auto;padding:0}.help-sidebar[_ngcontent-%COMP%]   .sidebar-title[_ngcontent-%COMP%]{padding:16px 20px;font-weight:700;color:#475569;text-transform:uppercase;font-size:12px;letter-spacing:.5px;border-bottom:1px solid #e2e8f0}.help-nav[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:8px 0}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]{background:none;border:none;padding:12px 16px;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;color:#475569;transition:all .18s ease;font-size:14px;font-weight:600}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%]{font-size:20px;color:#64748b;flex-shrink:0}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .nav-text[_ngcontent-%COMP%]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]:hover{background-color:#0b4bb40d;color:#0b4bb4}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]:hover   .nav-icon[_ngcontent-%COMP%]{color:#0b4bb4}.help-nav[_ngcontent-%COMP%]   .nav-item.active[_ngcontent-%COMP%]{background-color:#0b4bb41a;color:#0b4bb4;font-weight:700;border-left:3px solid #0b4bb4;padding-left:13px}.help-nav[_ngcontent-%COMP%]   .nav-item.active[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%]{color:#0b4bb4}.no-results[_ngcontent-%COMP%]{padding:16px;color:#94a3b8;font-size:13px;text-align:center;font-weight:500}.help-main[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:0;background:#fff}.help-article[_ngcontent-%COMP%]{padding:40px;max-width:900px;margin:0 auto}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]{margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #e2e8f0}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0 0 12px;font-size:32px;color:#0f172a;font-weight:700;letter-spacing:.5px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]   .article-description[_ngcontent-%COMP%]{margin:0;color:#475569;font-size:16px;font-weight:600}.article-content[_ngcontent-%COMP%]{line-height:1.8;color:#334155}.article-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:24px 0 16px;font-size:20px;color:#0f172a;font-weight:700}.article-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:18px 0 12px;font-size:16px;color:#1e293b;font-weight:700}.article-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:12px 0;font-size:15px;font-weight:500}.article-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{margin:16px 0;padding-left:24px;font-size:15px}.article-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:8px 0;line-height:1.6;font-weight:500}.article-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:#0f172a;font-weight:700}.article-content[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#475569;font-style:italic}.article-content[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:#0b4bb414;padding:2px 6px;border-radius:4px;font-family:Courier New,monospace;color:#0b4bb4;font-weight:600}.article-footer[_ngcontent-%COMP%]{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0}.article-footer[_ngcontent-%COMP%]   .article-updated[_ngcontent-%COMP%]{margin:0;color:#94a3b8;font-size:13px;display:flex;align-items:center;gap:6px;font-weight:500}.article-footer[_ngcontent-%COMP%]   .article-updated[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%]{font-size:16px}.no-content[_ngcontent-%COMP%]{padding:40px;text-align:center;color:#94a3b8;display:flex;align-items:center;justify-content:center;min-height:400px}.no-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;font-weight:500}@media(max-width:768px){.help-container[_ngcontent-%COMP%]{padding:0}.help-header[_ngcontent-%COMP%]{padding:15px}.help-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:22px}.help-content[_ngcontent-%COMP%]{flex-direction:column}.help-sidebar[_ngcontent-%COMP%]{width:100%;border-right:none;border-bottom:1px solid #e2e8f0;max-height:50vh;overflow-y:auto}.help-sidebar[_ngcontent-%COMP%]   .sidebar-title[_ngcontent-%COMP%]{padding:12px 16px}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]{padding:10px 14px;font-size:13px}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%]{font-size:18px}.help-nav[_ngcontent-%COMP%]   .nav-item.active[_ngcontent-%COMP%]{padding-left:11px}.help-article[_ngcontent-%COMP%]{padding:20px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]{margin-bottom:24px;padding-bottom:16px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:24px;margin-bottom:8px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]   .article-description[_ngcontent-%COMP%]{font-size:14px}.article-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:18px 0 12px;font-size:18px}.article-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:14px 0 10px;font-size:15px}.article-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{font-size:14px}.article-footer[_ngcontent-%COMP%]{margin-top:24px;padding-top:16px}.no-content[_ngcontent-%COMP%]{padding:20px;min-height:300px}}@media(max-width:480px){.help-header[_ngcontent-%COMP%]{padding:12px}.help-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:18px}.help-header[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%]{font-size:20px}.help-search[_ngcontent-%COMP%]{padding:12px 16px}.help-search[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]{padding:10px 12px;font-size:13px}.help-sidebar[_ngcontent-%COMP%]{max-height:40vh}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]{padding:8px 12px;font-size:12px}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%]{font-size:16px;min-width:16px}.help-nav[_ngcontent-%COMP%]   .nav-item[_ngcontent-%COMP%]   .nav-text[_ngcontent-%COMP%]{overflow:hidden}.help-article[_ngcontent-%COMP%]{padding:16px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]{margin-bottom:20px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:20px;margin-bottom:6px}.help-article[_ngcontent-%COMP%]   .article-header[_ngcontent-%COMP%]   .article-description[_ngcontent-%COMP%]{font-size:13px}.article-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:16px 0 10px;font-size:16px}.article-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:12px 0 8px;font-size:14px}.article-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{font-size:13px;margin:10px 0}.article-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .article-content[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{padding-left:20px}.article-footer[_ngcontent-%COMP%]{margin-top:20px;padding-top:12px}.article-footer[_ngcontent-%COMP%]   .article-updated[_ngcontent-%COMP%]{font-size:12px}}.help-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar, .help-main[_ngcontent-%COMP%]::-webkit-scrollbar{width:8px}.help-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar-track, .help-main[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#f1f5f9}.help-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, .help-main[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#0b4bb44d;border-radius:4px}.help-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover, .help-main[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover{background:#0b4bb480}"]})};export{U as HelpComponent};
