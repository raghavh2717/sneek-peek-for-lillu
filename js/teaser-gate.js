/* ==========================================================================
   TEASER-GATE.JS
   This is the standalone "sneak peek" experience — deploy it at its own
   URL, separate from the main birthday site. Counts down to an earlier
   date/time; once reached, reveals a couple of funny sneak-peek photos,
   then walks through a little "waiting room" of playful (deliberately
   annoying) mini-screens — a compliment generator, a guessing game, a
   runaway "dodge the button" game, a fake not-a-robot captcha, an
   are-you-sure confirmation spam, a fake ad with a rigged skip timer,
   and a fake patience meter — before one heartfelt moment and a button
   that sends her to the real site.

   >>> SET THE SNEAK-PEEK TIME HERE <<<
   const TEASER_REVEAL_AT = new Date('2026-08-31T14:57:00');

   >>> SET THE MAIN SITE'S LINK HERE <<<
   Once you've deployed the main project separately (see its own README),
   paste its live URL below. That's where the final button sends her.
   ========================================================================== */

(function () {
  const TEASER_REVEAL_AT = new Date('2026-09-14T00:16:00'); // <-- change this to whenever the sneak peek should unlock
  const MAIN_SITE_URL = 'https://your-main-site-link-here.netlify.app'; // <-- change this to the deployed main project's URL

  const gate = document.getElementById('teaserGate');
  const countdownView = document.getElementById('teaserCountdownView');
  const revealView = document.getElementById('teaserRevealView');
  const complimentView = document.getElementById('teaserComplimentView');
  const guessView = document.getElementById('teaserGuessView');
  const dodgeView = document.getElementById('teaserDodgeView');
  const captchaView = document.getElementById('teaserCaptchaView');
  const confirmView = document.getElementById('teaserConfirmView');
  const adView = document.getElementById('teaserAdView');
  const patienceView = document.getElementById('teaserPatienceView');
  const heartfeltView = document.getElementById('teaserHeartfeltView');
  const timeLabel = document.getElementById('teaserTimeLabel');

  const nextBtn = document.getElementById('teaserNextBtn');
  const complimentBtn = document.getElementById('teaserComplimentBtn');
  const complimentText = document.getElementById('teaserComplimentText');
  const complimentNextBtn = document.getElementById('teaserComplimentNextBtn');
  const guessOptions = document.getElementById('teaserGuessOptions');
  const guessAnswer = document.getElementById('teaserGuessAnswer');
  const guessNextBtn = document.getElementById('teaserGuessNextBtn');

  const dodgeArena = document.getElementById('teaserDodgeArena');
  const dodgeBtn = document.getElementById('teaserDodgeBtn');
  const dodgeMsg = document.getElementById('teaserDodgeMsg');
  const dodgeCount = document.getElementById('teaserDodgeCount');

  const captchaCheckbox = document.getElementById('teaserCaptchaCheckbox');
  const captchaStatus = document.getElementById('teaserCaptchaStatus');
  const captchaNextBtn = document.getElementById('teaserCaptchaNextBtn');

  const confirmPromptEl = document.getElementById('teaserConfirmPrompt');
  const confirmYesBtn = document.getElementById('teaserConfirmYesBtn');
  const confirmNoBtn = document.getElementById('teaserConfirmNoBtn');

  const adSkipBtn = document.getElementById('teaserAdSkipBtn');
  const adCountdownEl = document.getElementById('teaserAdCountdown');

  const patienceStatus = document.getElementById('teaserPatienceStatus');
  const patienceFill = document.getElementById('teaserPatienceFill');
  const patienceNextBtn = document.getElementById('teaserPatienceNextBtn');
  const heartfeltNextBtn = document.getElementById('teaserHeartfeltNextBtn');

  const dEl = document.getElementById('tcDays');
  const hEl = document.getElementById('tcHours');
  const mEl = document.getElementById('tcMinutes');
  const sEl = document.getElementById('tcSeconds');

  let tickInterval = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatTimeLabel(date) {
    try {
      return date.toLocaleString(undefined, { weekday: 'long', hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return date.toString();
    }
  }

  function switchView(fromView, toView) {
    if (fromView) fromView.classList.remove('show');
    if (toView) toView.classList.add('show');
  }

  /* ---------------- Step 1: countdown to the sneak peek ---------------- */

  function tick() {
    const diff = TEASER_REVEAL_AT.getTime() - Date.now();

    if (diff <= 0) {
      clearInterval(tickInterval);
      showReveal();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    dEl.textContent = pad(Math.floor(totalSeconds / 86400));
    hEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    mEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    sEl.textContent = pad(totalSeconds % 60);
  }

  function showReveal() {
    countdownView.classList.add('hide');
    revealView.classList.add('show');
  }

  /* ---------------- Step 2: compliment generator ---------------- */

  const compliments = [
    "You have the kind of smile that ruins other people's smiles for me.",
    "Somehow you make bad days feel survivable and good days feel unfair (in a good way).",
    "You're the reason my phone battery dies faster.",
    "You'd win an Olympic medal in 'being effortlessly likable.'",
    "Scientifically speaking, you're above average. Extremely above average.",
    "If overthinking about you burned calories, I'd be extremely fit.",
    "You make ordinary Tuesdays feel like they're worth something.",
    "I would 100% fight a goose for you. Maybe two geese.",
    "Your laugh should be studied by scientists. For science.",
    "You're proof that good things happen to bad joke-tellers (me).",
    "You're basically a human golden retriever, but classier.",
    "Even your typos are charming. That should not be possible.",
    "If confidence were a currency, you'd be sponsoring this entire website.",
    "You could win an argument with a mirror.",
    "Somewhere, a poet is jealous they didn't think of you first.",
    "You make 'low effort' outfits look like a runway show.",
    "I'd wait in worse lines than this one for you.",
  ];
  let lastComplimentIndex = -1;

  function showRandomCompliment() {
    let i = Math.floor(Math.random() * compliments.length);
    if (compliments.length > 1) {
      while (i === lastComplimentIndex) i = Math.floor(Math.random() * compliments.length);
    }
    lastComplimentIndex = i;
    complimentText.textContent = compliments[i];
  }

  /* ---------------- Step 3: guess the surprise ---------------- */

  const guessAnswers = [
    "Close, but no. Though I respect the ambition.",
    "Bold guess. Sadly, incorrect. Try lowering your expectations slightly. Or not.",
    "Honestly? Better than that. You'll see.",
    "Too late for apologies. You're already six screens deep.",
  ];

  /* ---------------- Step 4: dodge the button ---------------- */

  const dodgeTaunts = [
    "Nope! Try again.",
    "So close. Almost. Not quite.",
    "You'll have to be quicker than that.",
    "This button has trust issues.",
    "Getting warmer. Not really.",
  ];
  const DODGE_MAX = 5;
  let dodgeEscapes = 0;

  function moveDodgeBtn() {
    if (!dodgeArena || !dodgeBtn) return;
    dodgeBtn.style.transform = 'none';
    const cw = dodgeArena.clientWidth;
    const ch = dodgeArena.clientHeight;
    const bw = dodgeBtn.offsetWidth || 140;
    const bh = dodgeBtn.offsetHeight || 44;
    const maxX = Math.max(cw - bw, 0);
    const maxY = Math.max(ch - bh, 0);
    dodgeBtn.style.left = Math.random() * maxX + 'px';
    dodgeBtn.style.top = Math.random() * maxY + 'px';
  }

  function handleDodgeAttempt(e) {
    if (dodgeEscapes < DODGE_MAX) {
      e.preventDefault();
      dodgeEscapes++;
      moveDodgeBtn();
      if (dodgeMsg) dodgeMsg.textContent = dodgeTaunts[Math.min(dodgeEscapes - 1, dodgeTaunts.length - 1)];
      if (dodgeCount) dodgeCount.textContent = String(Math.max(DODGE_MAX - dodgeEscapes, 0));
      if (dodgeEscapes >= DODGE_MAX && dodgeBtn) {
        dodgeBtn.textContent = 'Okay fine, click me';
        if (dodgeMsg) dodgeMsg.textContent = "Alright, alright. You win. Go ahead.";
      }
      return;
    }
    switchView(dodgeView, captchaView);
  }

  /* ---------------- Step 5: fake "not a robot" captcha ---------------- */

  const captchaMessages = [
    "Hmm. Suspiciously fast. Try again.",
    "System glitch. (Not really. Try once more.)",
    "Still verifying. This is very thorough.",
    "Verified! You are, in fact, real.",
  ];
  let captchaAttempts = 0;
  const CAPTCHA_MAX = 4;

  /* ---------------- Step 6: are-you-sure spam ---------------- */

  const confirmPrompts = [
    "Are you sure you're ready to keep going?",
    "Are you REALLY sure?",
    "Like, 100%, cross-your-heart sure?",
    "No take-backs after this one. Sure?",
  ];
  const confirmNoResponses = [
    "Take your time. No rush. (Kidding, hurry up.)",
    "Understandable. Deep breaths.",
    "Fair. This is a big decision. Huge, even.",
    "Okay. I'll just wait here. Forever, if I have to.",
  ];
  let confirmStep = 0;

  function updateConfirmPrompt() {
    if (confirmPromptEl) confirmPromptEl.textContent = confirmPrompts[Math.min(confirmStep, confirmPrompts.length - 1)];
  }

  /* ---------------- Step 7: fake ad with a rigged skip timer ---------------- */

  let adTimer = null;
  let adResetUsed = false;

  function startAdCountdown() {
    let count = 8;
    adResetUsed = false;
    if (adSkipBtn) adSkipBtn.disabled = true;
    if (adCountdownEl) adCountdownEl.textContent = String(count);
    clearInterval(adTimer);
    adTimer = setInterval(() => {
      count--;
      if (count <= 1 && !adResetUsed) {
        adResetUsed = true;
        count = 6; // the classic "ad extends itself" gag
      }
      if (count <= 0) {
        clearInterval(adTimer);
        if (adSkipBtn) {
          adSkipBtn.disabled = false;
          adSkipBtn.textContent = 'Skip Ad ✓';
        }
      } else if (adCountdownEl) {
        adCountdownEl.textContent = String(count);
      }
    }, 1000);
  }

  /* ---------------- Step 8: fake patience meter ---------------- */

  const patienceMessages = [
    'Teaching penguins to slow dance…',
    'Untangling heart strings…',
    'Convincing time to move faster… it declined.',
    'Polishing the surprise. Again.',
    'Double-checking that this is worth the wait. It is.',
    'Almost there. Probably. Definitely.',
    'Reticulating splines. (This is a joke. Or is it.)',
    'Asking the WiFi to believe in itself.',
  ];

  function runPatienceMeter() {
    let progress = 0;
    let msgIndex = 0;
    patienceStatus.textContent = patienceMessages[0];

    const interval = setInterval(() => {
      progress += 4 + Math.random() * 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        patienceStatus.textContent = "There. Wasn't that dramatic?";
        patienceNextBtn.classList.remove('hidden');
      } else {
        msgIndex = Math.min(msgIndex + 1, patienceMessages.length - 1);
        patienceStatus.textContent = patienceMessages[msgIndex];
      }
      patienceFill.style.width = progress + '%';
    }, 950);
  }

  /* ---------------- Wiring the sequence together ---------------- */

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      switchView(revealView, complimentView);
      showRandomCompliment();
    });
  }

  if (complimentBtn) complimentBtn.addEventListener('click', showRandomCompliment);
  if (complimentNextBtn) {
    complimentNextBtn.addEventListener('click', () => switchView(complimentView, guessView));
  }

  if (guessOptions) {
    guessOptions.querySelectorAll('.teaser-guess-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        guessOptions.querySelectorAll('.teaser-guess-btn').forEach((b) => b.classList.remove('picked'));
        btn.classList.add('picked');
        guessAnswer.textContent = guessAnswers[i] || guessAnswers[0];
        guessAnswer.classList.add('show');
        guessNextBtn.classList.remove('hidden');
      });
    });
  }
  if (guessNextBtn) {
    guessNextBtn.addEventListener('click', () => switchView(guessView, dodgeView));
  }

  if (dodgeBtn) {
    dodgeBtn.addEventListener('click', handleDodgeAttempt);
    dodgeBtn.addEventListener('mouseenter', () => {
      if (dodgeEscapes < DODGE_MAX - 1 && Math.random() < 0.7) moveDodgeBtn();
    });
  }

  if (captchaCheckbox) {
    captchaCheckbox.addEventListener('change', () => {
      if (!captchaCheckbox.checked) return;
      captchaAttempts++;
      if (captchaAttempts < CAPTCHA_MAX) {
        if (captchaStatus) captchaStatus.textContent = captchaMessages[captchaAttempts - 1];
        setTimeout(() => { captchaCheckbox.checked = false; }, 1300);
      } else {
        if (captchaStatus) captchaStatus.textContent = captchaMessages[CAPTCHA_MAX - 1];
        captchaCheckbox.disabled = true;
        if (captchaNextBtn) captchaNextBtn.classList.remove('hidden');
      }
    });
  }
  if (captchaNextBtn) {
    captchaNextBtn.addEventListener('click', () => switchView(captchaView, confirmView));
  }

  if (confirmYesBtn) {
    confirmYesBtn.addEventListener('click', () => {
      confirmStep++;
      if (confirmStep >= confirmPrompts.length) {
        switchView(confirmView, adView);
        startAdCountdown();
        return;
      }
      updateConfirmPrompt();
    });
  }
  if (confirmNoBtn) {
    confirmNoBtn.addEventListener('click', () => {
      if (confirmPromptEl) confirmPromptEl.textContent = confirmNoResponses[Math.floor(Math.random() * confirmNoResponses.length)];
      setTimeout(updateConfirmPrompt, 2200);
    });
  }

  if (adSkipBtn) {
    adSkipBtn.addEventListener('click', () => {
      if (adSkipBtn.disabled) return;
      switchView(adView, patienceView);
      runPatienceMeter();
    });
  }

  if (patienceNextBtn) patienceNextBtn.addEventListener('click', () => switchView(patienceView, heartfeltView));
  if (heartfeltNextBtn) heartfeltNextBtn.addEventListener('click', goToMainSite);

  function goToMainSite() {
    if (gate) gate.classList.add('hidden');
    window.location.href = MAIN_SITE_URL;
  }

  function start() {
    if (!gate) return;

    if (timeLabel) timeLabel.textContent = formatTimeLabel(TEASER_REVEAL_AT);
    if (window.Effects) window.Effects.attachRipples();

    if (Date.now() >= TEASER_REVEAL_AT.getTime()) {
      showReveal();
      return;
    }

    tick();
    tickInterval = setInterval(tick, 1000);
  }

  // loading.js dispatches this once its own progress bar finishes.
  document.addEventListener('preload:done', start);

  // Fallback in case that event is ever missed.
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (gate && !gate.classList.contains('hidden') && !tickInterval && !revealView.classList.contains('show')) start();
    }, 1800);
  });
})();
