(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero pitch streams in token by token, like an LLM response.
  var stream = document.querySelector("[data-stream]");
  if (stream && !reduceMotion) {
    var text = stream.textContent.trim();
    // Split into word-ish tokens, keeping trailing spaces/punctuation attached.
    var tokens = text.match(/\S+\s*/g) || [];
    stream.textContent = "";
    var spans = tokens.map(function (t) {
      var s = document.createElement("span");
      s.className = "tok";
      s.textContent = t;
      stream.appendChild(s);
      return s;
    });
    var i = 0;
    (function next() {
      if (i >= spans.length) return;
      spans[i++].classList.add("on");
      // Slight jitter so it reads as generated, not typed.
      setTimeout(next, 35 + Math.random() * 55);
    })();
  }

  // Mobile menu.
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a") && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // Highlight the nav link of the section in view.
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.removeAttribute("aria-current");
          });
          var link = byId[entry.target.id];
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
