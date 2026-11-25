# To do

## Content
- [ ] Exact date, venue, town and ceremony time (invitation card and header)
- [ ] Welcome text
- [ ] Schedule (`info.schedule` in `index.html`)
- [ ] The place: venue and town description
- [ ] Travel tips: from Germany, from Norway, from elsewhere
- [ ] Where to stay: hotels with links
- [ ] RSVP deadline (`rsvpDeadline`) and the FAQ answer "When is the RSVP deadline?"
- [ ] Weather answer: make it specific to the town once known (now a northern Italy range)
- [ ] Photos for the quiz questions (now emoji placeholders, `questions[].photo`)

## Language check
- [ ] Fede proofreads all Italian texts (quiz, page, fun facts, FAQ)
- [ ] Check the Norwegian phrases
- [ ] Dress code wording: "Semi-formal" (German) and "Semi-formale" (Italian) OK?

## RSVP
- [x] Apps Script: Project Settings > Script Properties > add `NOTIFY_EMAILS` with both addresses, comma-separated
- [x] Paste the new `rsvp-apps-script.gs`, then Deploy > Manage deployments > Edit > New version
- [x] Send a test RSVP; both addresses get the mail
- [x] Archive the unused second deployment "no mail in script"
- [ ] In the Sheet: rename header `party` to `names`, delete the test rows
- [ ] Optional: rate limit in the script against floods

## Before going public
- [ ] Hosting: GitHub Pages needs a public repo on GitHub Free (or Pro for Pages from a private repo; the site itself is public either way)
- [ ] Test on a phone: language picker, "No" button counter, RSVP form with "Sadly, no"
