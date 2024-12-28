document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("gif-modal");
  const modalImage = document.getElementById("modal-image");
  const closeModal = document.getElementById("close-modal");

  document.querySelectorAll(".project-buttons a[target='_blank']").forEach(button => {
    if (button.href.endsWith(".gif")) {
      button.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        modal.style.display = "flex";
        modalImage.src = this.href; // Set modal image source
      });
    }
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  });