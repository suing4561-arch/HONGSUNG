    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

    const CONFIG = {
      supabaseUrl: 'https://afjtafxeugtsrbedkuqj.supabase.co',
      supabaseAnonKey: 'sb_publishable_mn3zi4iduWHHJxDGLjOVqQ_395lWBY-'
    };

    const ADMIN_EMAILS = [
      'suing4561@gmail.com',
      'admin2@example.com',
      'admin3@example.com'
    ];

    const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    const field = document.getElementById('field');
    const addBtn = document.getElementById('addBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const counter = document.getElementById('counter');
    const colorButtons = document.querySelectorAll('.color-btn');
    const authStatus = document.getElementById('authStatus');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const postPasswordInput = document.getElementById('postPasswordInput');
    const WORLD_CUP_STORAGE_KEY = 'onepick_worldcup_posts_v1';
    const worldcupList = document.getElementById('worldcupList');
    const worldcupToolbar = document.getElementById('worldcupToolbar');
    const worldcupWriteBtn = document.getElementById('worldcupWriteBtn');
    const worldcupModalBackdrop = document.getElementById('worldcupModalBackdrop');
    const worldcupForm = document.getElementById('worldcupForm');
    const worldcupCancelBtn = document.getElementById('worldcupCancelBtn');
    const worldcupTitleInput = document.getElementById('worldcupTitleInput');
    const worldcupCreatedAtInput = document.getElementById('worldcupCreatedAtInput');
    const worldcupDescriptionInput = document.getElementById('worldcupDescriptionInput');
    const worldcupStartInput = document.getElementById('worldcupStartInput');
    const worldcupEndInput = document.getElementById('worldcupEndInput');
    const worldcupResultInput = document.getElementById('worldcupResultInput');
    const worldcupCandidateNameInputs = Array.from(document.querySelectorAll('.candidate-name-input'));
    const worldcupCandidateImageInputs = Array.from(document.querySelectorAll('.candidate-image-input'));
    const worldcupCandidateVoteInputs = Array.from(document.querySelectorAll('.candidate-vote-input'));

    let selectedColor = 'green';
    let jerseys = [];
    let idSeed = 1;
    let dragTarget = null;
    let activePointerId = null;
    let holdOffsetX = 0;
    let holdOffsetY = 0;
    const colorMap = { green:'#16a34a', orange:'#f97316', pink:'#ec4899' };

    colorButtons.forEach(btn => btn.addEventListener('click', () => selectedColor = btn.dataset.color));

    function jerseySVG(color) {
      return `
      <svg class="jersey-svg" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M33 18L47 8h26l14 10 22 10-11 24-13-5v68c0 9-7 16-16 16H51c-9 0-16-7-16-16V47l-13 5L11 28l22-10z" fill="${color}" stroke="#ffffff" stroke-width="4"/>
        <path d="M47 8c2 9 8 13 13 13s11-4 13-13" fill="#ffffff" opacity="0.95"/>
        <rect x="34" y="41" width="52" height="32" rx="10" fill="#ffffff" opacity="0.90"/>
      </svg>`;
    }

    function drawRoundedRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawJersey(ctx, cx, cy, scale, fillColor, name) {
      const w = 120 * scale, h = 140 * scale, x = cx - w/2, y = cy - h/2;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 16 * scale;
      ctx.shadowOffsetY = 10 * scale;

      ctx.beginPath();
      ctx.moveTo(x + 33*scale, y + 18*scale);
      ctx.lineTo(x + 47*scale, y + 8*scale);
      ctx.lineTo(x + 73*scale, y + 8*scale);
      ctx.lineTo(x + 87*scale, y + 18*scale);
      ctx.lineTo(x + 109*scale, y + 28*scale);
      ctx.lineTo(x + 98*scale, y + 52*scale);
      ctx.lineTo(x + 85*scale, y + 47*scale);
      ctx.lineTo(x + 85*scale, y + 115*scale);
      ctx.quadraticCurveTo(x + 85*scale, y + 131*scale, x + 69*scale, y + 131*scale);
      ctx.lineTo(x + 51*scale, y + 131*scale);
      ctx.quadraticCurveTo(x + 35*scale, y + 131*scale, x + 35*scale, y + 115*scale);
      ctx.lineTo(x + 35*scale, y + 47*scale);
      ctx.lineTo(x + 22*scale, y + 52*scale);
      ctx.lineTo(x + 11*scale, y + 28*scale);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.lineWidth = 4 * scale;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      ctx.beginPath();
      ctx.moveTo(x + 47*scale, y + 8*scale);
      ctx.quadraticCurveTo(x + 49*scale, y + 21*scale, x + 60*scale, y + 21*scale);
      ctx.quadraticCurveTo(x + 71*scale, y + 21*scale, x + 73*scale, y + 8*scale);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fill();

      drawRoundedRect(ctx, x + 34*scale, y + 41*scale, 52*scale, 32*scale, 10*scale);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = `900 ${16*scale}px Arial, Apple SD Gothic Neo, Malgun Gothic, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name || '이름', x + 60*scale, y + 57*scale);
      ctx.restore();
    }

    function updateCounter() { counter.textContent = `현재 ${jerseys.length} / 12`; }

    function createJersey() {
      if (jerseys.length >= 12) return alert('유니폼은 최대 12개까지 배치할 수 있습니다.');
      const id = idSeed++;
      const item = { id, color: selectedColor, name: '', x: 50, y: 50 };
      jerseys.push(item);

      const el = document.createElement('div');
      el.className = 'jersey';
      el.dataset.id = id;
      el.style.left = item.x + '%';
      el.style.top = item.y + '%';
      el.innerHTML = jerseySVG(colorMap[item.color]);

      const input = document.createElement('input');
      input.className = 'name-input';
      input.type = 'text';
      input.maxLength = 8;
      input.placeholder = '이름';
      input.addEventListener('input', (e) => {
        const target = jerseys.find(j => j.id === id);
        if (target) target.name = e.target.value;
      });
      input.addEventListener('pointerdown', (e) => e.stopPropagation());
      input.addEventListener('mousedown', (e) => e.stopPropagation());
      input.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

      el.appendChild(input);
      el.addEventListener('pointerdown', startDrag);
      el.addEventListener('dblclick', () => removeJersey(id));
      field.appendChild(el);
      updateCounter();
    }

    function removeJersey(id) {
      jerseys = jerseys.filter(j => j.id !== id);
      const el = field.querySelector(`.jersey[data-id="${id}"]`);
      if (el) el.remove();
      updateCounter();
    }

    function startDrag(e) {
      if (e.target.classList.contains('name-input')) return;
      e.preventDefault();
      dragTarget = e.currentTarget;
      activePointerId = e.pointerId;
      dragTarget.classList.add('dragging');

      const fieldRect = field.getBoundingClientRect();
      const jerseyRect = dragTarget.getBoundingClientRect();
      const centerX = jerseyRect.left - fieldRect.left + jerseyRect.width / 2;
      const centerY = jerseyRect.top - fieldRect.top + jerseyRect.height / 2;

      holdOffsetX = (e.clientX - fieldRect.left) - centerX;
      holdOffsetY = (e.clientY - fieldRect.top) - centerY;
      try { dragTarget.setPointerCapture(e.pointerId); } catch {}
    }

    function moveDrag(e) {
      if (!dragTarget) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      e.preventDefault();

      const fieldRect = field.getBoundingClientRect();
      let x = ((e.clientX - fieldRect.left) - holdOffsetX) / fieldRect.width * 100;
      let y = ((e.clientY - fieldRect.top) - holdOffsetY) / fieldRect.height * 100;
      x = Math.max(8, Math.min(92, x));
      y = Math.max(7, Math.min(93, y));

      dragTarget.style.left = x + '%';
      dragTarget.style.top = y + '%';

      const id = Number(dragTarget.dataset.id);
      const target = jerseys.find(j => j.id === id);
      if (target) { target.x = x; target.y = y; }
    }

    function endDrag(e) {
      if (!dragTarget) return;
      if (e.pointerId !== undefined && activePointerId !== null && e.pointerId !== activePointerId) return;
      try { dragTarget.releasePointerCapture(activePointerId); } catch {}
      dragTarget.classList.remove('dragging');
      dragTarget = null;
      activePointerId = null;
    }

    function downloadBoardImage() {
      const rect = field.getBoundingClientRect();
      const exportScale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(rect.width * exportScale);
      canvas.height = Math.round(rect.height * exportScale);
      const ctx = canvas.getContext('2d');
      ctx.scale(exportScale, exportScale);

      const grad = ctx.createLinearGradient(0, 0, 0, rect.height);
      grad.addColorStop(0, '#34d399');
      grad.addColorStop(1, '#10b981');
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, 0, 0, rect.width, rect.height, 20);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      drawRoundedRect(ctx, 0, 0, rect.width, rect.height, 20);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath(); ctx.moveTo(0, rect.height/2); ctx.lineTo(rect.width, rect.height/2); ctx.stroke();
      ctx.beginPath(); ctx.arc(rect.width/2, rect.height/2, 60, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rect.width*.18,0); ctx.lineTo(rect.width*.18,rect.height*.15); ctx.lineTo(rect.width*.82,rect.height*.15); ctx.lineTo(rect.width*.82,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rect.width*.34,0); ctx.lineTo(rect.width*.34,rect.height*.07); ctx.lineTo(rect.width*.66,rect.height*.07); ctx.lineTo(rect.width*.66,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rect.width*.18,rect.height); ctx.lineTo(rect.width*.18,rect.height*.85); ctx.lineTo(rect.width*.82,rect.height*.85); ctx.lineTo(rect.width*.82,rect.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rect.width*.34,rect.height); ctx.lineTo(rect.width*.34,rect.height*.93); ctx.lineTo(rect.width*.66,rect.height*.93); ctx.lineTo(rect.width*.66,rect.height); ctx.stroke();

      Array.from(field.querySelectorAll('.jersey')).forEach((el) => {
        const id = Number(el.dataset.id);
        const data = jerseys.find(j => j.id === id);
        if (!data) return;
        const elRect = el.getBoundingClientRect();
        const cx = (elRect.left - rect.left) + elRect.width / 2;
        const cy = (elRect.top - rect.top) + elRect.height / 2;
        const scale = elRect.width / 120;
        drawJersey(ctx, cx, cy, scale, colorMap[data.color], data.name);
      });

      const link = document.createElement('a');
      link.download = 'futsal-board.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    addBtn.addEventListener('click', createJersey);
    resetBtn.addEventListener('click', () => {
      jerseys = [];
      field.querySelectorAll('.jersey').forEach(el => el.remove());
      updateCounter();
    });
    downloadBtn.addEventListener('click', downloadBoardImage);
    window.addEventListener('pointermove', moveDrag, { passive: false });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    updateCounter();

    const postList = document.getElementById('postList');
    const boardMeta = document.getElementById('boardMeta');
    const boardButtons = document.querySelectorAll('[data-board]');
    const writeBtn = document.getElementById('writeBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const postForm = document.getElementById('postForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const urgentBox = document.getElementById('urgentBox');
    const urgentInput = document.getElementById('urgentInput');
    const authorInput = document.getElementById('authorInput');
    const titleInput = document.getElementById('titleInput');
    const regionInput = document.getElementById('regionInput');
    const timeInput = document.getElementById('timeInput');
    const levelInput = document.getElementById('levelInput');
    const feeInput = document.getElementById('feeInput');
    const contentInput = document.getElementById('contentInput');

    let currentBoard = 'mercenary';
    let editingId = null;
    let currentUser = null;
    let cachedPosts = [];
    let bannedEmailSet = new Set();
    let worldcupPosts = loadWorldcupPosts();

    function boardLabel(board) {
      if (board === 'mercenary') return '용병';
      if (board === 'matching') return '팀매칭';
      return '팀원모집';
    }

    function updateUrgentBox() { urgentBox.style.display = currentBoard === 'mercenary' ? 'flex' : 'none'; }

    function formatDate(iso) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }

    function escapeHtml(str) {
      return String(str ?? '')
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    }

    function isAdminEmail(email) {
      return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
    }

    async function refreshBannedList() {
      const { data } = await supabase.from('banned_users').select('email');
      bannedEmailSet = new Set((data || []).map(x => String(x.email).toLowerCase()));
    }

    function isCurrentUserBanned() {
      const email = currentUser?.email?.toLowerCase();
      return !!email && bannedEmailSet.has(email);
    }

    function setStatus(message) {
      authStatus.textContent = message;
    }

    function updateWorldcupAdminUI() {
      const isAdmin = isAdminEmail(currentUser?.email);
      if (worldcupToolbar) worldcupToolbar.style.display = isAdmin ? 'flex' : 'none';
      if (worldcupWriteBtn) worldcupWriteBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    function toLocalDateTimeValue(date) {
      const copy = new Date(date);
      copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
      return copy.toISOString().slice(0, 16);
    }

    function fromDateTimeLocal(value) {
      return value ? new Date(value).toISOString() : '';
    }

    function createDefaultWorldcupPost({ title, description, resultSummary, startAt, endAt, createdAt, candidates }) {
      return {
        id: crypto.randomUUID(),
        title,
        description,
        createdAt,
        startAt,
        endAt,
        resultSummary,
        candidates: candidates.map(candidate => ({
          id: crypto.randomUUID(),
          name: candidate.name,
          image: candidate.image || '',
          votes: Number(candidate.votes || 0)
        }))
      };
    }

    function loadWorldcupPosts() {
      try {
        const raw = localStorage.getItem(WORLD_CUP_STORAGE_KEY);
        if (!raw) {
          const now = new Date();
          const later = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2);
          return [
            createDefaultWorldcupPost({
              title: '풋살화 원픽 월드컵 4강',
              description: '가장 마음에 드는 후보를 바로 선택해 주세요. 사진을 클릭할 때마다 투표 수가 즉시 올라갑니다.',
              createdAt: now.toISOString(),
              startAt: now.toISOString(),
              endAt: later.toISOString(),
              resultSummary: '현재 실시간 집계 중입니다. 종료 후 최다 득표 후보를 우승으로 정리할 예정입니다.',
              candidates: [
                { name: '스피드 킥', votes: 3 },
                { name: '컨트롤 마스터', votes: 5 },
                { name: '스트라이커 프로', votes: 2 },
                { name: '클래식 터치', votes: 4 }
              ]
            })
          ];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function saveWorldcupPosts() {
      localStorage.setItem(WORLD_CUP_STORAGE_KEY, JSON.stringify(worldcupPosts));
    }

    function getWorldcupStatus(post) {
      const now = Date.now();
      const start = new Date(post.startAt).getTime();
      const end = new Date(post.endAt).getTime();
      if (Number.isFinite(end) && now > end) {
        return { key: 'closed', label: '투표 종료', clickable: false };
      }
      if (Number.isFinite(start) && now < start) {
        return { key: 'pending', label: '투표 예정', clickable: false };
      }
      return { key: 'live', label: '투표 진행중', clickable: true };
    }

    function renderWorldcupPosts() {
      const sorted = [...worldcupPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (!sorted.length) {
        worldcupList.innerHTML = '<div class="board-empty">등록된 원픽월드컵 투표글이 없습니다. 관리자 투표 등록으로 첫 글을 추가하세요.</div>';
        return;
      }

      worldcupList.innerHTML = sorted.map(post => {
        const status = getWorldcupStatus(post);
        return `
          <article class="board-list-card worldcup-card">
            <div class="worldcup-top">
              <div>
                <h3>${escapeHtml(post.title)}</h3>
                <p class="worldcup-desc">${escapeHtml(post.description).replace(/\n/g, '<br>')}</p>
              </div>
              <span class="worldcup-status ${status.key}">${status.label}</span>
            </div>
            <div class="worldcup-info">
              <div class="worldcup-info-item">
                <strong>작성일</strong>
                <span>${formatDate(post.createdAt)}</span>
              </div>
              <div class="worldcup-info-item">
                <strong>투표 시작일</strong>
                <span>${formatDate(post.startAt)}</span>
              </div>
              <div class="worldcup-info-item">
                <strong>투표 종료일</strong>
                <span>${formatDate(post.endAt)}</span>
              </div>
              <div class="worldcup-info-item">
                <strong>상태</strong>
                <span>${status.label}</span>
              </div>
            </div>
            <p class="worldcup-result">${escapeHtml(post.resultSummary || '').replace(/\n/g, '<br>')}</p>
            <div class="worldcup-grid">
              ${post.candidates.map((candidate, index) => `
                <button
                  type="button"
                  class="candidate-card"
                  onclick="voteWorldcup('${post.id}', '${candidate.id}')"
                  ${status.clickable ? '' : 'disabled'}
                  aria-label="${escapeHtml(candidate.name)} 투표"
                >
                  <div class="candidate-media">
                    <span class="vote-badge">투표수 ${Number(candidate.votes || 0)}</span>
                    ${candidate.image
                      ? `<img src="${candidate.image}" alt="${escapeHtml(candidate.name)} 사진">`
                      : `<div class="candidate-placeholder">후보 ${index + 1}</div>`}
                  </div>
                  <div class="candidate-body">
                    <span class="candidate-name">${escapeHtml(candidate.name)}</span>
                    <div class="candidate-caption">${status.clickable ? '사진 클릭 시 즉시 1표 증가' : '현재 클릭이 비활성화된 후보입니다.'}</div>
                  </div>
                </button>
              `).join('')}
            </div>
          </article>
        `;
      }).join('');
    }

    function openWorldcupModal() {
      worldcupModalBackdrop.classList.add('show');
    }

    function closeWorldcupModal() {
      worldcupModalBackdrop.classList.remove('show');
      worldcupForm.reset();
    }

    async function fileToDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('이미지 변환 실패'));
        reader.readAsDataURL(file);
      });
    }

    function resetWorldcupFormDefaults() {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
      worldcupCreatedAtInput.value = toLocalDateTimeValue(now);
      worldcupStartInput.value = toLocalDateTimeValue(now);
      worldcupEndInput.value = toLocalDateTimeValue(nextWeek);
    }

    function getSupabaseStorageKeys() {
      const projectRef = new URL(CONFIG.supabaseUrl).hostname.split('.')[0];
      const keys = new Set([
        `sb-${projectRef}-auth-token`,
        `sb-${projectRef}-auth-token-code-verifier`
      ]);

      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`sb-${projectRef}-`)) keys.add(key);
      }

      for (let i = 0; i < sessionStorage.length; i += 1) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(`sb-${projectRef}-`)) keys.add(key);
      }

      return [...keys];
    }

    function clearSupabaseAuthStorage() {
      getSupabaseStorageKeys().forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }

    function forceBrowserRefresh() {
      window.location.reload();
    }

    async function loadAuthState() {
      const { data } = await supabase.auth.getSession();
      currentUser = data.session?.user ?? null;
      await refreshBannedList();
      if (!currentUser) {
        setStatus('로그인 전입니다. Google 로그인을 눌러주세요.');
        updateWorldcupAdminUI();
        return;
      }
      const email = currentUser.email || currentUser.id;
      const adminTag = isAdminEmail(currentUser.email) ? ' / 관리자' : '';
      const bannedTag = isCurrentUserBanned() ? ' / 차단됨' : '';
      setStatus(`로그인됨: ${email}${adminTag}${bannedTag}`);
      updateWorldcupAdminUI();
    }

    async function loginWithGoogle() {
      const redirectTo = window.location.href.split('#')[0];
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo }});
      if (error) alert(error.message);
    }

    async function logout() {
      logoutBtn.disabled = true;
      refreshBtn.disabled = true;
      setStatus('로그아웃 처리 중...');

      try {
        const { error } = await supabase.auth.signOut();
        if (error) console.error(error);
      } catch (error) {
        console.error(error);
      }

      clearSupabaseAuthStorage();
      currentUser = null;

      try {
        await loadAuthState();
      } catch (error) {
        console.error('logout auth refresh failed', error);
      }

      try {
        await loadPosts();
      } catch (error) {
        console.error('logout post refresh failed', error);
      }

      try {
        renderWorldcupPosts();
        updateWorldcupAdminUI();
      } catch (error) {
        console.error('logout worldcup refresh failed', error);
      }

      logoutBtn.disabled = false;
      refreshBtn.disabled = false;
    }

    async function canWriteWithoutLogin() {
      await refreshBannedList();
      if (currentUser && isCurrentUserBanned()) {
        alert('차단된 계정은 글쓰기/댓글 작성이 불가합니다.');
        return false;
      }
      return true;
    }

    async function loadPosts() {
      boardMeta.textContent = `현재 카테고리: ${boardLabel(currentBoard)}`;
      boardButtons.forEach(btn => btn.classList.toggle('on', btn.dataset.board === currentBoard));
      await refreshBannedList();

      const { data, error } = await supabase
        .from('posts')
        .select('id,user_id,board_type,is_urgent,is_pinned,author_name,title,region,play_time,level,fee,content,created_at,comments(id,user_id,author_name,content,created_at)')
        .eq('board_type', currentBoard)
        .order('is_pinned', { ascending: false })
        .order('is_urgent', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        postList.innerHTML = `<div class="board-empty">불러오기 오류: ${escapeHtml(error.message)}</div>`;
        return;
      }

      cachedPosts = data || [];
      if (!cachedPosts.length) {
        postList.innerHTML = '<div class="board-empty">등록된 글이 없습니다. 글쓰기를 눌러 첫 글을 등록해보세요.</div>';
        return;
      }

      const admin = isAdminEmail(currentUser?.email);

      postList.innerHTML = cachedPosts.map(post => {
        const comments = Array.isArray(post.comments) ? post.comments.sort((a,b) => new Date(a.created_at)-new Date(b.created_at)) : [];
        return `
          <article class="post-item ${post.is_urgent ? 'urgent' : ''}">
            <h4>
              ${post.is_pinned ? '<span class="urgent-label" style="background:#1d4ed8;">상단고정</span>' : ''}
              ${post.is_urgent ? '<span class="urgent-label">긴급</span>' : ''}
              <span>${escapeHtml(post.title)}</span>
            </h4>
            <div class="sub">
              작성자: ${escapeHtml(post.author_name)} · ${boardLabel(post.board_type)} · ${escapeHtml(post.region || '-')} · ${escapeHtml(post.play_time || '-')} · ${escapeHtml(post.level || '-')} · ${escapeHtml(post.fee || '-')}<br>
              작성일: ${formatDate(post.created_at)}
            </div>
            <p>${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>
            <div class="post-actions">
              <button class="tiny-btn primary" onclick="openEdit('${post.id}')">수정</button>
              <button class="tiny-btn red" onclick="deletePostByPassword('${post.id}')">삭제</button>
              ${admin ? `<button class="tiny-btn" onclick="togglePin('${post.id}', ${post.is_pinned ? 'false':'true'})">${post.is_pinned ? '상단고정 해제' : '상단고정'}</button>` : ''}
              ${admin ? `<button class="tiny-btn red" onclick="adminDeletePost('${post.id}')">관리자삭제</button>` : ''}
              ${admin ? `<button class="tiny-btn red" onclick="banPostWriter('${post.user_id || ''}', '${escapeHtml(post.author_name)}')">작성자 차단</button>` : ''}
            </div>
            <div class="post-comments">
              <strong>댓글</strong>
              ${comments.length ? comments.map(c => `
                <div class="comment">
                  ${escapeHtml(c.author_name || '사용자')} : ${escapeHtml(c.content)}
                  <div style="font-size:12px;color:#6b7280;margin-top:4px;">${formatDate(c.created_at)}</div>
                  ${admin ? `<div style="margin-top:6px;"><button class="tiny-btn red" onclick="adminDeleteComment('${c.id}')">댓글삭제</button></div>` : ''}
                </div>
              `).join('') : '<div class="comment" style="background:#fff;">아직 댓글이 없습니다.</div>'}
              <div class="comment-form">
                <input type="text" id="comment-${post.id}" placeholder="댓글 입력" maxlength="120">
                <button class="tiny-btn primary" onclick="addComment('${post.id}')">등록</button>
              </div>
            </div>
          </article>`;
      }).join('');
    }

    function openModal() {
      updateUrgentBox();
      modalBackdrop.classList.add('show');
    }
    function closeModal() {
      modalBackdrop.classList.remove('show');
      editingId = null;
      modalTitle.textContent = '글쓰기';
      postForm.reset();
      urgentInput.value = 'false';
      updateUrgentBox();
    }

    writeBtn.addEventListener('click', async () => {
      if (!(await canWriteWithoutLogin())) return;
      editingId = null;
      modalTitle.textContent = `${boardLabel(currentBoard)} 글쓰기`;
      postForm.reset();
      urgentInput.value = 'false';
      openModal();
    });

    cancelBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

    boardButtons.forEach(btn => btn.addEventListener('click', async () => { currentBoard = btn.dataset.board; await loadPosts(); }));

    async function verifyPassword(postId, password) {
      const { data, error } = await supabase.from('post_passwords').select('password').eq('post_id', postId).maybeSingle();
      if (error) return false;
      return !!data && String(data.password) === String(password);
    }

    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!(await canWriteWithoutLogin())) return;

      const password = (postPasswordInput.value || '').trim();
      if (!/^\d{4}$/.test(password)) {
        alert('작성 비밀번호는 숫자 4자리로 입력해주세요.');
        return;
      }

      const payload = {
        board_type: currentBoard,
        is_urgent: currentBoard === 'mercenary' ? urgentInput.value === 'true' : false,
        author_name: authorInput.value.trim(),
        title: titleInput.value.trim(),
        region: regionInput.value.trim() || null,
        play_time: timeInput.value.trim() || null,
        level: levelInput.value.trim() || null,
        fee: feeInput.value.trim() || null,
        content: contentInput.value.trim(),
        user_id: currentUser?.id || null
      };

      if (!payload.author_name || !payload.title || !payload.content) {
        alert('작성자, 제목, 내용은 필수입니다.');
        return;
      }

      let error, savedId = editingId;
      if (editingId) {
        const ok = await verifyPassword(editingId, password);
        if (!ok) return alert('비밀번호가 일치하지 않습니다.');
        ({ error } = await supabase.from('posts').update(payload).eq('id', editingId));
      } else {
        const res = await supabase.from('posts').insert(payload).select('id').single();
        error = res.error;
        savedId = res.data?.id;
        if (!error && savedId) {
          await supabase.from('post_passwords').upsert({ post_id: savedId, password }, { onConflict: 'post_id' });
        }
      }

      if (error) return alert(error.message);
      if (editingId) {
        await supabase.from('post_passwords').upsert({ post_id: editingId, password }, { onConflict: 'post_id' });
      }
      closeModal();
      await loadPosts();
      alert('저장되었습니다.');
    });

    window.openEdit = async function(id) {
      const post = cachedPosts.find(p => p.id === id);
      if (!post) return;
      const pw = prompt('수정하려면 작성 비밀번호 4자리를 입력하세요.');
      if (!pw) return;
      const ok = await verifyPassword(id, pw.trim());
      if (!ok) return alert('비밀번호가 일치하지 않습니다.');

      editingId = id;
      currentBoard = post.board_type;
      modalTitle.textContent = '글 수정';
      authorInput.value = post.author_name || '';
      titleInput.value = post.title || '';
      regionInput.value = post.region || '';
      timeInput.value = post.play_time || '';
      levelInput.value = post.level || '';
      feeInput.value = post.fee || '';
      contentInput.value = post.content || '';
      urgentInput.value = post.is_urgent ? 'true' : 'false';
      postPasswordInput.value = pw.trim();
      openModal();
    }

    window.deletePostByPassword = async function(id) {
      const pw = prompt('삭제하려면 작성 비밀번호 4자리를 입력하세요.');
      if (!pw) return;
      const ok = await verifyPassword(id, pw.trim());
      if (!ok) return alert('비밀번호가 일치하지 않습니다.');
      if (!confirm('이 글을 삭제할까요?')) return;

      let { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) return alert(error.message);
      await supabase.from('post_passwords').delete().eq('post_id', id);
      await loadPosts();
    }

    window.adminDeletePost = async function(id) {
      if (!isAdminEmail(currentUser?.email)) return alert('관리자만 가능합니다.');
      if (!confirm('관리자 권한으로 이 글을 삭제할까요?')) return;
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) return alert(error.message);
      await supabase.from('post_passwords').delete().eq('post_id', id);
      await loadPosts();
    }

    window.togglePin = async function(id, nextValue) {
      if (!isAdminEmail(currentUser?.email)) return alert('관리자만 가능합니다.');
      const { error } = await supabase.from('posts').update({ is_pinned: nextValue === true || nextValue === 'true' }).eq('id', id);
      if (error) return alert(error.message);
      await loadPosts();
    }

    window.adminDeleteComment = async function(id) {
      if (!isAdminEmail(currentUser?.email)) return alert('관리자만 가능합니다.');
      if (!confirm('댓글을 삭제할까요?')) return;
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) return alert(error.message);
      await loadPosts();
    }

    window.banPostWriter = async function(userId, authorName) {
      if (!isAdminEmail(currentUser?.email)) return alert('관리자만 가능합니다.');
      const email = prompt(`차단할 이메일을 입력하세요.\n현재 글 작성자: ${authorName}\n(구글 로그인 이메일 기준)`);
      if (!email) return;
      const normalized = email.trim().toLowerCase();
      const { error } = await supabase.from('banned_users').upsert({ email: normalized, reason: `관리자 차단 - ${authorName}` }, { onConflict: 'email' });
      if (error) return alert(error.message);
      await refreshBannedList();
      alert('차단 처리되었습니다.');
    }

    window.addComment = async function(id) {
      await refreshBannedList();
      if (currentUser && isCurrentUserBanned()) return alert('차단된 계정은 댓글 작성이 불가합니다.');
      const input = document.getElementById(`comment-${id}`);
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      const payload = {
        post_id: id,
        user_id: currentUser?.id || null,
        author_name: currentUser?.user_metadata?.name || currentUser?.email || '비회원',
        content: text
      };

      const { error } = await supabase.from('comments').insert(payload);
      if (error) return alert(error.message);
      input.value = '';
      await loadPosts();
    }

    if (worldcupWriteBtn && worldcupForm && worldcupCancelBtn && worldcupModalBackdrop) {
      worldcupWriteBtn.addEventListener('click', () => {
        if (!isAdminEmail(currentUser?.email)) {
          alert('원픽월드컵 등록은 관리자만 가능합니다.');
          return;
        }
        worldcupForm.reset();
        resetWorldcupFormDefaults();
        openWorldcupModal();
      });

      worldcupCancelBtn.addEventListener('click', closeWorldcupModal);
      worldcupModalBackdrop.addEventListener('click', (e) => {
        if (e.target === worldcupModalBackdrop) closeWorldcupModal();
      });

      worldcupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAdminEmail(currentUser?.email)) {
          alert('원픽월드컵 등록은 관리자만 가능합니다.');
          return;
        }

        const createdAt = fromDateTimeLocal(worldcupCreatedAtInput.value);
        const startAt = fromDateTimeLocal(worldcupStartInput.value);
        const endAt = fromDateTimeLocal(worldcupEndInput.value);
        if (!createdAt || !startAt || !endAt) {
          alert('작성일, 시작일, 종료일을 모두 입력해 주세요.');
          return;
        }
        if (new Date(startAt) > new Date(endAt)) {
          alert('투표 시작일은 종료일보다 늦을 수 없습니다.');
          return;
        }

        const candidates = await Promise.all(worldcupCandidateNameInputs.map(async (input, index) => {
          const imageFile = worldcupCandidateImageInputs[index]?.files?.[0];
          const voteValue = Number(worldcupCandidateVoteInputs[index]?.value || 0);
          return {
            name: input.value.trim(),
            image: imageFile ? await fileToDataUrl(imageFile) : '',
            votes: Number.isFinite(voteValue) && voteValue >= 0 ? Math.floor(voteValue) : 0
          };
        }));

        if (!worldcupTitleInput.value.trim() || !worldcupDescriptionInput.value.trim() || !worldcupResultInput.value.trim()) {
          alert('제목, 설명, 결과 요약 텍스트를 모두 입력해 주세요.');
          return;
        }

        if (candidates.length !== 4 || candidates.some(candidate => !candidate.name)) {
          alert('후보 4개의 이름을 모두 입력해 주세요.');
          return;
        }

        worldcupPosts.push(createDefaultWorldcupPost({
          title: worldcupTitleInput.value.trim(),
          description: worldcupDescriptionInput.value.trim(),
          createdAt,
          startAt,
          endAt,
          resultSummary: worldcupResultInput.value.trim(),
          candidates
        }));
        saveWorldcupPosts();
        renderWorldcupPosts();
        closeWorldcupModal();
      });
    }

    window.voteWorldcup = function(postId, candidateId) {
      const post = worldcupPosts.find(item => item.id === postId);
      if (!post) return;
      const status = getWorldcupStatus(post);
      if (!status.clickable) return;
      const candidate = post.candidates.find(item => item.id === candidateId);
      if (!candidate) return;
      candidate.votes = Number(candidate.votes || 0) + 1;
      saveWorldcupPosts();
      renderWorldcupPosts();
    }

    window.handleLoginClick = loginWithGoogle;
    window.handleLogoutClick = logout;
    window.handleRefreshClick = forceBrowserRefresh;

    loginBtn.addEventListener('click', loginWithGoogle);
    logoutBtn.addEventListener('click', logout);
    refreshBtn.addEventListener('click', () => {
      forceBrowserRefresh();
    });

    supabase.auth.onAuthStateChange(async () => {
      try {
        await loadAuthState();
      } catch (error) {
        console.error('auth state refresh failed', error);
      }

      try {
        await loadPosts();
      } catch (error) {
        console.error('post reload after auth failed', error);
      }

      try {
        renderWorldcupPosts();
        updateWorldcupAdminUI();
      } catch (error) {
        console.error('worldcup refresh after auth failed', error);
      }
    });

    async function initializeApp() {
      try {
        resetWorldcupFormDefaults();
        renderWorldcupPosts();
        updateWorldcupAdminUI();
      } catch (error) {
        console.error('worldcup init failed', error);
      }

      try {
        await loadAuthState();
      } catch (error) {
        console.error('loadAuthState failed', error);
        setStatus('로그인 상태를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.');
      }

      try {
        await loadPosts();
      } catch (error) {
        console.error('loadPosts failed', error);
        postList.innerHTML = '<div class="board-empty">게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>';
      }
    }

    initializeApp();
