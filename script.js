// ==============================
// CREATIVE ARTS TOKYO - site script
// ==============================

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('nav.links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // メニュー内のリンクをタップしたら自動で閉じる（スマホ用）
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- お問い合わせフォーム（Formspree / AJAX送信） ----
  document.querySelectorAll('.inquiry-form').forEach(function (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('.form-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        statusEl.textContent = 'フォームの設定が未完了です（管理者向け: Formspreeのフォームエンドポイントを設定してください）。';
        statusEl.classList.add('error');
        return;
      }

      statusEl.classList.remove('error');
      statusEl.textContent = '送信中…';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            statusEl.textContent = 'お問い合わせありがとうございます。送信が完了しました。';
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.errors) ? data.errors.map(function (er) { return er.message; }).join(', ') : '送信に失敗しました。');
            });
          }
        })
        .catch(function () {
          statusEl.textContent = '送信に失敗しました。お手数ですが、時間を置いて再度お試しください。';
          statusEl.classList.add('error');
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  });
});
