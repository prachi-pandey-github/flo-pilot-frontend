const KEY = 'flowpilot-demo';
const API_BASE = 'https://flo-backend-3t89.onrender.com';
const SUPABASE_URL = 'https://bkhthwzdgbezcczuvutf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Q1udrIe1uI5ZzFmuKP0cQg_T92VlOGX';
let supabaseClient;
const defaultState = {
  user: { name: 'Avery Morgan', email: 'avery@northstarops.com', role: 'Operations lead' },
  business: { name: 'Northstar Operations', industry: 'B2B services', size: '11-50' },
  loggedIn: false,
  emails: 342,
  incomingEmails: 24,
  quotes: 18,
  documents: 96,
  followups: 27
};
const state = { ...defaultState, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
if (state.incomingEmails > 0) {
  state.emails += state.incomingEmails;
  state.incomingEmails = 0;
  save();
}
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
const icon = name => `<span class="material-symbols-rounded">${name}</span>`;
const initials = name => (name || 'A').split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
function toast(message) { const node = document.createElement('div'); node.className = 'toast'; node.textContent = message; document.body.append(node); setTimeout(() => node.remove(), 2600); }
function nav(page) {
  const items = [
    ['dashboard.html','space_dashboard','Overview','dashboard'],
    ['services.html','auto_awesome','AI services','services'],
    ['inbox.html','inbox','Emails','inbox'],
    ['lead.html','inbox','Leads & campaign','leads'],
    ['campaign.html','send','Followups','campaign'],
    ['analytics.html','insights','Analytics','analytics']
  ];
  return `<aside class="sidebar"><a class="brand" href="dashboard.html"><span class="brand-mark">✦</span> flowpilot</a><div class="nav-group"><span class="nav-label">Workspace</span>${items.map(([href, ico, label, key]) => `<a class="nav-link ${page === key ? 'active' : ''}" href="${href}">${icon(ico)}<span>${label}</span></a>`).join('')}</div><div class="nav-group"><span class="nav-label">Account</span><a class="nav-link ${page === 'profile' ? 'active' : ''}" href="profile.html">${icon('manage_accounts')}<span>Profile & business</span></a><button class="nav-link" data-action="logout">${icon('logout')}<span>Log out</span></button></div><div class="sidebar-note"><strong>All systems active</strong><p>Five automations are working across your client pipeline.</p></div></aside>`;
}
function topbar() { return `<header class="topbar"><a class="brand" href="dashboard.html"><span class="brand-mark">✦</span> flowpilot</a><div class="top-actions"><a class="btn ghost small" href="profile.html">${icon('settings')} Workspace settings</a><a class="avatar" href="profile.html" aria-label="Open profile">${initials(state.user.name)}</a></div></header>`; }
function shell(page, content) { return `<div class="app">${topbar()}<div class="layout">${nav(page)}<main class="main">${content}</main></div></div>`; }
function landing() { return `<div class="landing"><header class="landing-nav"><a class="brand" href="index.html"><span class="brand-mark">✦</span> flowpilot</a><nav><a href="#services">What it does</a><a href="#workflow">How it works</a><a class="btn ghost small" href="login.html">${icon('login')} Log in</a></nav></header><main><section class="landing-hero"><div class="landing-copy"><span class="chip live">● AI operations for modern teams</span><h1>Turn busywork into <em>business momentum.</em></h1><p class="lede">Flowpilot helps client-focused teams classify every email, shape better quotes, and keep follow-ups moving, all from one calm workspace.</p><div class="landing-actions"><a class="btn lime" href="login.html">${icon('arrow_forward')} Start working smarter</a><a class="text-link" href="#services">Explore the workspace ${icon('south') }</a></div><div class="landing-proof"><span>${icon('verified')} Human review always on</span><span>${icon('lock')} Private by design</span></div></div><div class="landing-preview"><div class="preview-top"><span class="eyebrow">Today at a glance</span><span class="chip live">● Live</span></div><h3>Your work, already moving.</h3><div class="preview-stat"><strong>342</strong><span>messages classified</span><b>+18%</b></div><div class="preview-list"><div><span class="preview-icon">${icon('mark_email_unread')}</span><span><strong>Pricing request</strong><small>High intent · Reply recommended</small></span><span class="chip blue">Reply</span></div><div><span class="preview-icon">${icon('request_quote')}</span><span><strong>Quote draft ready</strong><small>Implementation package · $8,400</small></span><span class="chip live">Ready</span></div><div><span class="preview-icon">${icon('schedule_send')}</span><span><strong>Follow-up queued</strong><small>Next business day · 9:15 AM</small></span><span class="chip">Queued</span></div></div></div></section><section class="landing-section" id="services"><div class="landing-section-head"><span class="eyebrow">One clear workflow</span><h2>Less admin. More meaningful work.</h2><p class="lede">The repetitive parts of client operations should run quietly in the background. Flowpilot gives your team the context to act with confidence.</p></div><div class="landing-features"><article><span class="service-icon">${icon('mark_email_read')}</span><h3>Classify every email</h3><p>Understand intent, urgency, and the next best action before your team opens the inbox.</p></article><article><span class="service-icon">${icon('request_quote')}</span><h3>Shape better quotes</h3><p>Turn a client brief into a structured, editable quote in seconds, not hours.</p></article><article><span class="service-icon">${icon('schedule_send')}</span><h3>Keep momentum</h3><p>Queue thoughtful follow-ups so warm conversations never quietly go cold.</p></article></div></section><section class="landing-workflow" id="workflow"><div><span class="eyebrow">Built for calm momentum</span><h2>From first message to next step.</h2><p class="lede">Capture the signal, understand what matters, and let your team focus on the conversations that grow the business.</p><a class="btn primary" href="login.html">Open your workspace ${icon('arrow_forward')}</a></div><div class="workflow-steps"><div><b>01</b><span>Capture</span><p>Bring client messages and briefs into one place.</p></div><div><b>02</b><span>Understand</span><p>Surface the intent, urgency, and context.</p></div><div><b>03</b><span>Move forward</span><p>Review, respond, and follow through faster.</p></div></div></section></main><footer><a class="brand" href="index.html"><span class="brand-mark">✦</span> flowpilot</a><span>Make the busywork disappear.</span><a href="login.html">Log in ${icon('arrow_forward')}</a></footer></div>`; }
function serviceCard(service, title, description, metric, href, featured = false) { return `<a class="card service-card ${featured ? 'featured' : ''}" href="${href}"><span class="service-icon">${icon(service.icon)}</span><div><h3>${title}</h3><p class="muted">${description}</p></div><strong class="muted">${metric} ${icon('arrow_forward')}</strong></a>`; }
function inbox() { return shell('inbox', `<div class="page-head"><div><p class="eyebrow">Incoming messages</p><h1>Emails</h1><p class="lede">See every incoming email in one place. Flowpilot classifies messages automatically as they arrive.</p></div><div style="display:flex;align-items:center;gap:12px"><span class="chip live">${icon('mark_email_read')} 3 new emails</span><button class="btn primary" type="button" data-action="toggle-compose" aria-controls="new-mail">${icon('add')} New mail</button></div></div><section class="card"><div class="section-head" style="margin-top:0"><div><h2>Incoming emails</h2><p class="lede">Newest messages are shown first.</p></div><span class="chip blue">Emails synced just now</span></div><div class="list"><div class="list-row"><div class="row-main"><span class="row-icon">${icon('mark_email_unread')}</span><div><p class="row-title">Pricing request · Koru Labs</p><p class="row-sub">Could you send implementation pricing by Friday?</p><p class="row-sub">Avery Chen · 2 minutes ago</p></div></div><div><span class="chip live">High intent</span></div></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('question_answer')}</span><div><p class="row-title">Product question · Helio Systems</p><p class="row-sub">Can your automation connect with our current CRM?</p><p class="row-sub">Morgan Lee · 18 minutes ago</p></div></div><div><span class="chip blue">Needs context</span></div></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('thumb_up')}</span><div><p class="row-title">Positive reply · Northwind</p><p class="row-sub">We would like to see the next available onboarding slot.</p><p class="row-sub">Jordan Patel · 42 minutes ago</p></div></div><div><span class="chip live">Warm</span></div></div></div></section><section class="card hidden" id="new-mail" style="margin-top:16px"><div class="section-head" style="margin-top:0"><div><h2>Write a new email</h2><p class="lede">Choose manual drafting or let AI create a first draft.</p></div><span class="chip">Human review always on</span></div><div class="tabs compose-tabs"><button class="tab active" type="button" data-compose-tab="manual">Manual email</button><button class="tab" type="button" data-compose-tab="ai">${icon('auto_awesome')} AI email writer</button></div><form data-action="send-email" class="form-grid" id="manual-email-form"><div class="field"><label>Recipient</label><input name="recipient" type="email" placeholder="client@company.com" required /></div><div class="field"><label>Subject</label><input name="subject" placeholder="What is this email about?" required /></div><div class="field full"><label>Message</label><textarea name="message" rows="5" placeholder="Write your message..." required></textarea></div><div class="field full"><button class="btn primary" type="submit">${icon('send')} Send email</button></div></form><form data-action="generate-ai-email" class="form-grid hidden" id="ai-email-form"><div class="field"><label>Recipient email</label><input name="recipient" type="email" placeholder="client@company.com" required /></div><div class="field"><label>Recipient name</label><input name="name" placeholder="Avery Chen" required /></div><div class="field"><label>Company</label><input name="company" placeholder="Koru Labs" /></div><div class="field full"><label>Client context</label><textarea name="context" rows="3" placeholder="Describe the customer and why you are contacting them."></textarea></div><div class="field full"><label>Campaign goal</label><textarea name="prompt" rows="4" placeholder="Advertizing or another specific outreach goal." required></textarea><p class="field-hint">The API sends this form as one client, with your campaign goal and context.</p></div><div class="field full"><button class="btn lime" type="submit">${icon('auto_awesome')} Generate email</button></div><div class="field full hidden" id="ai-email-output-wrap"><label>Generated subject</label><input id="ai-email-subject" readonly /><label>Generated email</label><textarea id="ai-email-output" rows="8" readonly></textarea><button class="btn primary" type="button" data-action="send-ai-email" style="margin-top:12px">${icon('send')} Send email</button></div></form><div id="new-mail-result"></div></section>`); }
function dashboard() { return shell('dashboard', `<div class="page-head"><div><p class="eyebrow">${esc(state.business.name)} / Monday, Oct 24</p><h1>Make the busywork disappear.</h1><p class="lede">One calm command center for the messages, documents, quotes, and follow-ups that keep your client work moving.</p></div><a class="btn lime" href="services.html">${icon('auto_awesome')} Open AI workspace</a></div><div class="grid grid-4 stats"><div class="card stat"><span class="eyebrow">Messages classified</span><span class="stat-value">${state.emails}</span><span class="stat-meta">${icon('trending_up')} +18% this week</span></div><div class="card stat"><span class="eyebrow">Quotes drafted</span><span class="stat-value">${state.quotes}</span><span class="stat-meta">${icon('bolt')} 6 awaiting review</span></div><div class="card stat"><span class="eyebrow">Docs extracted</span><span class="stat-value">${state.documents}%</span><span class="stat-meta">${icon('verified')} accuracy score</span></div><div class="card stat"><span class="eyebrow">Follow-ups queued</span><span class="stat-value">${state.followups}</span><span class="stat-meta">${icon('schedule')} next in 42 min</span></div></div><div class="section-head"><h2>Your automation services</h2><a class="btn ghost small" href="services.html">View workspace ${icon('arrow_forward')}</a></div><div class="grid grid-3">${serviceCard({icon:'mark_email_read'},'Email classification','Sort intent, urgency, and next action before your team opens the inbox.',`${state.emails} processed`,'lead.html',true)}${serviceCard({icon:'request_quote'},'Quote generation','Turn a client brief into a polished, editable quote in seconds.',`${state.quotes} drafts`,'services.html')}${serviceCard({icon:'document_scanner'},'Document extraction','Pull structured facts from PDFs, forms, and attachments without retyping.',`${state.documents}% accuracy`,'services.html')}${serviceCard({icon:'schedule_send'},'Automated followups','Keep every warm conversation moving with thoughtful, timed nudges.',`${state.followups} queued`,'campaign.html')}${serviceCard({icon:'insights'},'Analytics','See pipeline velocity, service impact, and the moments that need attention.', 'Live view','analytics.html')}</div><div class="section-head"><h2>Today at a glance</h2><span class="chip live">● Live activity</span></div><div class="grid grid-2"><section class="card"><h3>Priority inbox</h3><div class="list"><div class="list-row"><div class="row-main"><span class="row-icon">${icon('mark_email_unread')}</span><div><p class="row-title">Pricing request from Koru Labs</p><p class="row-sub">High intent · classified 2m ago</p></div></div><span class="chip blue">Reply</span></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('description')}</span><div><p class="row-title">MSA renewal document</p><p class="row-sub">3 fields extracted · ready to review</p></div></div><span class="chip live">Ready</span></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('schedule_send')}</span><div><p class="row-title">Follow-up: Horizon Studio</p><p class="row-sub">Scheduled for today at 3:40 PM</p></div></div><span class="chip">Queued</span></div></div></section><section class="card"><div class="section-head" style="margin-top:0"><h3>Pipeline health</h3><span class="chip blue">This week</span></div><div class="list"><div><div class="list-row"><span>New conversations</span><strong>184</strong></div><div class="progress"><span style="width:82%"></span></div></div><div><div class="list-row"><span>Qualified opportunities</span><strong>68</strong></div><div class="progress"><span style="width:58%;background:var(--lime-deep)"></span></div></div><div><div class="list-row"><span>Quotes sent</span><strong>31</strong></div><div class="progress"><span style="width:39%;background:var(--coral)"></span></div></div></div></section></div>`); }
function services() { return shell('services', `<div class="hero-band"><div><p class="eyebrow" style="color:var(--lime)">AI operations layer</p><h1>Five small engines. One clear workflow.</h1><p class="lede">Flowpilot turns repetitive client operations into a reliable sequence your team can review, adjust, and trust.</p></div><div class="workflow"><div class="workflow-step"><b>01</b><span>Capture</span></div><div class="workflow-step"><b>02</b><span>Understand</span></div><div class="workflow-step"><b>03</b><span>Draft</span></div><div class="workflow-step"><b>04</b><span>Follow through</span></div></div></div><div class="page-head"><div><p class="eyebrow">AI workspace</p><h2>Choose a service to run</h2><p class="lede">Every result stays editable and every automation has a human review point.</p></div><span class="chip live">● 5 services operational</span></div><div class="grid grid-2"><div class="card service-card featured"><span class="service-icon">${icon('mark_email_read')}</span><div><h3>Email classification</h3><p class="muted">All incoming emails are classified automatically by intent, urgency, sentiment, and recommended action.</p></div><div class="notice" style="margin-top:14px">${icon('check_circle')}<span><strong>Automatic classification active</strong><br>New incoming emails are classified as they arrive.</span></div></div><div class="card"><span class="service-icon">${icon('request_quote')}</span><div style="margin:18px 0"><h3>Quote generation</h3><p class="lede">Describe the work and let AI shape a structured quote your team can polish before sending.</p></div><form data-action="generate-quote"><div class="field"><textarea name="brief" placeholder="Describe the client's needs...">A 6-week CRM cleanup and automation setup for a 12-person sales team.</textarea></div><button class="btn primary" type="submit">${icon('request_quote')} Draft a quote</button></form><div id="quote-result"></div></div><div class="card"><span class="service-icon">${icon('document_scanner')}</span><div style="margin:18px 0"><h3>Document extraction</h3><p class="lede">Upload or simulate a document scan and turn messy pages into useful, searchable fields.</p></div><button class="btn ghost" data-action="extract-document">${icon('upload_file')} Extract a sample document</button><div id="extraction-result"></div></div><div class="card"><span class="service-icon">${icon('schedule_send')}</span><div style="margin:18px 0"><h3>Automated followups</h3><p class="lede">Keep the right tone and timing across every open conversation.</p></div><button class="btn ghost" data-action="queue-followup">${icon('add_task')} Queue a follow-up</button><div id="followup-result"></div></div></div>`); }
function leads() { return shell('leads', `<div class="page-head"><div><p class="eyebrow">Lead intelligence</p><h1>Leads & campaign</h1><p class="lede">Every conversation is classified before it becomes a task, a quote, or a follow-up.</p></div></div><div class="grid grid-3 stats"><div class="card stat"><span class="eyebrow">High intent</span><span class="stat-value">48</span><span class="stat-meta">${icon('priority_high')} 8 need a reply</span></div><div class="card stat"><span class="eyebrow">In review</span><span class="stat-value">19</span><span class="stat-meta">${icon('visibility')} Human check</span></div><div class="card stat"><span class="eyebrow">Avg. response time</span><span class="stat-value">2.4h</span><span class="stat-meta">${icon('trending_down')} 31% faster</span></div></div><section class="card"><div class="section-head" style="margin-top:0"><div><h2>Priority conversations</h2><p class="lede">Sorted by intent and recency.</p></div><span class="chip blue">Campaign synced 2m ago</span></div><div class="list"><div class="list-row"><div class="row-main"><span class="row-icon">${icon('mark_email_unread')}</span><div><p class="row-title">Pricing request · Koru Labs</p><p class="row-sub">“Could you send implementation pricing by Friday?”</p></div></div><div><span class="chip live">High intent</span></div></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('question_answer')}</span><div><p class="row-title">Product question · Helio Systems</p><p class="row-sub">Needs technical context before a quote.</p></div></div><div><span class="chip blue">Needs context</span></div></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('thumb_up')}</span><div><p class="row-title">Positive reply · Northwind</p><p class="row-sub">Asked to see the next available onboarding slot.</p></div></div><div><span class="chip live">Warm</span></div></div></div></section>`); }
function campaign() { return shell('campaign', `<div class="page-head"><div><p class="eyebrow">Momentum engine</p><h1>Followups that feel human.</h1><p class="lede">Automate the next thoughtful touch without losing visibility or control.</p></div><button class="btn lime" data-action="queue-followup">${icon('add_task')} Schedule follow-up</button></div><div class="grid grid-3 stats"><div class="card stat"><span class="eyebrow">Queued today</span><span class="stat-value">${state.followups}</span><span class="stat-meta">${icon('schedule')} 9 due before noon</span></div><div class="card stat"><span class="eyebrow">Open rate</span><span class="stat-value">61%</span><span class="stat-meta">${icon('trending_up')} +7.4% this month</span></div><div class="card stat"><span class="eyebrow">Replies recovered</span><span class="stat-value">84</span><span class="stat-meta">${icon('reply')} From automated nudges</span></div></div><div class="grid grid-2"><section class="card"><div class="section-head" style="margin-top:0"><h2>Upcoming sequence</h2><span class="chip live">● Running</span></div><div class="list"><div class="list-row"><div class="row-main"><span class="row-icon">${icon('schedule_send')}</span><div><p class="row-title">Horizon Studio · check-in</p><p class="row-sub">Today, 3:40 PM · Email 2 of 3</p></div></div><span class="chip blue">Review</span></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('schedule_send')}</span><div><p class="row-title">Ridgeway · proposal nudge</p><p class="row-sub">Tomorrow, 9:15 AM · Email 1 of 2</p></div></div><span class="chip">Scheduled</span></div><div class="list-row"><div class="row-main"><span class="row-icon">${icon('pause_circle')}</span><div><p class="row-title">Atlas Health · paused</p><p class="row-sub">Reply detected · sequence stopped</p></div></div><span class="chip live">Protected</span></div></div></section><section class="card"><h2>Automation rules</h2><div class="list"><div class="list-row"><span>Wait 2 business days</span><span class="chip">Timing</span></div><div class="list-row"><span>Stop when a reply lands</span><span class="chip live">Guardrail</span></div><div class="list-row"><span>Escalate high intent</span><span class="chip blue">Smart rule</span></div></div><button class="btn ghost" data-action="save-rule" style="margin-top:14px">${icon('add')} Add automation rule</button></section></div>`); }
function analytics() { return shell('analytics', `<div class="page-head"><div><p class="eyebrow">Service intelligence</p><h1>Know what is working.</h1><p class="lede">A clear view of the time saved, pipeline created, and attention still needed.</p></div><button class="btn ghost" data-action="export-report">${icon('download')} Export report</button></div><div class="grid grid-4 stats"><div class="card stat"><span class="eyebrow">Time saved</span><span class="stat-value">42h</span><span class="stat-meta">${icon('trending_up')} +12h vs last month</span></div><div class="card stat"><span class="eyebrow">Pipeline influenced</span><span class="stat-value">$184k</span><span class="stat-meta">${icon('auto_graph')} 31 opportunities</span></div><div class="card stat"><span class="eyebrow">Automation ROI</span><span class="stat-value">4.8x</span><span class="stat-meta">${icon('paid')} On subscription</span></div><div class="card stat"><span class="eyebrow">Data confidence</span><span class="stat-value">94%</span><span class="stat-meta">${icon('verified')} Across services</span></div></div><div class="grid grid-2"><section class="card"><div class="section-head" style="margin-top:0"><h2>Weekly activity</h2><span class="chip blue">Last 7 days</span></div><div class="list"><div class="list-row"><span class="row-main">${icon('mark_email_read')} Emails classified</span><strong>342</strong></div><div class="progress"><span style="width:88%"></span></div><div class="list-row"><span class="row-main">${icon('request_quote')} Quotes generated</span><strong>18</strong></div><div class="progress"><span style="width:46%;background:var(--coral)"></span></div><div class="list-row"><span class="row-main">${icon('schedule_send')} Follow-ups completed</span><strong>96</strong></div><div class="progress"><span style="width:67%;background:var(--lime-deep)"></span></div></div></section><section class="card"><h2>Service health</h2><div class="list"><div class="list-row"><span class="row-main"><span class="row-icon">${icon('mark_email_read')}</span>Email classification</span><span class="chip live">Healthy</span></div><div class="list-row"><span class="row-main"><span class="row-icon">${icon('document_scanner')}</span>Document extraction</span><span class="chip live">Healthy</span></div><div class="list-row"><span class="row-main"><span class="row-icon">${icon('schedule_send')}</span>Automated followups</span><span class="chip blue">12 queued</span></div></div></section></div><section class="card" style="margin-top:16px"><div class="section-head" style="margin-top:0"><h2>Recent impact</h2><span class="chip">Updated just now</span></div><div class="table-wrap"><table><thead><tr><th>Service</th><th>Outcome</th><th>Confidence</th><th>Status</th></tr></thead><tbody><tr><td>Email classification</td><td>8 high-intent replies surfaced</td><td>97%</td><td><span class="chip live">Actioned</span></td></tr><tr><td>Quote generation</td><td>6 drafts awaiting review</td><td>91%</td><td><span class="chip blue">In review</span></td></tr><tr><td>Document extraction</td><td>12 renewal fields captured</td><td>96%</td><td><span class="chip live">Complete</span></td></tr></tbody></table></div></section>`); }
function profile() { return shell('profile', `<div class="page-head"><div><p class="eyebrow">Account</p><h1>Profile & business</h1><p class="lede">Keep the workspace context current so every generated email, quote, and follow-up sounds like your team.</p></div><span class="chip live">● Supabase account</span></div><div class="grid grid-2"><section class="card"><div class="section-head" style="margin-top:0"><h2>Personal details</h2><span class="avatar">${initials(state.user.name)}</span></div><form data-action="save-profile" class="form-grid"><div class="field"><label>Full name</label><input name="name" value="${esc(state.user.name)}" required /></div><div class="field"><label>Work email</label><input name="email" type="email" value="${esc(state.user.email)}" required /></div><div class="field full"><label>Role</label><input name="role" value="${esc(state.user.role)}" /></div><div class="field full"><button class="btn primary" type="submit">${icon('save')} Save personal details</button></div></form></section><section class="card"><div class="section-head" style="margin-top:0"><h2>Business account</h2><span class="chip blue">Team plan</span></div><form data-action="save-business" class="form-grid"><div class="field full"><label>Business name</label><input name="name" value="${esc(state.business.name)}" required /></div><div class="field"><label>Industry</label><input name="industry" value="${esc(state.business.industry)}" /></div><div class="field"><label>Team size</label><select name="size"><option ${state.business.size === '1-10' ? 'selected' : ''}>1-10</option><option ${state.business.size === '11-50' ? 'selected' : ''}>11-50</option><option ${state.business.size === '51-200' ? 'selected' : ''}>51-200</option></select></div><div class="field full"><button class="btn lime" type="submit">${icon('domain')} Save business account</button></div></form></section></div><section class="card" style="margin-top:16px"><div class="section-head" style="margin-top:0"><div><h2>Workspace access</h2><p class="lede">Your account is authenticated with Supabase.</p></div><button class="btn ghost" data-action="logout">${icon('logout')} Log out</button></div><div class="notice">${icon('shield')} Your session is securely persisted by Supabase in this browser.</div></section>`); }
function auth() { return `<div class="auth-page"><section class="auth-visual"><a class="brand" href="login.html" style="color:#fff"><span class="brand-mark">✦</span> flowpilot</a><div><p class="eyebrow" style="color:var(--lime)">The calm layer for client work</p><h1>Move from inbox noise to meaningful next steps.</h1><p>Flowpilot brings intelligence to the moments your team repeats every day, so the work feels lighter without becoming less human.</p></div><div class="auth-points"><div class="auth-point">${icon('check_circle')} Classify every message by intent</div><div class="auth-point">${icon('check_circle')} Turn briefs into ready-to-review quotes</div><div class="auth-point">${icon('check_circle')} Keep follow-ups moving automatically</div></div></section><section class="auth-panel"><div class="auth-card"><p class="eyebrow">Welcome to flowpilot</p><h2 id="auth-title">Sign in to your workspace</h2><p class="lede" id="auth-copy">Use your email and password to access your workspace.</p><div class="tabs"><button class="tab active" data-tab="login" type="button">Sign in</button><button class="tab" data-tab="signup" type="button">Sign up</button></div><div id="auth-result"></div><form id="login-form" data-action="login"><div class="field"><label>Email</label><input type="email" name="email" autocomplete="email" required /></div><div class="field" style="margin-top:14px"><label>Password</label><input type="password" name="password" autocomplete="current-password" required /></div><button class="btn primary" type="submit" style="width:100%;margin-top:20px">${icon('login')} Sign in</button></form><form id="signup-form" class="hidden" data-action="signup"><div class="section-head" style="margin:18px 0 12px"><div><h3>Choose your account</h3><p class="lede">Tell us how you will use Flowpilot.</p></div></div><div class="tabs"><button class="tab active" data-account-type="personal" type="button">Personal details</button><button class="tab" data-account-type="business" type="button">Business account</button></div><input id="signup-account-type" type="hidden" name="accountType" value="personal" /><div class="field"><label>Full name</label><input name="name" autocomplete="name" placeholder="Avery Morgan" required /></div><div class="field" style="margin-top:14px"><label>Work email</label><input name="email" type="email" autocomplete="email" placeholder="you@company.com" required /></div><div class="field" style="margin-top:14px"><label>Role</label><input name="role" placeholder="Operations lead" required /></div><div class="field" style="margin-top:14px"><label>Create password</label><input name="password" type="password" autocomplete="new-password" minlength="6" required /></div><div id="business-signup-fields" class="hidden"><div class="field" style="margin-top:14px"><label>Business name</label><input name="business" placeholder="Northstar Operations" /></div><div class="field" style="margin-top:14px"><label>Industry</label><input name="industry" placeholder="B2B services" /></div><div class="field" style="margin-top:14px"><label>Team size</label><select name="size"><option value="">Select team size</option><option>1-10</option><option>11-50</option><option>51-200</option></select></div></div><button class="btn lime" type="submit" style="width:100%;margin-top:20px">${icon('rocket_launch')} Create account</button></form><p style="margin:18px 0 0;color:var(--muted);font-size:11px">Your account is securely managed by Supabase.</p></div></section></div>`; }
function bind() {
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-tab]').forEach(item => item.classList.remove('active')); button.classList.add('active'); const login = button.dataset.tab === 'login'; document.getElementById('login-form')?.classList.toggle('hidden', !login); document.getElementById('signup-form')?.classList.toggle('hidden', login); document.getElementById('auth-title').textContent = login ? 'Sign in to your workspace' : 'Create your business workspace'; document.getElementById('auth-copy').textContent = login ? 'Use your email and password to access your workspace.' : 'Create a secure account for your workspace.'; }));
  document.querySelectorAll('[data-account-type]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-account-type]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const business = button.dataset.accountType === 'business';
    const accountType = document.getElementById('signup-account-type');
    if (accountType) accountType.value = button.dataset.accountType;
    document.getElementById('business-signup-fields')?.classList.toggle('hidden', !business);
    document.querySelectorAll('#business-signup-fields input, #business-signup-fields select').forEach(field => { field.required = business; });
  }));
  document.querySelectorAll('[data-compose-tab]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-compose-tab]').forEach(item => item.classList.remove('active')); button.classList.add('active'); const ai = button.dataset.composeTab === 'ai'; document.getElementById('manual-email-form')?.classList.toggle('hidden', ai); document.getElementById('ai-email-form')?.classList.toggle('hidden', !ai); }));
  document.querySelectorAll('[data-action]').forEach(element => element.addEventListener('click', handleAction));
  document.querySelectorAll('form[data-action]').forEach(form => form.addEventListener('submit', handleAction));
}
async function requestEmail(payload) {
  const response = await fetch(`${API_BASE}/campaigns`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(body.detail) ? body.detail.map(item => item.msg).join(', ') : body.detail;
    throw new Error(detail || `Email service returned ${response.status}`);
  }
  if (!body.results || !body.results[0]) throw new Error('Email service returned no email result');
  return body.results[0];
}
function showEmailResult(message, success = false) {
  const result = document.getElementById('new-mail-result');
  if (result) result.innerHTML = `<div class="notice ${success ? 'success' : 'warn'}" style="margin-top:14px">${icon(success ? 'check_circle' : 'error')}<span>${message}</span></div>`;
}
function showAuthResult(message, success = false) {
  const result = document.getElementById('auth-result');
  if (result) result.innerHTML = `<div class="notice ${success ? 'success' : 'warn'}" style="margin:14px 0">${icon(success ? 'check_circle' : 'error')}<span>${esc(message)}</span></div>`;
}
function setBusy(button, busy, label) {
  if (!button) return;
  button.disabled = busy;
  if (busy) {
    button.dataset.originalLabel = button.innerHTML;
    button.textContent = label;
  } else if (button.dataset.originalLabel) {
    button.innerHTML = button.dataset.originalLabel;
    delete button.dataset.originalLabel;
  }
}
async function handleAction(event) {
  if (event.type === 'submit') event.preventDefault();
  const action = event.currentTarget.dataset.action;
  const form = event.currentTarget;
  if (action === 'login' || action === 'signup') {
    const data = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type="submit"]');
    setBusy(button, true, action === 'login' ? 'Logging in...' : 'Creating account...');
    try {
      const result = action === 'login'
        ? await supabaseClient.auth.signInWithPassword({ email: data.email, password: data.password })
        : await supabaseClient.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                name: data.name,
                role: data.role,
                account_type: data.accountType,
                business: data.business || '',
                industry: data.industry || '',
                size: data.size || ''
              },
              emailRedirectTo: `${window.location.origin}/login.html`
            }
          });
      if (result.error) throw result.error;
      if (action === 'signup' && !result.data.session) {
        showAuthResult('Account created. Check your email to confirm your account, then log in.', true);
        form.reset();
      } else {
        state.loggedIn = true;
        state.user = {
          ...state.user,
          name: result.data.user.user_metadata?.name || data.name || state.user.name,
          email: result.data.user.email,
          role: result.data.user.user_metadata?.role || data.role || state.user.role
        };
        if (action === 'signup') {
          state.business = {
            ...state.business,
            name: data.business || '',
            industry: data.industry || '',
            size: data.size || ''
          };
        }
        save();
        window.location.href = action === 'login' ? 'dashboard.html' : 'profile.html';
      }
    } catch (error) {
      showAuthResult(error.message || 'Authentication failed. Please try again.');
    } finally {
      setBusy(button, false);
    }
  }
  if (action === 'logout') {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast(error.message || 'Could not log out');
      return;
    }
    state.loggedIn = false;
    save();
    window.location.href = 'login.html';
  }
  if (action === 'save-profile') { const data = Object.fromEntries(new FormData(form)); state.user = { ...state.user, ...data }; save(); toast('Personal details saved'); render(); }
  if (action === 'save-business') { const data = Object.fromEntries(new FormData(form)); state.business = { ...state.business, ...data }; save(); toast('Business account updated'); render(); }
  if (action === 'toggle-compose') { const composer = document.getElementById('new-mail'); composer.classList.toggle('hidden'); if (!composer.classList.contains('hidden')) composer.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  if (action === 'generate-quote') { state.quotes += 1; save(); document.getElementById('quote-result').innerHTML = '<div class="notice success" style="margin-top:14px">' + icon('description') + '<span><strong>Quote draft ready</strong><br>Implementation setup · $8,400 · 6-week delivery. Review before sending.</span></div>'; }
  if (action === 'extract-document') { state.documents = Math.max(state.documents, 97); save(); document.getElementById('extraction-result').innerHTML = '<div class="notice success" style="margin-top:14px">' + icon('verified') + '<span><strong>12 fields extracted</strong><br>Client, renewal date, total value, and payment terms are ready to review.</span></div>'; }
  if (action === 'queue-followup') { state.followups += 1; save(); const result = document.getElementById('followup-result'); if (result) result.innerHTML = '<div class="notice success" style="margin-top:14px">' + icon('schedule_send') + '<span><strong>Follow-up queued</strong><br>Scheduled for the next business day at 9:15 AM.</span></div>'; else { toast('Follow-up queued for the next business day'); render(); } }
  if (action === 'generate-ai-email') {
    const data = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type="submit"]');
    const payload = { clients: [{ email: data.recipient, name: data.name, company: data.company || '', context: data.context || '' }], campaign_goal: data.prompt, dry_run: true };
    setBusy(button, true, 'Generating...');
    try {
      const result = await requestEmail(payload);
      form.dataset.emailPayload = JSON.stringify(payload);
      document.getElementById('ai-email-subject').value = result.subject || '';
      document.getElementById('ai-email-output').value = result.body || '';
      document.getElementById('ai-email-output-wrap').classList.remove('hidden');
      showEmailResult('<strong>AI draft generated</strong><br>Review the subject and message, then send when ready.', false);
    } catch (error) {
      showEmailResult(`<strong>Could not generate the email</strong><br>${esc(error.message)}`);
    } finally {
      setBusy(button, false);
    }
  }
  if (action === 'send-email') { const data = Object.fromEntries(new FormData(form)); const result = document.getElementById('new-mail-result'); result.innerHTML = '<div class="notice success" style="margin-top:14px">' + icon('check_circle') + '<span><strong>Email ready to send</strong><br>To: ' + esc(data.recipient || 'your selected recipient') + '<br>Your email has been prepared for sending.</span></div>'; }
  if (action === 'send-ai-email') {
    const aiForm = form.closest('form');
    const payload = aiForm && aiForm.dataset.emailPayload ? JSON.parse(aiForm.dataset.emailPayload) : null;
    if (!payload) {
      showEmailResult('<strong>Generate an email first</strong><br>The send request needs a draft from the API.');
      return;
    }
    const button = form;
    setBusy(button, true, 'Sending...');
    try {
      const result = await requestEmail({ ...payload, dry_run: false });
      state.emails += 1;
      save();
      showEmailResult(`<strong>Email sent successfully</strong><br>To: ${esc(result.to || payload.clients[0].email)}<br>Message ID: ${esc(result.message_id || 'confirmed by email service')}`, true);
    } catch (error) {
      showEmailResult(`<strong>Could not send the email</strong><br>${esc(error.message)}`);
    } finally {
      setBusy(button, false);
    }
  }
  if (action === 'save-rule') toast('Automation rule added to the sequence');
  if (action === 'export-report') toast('Report prepared for download');
}
function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load Supabase. Check your connection and try again.'));
    document.head.appendChild(script);
  });
}
async function render() {
  const page = document.body.dataset.page;
  if (page !== 'landing') {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    state.loggedIn = Boolean(data.session);
    if (data.session?.user) {
      state.user = {
        ...state.user,
        name: data.session.user.user_metadata?.name || state.user.name,
        email: data.session.user.email || state.user.email
      };
      save();
    }
  }
  if (page === 'landing') document.body.innerHTML = landing();
  else if (page === 'auth' && state.loggedIn) window.location.href = 'dashboard.html';
  else if (page === 'auth') document.body.innerHTML = auth();
  else if (!state.loggedIn) window.location.href = 'login.html';
  else {
    const views = { dashboard, services, inbox, leads, campaign, analytics, profile };
    document.body.innerHTML = views[page]();
  }
  bind();
}
loadSupabase()
  .then(() => {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return render();
  })
  .catch(error => {
    document.body.innerHTML = `<div class="notice warn" style="margin:24px">${icon('error')}<span>${esc(error.message)}</span></div>`;
  });
