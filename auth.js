// ─── Shared auth widget + exam history (Firebase) ───────────────────────────
// Include this AFTER firebase-app-compat.js, firebase-auth-compat.js,
// firebase-firestore-compat.js, and firebase-config.js on every page.

(function () {
  const auth = firebase.auth();
  const db = firebase.firestore();

  // ── Styles for the widget + modal (scoped, dark-theme to match the quizzes) ──
  const style = document.createElement('style');
  style.textContent = `
    #auth-widget {
      position: fixed; top: 16px; right: 16px; z-index: 9999;
      font-family: 'DM Sans', sans-serif;
    }
    #auth-widget button {
      background: #1c2333; color: #e8edf5; border: 1px solid #2a3347;
      border-radius: 50px; padding: 8px 16px; font-size: 0.8rem; cursor: pointer;
      font-family: 'DM Mono', monospace;
    }
    #auth-widget button:hover { border-color: #5b8dee; }
    #auth-widget .auth-pill {
      display: flex; align-items: center; gap: 10px;
      background: #1c2333; border: 1px solid #2a3347; border-radius: 50px;
      padding: 6px 8px 6px 16px; font-size: 0.8rem; color: #e8edf5;
    }
    #auth-widget .auth-email { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #6b7a99; }
    #auth-widget a { color: #3ecf8e; text-decoration: none; font-size: 0.78rem; font-family: 'DM Mono', monospace; }
    #auth-modal-backdrop {
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      z-index: 10000; align-items: center; justify-content: center;
    }
    #auth-modal-backdrop.show { display: flex; }
    #auth-modal {
      background: #161b27; border: 1px solid #2a3347; border-radius: 12px;
      padding: 32px; width: 320px; font-family: 'DM Sans', sans-serif; color: #e8edf5;
    }
    #auth-modal h3 { font-family: 'DM Serif Display', serif; margin-bottom: 16px; font-size: 1.3rem; }
    #auth-modal input {
      width: 100%; padding: 10px 12px; margin-bottom: 10px; border-radius: 8px;
      border: 1px solid #2a3347; background: #1c2333; color: #e8edf5; font-size: 0.9rem;
    }
    #auth-modal .auth-error { color: #e05252; font-size: 0.78rem; margin-bottom: 10px; min-height: 1em; }
    #auth-modal .auth-row { display: flex; gap: 8px; margin-top: 6px; }
    #auth-modal .auth-row button {
      flex: 1; background: #3ecf8e; color: #0e1117; border: none;
      border-radius: 8px; padding: 10px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
    }
    #auth-modal .auth-row button.secondary { background: transparent; color: #6b7a99; border: 1px solid #2a3347; font-weight: 400; }
    #auth-modal .auth-close { position: absolute; top: 16px; right: 20px; cursor: pointer; color: #6b7a99; background:none; border:none; font-size:1.2rem; }
    #auth-modal { position: relative; }
  `;
  document.head.appendChild(style);

  // ── Widget DOM ──
  const widget = document.createElement('div');
  widget.id = 'auth-widget';
  document.body.appendChild(widget);

  const backdrop = document.createElement('div');
  backdrop.id = 'auth-modal-backdrop';
  backdrop.innerHTML = `
    <div id="auth-modal">
      <button class="auth-close" id="auth-close-btn">✕</button>
      <h3 id="auth-modal-title">Sign In</h3>
      <input type="email" id="auth-email" placeholder="Email" autocomplete="email">
      <input type="password" id="auth-password" placeholder="Password" autocomplete="current-password">
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-row">
        <button id="auth-submit-btn">Sign In</button>
      </div>
      <div class="auth-row">
        <button class="secondary" id="auth-toggle-mode">Need an account? Sign up</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  let mode = 'signin'; // or 'signup'

  function openModal(startMode) {
    mode = startMode || 'signin';
    updateModalMode();
    document.getElementById('auth-error').textContent = '';
    document.getElementById('auth-email').value = '';
    document.getElementById('auth-password').value = '';
    backdrop.classList.add('show');
  }
  function closeModal() { backdrop.classList.remove('show'); }

  function updateModalMode() {
    document.getElementById('auth-modal-title').textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
    document.getElementById('auth-submit-btn').textContent = mode === 'signin' ? 'Sign In' : 'Sign Up';
    document.getElementById('auth-toggle-mode').textContent = mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in';
  }

  document.getElementById('auth-close-btn').onclick = closeModal;
  document.getElementById('auth-toggle-mode').onclick = () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    updateModalMode();
  };
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

  document.getElementById('auth-submit-btn').onclick = async () => {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errEl = document.getElementById('auth-error');
    errEl.textContent = '';
    if (!email || !password) { errEl.textContent = 'Enter an email and password.'; return; }
    try {
      if (mode === 'signin') {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await auth.createUserWithEmailAndPassword(email, password);
      }
      closeModal();
    } catch (e) {
      errEl.textContent = e.message.replace('Firebase: ', '');
    }
  };

  function renderWidget(user) {
    if (user) {
      widget.innerHTML = `
        <div class="auth-pill">
          <a href="history.html">📊 History</a>
          <span class="auth-email">${user.email}</span>
          <button id="auth-signout-btn">Sign Out</button>
        </div>
      `;
      document.getElementById('auth-signout-btn').onclick = () => auth.signOut();
    } else {
      widget.innerHTML = `<button id="auth-signin-btn">🔑 Sign In</button>`;
      document.getElementById('auth-signin-btn').onclick = () => openModal('signin');
    }
  }

  auth.onAuthStateChanged((user) => {
    renderWidget(user);
    window.currentUser = user || null;
    window.dispatchEvent(new CustomEvent('auth-ready', { detail: { user } }));
  });

  // ── Save a completed exam attempt (call from a quiz's showResults) ──
  window.saveExamAttempt = async function (examName, bankKey, correct, total, mode) {
    const user = auth.currentUser;
    if (!user) return; // not signed in — silently skip, quiz still works normally
    try {
      await db.collection('attempts').add({
        uid: user.uid,
        examName: examName,
        bankKey: bankKey || null,
        correct: correct,
        total: total,
        pct: total > 0 ? Math.round((correct / total) * 100) : 0,
        mode: mode || 'tutored',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (e) {
      console.error('Could not save exam attempt:', e);
    }
  };

  // ── Read the current user's history (used on history.html) ──
  window.getMyHistory = async function () {
    const user = auth.currentUser;
    if (!user) return [];
    const snap = await db.collection('attempts')
      .where('uid', '==', user.uid)
      .orderBy('timestamp', 'desc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };
})();
