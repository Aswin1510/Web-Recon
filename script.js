const STORAGE_KEY = 'bmsce-eventhub-events';
const USERS_KEY = 'bmsce-eventhub-users';
const SESSION_KEY = 'bmsce-eventhub-session';

const categories = ['Workshop', 'Hackathon', 'Competition', 'Fest', 'Seminar/Talk', 'Cultural Event', 'Technical Event', 'Club Activity', 'Other'];

function pad(value) { return String(value).padStart(2, '0'); }
function futureDate(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
function initials(title) { return String(title || 'EV').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase(); }
function formatDate(dateString) {
  if (!dateString) return 'Date TBA';
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function isPastEvent(event) {
  if (!event?.eventDate) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(`${event.eventDate}T00:00:00`) < today || event.status === 'completed';
}
function getEvents() {
  initializeSampleEvents();
  try {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(events) ? events : [];
  } catch (error) { return []; }
}
function saveEvents(events) { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); }
function getUsers() { try { const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); return Array.isArray(users) ? users : []; } catch (error) { return []; } }
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (error) { return null; } }
function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }
function getEventById(id) { return getEvents().find((event) => String(event.id) === String(id)) || null; }
function sampleEvent(id, title, description, category, organizer, days, startTime, endTime, venue, eligibility, entryFee, deadline, contactPerson, contactInfo, posterImage) {
  return { id, title, description, category, organizer, eventDate: futureDate(days), startTime, endTime, venue, eligibility, entryFee, registrationDeadline: futureDate(deadline), registrationLink: `https://forms.google.com/${id}-bmsce-event`, contactPerson, contactInfo, posterImage, status: 'upcoming' };
}
function buildSampleEvents() {
  return [
    sampleEvent(1, 'AI and Machine Learning Workshop', 'Make machine learning practical with guided experiments, project prompts and a clear path from idea to prototype.', 'Workshop', 'CSE', 4, '10:00', '13:00', 'Innovation Hall, Block C', 'Open to all branches', '₹150', 2, 'Dr. Neha Sharma', 'neha.sharma@bmsce.ac.in', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(2, 'BMSCE Coding Club 24-Hour Hackathon', 'Build a useful thing in a single day with teammates, mentors and a campus full of people who like solving hard problems.', 'Hackathon', 'Coding Club', 8, '09:00', '09:00', 'Main Auditorium and Labs', 'All BMSCE students', 'Free', 5, 'Rahul Nair', '+91 98765 11223', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(3, 'Robotics Competition', 'Prototype, test and compete in a robotics challenge built around sensing, navigation and design efficiency.', 'Competition', 'Mechanical', 13, '11:00', '15:30', 'Mechanical Workshop Block', 'Open to all branches', '₹200', 8, 'Prof. Karthik Shetty', 'karthik.shetty@bmsce.ac.in', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(4, '5G Technologies Seminar', 'Explore 5G network architecture, edge computing and the future of connectivity with industry experts and student Q&A.', 'Seminar/Talk', 'ECE', 6, '14:00', '16:00', 'Seminar Hall, ECE Block', 'ECE, EEE, CSE students', 'Free', 3, 'Priya Menon', 'priya.menon@bmsce.ac.in', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(5, 'Cultural Fest Dance Auditions', 'Bring your style to the annual cultural fest auditions. Classical, freestyle and fusion teams are all welcome.', 'Cultural Event', 'Cultural Club', 15, '17:00', '19:00', 'Open Air Stage', 'Open to all branches', 'Free', 10, 'Aditi Joshi', '+91 99887 12344', 'https://images.unsplash.com/photo-1508700115892-45ecd05f9a4d?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(6, 'Cloud Computing Workshop', 'Learn cloud architecture, serverless computing and practical deployment strategies for modern applications.', 'Workshop', 'ISE', 18, '10:30', '13:30', 'ISE Lab 2', 'ISE and CSE students', '₹180', 12, 'Prof. Divya Rao', 'divya.rao@bmsce.ac.in', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(7, 'Entrepreneurship Pitch Competition', 'Pitch a product idea, get thoughtful feedback and meet student founders building the next thing from campus.', 'Competition', 'Entrepreneurship Cell', 23, '15:00', '18:00', 'Startup Studio, Block D', 'Open to all branches', 'Free', 14, 'Vikram Iyer', 'vikram.iyer@bmsce.ac.in', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(8, 'Cybersecurity Capture The Flag', 'Test your ethical hacking skills across reconnaissance, encryption, web security and digital forensics.', 'Technical Event', 'Coding Club', 28, '12:00', '18:00', 'Cyber Lab, Block B', 'CSE, ISE, ECE students', 'Free', 17, 'Sanjana Gupta', '+91 98112 77665', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(9, 'Photography Club Photo Walk', 'A slow morning around campus for composition, framing and storytelling through everyday places.', 'Club Activity', 'Other', 31, '08:00', '10:30', 'Campus Garden and Heritage Wings', 'Open to all branches', 'Free', 20, 'Meera Shah', 'meera.shah@bmsce.ac.in', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80'),
    sampleEvent(10, 'Open Mic Night', 'Poetry, music, comedy and stories. A low-pressure evening to perform, listen and connect with the campus arts community.', 'Cultural Event', 'Cultural Club', 39, '18:30', '21:00', 'College Amphitheatre', 'Open to all branches', 'Free', 25, 'Kiran Nair', '+91 90345 18562', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80')
  ];
}
function buildFeaturedEvents() {
  return [
    { id: 101, title: 'Chain Reaction', description: 'A mathematics and logic challenge by Pentagram and OSCode BMSCE. Bring a teammate, solve fast and compete for exciting goodies.', category: 'Competition', organizer: 'Pentagram', eventDate: '2026-09-29', startTime: '14:00', endTime: '17:00', venue: 'CR 404, PJ Block', eligibility: 'Teams of 2 members', entryFee: 'Free', registrationDeadline: '2026-09-29', registrationLink: 'https://forms.google.com/chain-reaction-bmsce', contactPerson: 'Nandini / Navya', contactInfo: '8882812225 / 7389441606', posterImage: '', status: 'upcoming', featured: true },
    { id: 102, title: 'Trifesta', description: 'Think. Guess. Unravel. Find your Oz in this themed puzzle experience presented by OSCode BMSCE.', category: 'Club Activity', organizer: 'OSCode BMSCE', eventDate: '2026-09-28', startTime: '14:00', endTime: '16:00', venue: 'CR 216, PJ Block', eligibility: 'Teams of 2 participants', entryFee: 'Free', registrationDeadline: '2026-09-28', registrationLink: 'https://forms.google.com/trifesta-bmsce', contactPerson: 'Nama Vaishnavi / Ria Arun Kachapilly', contactInfo: '96660 12436 / 97310 47566', posterImage: '', status: 'upcoming', featured: true },
    { id: 103, title: 'Enrollment 2026', description: 'BMSCE NCC enrollment drive for students ready to practise discipline, teamwork and service.', category: 'Other', organizer: 'BMSCE NCC', eventDate: '2026-09-28', startTime: '06:00', endTime: '', venue: 'BMSCE Main Ground', eligibility: 'BMSCE students', entryFee: 'Free', registrationDeadline: '2026-09-28', registrationLink: 'https://forms.google.com/ncc-enrollment-2026', contactPerson: 'Lt. Shivakumaraswamy G.V.', contactInfo: '9632883530', posterImage: '', status: 'upcoming', featured: true },
    { id: 104, title: 'IEEE EDGE 4.0', description: 'Interact with seniors, discover what IEEE is and enjoy fun activities at this open student chapter event.', category: 'Technical Event', organizer: 'BMSCE IEEE', eventDate: '2026-09-28', startTime: '14:00', endTime: '16:00', venue: 'TBA', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '2026-09-28', registrationLink: 'https://forms.google.com/ieee-edge-4', contactPerson: 'Thanisha / Sharath', contactInfo: '91487 82973 / 93533 90346', posterImage: '', status: 'upcoming', featured: true },
    { id: 105, title: 'Aarohana', description: 'The Ascension: a Leo Club of BMSCE installation ceremony with engaging activities, refreshments and a new chapter of service.', category: 'Club Activity', organizer: 'Leo Club of BMSCE', eventDate: '2026-09-28', startTime: '13:00', endTime: '', venue: 'BMSCE Auditorium 1', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '2026-09-28', registrationLink: 'https://forms.google.com/aarohana-bmsce', contactPerson: 'Leo Club of BMSCE', contactInfo: 'Contact club organizers', posterImage: '', status: 'upcoming', featured: true }
  ];
}
function buildPastEvents() {
  return [
    { id: 201, title: 'Onam Utsavam 2.0', description: 'A campus celebration of Kerala culture, colour, food and community.', category: 'Cultural Event', organizer: 'BMSCE Student Community', eventDate: '2026-09-12', startTime: '16:00', endTime: '21:00', venue: 'BMSCE Main Quadrangle', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '', registrationLink: '', contactPerson: 'Student Affairs Office', contactInfo: 'studentaffairs@bmsce.ac.in', posterImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1100&q=85', status: 'completed', past: true },
    { id: 202, title: 'BMSCE Campus Concert', description: 'An electric evening of live music, lights and the campus coming together after sunset.', category: 'Fest', organizer: 'BMSCE Cultural Club', eventDate: '2026-09-06', startTime: '18:00', endTime: '22:00', venue: 'BMSCE Main Ground', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '', registrationLink: '', contactPerson: 'Cultural Club', contactInfo: 'culturalclub@bmsce.ac.in', posterImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1100&q=85', status: 'completed', past: true },
    { id: 203, title: 'Cultural Night', description: 'A high-energy night of performances, lights and student-led celebration on campus.', category: 'Cultural Event', organizer: 'BMSCE Cultural Club', eventDate: '2026-08-28', startTime: '18:30', endTime: '22:00', venue: 'BMSCE Open Air Stage', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '', registrationLink: '', contactPerson: 'Cultural Club', contactInfo: 'culturalclub@bmsce.ac.in', posterImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1100&q=85', status: 'completed', past: true },
    { id: 204, title: 'Campus Celebration', description: 'Students, music, lights and a packed ground made this one for the memory wall.', category: 'Fest', organizer: 'BMSCE Events Team', eventDate: '2026-08-22', startTime: '17:00', endTime: '22:00', venue: 'BMSCE Main Ground', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '', registrationLink: '', contactPerson: 'BMSCE Events Team', contactInfo: 'events@bmsce.ac.in', posterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1100&q=85', status: 'completed', past: true },
    { id: 205, title: "Moto Show '26", description: 'A showcase of machines, builds and the student motor community at BMSCE.', category: 'Other', organizer: 'BMSCE Motor Club', eventDate: '2026-08-15', startTime: '10:00', endTime: '16:00', venue: 'BMSCE Main Ground', eligibility: 'Open to all', entryFee: 'Free', registrationDeadline: '', registrationLink: '', contactPerson: 'BMSCE Motor Club', contactInfo: 'motorclub@bmsce.ac.in', posterImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1100&q=85', status: 'completed', past: true }
  ];
}
function initializeSampleEvents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) { saveEvents([...buildSampleEvents(), ...buildFeaturedEvents(), ...buildPastEvents()]); return; }
  try {
    const events = JSON.parse(stored);
    if (!Array.isArray(events)) return;
    const existingIds = new Set(events.map((event) => Number(event.id)));
    const additions = [...buildFeaturedEvents(), ...buildPastEvents()].filter((event) => !existingIds.has(event.id));
    if (additions.length) saveEvents([...events, ...additions]);
  } catch (error) { /* Keep an existing malformed store untouched. */ }
}
function normalize(value) { return String(value || '').toLowerCase(); }
function searchEvents(events, query) {
  const term = normalize(query).trim();
  if (!term) return events;
  return events.filter((event) => [event.title, event.category, event.organizer, event.venue, event.description, event.contactPerson, event.contactInfo].some((value) => normalize(value).includes(term)));
}
function upcomingEvents() { return getEvents().filter((event) => event.status !== 'cancelled' && !isPastEvent(event)).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)); }
function daysUntilEvent(event) { return Math.ceil((new Date(`${event.eventDate}T00:00:00`) - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000); }
function pastEvents() { return getEvents().filter((event) => event.status !== 'cancelled' && isPastEvent(event)).sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)); }
function posterMarkup(event, compact = false) {
  const image = event.posterImage ? `<img src="${escapeHTML(event.posterImage)}" alt="${escapeHTML(event.title)} poster" loading="lazy" onerror="this.remove()">` : '';
  const posterFallback = `<div class="poster-placeholder event-poster-${escapeHTML(event.id)}"><small>BMSCE / ${escapeHTML(event.organizer)}</small><strong>${escapeHTML(event.title)}</strong><span>${escapeHTML(formatDate(event.eventDate))} · ${escapeHTML(event.venue)}</span></div>`;
  return `<div class="card-poster ${compact ? 'compact-poster' : ''}">${image}${posterFallback}<span class="badge">${escapeHTML(event.category)}</span></div>`;
}
function cardMarkup(event) {
  return `<article class="event-card">${posterMarkup(event)}<div class="card-content"><div class="card-meta"><span>${escapeHTML(formatDate(event.eventDate))}</span><span>${escapeHTML(event.startTime || 'TBA')}</span></div><h3>${escapeHTML(event.title)}</h3><p>↳ ${escapeHTML(event.venue)}</p><p>↳ ${escapeHTML(event.organizer)}</p><p class="card-description">${escapeHTML(event.description)}</p><a class="card-link" href="event-details.html?id=${encodeURIComponent(event.id)}">View details ↗</a></div></article>`;
}
function spotlightMarkup(event) {
  const days = daysUntilEvent(event);
  const timing = days === 0 ? 'Happening today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
  return `<article class="spotlight-card">${posterMarkup(event)}<div class="card-content"><span class="spotlight-flag">Next up · ${escapeHTML(timing)}</span><div class="card-meta"><span>${escapeHTML(formatDate(event.eventDate))}</span><span>${escapeHTML(event.startTime || 'TBA')}</span></div><h3>${escapeHTML(event.title)}</h3><p>↳ ${escapeHTML(event.venue)}</p><p>↳ ${escapeHTML(event.organizer)}</p><p class="card-description">${escapeHTML(event.description)}</p><a class="button button-lime" href="event-details.html?id=${encodeURIComponent(event.id)}">See event details ↗</a></div></article>`;
}
function renderEventCards(events, target = document.getElementById('event-list')) {
  if (!target) return;
  target.innerHTML = events.map(cardMarkup).join('');
}
function filterEvents() {
  const list = document.getElementById('event-list');
  if (!list) return;
  let events = upcomingEvents();
  const search = document.getElementById('event-search')?.value || '';
  const category = document.getElementById('category-filter')?.value || 'All Categories';
  const organizer = document.getElementById('organizer-filter')?.value || 'All Organizers';
  const date = document.getElementById('date-filter')?.value || 'all';
  const openToAll = document.getElementById('open-to-all')?.checked;
  events = searchEvents(events, search);
  if (category !== 'All Categories') events = events.filter((event) => event.category === category);
  if (organizer !== 'All Organizers') events = events.filter((event) => event.organizer === organizer);
  if (openToAll) events = events.filter((event) => normalize(event.eligibility).includes('all'));
  if (date !== 'all') {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    events = events.filter((event) => { const difference = Math.round((new Date(`${event.eventDate}T00:00:00`) - today) / 86400000); return date === 'today' ? difference === 0 : date === 'week' ? difference >= 0 && difference <= 7 : difference >= 0 && difference <= 31; });
  }
  renderEventCards(events, list);
  const summary = document.getElementById('results-summary'); if (summary) summary.textContent = `${events.length} event${events.length === 1 ? '' : 's'} found`;
  document.getElementById('empty-state')?.classList.toggle('hidden', events.length !== 0);
}
function updateFilterUrl() {
  const url = new URL(window.location.href); const values = { search: document.getElementById('event-search')?.value.trim(), category: document.getElementById('category-filter')?.value, organizer: document.getElementById('organizer-filter')?.value, date: document.getElementById('date-filter')?.value, openToAll: document.getElementById('open-to-all')?.checked ? 'true' : '' };
  Object.entries(values).forEach(([key, value]) => value && !['All Categories', 'All Organizers', 'all'].includes(value) ? url.searchParams.set(key, value) : url.searchParams.delete(key));
  history.replaceState({}, '', url);
}
function clearFilters() {
  const search = document.getElementById('event-search'); const category = document.getElementById('category-filter'); const organizer = document.getElementById('organizer-filter'); const date = document.getElementById('date-filter'); const open = document.getElementById('open-to-all');
  if (search) search.value = ''; if (category) category.value = 'All Categories'; if (organizer) organizer.value = 'All Organizers'; if (date) date.value = 'all'; if (open) open.checked = false;
  const url = new URL(window.location.href); ['search', 'category', 'organizer', 'date', 'openToAll'].forEach((key) => url.searchParams.delete(key)); history.replaceState({}, '', url); filterEvents();
}
function renderHomeHighlights() {
  const target = document.getElementById('home-highlights'); if (!target) return;
  const events = upcomingEvents(); const soonest = events.find((event) => daysUntilEvent(event) <= 7) || events[0]; const shortlist = events.filter((event) => event.id !== soonest?.id).slice(0, 3);
  target.innerHTML = soonest ? [spotlightMarkup(soonest), ...shortlist.map(cardMarkup)].join('') : '<div class="empty-state"><h2>No upcoming events</h2><p>Check back soon for campus updates.</p></div>';
}
function pastCardMarkup(event, index) {
  return `<article class="past-card reveal-on-scroll" style="--reveal-delay: ${index * 80}ms"><a href="event-details.html?id=${encodeURIComponent(event.id)}"><div class="past-image">${event.posterImage ? `<img src="${escapeHTML(event.posterImage)}" alt="${escapeHTML(event.title)} event photo" loading="lazy" onerror="this.remove()">` : ''}<div class="past-image-fallback"><span>${escapeHTML(initials(event.title))}</span></div><span class="past-date">${escapeHTML(formatDate(event.eventDate))}</span><span class="past-arrow">↗</span></div><div class="past-card-content"><span>${escapeHTML(event.category)}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.venue)}</p></div></a></article>`;
}
function renderPastEvents(filter = 'all') {
  const target = document.getElementById('past-events'); if (!target) return;
  const events = pastEvents().filter((event) => filter === 'all' || event.category === filter);
  target.innerHTML = events.length ? events.map(pastCardMarkup).join('') : '<div class="empty-state"><h2>No archived events</h2><p>There are no past events in this category yet.</p></div>';
  requestAnimationFrame(() => target.querySelectorAll('.past-card').forEach((card) => card.classList.add('is-visible')));
}
function initializePastEventFilters() {
  const filters = document.querySelectorAll('[data-past-filter]'); if (!filters.length) return;
  filters.forEach((filter) => filter.addEventListener('click', () => { filters.forEach((item) => item.classList.remove('active')); filter.classList.add('active'); renderPastEvents(filter.dataset.pastFilter); }));
  renderPastEvents();
}
function renderEventDetails() {
  const target = document.getElementById('event-details-content'); if (!target) return;
  const event = getEventById(new URLSearchParams(window.location.search).get('id'));
  if (!event) { target.innerHTML = '<div class="not-found"><h1>Event not found</h1><p>The event may have moved or been removed.</p><a class="button button-lime" href="events.html">Explore events ↗</a></div>'; return; }
  const ended = isPastEvent(event); const cancelled = event.status === 'cancelled'; const canRegister = !ended && !cancelled && event.registrationLink;
  const detailPoster = event.posterImage ? `<img src="${escapeHTML(event.posterImage)}" alt="${escapeHTML(event.title)} poster" onerror="this.remove()">` : '';
  const detailPosterFallback = `<div class="poster-placeholder event-poster-${escapeHTML(event.id)}"><small>BMSCE / ${escapeHTML(event.organizer)}</small><strong>${escapeHTML(event.title)}</strong><span>${escapeHTML(formatDate(event.eventDate))} · ${escapeHTML(event.venue)}</span></div>`;
  target.innerHTML = `<article class="detail-shell"><div class="detail-cover">${detailPoster}${detailPosterFallback}</div><div class="detail-body">${cancelled ? '<div class="status-banner cancelled">Cancelled · registration unavailable</div>' : ended ? '<div class="status-banner ended">This event has ended</div>' : ''}<p class="kicker">${escapeHTML(event.organizer)} / ${escapeHTML(event.category)}</p><h1>${escapeHTML(event.title)}</h1><div class="badge-row"><span class="badge">${escapeHTML(event.category)}</span><span class="badge">${escapeHTML(event.eligibility || 'Open to all')}</span></div><p class="detail-description">${escapeHTML(event.description)}</p><div class="detail-grid"><div class="detail-item"><strong>Date</strong><span>${escapeHTML(formatDate(event.eventDate))}</span></div><div class="detail-item"><strong>Time</strong><span>${escapeHTML(event.startTime || 'TBA')}${event.endTime ? ` — ${escapeHTML(event.endTime)}` : ''}</span></div><div class="detail-item"><strong>Venue</strong><span>${escapeHTML(event.venue)}</span></div><div class="detail-item"><strong>Entry fee</strong><span>${escapeHTML(event.entryFee || 'Free')}</span></div><div class="detail-item"><strong>Register by</strong><span>${escapeHTML(event.registrationDeadline ? formatDate(event.registrationDeadline) : 'Not specified')}</span></div><div class="detail-item"><strong>Contact</strong><span>${escapeHTML(event.contactPerson)}<br>${escapeHTML(event.contactInfo)}</span></div></div><div class="detail-actions">${canRegister ? `<a class="button button-lime" href="${escapeHTML(event.registrationLink)}" target="_blank" rel="noreferrer">Register now ↗</a>` : '<button class="button button-lime" disabled>Registration closed</button>'}<a class="button" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`BMS College of Engineering ${event.venue}`)}" target="_blank" rel="noreferrer">Venue map ↗</a><button class="button" id="share-event-button" type="button">Share event ↗</button></div></div></article>`;
  document.getElementById('share-event-button')?.addEventListener('click', async () => {
    try { if (navigator.share) await navigator.share({ title: event.title, text: `${event.title} at BMSCE EventHub`, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); showNotification('Event link copied to clipboard.'); } }
    catch (error) { showNotification('Unable to share this event right now.', 'error'); }
  });
}
function showNotification(message, type = 'success') {
  document.querySelector('.toast')?.remove(); const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.textContent = message; document.getElementById('toast-root')?.appendChild(toast); setTimeout(() => toast.remove(), 3000);
}
function validateForm() {
  const form = document.getElementById('event-form'); if (!form) return true; let valid = true;
  const errors = {}; const value = (id) => document.getElementById(id)?.value.trim() || '';
  const required = ['title', 'description', 'category', 'organizer', 'eventDate', 'startTime', 'venue', 'registrationLink', 'contactPerson', 'contactInfo'];
  required.forEach((id) => { if (!value(id)) errors[id] = 'This field is required.'; });
  const eventDate = value('eventDate'); if (eventDate && new Date(`${eventDate}T00:00:00`) < new Date(new Date().setHours(0, 0, 0, 0))) errors.eventDate = 'Event date cannot be in the past.';
  ['registrationLink', 'posterImage'].forEach((id) => { const url = value(id); if (url) { try { const parsed = new URL(url); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(); } catch (error) { errors[id] = 'Enter a valid http(s) URL.'; } } });
  if (!document.getElementById('confirm-details')?.checked) errors.confirm = 'Please confirm the information is correct.';
  document.querySelectorAll('[data-error-for]').forEach((node) => { node.textContent = errors[node.dataset.errorFor] || ''; }); valid = Object.keys(errors).length === 0; return valid;
}
function initializeSubmitForm() {
  const form = document.getElementById('event-form'); if (!form) return;
  const dateInput = document.getElementById('eventDate'); if (dateInput) dateInput.min = futureDate(0);
  form.addEventListener('submit', (submitEvent) => { submitEvent.preventDefault(); if (!validateForm()) { showNotification('Please correct the highlighted fields.', 'error'); return; }
    const button = document.getElementById('submit-button'); const spinner = button?.querySelector('.spinner'); const label = button?.querySelector('.btn-label'); if (button) button.disabled = true; spinner?.classList.remove('hidden'); if (label) label.textContent = 'Publishing...';
    const data = new FormData(form); const events = getEvents(); const newEvent = { id: Date.now(), title: data.get('title').trim(), description: data.get('description').trim(), category: data.get('category'), organizer: data.get('organizer'), eventDate: data.get('eventDate'), startTime: data.get('startTime'), endTime: data.get('endTime'), venue: data.get('venue').trim(), eligibility: data.get('eligibility').trim() || 'Open to all students', entryFee: data.get('entryFee').trim() || 'Free', registrationDeadline: data.get('registrationDeadline'), registrationLink: data.get('registrationLink').trim(), contactPerson: data.get('contactPerson').trim(), contactInfo: data.get('contactInfo').trim(), posterImage: data.get('posterImage').trim(), status: 'upcoming' };
    const session = getSession(); newEvent.ownerEmail = session?.email || ''; newEvent.ownerName = session?.name || ''; newEvent.ownerRole = session?.role || 'organizer'; saveEvents([...events, newEvent]); const success = document.getElementById('form-success'); if (success) { success.textContent = 'Published. Redirecting to your event...'; success.classList.remove('hidden'); } showNotification('Event published successfully.'); setTimeout(() => { window.location.href = `event-details.html?id=${newEvent.id}`; }, 800);
  });
}
function initializeEventsPage() {
  const url = new URL(window.location.href); const search = document.getElementById('event-search'); const category = document.getElementById('category-filter'); const organizer = document.getElementById('organizer-filter'); const date = document.getElementById('date-filter'); const open = document.getElementById('open-to-all');
  if (search) search.value = url.searchParams.get('search') || ''; if (category && categories.includes(url.searchParams.get('category'))) category.value = url.searchParams.get('category'); if (organizer && url.searchParams.get('organizer')) organizer.value = url.searchParams.get('organizer'); if (date) date.value = url.searchParams.get('date') || 'all'; if (open) open.checked = url.searchParams.get('openToAll') === 'true';
  [search, category, organizer, date, open].forEach((control) => control?.addEventListener(control.type === 'search' ? 'input' : 'change', () => { updateFilterUrl(); filterEvents(); })); document.getElementById('clear-filters')?.addEventListener('click', clearFilters); document.getElementById('empty-clear-filters')?.addEventListener('click', clearFilters); filterEvents();
}
function initializeAuthPage() {
  const form = document.getElementById('auth-form'); if (!form) return;
  let role = 'student'; let mode = 'login';
  const roleTabs = document.querySelectorAll('[data-role]'); const modeButtons = document.querySelectorAll('[data-auth-mode]'); const nameField = document.getElementById('auth-name')?.closest('.field-row'); const confirmField = document.querySelector('.register-only-field'); const message = document.getElementById('auth-message'); const submitLabel = document.getElementById('auth-submit-label');
  const setMessage = (text, type = '') => { if (message) { message.textContent = text; message.className = `auth-message ${type}`; } };
  const updateMode = () => { const registering = mode === 'register'; nameField?.classList.toggle('hidden', !registering); confirmField?.classList.toggle('hidden', !registering); if (submitLabel) submitLabel.textContent = registering ? 'Create account ↗' : 'Sign in ↗'; modeButtons.forEach((button) => button.classList.toggle('active', button.dataset.authMode === mode)); document.getElementById('auth-password')?.setAttribute('autocomplete', registering ? 'new-password' : 'current-password'); setMessage(''); };
  roleTabs.forEach((tab) => tab.addEventListener('click', () => { role = tab.dataset.role; roleTabs.forEach((item) => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', String(item === tab)); }); setMessage(''); }));
  modeButtons.forEach((button) => button.addEventListener('click', () => { mode = button.dataset.authMode; updateMode(); }));
  form.addEventListener('submit', (event) => { event.preventDefault(); document.querySelectorAll('[data-auth-error]').forEach((node) => node.textContent = ''); const data = new FormData(form); const name = String(data.get('name') || '').trim(); const email = String(data.get('email') || '').trim().toLowerCase(); const password = String(data.get('password') || ''); const confirmPassword = String(data.get('confirmPassword') || ''); const errors = {}; if (mode === 'register' && !name) errors.name = 'Enter your full name.'; if (!email || !email.includes('@')) errors.email = 'Enter a valid email address.'; if (password.length < 6) errors.password = 'Use at least 6 characters.'; if (mode === 'register' && password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'; Object.entries(errors).forEach(([key, value]) => { const node = document.querySelector(`[data-auth-error="${key}"]`); if (node) node.textContent = value; }); if (Object.keys(errors).length) return;
    const users = getUsers(); const existing = users.find((user) => user.email === email && user.role === role);
    if (mode === 'register') { if (existing) { setMessage('An account already exists for this role and email.', 'error'); return; } const user = { id: Date.now(), name, email, password, role }; saveUsers([...users, user]); saveSession(user); window.location.href = 'portal.html'; return; }
    if (!existing || existing.password !== password) { setMessage('Email, password or role did not match.', 'error'); return; } saveSession(existing); window.location.href = 'portal.html';
  });
  updateMode();
}
function initializeTheme() {
  const shell = document.querySelector('.nav-shell');
  const navigationToggle = document.querySelector('.nav-toggle');
  if (!shell || document.querySelector('.theme-toggle')) return;
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.type = 'button';
  toggle.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">☾</span><span class="theme-toggle-label">Dark mode</span>';
  if (navigationToggle) shell.insertBefore(toggle, navigationToggle); else shell.appendChild(toggle);
  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.dataset.theme = isDark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';
    toggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☼' : '☾';
  };
  applyTheme(localStorage.getItem('bmsce-eventhub-theme') || 'light');
  toggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('bmsce-eventhub-theme', nextTheme);
    applyTheme(nextTheme);
  });
}
function initializeBrandName() {
  document.title = document.title.replace(/EventHub/g, 'EventVerse');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => { node.nodeValue = node.nodeValue.replace(/EventHub/g, 'EventVerse'); });
  document.querySelectorAll('[aria-label], [alt], [content]').forEach((element) => {
    ['aria-label', 'alt', 'content'].forEach((attribute) => { if (element.hasAttribute(attribute)) element.setAttribute(attribute, element.getAttribute(attribute).replace(/EventHub/g, 'EventVerse')); });
  });
}
function portalEventList(events, emptyText) { return events.length ? `<div class="portal-event-list">${events.map((event) => `<a class="portal-event" href="event-details.html?id=${encodeURIComponent(event.id)}"><div><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.venue)} · ${escapeHTML(event.category)}</p></div><span class="portal-event-date">${escapeHTML(formatDate(event.eventDate))}<br>↗</span></a>`).join('')}</div>` : `<p class="portal-empty">${escapeHTML(emptyText)}</p>`; }
function initializePortalPage() {
  const target = document.getElementById('portal-content'); if (!target) return;
  const session = getSession(); if (!session) { window.location.href = 'login.html'; return; }
  const title = document.getElementById('portal-title'); const subtitle = document.getElementById('portal-subtitle'); if (title) title.innerHTML = `Hello, <span>${escapeHTML(session.name.split(' ')[0])}.</span>`;
  if (session.role === 'organizer') {
    if (subtitle) subtitle.textContent = 'Publish, review and keep track of your campus events.';
    const ownedEvents = getEvents().filter((event) => event.ownerEmail === session.email); const upcomingOwned = ownedEvents.filter((event) => !isPastEvent(event));
    target.innerHTML = `<div class="portal-stat-row"><div class="portal-stat"><strong>${ownedEvents.length}</strong><span>Your events</span></div><div class="portal-stat"><strong>${upcomingOwned.length}</strong><span>Upcoming</span></div><div class="portal-stat"><strong>${ownedEvents.filter((event) => isPastEvent(event)).length}</strong><span>Completed</span></div></div><div class="portal-grid"><section class="portal-card"><p class="kicker">Organizer desk</p><h2>Your event board</h2>${portalEventList(ownedEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)), 'Your submitted events will appear here.')}</section><section class="portal-card dark"><p class="kicker">Make it visible</p><h2>Have something coming up?</h2><p>Share the date, place and details with the BMSCE community.</p><div class="portal-actions"><a class="button button-lime" href="submit-event.html">Submit an event ↗</a><a class="button" href="events.html">Explore board ↗</a></div></section></div>`;
  } else {
    if (subtitle) subtitle.textContent = 'A quick view of what is happening around BMSCE.';
    const events = upcomingEvents(); target.innerHTML = `<div class="portal-grid"><section class="portal-card dark"><p class="kicker">Student shortcuts</p><h2>Stay in the loop.</h2><p>Find something to learn, build, perform or show up for next.</p><div class="portal-actions"><a class="button button-lime" href="events.html">Explore events ↗</a><a class="button" href="submit-event.html">Share an event ↗</a></div></section><section class="portal-card"><p class="kicker">Coming soon</p><h2>Next on campus</h2>${portalEventList(events.slice(0, 4), 'No upcoming events right now.')}</section></div>`;
  }
  document.getElementById('logout-button')?.addEventListener('click', () => { clearSession(); window.location.href = 'login.html'; });
}
function initializeNavigation() { const toggle = document.querySelector('.nav-toggle'); const nav = document.querySelector('.main-nav'); if (!toggle || !nav) return; const session = getSession(); if (!nav.querySelector('.portal-nav-link')) { const portalLink = document.createElement('a'); portalLink.className = 'portal-nav-link'; portalLink.href = session ? 'portal.html' : 'login.html'; portalLink.textContent = session ? 'Portal' : 'Login'; if (session) portalLink.classList.add('active'); nav.appendChild(portalLink); } toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); }); nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); })); }
function initializeScrollMotion() {
  document.documentElement.classList.add('motion-ready');
  const revealables = document.querySelectorAll('main > section, .category-list a, .highlight-card, .event-card, .how-steps article, .detail-shell, .about-grid, .form-wrap');
  revealables.forEach((element, index) => { element.classList.add('reveal-on-scroll'); element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`); });
  if (!('IntersectionObserver' in window)) { revealables.forEach((element) => element.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver((entries, motionObserver) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); motionObserver.unobserve(entry.target); }); }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealables.forEach((element) => observer.observe(element));
}
function initializeHomeSearch() { document.getElementById('home-search-form')?.addEventListener('submit', (event) => { event.preventDefault(); const value = document.getElementById('home-search-input')?.value.trim(); const url = new URL('events.html', window.location.href); if (value) url.searchParams.set('search', value); window.location.href = url.toString(); }); }
function initializePage() { document.querySelectorAll('#year').forEach((node) => node.textContent = new Date().getFullYear()); document.querySelectorAll('.brand-mark img, .auth-brand img').forEach((image) => { image.src = 'BMSCE.jpeg'; image.alt = 'BMS College of Engineering logo'; }); initializeBrandName(); initializeTheme(); initializeNavigation(); const page = document.body.dataset.page; if (page === 'home') { renderHomeHighlights(); renderPastEvents(); initializePastEventFilters(); initializeHomeSearch(); } if (page === 'events') initializeEventsPage(); if (page === 'details') renderEventDetails(); if (page === 'submit') initializeSubmitForm(); if (page === 'login') initializeAuthPage(); if (page === 'portal') initializePortalPage(); initializeScrollMotion(); }

document.addEventListener('DOMContentLoaded', initializePage);
