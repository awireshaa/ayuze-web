
/* AYUZE STUDIO — shared site behaviour */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* Highlight current nav link based on file name */
  (function markCurrentPage() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  })();

  /* Portfolio filter (portfolio.html) */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var workCards = document.querySelectorAll("[data-category]");
  if (filterButtons.length && workCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var cat = btn.getAttribute("data-filter");
        workCards.forEach(function (card) {
          var show = cat === "all" || card.getAttribute("data-category") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* Quote / contact form -> pre-filled WhatsApp message (no backend required) */
  var quoteForm = document.querySelector("#quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(quoteForm);
      var name = (data.get("name") || "").toString().trim();
      var service = (data.get("service") || "").toString().trim();
      var date = (data.get("date") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();

      var lines = [
        "Hi AYUZE Studio, I'd like to request a quote.",
        name ? "Name: " + name : null,
        service ? "Service: " + service : null,
        date ? "Event date: " + date : null,
        phone ? "Phone/email: " + phone : null,
        message ? "Details: " + message : null
      ].filter(Boolean);

      var plainText = lines.join("\n");
      var encodedText = encodeURIComponent(plainText);

      /* NOTE TO OWNER: replace this number/address if your contact details change */
      var waNumber = "2348112050470";
      var waUrl = "https://wa.me/" + waNumber + "?text=" + encodedText;

      var emailAddress = "Ayuzestudio1@gmail.com";
      var emailSubject = encodeURIComponent("Quote Request" + (name ? " — " + name : ""));
      var emailBody = encodeURIComponent(plainText);
      var emailUrl = "mailto:" + emailAddress + "?subject=" + emailSubject + "&body=" + emailBody;

      var whatsappLink = document.querySelector("#confirm-whatsapp");
      var emailLink = document.querySelector("#confirm-email");
      if (whatsappLink) whatsappLink.setAttribute("href", waUrl);
      if (emailLink) emailLink.setAttribute("href", emailUrl);

      quoteForm.hidden = true;

      var confirmation = document.querySelector("#quote-confirmation");
      if (confirmation) {
        confirmation.hidden = false;
        confirmation.focus();
        confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Waveform dividers: draw once, respect reduced motion (static bars, no animation) */
  document.querySelectorAll(".waveform").forEach(function (wf) {
    var bars = parseInt(wf.getAttribute("data-bars") || "40", 10);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < bars; i++) {
      var bar = document.createElement("i");
      var h = 6 + Math.round(Math.abs(Math.sin(i * 0.5)) * 28);
      bar.style.height = h + "px";
      frag.appendChild(bar);
    }
    wf.appendChild(frag);
  });
})();


(function () {
  "use strict";
  var routes = document.querySelectorAll(".route");
  var navLinks = document.querySelectorAll(".nav-links a[data-route]");
  function parseHash() {
    var raw = (window.location.hash || "#home").replace(/^#/, "");
    var parts = raw.split(":");
    showRoute(parts[0] || "home", parts[1] || null);
  }
  function showRoute(route, anchor) {
    var found = false;
    routes.forEach(function (el) {
      var match = el.getAttribute("data-route") === route;
      el.style.display = match ? "" : "none";
      if (match) found = true;
    });
    if (!found) {
      routes.forEach(function (el) { el.style.display = el.getAttribute("data-route") === "home" ? "" : "none"; });
    }
    navLinks.forEach(function (a) {
      if (a.getAttribute("data-route") === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (anchor) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var el = document.getElementById(anchor);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    } else { window.scrollTo(0, 0); }
  }
  window.addEventListener("hashchange", parseHash);
  window.addEventListener("DOMContentLoaded", parseHash);
})();

