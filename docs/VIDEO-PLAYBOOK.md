# Hackathon Demo Video Prompt (v1, follow-on to the master playbook)

A companion to `hackathon-planning-prompt.md`. Run it in a project the master playbook has
already planned (RECON.md, IDENTITY.md, DESIGN-BRIEF.md and a Design System artifact exist) and
once the product's demo slice actually works. It produces the demo video: Claude Design designs
every frame, including a custom logo reveal, as a HyperFrames composition (HTML + GSAP). Claude
Code adds the real app footage, AI voiceover, music, sound and captions, then renders the MP4.

How to use:
1. Copy this file into the project as `docs/VIDEO-PLAYBOOK.md`. Fill section 1 only for
   anything the master docs don't already answer.
2. **Between sessions, before Stage V1** (never mid-session, see PLAYBOOK section 3), run
   these yourself:
   - `claude plugin marketplace add heygen-com/hyperframes`
   - `claude plugin install hyperframes@hyperframes`
   - Install Node.js 22+ and FFmpeg, then run `npx hyperframes doctor` until it's clean
   - Optional: OBS Studio, used as a fallback capture tool if Playwright's video is too soft
3. **Session 1:** start Claude Code in the project (auto mode, Opus) and paste:
   `Read docs/VIDEO-PLAYBOOK.md and follow the fenced prompt, starting at Phase V0.`
4. Later sessions: `/clear`, then paste the resume line Claude gives you. Same `wrap up`
   rule as the master: type it at around 85% of your 5-hour meter.

| Stage | Phases | Main model |
|---|---|---|
| V1 Constraints and story | V0, V1, V2 | Opus |
| V2 Look, footage and design handoff | V3, V4, V5 | Opus (V4 capture scripting can be Sonnet) |
| V3 Edit bay and delivery | V6, V7 | Opus |

Why HyperFrames: the Motion template (Claude's native animation type with MP4 export) is on
Team and Enterprise plans only, and the Design artifact's own animations are hard to get out
as video. HyperFrames is Apache-2.0, renders locally, and publishes an official instruction file
for Claude Design. Remotion was dropped because teams of 4+ need a paid company license.

## Grudge project notes (filled 2026-11-10 08:20 UTC)

- **RECON.md does not exist here.** Its role is played by `docs/RESEARCH.md` (rules, sources)
  and `docs/research/COMPETITORS.md`. Video rule known: a 2 to 3 minute video is required.
- **Section 1 inputs:** live app https://grudge-l19c.onrender.com (no login; never POST
  `/api/pick` from a script, it adds a real Crowd call); target length 2:30; voiceover language
  English; no extra cuts unless the owner asks.
- **Humanizer:** the owner skipped the humanizer pass for the whole project (2026-11-09). Do not
  run it on the VO.
- **Existing assets:** `docs/launch/VIDEO-SCRIPT.md` (2:30 script, Nov 10 numbers, recording
  order: film the amnesia wipe last), title and closing cards in `docs/launch/assets/`
  (`video-title.png`, `video-close.png`), the Feathers mark (`docs/launch/assets/mark.svg`),
  Design artifact https://claude.ai/artifact/6NgfptsBX3JYdhPLXWeST3.
- **Time:** started 2026-11-10 08:20 UTC with the submission closing 17:00 UTC the same day
  (our cutoff 14:00). The owner chose the full playbook knowing it may not finish; cut phases
  rather than miss the deadline, and keep the plain screen recording as the fallback.

---

````text
# ROLE AND GOAL

You are my director, editor and post-production lead for the hackathon demo video. The goal is
the video that wins: in the first 20 seconds a judge sees a real, working product doing its
magic moment, and every second after that earns its place. It has to feel like a film, with
motion, a camera, rhythm and sound, never a slide deck that happens to be animated. It must
look made by our team for this product, and nothing in it may look AI-generated or templated.

Everything the master playbook demands still holds. This prompt adds video-specific rules and
overrides the master only where it says so.

# 0. WHAT CARRIES OVER FROM THE MASTER PLAYBOOK (binding)

Read `docs/PLAYBOOK.md` sections 2 (operating rules), 3 (token budget and subagent routing),
6 (hard bans) and 7 (output conventions). Apply them here unchanged:
- gated phases, asking early with recommended defaults, the ASSUMPTIONS list, honesty
- no AI attribution anywhere, including the video's credits, description and commits
- Haiku/low for fetching, Sonnet/medium for synthesis and drafts, you for judgment; never
  `fork`, never `deep-research`; raw findings go to `docs/research/raw/`
- HANDOFF.md is updated at every phase end and before every fan-out; `wrap up` works the same
- every visual made in Claude Design for this project; the section 6 bans hold on every frame

**Source of truth:** `docs/IDENTITY.md` (tokens, fonts, motion tokens, signature motion, "Not
this" list), `docs/DESIGN-BRIEF.md` (asset inventory, motion spec), `docs/research/RECON.md`
(rules, judging rubric, past winners), `docs/PRD.md` (magic moment, sponsor tracks) and the
project's Design System artifact. Don't re-research what they already answer.

**Rule 8 exception (Claude Code doesn't design visuals).** Claude Design designs every scene,
the logo reveal, all type, art, color and transitions. In the edit bay (Phase V6), Claude
Code may only:
- place the real footage and audio into the slots Claude Design left for them
- tune what already exists: eases, stagger, durations, cut points, and swapping one approved
  transition for another
- add captions in the caption style Claude Design drew
Any new visual element, color, typeface, graphic or effect goes back to Claude Design.

# 1. INPUTS (fallback: fill only what the master docs don't answer)

- Video rules not in RECON.md (max length, aspect ratio, host such as YouTube/Vimeo/Loom,
  public vs unlisted, required content such as a team intro or sponsor tech on screen,
  music/AI rules): <<OR "see RECON.md">>
- Live app URL and demo account for capture: <<URL, login>>
- Target length: <<e.g. 2:30, or "rules max minus 10 s">>
- Language and accent for the voiceover: <<e.g. US English, neutral>>
- Extra cuts wanted: <<e.g. 30 s social cut 9:16, OR none>>

# 2. PIPELINE

```
IDENTITY.md + Design System ─┐
VIDEO-BRIEF.md (script, ─────┼─> Design artifact (Claude Design + HyperFrames instruction file)
  storyboard, shot list)     │      └─ Download ZIP ─> video/ (HyperFrames project)
Playwright captures ─────────┼────────────────────────> video/assets/footage/
AI voiceover, music, SFX ────┘────────────────────────> video/assets/audio/
                                  Claude Code: check, preview, polish, render ─> MP4 + SRT
```

# 3. TOOL AND SKILL MAP

| Need | Use | Don't use |
|---|---|---|
| Composition and render | HyperFrames plugin: `/hyperframes:hyperframes`, `hyperframes-cli` (`check`, `lint`, `preview`, `render`) | `/hyperframes-registry` and every catalog block, chart, map or overlay from it: all visuals are ours |
| Design in Claude Design | A **Design** artifact (quickstart intent `design`) on our Design System, seeded with the HyperFrames instruction file `docs/guides/claude-design-hyperframes.md` (the **Download ZIP** flow) | The "Send to HyperFrames" cloud flow (the free tier allows only 3 renders a month, and it ships the unreleased project to a hosted service); Claude Design's built-in "Animated video" starter |
| Voice, music, SFX, captions | `media-use` for **audio and transcription only** (`voice`, `bgm`, `sfx`, `npx hyperframes transcribe`), mixing per its `references/mixing.md` | `media-use` for images, icons, logos, generated images, avatars or generated video |
| Footage capture | Playwright (scripted, repeatable runs on seeded data); OBS Studio as the fallback recorder | Screen recording by hand as the main source |
| Analysing past winners' videos | `/reverse-any-video` on 2-3 winning demos (structure and timing only), run by a Sonnet subagent | Copying any video's look, layout or script |
| Script and copy | `copywriting` for the hook and the on-screen lines, `humanizer` as the last pass on the VO | |
| Charts in the video | `dataviz` rules, drawn by Claude Design | Library chart blocks |
| Version or API facts | context7 (Haiku subagent), the HyperFrames docs in the repo `heygen-com/hyperframes` | Memory |

HyperFrames' own engine is allowed: the runtime, GSAP and `@hyperframes/shader-transitions`
count as a renderer (master section 6 exception). Shader transitions are used at most twice,
recolored with our tokens, and only where the motion spec calls for them.

Where the HyperFrames instruction file conflicts with IDENTITY.md (fonts, eases, "everything
keeps moving", bouncy `back.out`), IDENTITY.md and this prompt win. Say so in the seed message.

Telemetry: HyperFrames skills send a usage beacon. Check its docs for the opt-out and set it in
V0. Anything sent to a hosted voice, music or catalog service (the VO script, search intents)
leaves our machine: confirm with me once in V0 that this is fine before the submission is public.

# 4. PHASES

## Phase V0: Setup and pipeline smoke test (no gate unless it fails)

- Confirm that the master's docs and the Design System artifact exist and that the demo slice
  runs. If something is missing, stop and tell me what it is.
- Check the toolchain: `node -v` (22+), `ffmpeg -version`, `npx hyperframes doctor`, the
  HyperFrames plugin, and Playwright. List anything missing with the install command, and don't
  install it yourself.
- Create `docs/video/` and `video/` (the HyperFrames project root).
- Fetch the HyperFrames Claude Design instruction file from the repo at a pinned commit into
  `docs/video/HYPERFRAMES-CLAUDE-DESIGN.md`, and note the commit and the CLI version.
- **Smoke test the whole pipeline before investing in it.** Create a throwaway Design artifact
  seeded with the instruction file and ask for a 4-second 1920x1080 test: our wordmark, one
  token color, one tween and one `<video>` slot. I download the ZIP. You unzip it into
  `video/_smoke/`, drop in a 4-second test clip, run `check` and `render`, and confirm the MP4
  plays with the right font (not a fallback). Record anything that breaks in ASSUMPTIONS.md.
  The test also checks that the Design artifact's chat on claude.ai can write and preview a
  HyperFrames project at all: its GSAP and `@hyperframes` scripts load from jsdelivr, and an
  artifact may require exact version pins. If the test fails, stop and give me the options:
  (a) fix the seed and retry; (b) Claude Design delivers the scenes as layered artboards and
  SVG plus a frame-exact motion spec, and Claude Code builds the HyperFrames timeline from them
  (this widens the rule 8 exception, so I have to approve it).
- Add a "Video" block to HANDOFF.md's key facts: max length, aspect ratio, host, deadline.

## Phase V1: Video constraints and what wins

- **Rules digest** (from RECON.md, a Haiku fetch only for gaps) in `docs/video/VIDEO-RECON.md`:
  max length (and whether judges stop watching at a cutoff), resolution and aspect ratio, host,
  visibility, required content, whether music or AI voice is restricted, captions,
  file-size limits, what must be shown live vs. what may be mocked. Flag anything that could
  disqualify us.
- **Past-winner demo videos** (one Sonnet subagent): 6-10 winning videos from this hackathon
  and similar ones. For each: length, seconds until the real product appears, seconds until the
  magic moment, logo/intro length, VO style, how sponsor tech was shown, what dragged. Run
  `/reverse-any-video` on the 2-3 best for scene timing only. Summarise the patterns and the
  clichés judges will be tired of.
- **Judge attention model:** with N submissions and the judging time from RECON, estimate how
  much of our video a tired judge actually watches, and design for that.

Gate: the constraint table, the patterns, and your recommended length and structure.

## Phase V2: Story and script (main writes; nothing visual yet)

- **Structure:** derive it from the rubric and the V1 patterns, not from a template. Hard
  requirements:
  - a hook in the first 3-5 s that is about the user's problem or the product's result, never
    a title card
  - the real product on screen by 0:10-0:15 and the magic moment complete by 0:20-0:30
  - the logo reveal at 2.5-4 s, placed where it lands best (often right after the cold-open
    hook, as the release of the first beat), never as a slow opener
  - each targeted sponsor track shown visibly using the sponsor's tech, matching the write-up
  - a close the judges remember: one line, one image, the live link
- **Script** in `docs/video/SCRIPT.md`: a table of timecode, VO line, what's on screen, shot
  type, sound cue. Shot types: **D** (designed scene), **F** (real footage), **H** (footage
  framed inside a designed scene: device frame, crop, zoom, annotations). Budget the VO at about
  150 words a minute and leave air: no VO over the magic moment's payoff.
- On-screen text follows the master's copy bans, and nothing on screen reads like a slide: no
  bullet lists, no paragraph cards, at most about 7 words per text beat.
- Draft the hook and the close with `copywriting`, then run `humanizer` on all VO lines (give it
  a sample of my writing).
- **Honesty pass:** every claim in the VO is something the product really does on camera. Mark
  anything sped up, simulated or seeded, and decide with me how it's labelled.

Gate: I approve the script and the timing.

## Phase V3: Motion language, logo reveal and storyboard

Write the video section of the motion spec yourself (main) into `docs/video/VIDEO-BRIEF.md`,
extending IDENTITY.md's motion tokens. The video may push further than the app, but it has to
feel like the same product (master Phase 3, Step 0).

- **Logo reveal: three concepts, different on purpose.** Each one is built from how our logo is
  actually constructed (its strokes, counters, grid, the signature move) or from the identity's
  world, never from a reveal template. They differ in mechanism: e.g. the mark constructs
  itself, the UI collapses into the mark, the world's material forms it, type resolves into it.
  For each: a 2-line idea, a beat-by-beat timing at frame precision, the sound that sells it,
  and the end frame it holds on. Before the reveal concepts, name the reveal clichés we refuse:
  particles assembling, liquid splash, glitch, light sweep, 3D spin, stroke-draw-then-fill
  on its own.
- **Transition grammar:** about 90% hard cuts on the beat. Use match cuts and shared-element
  moves between the designed scenes and the footage (a UI element in the footage becomes the
  next designed scene). At most two shader moments: the logo reveal and one energy shift. Name
  each transition and where it's used.
- **Virtual camera on footage:** push-ins to the action, pans that follow the cursor, focus
  pulls by dimming the rest. Easing and maximum speed come from the motion tokens. No
  Ken Burns drift on stills as filler.
- **Designed cursor and interaction feedback:** an original cursor and click mark drawn in
  Claude Design, driven by the timestamps and coordinates that the V4 capture logs.
- **Type in motion and captions:** how headlines enter and leave, plus the burned-in caption
  style (size, position, how it handles the active word). Both drawn by Claude Design.
- **Texture and effects:** only what the identity's world justifies. No generic light leaks,
  lens flares, chromatic aberration, glow or film-grain presets.
- **Rhythm:** the music's BPM gives a beat grid, and cuts and hits land on it. Write the cut
  list against the grid.
- **Sound design map:** which motion events get a sound (the reveal, the magic moment, key
  clicks) and what the sound is like. Not every cut gets a whoosh.
- **Footage grade:** how captured UI is colored and framed to sit inside the identity (device
  frame or none, background, shadow, corner radius from tokens).

Then **storyboard in Claude Design:** a Design artifact on our Design System, seeded with
VIDEO-BRIEF.md and SCRIPT.md. Ask for (a) the three logo reveal concepts as short working
HyperFrames loops, and (b) one keyframe artboard per scene at 1920x1080. Run the master's drift
check (Phase 7) on what comes back.

Gate: I pick the logo reveal and approve the storyboard. Lock the choices into VIDEO-BRIEF.md.

## Phase V4: Capture the real footage

- Seed demo data that tells the story (realistic names and numbers, no lorem, no personal
  data), then reset it before every take.
- One Playwright script per F/H shot in `video/capture/`: viewport 1920x1080 at
  `deviceScaleFactor` 2, no browser chrome, deterministic waits, human-paced typing and mouse
  movement. Each run logs an action file (`<shot>.actions.json`: timestamp, x, y, event) for the
  designed cursor, the zooms and the click marks.
- **Check the capture quality before shooting everything.** Record one shot and measure it with
  `ffprobe` (fps, bitrate, resolution). If it's under 60 fps or soft on text, run the same
  script headed and record it with OBS (60 fps, high-quality CQP), keeping the action log.
- Normalise every clip to H.264 at constant frame rate (60 fps or the composition's rate) with
  ffmpeg, named `<shot>.mp4`, and log the exact durations in `docs/video/FOOTAGE.md`.
- Terminal shots, if any: record them in the same scripted way, and they get styled in the
  designed frame like any other footage.
- Build a contact sheet (one frame per second per shot) so I can review it fast.

Gate: I approve the footage, or list the retakes.

## Phase V5: The Claude Design build (handoff)

Write the seed yourself (main). Don't design anything.

- Finalise VIDEO-BRIEF.md: the locked tokens and fonts (pasted exactly, with the font files),
  the logo as layered SVG with separable paths, the chosen reveal, the storyboard, SCRIPT.md
  with timecodes, the beat grid, the transition grammar, the caption style, and every footage
  slot with its file name, exact duration, and where the action log puts the action. Include
  the bans from section 5 and PLAYBOOK section 6.
- Create the **Design** artifact (quickstart intent `design`) on our Design System, seeded with
  VIDEO-BRIEF.md, SCRIPT.md, HYPERFRAMES-CLAUDE-DESIGN.md, the logo SVG, font files, the
  storyboard frames and low-res proxies or stills of the footage (not the full files).
- Give me the opening message to paste into Claude Design. It says: follow
  HYPERFRAMES-CLAUDE-DESIGN.md (Download ZIP flow); IDENTITY tokens and VIDEO-BRIEF override its
  defaults; build the logo reveal as its own composition first; then the full composition at
  the script's timecodes, with `<video>` slots pointing at `assets/footage/<shot>.mp4` and the
  designed cursor and caption layers ready to be driven.
- When the ZIP comes back: unzip it to `video/`, run `npx hyperframes check` and `lint`, then
  the master's drift check (tokens sampled from rendered frames, real fonts, no catalog blocks,
  no stock or library shapes, motion within budget). Send failures back to Claude Design with
  the exact token or ban they broke.

Gate: the composition passes check, lint and the drift check, and I've seen a draft preview.

## Phase V6: Edit bay (Claude Code, inside the rule 8 exception)

- **Audio first:** the timing hangs on it.
  - Voiceover: generate the VO lines on a short-listed set of 2-3 voices (e.g. Kokoro locally via
    `npx hyperframes tts`, HeyGen Voice Turbo, ElevenLabs). I pick blind from the hook line.
    Before using any provider, verify that its current terms allow public, competitive use
    without attribution, and write the result to ASSUMPTIONS.md.
  - Music: an instrumental track whose license allows public posting on the host (check Content
    ID claims too). Fit the edit to its structure, and keep vocals out of VO sections.
  - SFX per the sound design map. Mix: VO ducking under the music, loudness to the host's target
    (e.g. about -14 LUFS integrated for YouTube, true peak at most -1 dBTP).
  - Every audio source, its license and its link go into `docs/video/CREDITS.md`.
- **Assemble:** drop the footage into its slots, drive the cursor, zooms and click marks from
  the action logs, sync the cuts to the beat grid and the VO, and add captions from
  `npx hyperframes transcribe` checked against SCRIPT.md.
- **Review loop:** you can't watch video, so don't claim it "looks smooth". For every draft,
  render at preview quality and pull frames at each cut and key beat with ffmpeg into a contact
  sheet you inspect. I watch the draft and give timestamped notes. Fix within the exception;
  anything visual goes back to Claude Design. At most 3 rounds before we decide what to cut.
- **Judge pass** (main, after the final draft): watch as the tired judge from V1. Is the product
  real and on screen by 0:15? Is each targeted track visible? Does any claim lack on-screen
  proof? Is there any dead second? Fix or cut.

Gate: I approve the final draft.

## Phase V7: Final render, QA and delivery

- Render the master at 1920x1080 (or 4K if the host and rules reward it), at the project's frame
  rate, as H.264 at a high bitrate with AAC 48 kHz audio. Also export the SRT.
- QA, and show me the output of each check: `ffprobe` for duration (at or below the limit with
  a margin of 2 s or more), resolution and fps; loudness measured with ffmpeg `ebur128`; no
  black or frozen frames at the cuts (`blackdetect`, `freezedetect`); fonts rendered for real;
  the captions in sync.
- A thumbnail designed in Claude Design (master Phase 7 surfaces) plus the designed first frame.
- Upload settings: title, description with the live link and repo, chapters, captions, and the
  visibility the rules require. Verify it plays logged out, in a private window, on mobile.
- The extra cuts from section 1, if any, built from the same composition rather than cropped.
- Keep the master render, the HyperFrames project and the CREDITS.md in the repo (large media
  via Git LFS or an external link). Update the submission checklist and HANDOFF.md.

Gate: the delivery checklist is all green. Give me the links.

# 5. VIDEO BANS (on top of PLAYBOOK section 6)

**Slide-deck tells**
- title card → screenshot → title card rhythm; bullet lists or paragraphs on screen
- a static frame held over about 1.5 s with nothing alive in it; Ken Burns on screenshots as the
  main motion
- an "Agenda", "The Problem" or "Our Solution" chapter card; a team-photo slide (unless the
  rules require a team intro, and then it's designed)

**Motion and effects tells**
- stock transitions: cube, spin, page curl, zoom blur, star wipe, glitch, slideshow dissolves on
  every cut
- preset light leaks, lens flares, chromatic aberration, VHS or film-grain overlays, generic glow
- reveal templates: particles assembling, liquid splash, smoke, 3D spin of the logo, a light
  sweep across the wordmark
- everything moving at once with the same ease; bouncy overshoot unless IDENTITY allows it;
  shader transitions on more than two cuts

**Sound tells**
- a whoosh on every cut; stock keyboard-typing loops; music with vocals under the VO;
  "epic trailer" drums or corporate ukulele by default
- a VO that reads the on-screen text aloud

**Honesty**
- fake UI passed off as the product, sped-up footage with no label when speed is the claim,
  or results the product can't actually reproduce live
- AI-generated video, images or avatars; stock footage; catalog visuals of any kind

# 6. OUTPUT CONVENTIONS

- Docs live in `docs/video/`, the HyperFrames project in `video/`, raw research in
  `docs/research/raw/`. Media over 50 MB never goes into plain git.
- Gate messages follow PLAYBOOK section 7 (paths, decisions, questions with defaults, next
  phase, about 15 lines at most).
- Stage boundaries: V0-V2, V3-V5, V6-V7. At each one, update HANDOFF.md and say: "Video stage N
  done. Run /clear and paste: `Read docs/HANDOFF.md, then run Video stage N+1 of
  docs/VIDEO-PLAYBOOK.md`".

Start with Phase V0.
````
