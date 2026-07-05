/* ═══════════════════════════════════════════════════════════════════════════
   REVIEW PULL-QUOTES — real quotes from press / customer reviews.
   Attributed generically ("customer review" / "Tripadvisor") — do NOT attribute
   to named individuals or fabricate new quotes.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Review {
  quote: string;
  source: string;
}

export const reviews: Review[] = [
  {
    quote: "The panino was amazing, still warm from the oven and BIG.",
    source: "Customer review",
  },
  {
    quote:
      "The star of the show was the chips — the best I've ever had… deep golden, mix of crisp and soft.",
    source: "Customer review",
  },
  {
    quote:
      "The queue was out the door but the well-oiled action-stations inside meant the wait was only 10 minutes.",
    source: "Tripadvisor",
  },
  {
    quote:
      "Proper Italian comfort food without the pretense — bread that actually matters and fillings that don't skimp.",
    source: "Customer review",
  },
];
