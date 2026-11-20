# AntiGravity Update Prompt --- Migrate the Existing Results Website to React + Tailwind

Continue from the **existing project and current implementation**. Do
not restart the project or redesign it from scratch.

## Important change in direction

The previous brief asked for vanilla HTML, CSS and JavaScript. **That
requirement is now replaced.**

Use this stack:

-   React
-   Vite (if the project is not already using a suitable React setup)
-   Tailwind CSS
-   JavaScript or JSX (TypeScript is fine only if the project already
    uses it)
-   React components and hooks for all UI and interaction state

Do not build the application as a standalone vanilla HTML/CSS/JS
project. Do not use Next.js or add a backend.

## 1. First inspect the existing project

Before changing anything:

1.  Inspect the current folder structure and `package.json`.
2.  Identify which parts of the website have already been implemented.
3.  Inspect the existing `assets/` folder and identify the moon,
    astronaut, planet and other generated visual assets.
4.  Reuse the assets that are already present. **Do not regenerate,
    replace, or create duplicate versions of assets that are ready.**
5.  Preserve useful existing content, visual decisions, working
    countdown logic and animations wherever possible.

If React and Tailwind are already configured, continue with the existing
setup. If not, configure a minimal Vite + React + Tailwind project using
compatible current packages. Avoid unnecessary dependencies.

## 2. Refactor the website into React

Organise the experience into small, reusable React components. A
sensible starting structure is:

``` text
src/
  components/
    IntroSection.jsx
    AnnouncementSection.jsx
    CountdownSection.jsx
    WinnerReveal.jsx
    FinalSection.jsx
    SpaceScene.jsx
  data/
    eventConfig.js
  hooks/
    useCountdown.js
  App.jsx
  main.jsx
  index.css
```

Adjust this structure to suit the existing project. Do not create
components just for the sake of having more files.

Requirements:

-   Use React state and hooks to manage the current experience stage,
    countdown and winner reveal sequence.
-   Keep event details and winner information in one editable
    configuration file.
-   Use Tailwind utility classes for layout, spacing, typography,
    responsive behaviour, colours and most visual styling.
-   Keep custom CSS limited to special animations, keyframes and effects
    that are awkward to express with Tailwind.
-   Avoid inline style-heavy implementations.
-   Keep components readable and maintainable.

## 3. Preserve the agreed experience

Keep the same five-stage storyline and visual direction from the
existing brief:

1.  Greeting with staggered text:
    -   "HEY, EVERYONE!"
    -   "Hope you enjoyed today's Vibe Coding Small Hackathon."
    -   "But more importantly, I hope you discovered how much you can
        actually build with just a prompt."
    -   "And now... I hope you're excited for the results!"
2.  Announcement:
    -   "THE WAIT IS ALMOST OVER."
    -   "Your creativity, ideas and hard work are about to be
        recognised."
    -   "RESULTS ANNOUNCED TONIGHT AT 9:00 PM."
3.  Countdown:
    -   "MISSION: RESULTS"
    -   "THE RESULTS WILL BE REVEALED IN"
    -   Display `HH : MM : SS`.
4.  Sequential results:
    -   TOP 3, then TOP 2, then TOP 1.
    -   Each shows participant/team name, project name and optional
        score/image.
    -   TOP 1 must have the strongest reveal.
5.  Closing:
    -   "MISSION ACCOMPLISHED."
    -   "Congratulations to all our winners!"
    -   "Thank you for being part of this Vibe Coding Hackathon."
    -   Replay experience control.

Keep the intro concise (approximately 10--15 seconds) and provide a Skip
intro control.

## 4. Countdown and timing correctness

Use the configured deadline:

`2026-11-20T21:00:00+05:30`

This is 9:00 PM IST on 20 November 2026.

Implementation requirements:

-   Create a reusable React countdown hook or similarly clean React
    logic.
-   Calculate remaining time from the real current time. Never hardcode
    a starting duration.
-   Update once per second and clean up the interval on unmount.
-   Never show negative countdown values.
-   At or after the deadline, transition automatically to the results
    sequence.
-   If the site is opened or refreshed after the deadline, go directly
    to the results sequence.
-   Refreshing must not restart the countdown.
-   Keep the deadline in the central event configuration so it can be
    changed easily.

Avoid stale state, duplicate intervals, race conditions and effects that
repeatedly trigger the reveal.

## 5. Winner reveal behaviour

Keep the exact order:

1.  TOP 3
2.  TOP 2
3.  TOP 1

Use React state to control the active reveal. Add:

-   A short pause between automatic reveals.
-   A Continue / Reveal next control.
-   A Skip reveal control.
-   Protection against accidental rapid clicks causing skipped or
    duplicated stages.
-   A clear final transition after TOP 1.

Keep the winner data editable in one place, for example:

``` js
export const eventConfig = {
  title: "Vibe Coding Small Hackathon",
  deadline: "2026-11-20T21:00:00+05:30",
  timezone: "Asia/Kolkata",
  winners: [
    {
      rank: "TOP 3",
      name: "[PARTICIPANT / TEAM NAME]",
      project: "[PROJECT NAME]",
      score: "",
      image: ""
    },
    {
      rank: "TOP 2",
      name: "[PARTICIPANT / TEAM NAME]",
      project: "[PROJECT NAME]",
      score: "",
      image: ""
    },
    {
      rank: "TOP 1",
      name: "[PARTICIPANT / TEAM NAME]",
      project: "[PROJECT NAME]",
      score: "",
      image: ""
    }
  ]
};
```

Use the existing project's configuration if one already exists; do not
create a second competing source of truth. Do not invent actual winners.
Hide optional score or image fields when empty, and make unfilled names
visibly identifiable as development placeholders rather than real
results.

## 6. Tailwind visual implementation

Preserve the agreed art direction:

-   Deep midnight navy / near-black space background.
-   White and muted silver typography.
-   Restrained cool-blue accents.
-   Oversized editorial display type.
-   Large moon as the visual anchor.
-   Existing 3D astronaut asset positioned naturally on or near the
    moon.
-   Sparse stars / distant planet details only where useful.
-   Generous negative space and clean alignment.
-   Responsive layouts that feel deliberately designed, not merely
    squeezed down.

Use Tailwind responsive utilities for desktop, tablet and mobile. Ensure
the countdown remains prominent on mobile and winner names remain
readable.

Motion should feel polished but restrained:

-   Staggered intro text reveals.
-   Smooth fade, blur, translate and scale transitions.
-   Gentle movement on the existing moon / astronaut assets.
-   A more dramatic but tasteful TOP 1 reveal.
-   No excessive neon, flashing, confetti, random cards or heavy
    particle effects.

Use CSS keyframes or the Web Animations API for special effects. If
Framer Motion is already installed, it may be used; otherwise do not add
it unless it provides a clear benefit. Respect `prefers-reduced-motion`.

## 7. Replay and navigation

Replay must:

-   Restart the presentation from the greeting.
-   Not change the configured deadline.
-   Not reset or fake the real countdown.
-   If the deadline has passed, replay the intro and then proceed to the
    results without showing an active countdown.

Keep the experience as one page. Do not add routing, authentication,
admin tools or a backend.

## 8. Validate the finished React implementation

Run the project using its package scripts and fix build/runtime errors.

Test:

-   React app starts successfully.
-   Tailwind styles load correctly.
-   Existing generated assets load from the correct paths.
-   Before-deadline countdown works and updates once per second.
-   Deadline transition works.
-   Opening after the deadline skips the countdown.
-   Refresh does not reset the deadline.
-   Winner order is TOP 3 → TOP 2 → TOP 1.
-   Manual reveal controls work reliably.
-   Replay behaves correctly.
-   Desktop and mobile layouts have no horizontal overflow.
-   Reduced-motion preference is respected.
-   No console errors, missing assets or duplicate timers.

## Final instruction

**Update the existing project in place.** Reuse the assets that are
already ready. Migrate or refactor the implementation to React +
Tailwind CSS, preserving the approved space-themed design and storyline.
Do not regenerate assets, restart from a blank project, or add
unnecessary features.

When complete, give only a concise summary of what changed, how to run
the project, and where to edit the event deadline and winner details.
