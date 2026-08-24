gsap.registerPlugin(Observer, SplitText);

    const scenes = gsap.utils.toArray(".scene");
    const backgrounds = gsap.utils.toArray(".scene-background");
    const shells = gsap.utils.toArray(".scene-shell");
    const inners = gsap.utils.toArray(".scene-inner");
    const titles = gsap.utils.toArray(".scene-title");
    const eyebrows = gsap.utils.toArray(".eyebrow");
    const subtitles = gsap.utils.toArray(".scene-subtitle");
    const currentSceneLabel = document.getElementById("currentScene");

    const splitTitles = titles.map((title) => {
      return new SplitText(title, {
        type: "lines,words,chars",
        linesClass: "clip-line"
      });
    });

    const wrapIndex = gsap.utils.wrap(0, scenes.length);

    let currentIndex = -1;
    let animating = false;

    gsap.set(shells, {
      yPercent: 100
    });

    gsap.set(inners, {
      yPercent: -100
    });

    gsap.set(scenes, {
      autoAlpha: 0
    });

    function updateCounter(index) {
      currentSceneLabel.textContent = String(index + 1).padStart(2, "0");
    }

    function goToScene(index, direction) {
      index = wrapIndex(index);

      if (animating) {
        return;
      }

      animating = true;

      const movingUp = direction === -1;
      const directionFactor = movingUp ? -1 : 1;

      const timeline = gsap.timeline({
        defaults: {
          duration: 1.2,
          ease: "power3.inOut"
        },
        onComplete: () => {
          animating = false;
        }
      });

      if (currentIndex >= 0) {
        gsap.set(scenes[currentIndex], {
          zIndex: 0
        });

        timeline
          .to(
            backgrounds[currentIndex],
            {
              yPercent: -12 * directionFactor,
              scale: 1.045
            },
            0
          )
          .to(
            splitTitles[currentIndex].chars,
            {
              yPercent: -85 * directionFactor,
              autoAlpha: 0,
              duration: 0.6,
              stagger: {
                each: 0.004,
                from: "random"
              },
              ease: "power2.in"
            },
            0
          )
          .to(
            [
              eyebrows[currentIndex],
              subtitles[currentIndex]
            ],
            {
              y: -18 * directionFactor,
              autoAlpha: 0,
              duration: 0.45
            },
            0
          )
          .set(
            scenes[currentIndex],
            {
              autoAlpha: 0
            },
            1.05
          );
      }

      gsap.set(scenes[index], {
        autoAlpha: 1,
        zIndex: 1
      });

      gsap.set(backgrounds[index], {
        scale: 1.035
      });

      timeline
        .fromTo(
          [
            shells[index],
            inners[index]
          ],
          {
            yPercent: (itemIndex) => {
              return itemIndex
                ? -100 * directionFactor
                : 100 * directionFactor;
            }
          },
          {
            yPercent: 0
          },
          0
        )
        .fromTo(
          backgrounds[index],
          {
            yPercent: 12 * directionFactor
          },
          {
            yPercent: 0,
            scale: 1,
            duration: 1.45
          },
          0
        )
        .fromTo(
          splitTitles[index].chars,
          {
            yPercent: 125 * directionFactor,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: {
              each: 0.012,
              from: "random"
            }
          },
          0.25
        )
        .fromTo(
          eyebrows[index],
          {
            y: 22 * directionFactor,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power2.out"
          },
          0.35
        )
        .fromTo(
          subtitles[index],
          {
            y: 26 * directionFactor,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            ease: "power2.out"
          },
          0.48
        );

      currentIndex = index;
      updateCounter(index);
    }

    Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,

      onDown: () => {
        if (!animating) {
          goToScene(currentIndex - 1, -1);
        }
      },

      onUp: () => {
        if (!animating) {
          goToScene(currentIndex + 1, 1);
        }
      }
    });

    window.addEventListener("keydown", (event) => {
      if (animating) {
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        goToScene(currentIndex + 1, 1);
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        goToScene(currentIndex - 1, -1);
      }
    });

    goToScene(0, 1);