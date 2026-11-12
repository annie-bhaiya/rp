type Brief = {
  summary: string; explanation: string; missingFacts: string[]; tradeoffs: string[];
  extractionSource: string; explanationSource: string; recommendedOptionType?: string;
};

export function ResolutionBrief({ brief }: { brief?: Brief }) {
  if (!brief) return null;
  const live = brief.extractionSource === 'GEMINI' && brief.explanationSource === 'GEMINI';
  return <section aria-label="Resolution assistant" className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-blue-950">Your resolution brief</h2>
      <span className="text-xs text-blue-800">{live ? 'Gemini AI · advisory' : 'Rules-based fallback · AI unavailable or not configured'}</span>
    </div>
    <p className="text-sm text-blue-950">{brief.summary}</p>
    <p className="text-sm text-blue-900">{brief.explanation}</p>
    {!!brief.missingFacts?.length && <div>
      <h3 className="text-sm font-semibold text-blue-950">Helpful information to provide</h3>
      <ul className="list-disc pl-5 text-sm text-blue-900">{brief.missingFacts.map((fact, i) => <li key={i}>{fact}</li>)}</ul>
    </div>}
    {!!brief.tradeoffs?.length && <details className="text-sm text-blue-900">
      <summary className="cursor-pointer font-medium">Compare the tradeoffs</summary>
      <ul className="list-disc pl-5 mt-2">{brief.tradeoffs.map((text, i) => <li key={i}>{text}</li>)}</ul>
    </details>}
    <p className="text-xs text-blue-800">The amounts and requirements on each remedy are authoritative. You choose the remedy; the merchant verifies and approves it.</p>
  </section>;
}
