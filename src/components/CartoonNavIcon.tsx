export type CartoonNavKind = 'journey' | 'journal' | 'profile'

/** Filled, layered cartoon artwork shared by the three primary destinations. */
export default function CartoonNavIcon({kind}:{kind:CartoonNavKind}) {
  return <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false" fill="none" stroke="#285965" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    {kind==='journey'?<>
      <ellipse cx="24" cy="42" rx="19" ry="3" fill="#bdddd7" stroke="none"/>
      <path d="m5 12 12-5 14 5 12-5v30l-12 5-14-5-12 5Z" fill="#8bd9b2"/>
      <path d="m17 7 14 5v30l-14-5Z" fill="#b8edba" stroke="none"/>
      <path d="M17 9v26m14-21v25" stroke="#63b695"/>
      <path d="M11 32c1-10 15-2 15-12" stroke="#fff3b1" strokeWidth="6"/>
      <path d="M29 23V7" stroke="#285965" strokeWidth="3"/>
      <path d="m30 7 10 4-10 5Z" fill="#ff907a"/>
      <circle cx="11" cy="33" r="3" fill="#fff6cc"/>
    </>:kind==='journal'?<>
      <ellipse cx="24" cy="43" rx="17" ry="3" fill="#bdddd7" stroke="none"/>
      <path d="M9 8h25q5 0 5 5v27H12q-5 0-5-5V13q0-5 5-5" fill="#cc5e61"/>
      <path d="M12 5h24v30H12q-5 0-5 4V10q0-5 5-5Z" fill="#ffac8f"/>
      <path d="M12 5v30" stroke="#e57a70" strokeWidth="3"/>
      <path d="M13 36h25v5H13q-5-2 0-5" fill="#fff2cf"/>
      <path d="M27 5v14l-4-3-4 3V5" fill="#59bfc0"/>
      <path d="M18 26h12m-12 4h8" stroke="#b75b61"/>
    </>:<>
      <ellipse cx="24" cy="43" rx="18" ry="3" fill="#bdddd7" stroke="none"/>
      <path d="M6 41q0-16 18-16t18 16Z" fill="#5bc4c0"/>
      <path d="M8 39h32v4H8Z" fill="#36a7ae" stroke="none"/>
      <path d="M18 27q6 8 12 0" stroke="#c3f0db" strokeWidth="4"/>
      <path d="M12 15q-3-3-4 1t4 6m24-7q3-3 4 1t-4 6" fill="#ffd5a0"/>
      <path d="M12 13q0-10 12-10t12 10v6q0 12-12 12T12 19Z" fill="#ffdcaa"/>
      <path d="M12 14q-3-13 9-12 8-5 14 4l1 8q-8-1-12-7-3 7-12 7Z" fill="#936449"/>
      <path d="M18 18v1m12-1v1" strokeWidth="3"/>
      <path d="M20 24q4 4 8 0"/>
      <path d="M15 22h2m14 0h2" stroke="#f6ae8c" strokeWidth="3"/>
    </>}
  </svg>
}
