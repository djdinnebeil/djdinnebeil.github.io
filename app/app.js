(function () {
  function setupTemplateEffects() {
    const header = document.getElementById("header");
    const banner = document.getElementById("banner");

    window.addEventListener("load", function () {
      setTimeout(function () {
        document.body.classList.remove("is-preload");
      }, 100);
    });

    if (!header || !banner || !header.classList.contains("alt")) {
      return;
    }

    let ticking = false;

    function updateHeaderState() {
      const bannerBottom = banner.getBoundingClientRect().bottom;
      const headerHeight = header.offsetHeight;

      header.classList.toggle("alt", bannerBottom > headerHeight);
      ticking = false;
    }

    function requestHeaderUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(updateHeaderState);
    }

    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
    window.addEventListener("resize", requestHeaderUpdate);
    requestHeaderUpdate();
  }

  function setupContactEmail() {
    const emailPlaceholder = document.getElementById("email-link");

    if (!emailPlaceholder) {
      return;
    }

    const user = "dj";
    const domain = "djdinn.dev";
    const email = `${user}@${domain}`;

    setTimeout(function () {
      emailPlaceholder.classList.add("email-fading");

      setTimeout(function () {
        const emailLink = document.createElement("a");

        emailLink.href = `mailto:${email}`;
        emailLink.textContent = email;
        emailLink.className = "email-reveal email-fading";
        emailLink.setAttribute("data-track-click", "contact:email");
        emailLink.setAttribute("aria-label", `Email ${email}`);

        emailPlaceholder.replaceWith(emailLink);

        requestAnimationFrame(function () {
          emailLink.classList.remove("email-fading");
        });
      }, 200);
    }, 1500);
  }

  function sendPageVisitTrackingEvent() {
    const payload = new URLSearchParams();

    payload.set("event", "github-portfolio-page-visit");
    payload.set("target", window.location.href);
    payload.set("path", window.location.pathname);
    payload.set("title", document.title);
    payload.set("referrer", document.referrer);

    const trackingUrl = "https://djdinn.dev/track/";

    const sentWithBeacon =
      navigator.sendBeacon &&
      navigator.sendBeacon(trackingUrl, payload);

    if (sentWithBeacon) {
      return;
    }

    fetch(trackingUrl, {
      method: "POST",
      body: payload,
      keepalive: true,
      mode: "no-cors"
    }).catch(function () {});
  }

  function setupBackToTop() {
    const backToTop = document.getElementById("back-to-top");

    if (!backToTop) {
      return;
    }

    backToTop.addEventListener("click", function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

      history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  }

  function setupProjectsNavOffset() {
    const projectLink = document.querySelector('a[href="#projects"]');

    if (!projectLink) {
      return;
    }

    projectLink.addEventListener("click", function (event) {
      if (window.matchMedia("(max-width: 735px)").matches) {
        return; // use normal anchor behavior on mobile
      }

      event.preventDefault();

      const target = document.querySelector("#projects");

      if (!target) {
        return;
      }

      const y = target.getBoundingClientRect().top + window.pageYOffset - 21;

      window.scrollTo({
        top: y,
        behavior: "auto"
      });

      history.pushState(null, "", "#projects");
    });
  }

  function setupProjectCarousels() {
    document.querySelectorAll(".project-carousel-shell").forEach(function (shell) {
      const carousel = shell.querySelector(".project-carousel");
      const previousButton = shell.querySelector(".project-carousel-control-prev");
      const nextButton = shell.querySelector(".project-carousel-control-next");
      const items = Array.from(carousel ? carousel.children : []);

      if (!carousel || !previousButton || !nextButton || items.length === 0) {
        return;
      }

      let activeIndex = 0;

      function getWrappedIndex(index) {
        return (index + items.length) % items.length;
      }

      function setItemInteractivity(item, isActive) {
        item.setAttribute("aria-hidden", isActive ? "false" : "true");

        item.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach(function (element) {
          if (isActive) {
            if (element.dataset.carouselTabindex === "auto") {
              element.removeAttribute("tabindex");
              delete element.dataset.carouselTabindex;
            } else if (element.dataset.carouselTabindex) {
              element.setAttribute("tabindex", element.dataset.carouselTabindex);
              delete element.dataset.carouselTabindex;
            }

            return;
          }

          if (!element.dataset.carouselTabindex) {
            element.dataset.carouselTabindex = element.hasAttribute("tabindex")
              ? element.getAttribute("tabindex")
              : "auto";
          }

          element.setAttribute("tabindex", "-1");
        });
      }

      function updateCarousel(nextIndex) {
        activeIndex = getWrappedIndex(nextIndex);

        const previousIndex = getWrappedIndex(activeIndex - 1);
        const nextItemIndex = getWrappedIndex(activeIndex + 1);

        items.forEach(function (item, index) {
          const isActive = index === activeIndex;
          const isPrevious = items.length > 1 && index === previousIndex;
          const isNext = items.length > 1 && index === nextItemIndex;

          item.classList.toggle("project-carousel-item-active", isActive);
          item.classList.toggle("project-carousel-item-previous", isPrevious);
          item.classList.toggle("project-carousel-item-next", isNext);
          item.classList.toggle("project-carousel-item-adjacent", isPrevious || isNext);
          setItemInteractivity(item, isActive);
        });

        previousButton.disabled = items.length < 2;
        nextButton.disabled = items.length < 2;
      }

      previousButton.addEventListener("click", function () {
        updateCarousel(activeIndex - 1);
      });

      nextButton.addEventListener("click", function () {
        updateCarousel(activeIndex + 1);
      });

      carousel.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          updateCarousel(activeIndex - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          updateCarousel(activeIndex + 1);
        }
      });

      updateCarousel(activeIndex);
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    setupTemplateEffects();
    setupContactEmail();
    sendPageVisitTrackingEvent();
    setupBackToTop();
    setupProjectsNavOffset();
    setupProjectCarousels();
  });
})();
