# Total Recall hackathon: demo video rules (fetched 2026-11-10)

Sources used:
- S1: https://tatum.io/hackathon/total-recall (WebFetch returned only the page title; curl returned no body. Content is JS-rendered and was not verified.)
- S2: https://recall-tatum-walrus.vercel.app (fetched via WebFetch and raw curl HTML)
- S3: https://github.com/tatummarketing/total-recall-hackathon/blob/HEAD/src/lib/content.ts (`eventRules`, `faqs`, `judgingCriteria`, `requirements`)
- S4: https://github.com/tatummarketing/total-recall-hackathon/blob/HEAD/src/components/SubmitModal.tsx
- S5: https://github.com/tatummarketing/total-recall-hackathon/blob/HEAD/src/app/actions/submit.ts

Firecrawl returned "Anonymous keyless access is unavailable" for both sites, so WebFetch and curl were used instead.

## Demo video facts

- Length (min/max): "Short demo video (2 to 3 min)" (S3, eventRules, Hackathon Eligibility list; S4 form label). Only a 2 to 3 minute range is stated. No separate min or max beyond that.
- Required field: "Short demo video (2 to 3 min) <span className="form-req">*</span>" with `required` on the input (S4). The form is required to submit.
- Hosting: placeholder reads "YouTube or other link" (S4). Validation only checks `isUrl`: "u.protocol === "http:" || u.protocol === "https:"" (S5). Specific host allowed or required: not stated beyond "YouTube or other link".
- Public vs unlisted (video): not stated. Closest wording, for the repo: "Working demo and public repo." (S2, Submission checklist item 05; S3, requirements item 5). Rules grant: "you grant the Sponsors a worldwide, royalty free license to review, demo, and publicly showcase your Submission for Hackathon and marketing purposes." (S3, Submissions section).
- Required content (team intro, sponsor tech shown, live demo, face cam): not stated. Only "Working demo" appears (S2, S3). Also "Clear documentation and a working demo." (S2, Presentation criterion, 20%).
- Live demo vs mocked: not stated. "Working demo" is the only wording (S2, S3).
- Language: not stated.
- Captions / subtitles: not stated.
- File size: not stated. (The form takes a URL, not an upload.)
- AI voiceover, AI-generated media, or AI-generated music restrictions: not stated. The rules only say "Your Submission must be your original work (or work you are authorized to submit)" (S3, Submissions section). No mention of AI media.
- Video is watched in full by judges: not stated.

## Judging facts

- Number of judges: not stated. Wording: "Submissions are scored against the published judging criteria by a panel appointed by the Sponsors (the “Panel”). Panel decisions are final and binding." (S3, Judgment section). Panel size: not stated.
- Criteria, from S2 and S3: "Walrus and Tatum Integration" 30%, "Technical Quality" 30%, "Creativity" 20%, "Presentation" 20% ("Clear documentation and a working demo.").
- Judging window: "11 to 16 Nov" (S2, Timeline). "Results Announcement: November 17, 2026" (S3).
- Submission deadline: "Submission Deadline: November 10, 2026 5:00 PM UTC" (S3). S2 says "Repo, demo, and blog post due 17:00 UTC." (Timeline).
- Sponsors may disqualify: "The Sponsors may disqualify Submissions that are incomplete, fraudulent, abusive, do not comply with these rules, or that violate these Event Rules or applicable law." (S3).

## Counts

- Registrants: not stated (S1 gave no content; S2 and S3 have none).
- Submissions received: not stated.

## Other

- Tatum AI Builder: "Optional build with Tatum AI Builder (ai.tatum.io) for the dedicated $500 bonus described below under Prizes." (S3). No video-related rule.
- Public results: "Results shared publicly with partners and community." (S2, Timeline).
- Bonus for sharing: "Share your project on X or LinkedIn. Tagging @Tatum_io and @WalrusFoundation is optional and may earn extra points." (S2, judging bonus; S3, judgingBonus). No video-specific rule.
- Eligibility to submit the form at https://recall-tatum-walrus.vercel.app (S3).
- Rules and legal links: Event Rules text in S3 (`eventRules`). Terms: https://tatum.io/terms-of-use, https://docs.wal.app/docs/legal/walrus_general_tos, https://docs.wal.app/docs/legal/privacy (S2, S3). No dedicated rules or FAQ subpage found in the repo tree or on S2 (the FAQ is an on-page section).
- S1 (tatum.io) not verified: the page is JS-rendered and returned no text to WebFetch or curl. A browser render or an authenticated fetch is needed to confirm whether tatum.io states any video rule.
