document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel-horizontal");
  if (!carousel) return;

  // Configurações (alteráveis conforme você quiser):
  const config = {
    scrollStep: 1,        // pixels por frame
    resumeDelay: 2000,    // ms até retomar o auto-scroll após o usuário soltar
    reverse: true         // true = vai & volta ; false = loop circular
  };

  let isUserActive = false;    // true = usuário está clicando/to­cando (pausa)
  let inactivityTimer;         // timer que retorna isUserActive = false
  let direction = 1;           // 1 = rolando para a direita ; -1 = rolando para a esquerda

  // Dispara quando o usuário pressiona (mouse ou touch) no carrossel
  function onUserStart() {
    isUserActive = true;
    clearTimeout(inactivityTimer);
  }

  // Dispara quando o usuário solta (mouse up, touchend ou mouseleave)
  function onUserEnd() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      isUserActive = false;
    }, config.resumeDelay);
  }

  // Loop de auto-scroll via requestAnimationFrame
  function autoScroll() {
    if (!isUserActive) {
      carousel.scrollLeft += config.scrollStep * direction;

      if (config.reverse) {
        // modo vai&volta: detecta borda esquerda ou direita
        const atEnd   = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth;
        const atStart = carousel.scrollLeft <= 0;
        if (atEnd || atStart) {
          direction *= -1;
        }
      } else {
        // modo “loop circular”: volta pro início ao chegar no fim
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
          carousel.scrollLeft = 0;
        }
      }
    }
    requestAnimationFrame(autoScroll);
  }

  // Registra os eventos de clique/touch
  carousel.addEventListener("mousedown", onUserStart);
  carousel.addEventListener("touchstart", onUserStart);
  carousel.addEventListener("mouseup", onUserEnd);
  carousel.addEventListener("mouseleave", onUserEnd);
  carousel.addEventListener("touchend", onUserEnd);

  // Inicia o loop de auto-scroll imediatamente (isUserActive já = false)
  autoScroll();
});
