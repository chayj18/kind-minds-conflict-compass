<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep round interaction regression tests against the exported Round component so input validation can be exercised without routing or result storage.
- Validate steps 1–2 with conservative local non-answer checks followed by a server-only contextual AI check; accept varied emotions and plausible needs rather than a fixed vocabulary so student reflection is not reduced to an answer key.
- Keep AI credentials and prompts in server-only helpers called through a bounded-input server function; return feedback without persisting drafts or sending student nicknames to AI.
