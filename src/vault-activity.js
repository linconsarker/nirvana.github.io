// ── Vault Activity Log ─────────────────────────────────────────────

const EVENT_CFG = {
  vault:            { color:"#5856D6", bg:"rgba(88,86,214,0.12)",  border:"#5856D6" },
  member:           { color:"#007AFF", bg:"rgba(0,122,255,0.12)",  border:"#007AFF" },
  file:             { color:"#AF52DE", bg:"rgba(175,82,222,0.12)", border:"#AF52DE" },
  consent_request:  { color:"#FF9500", bg:"rgba(255,149,0,0.12)",  border:"#FF9500" },
  consent_approved: { color:"#34C759", bg:"rgba(52,199,89,0.12)",  border:"#34C759" },
  consent_declined: { color:"#FF3B30", bg:"rgba(255,59,48,0.12)",  border:"#FF3B30" },
  session:          { color:"#E67300", bg:"rgba(230,115,0,0.12)",  border:"#E67300" },
  security:         { color:"#8B1A1A", bg:"rgba(139,26,26,0.09)",  border:"#8B1A1A" },
};

// dateGroup: "Today" | "Yesterday" | "May 4, 2026" etc.
const VAULT_ACTIVITY = {
  medical: [
    {
      id:"vam1", category:"consent_approved", filterTag:"consent",
      actor:"John Doe", actorRole:"Owner",
      action:"Approved access request from Jane Smith",
      when:"May 6, 2026 · 9:05 AM UTC", local:"5:05 AM EDT",
      badgeLabel:"APPROVED", vaultName:"Medical Records", dateGroup:"Today",
      details:[
        ["Consent ID","CON-8812"],["Approval #","2 of 2"],
        ["Reason","Routine medical review"],["Duration","4 hours"],
        ["IP Address","10.0.0.8"],["Device","MacBook Pro · macOS 14.3"]
      ]
    },
    {
      id:"vam2", category:"consent_request", filterTag:"consent",
      actor:"Jane Smith", actorRole:"Partner A",
      action:"Requested temporary access to Medical Records",
      when:"May 6, 2026 · 8:48 AM UTC", local:"4:48 AM EDT",
      badgeLabel:"REQUESTED", vaultName:"Medical Records", dateGroup:"Today",
      details:[
        ["Consent ID","CON-8812"],["Duration Requested","4 hours"],
        ["Reason","Routine medical review"],["Approvals Needed","2 of 2"],
        ["IP Address","10.0.0.22"],["Device","iPhone 14 · iOS 17.2"]
      ]
    },
    {
      id:"vam3", category:"session", filterTag:"access",
      actor:"John Doe", actorRole:"Owner",
      action:"Opened vault session — drive accessed for 3h 42m",
      when:"May 6, 2026 · 9:10 AM UTC", local:"5:10 AM EDT",
      badgeLabel:"SESSION OPENED", vaultName:"Medical Records", dateGroup:"Today",
      details:[
        ["Session ID","SES-7E3B21"],["Duration","3h 42m"],
        ["Expires","May 6, 2026 · 1:10 PM UTC"],["Recipient","Jane Smith"],
        ["IP Address","10.0.0.8"],["Device","MacBook Pro · macOS 14.3"]
      ]
    },
    {
      id:"vam4", category:"security", filterTag:"security",
      actor:"Unknown", actorRole:"—",
      action:"Screenshot attempt detected during active session",
      when:"May 5, 2026 · 4:31 PM UTC", local:"12:31 PM EDT",
      badgeLabel:"SCREENSHOT BLOCKED", vaultName:"Medical Records", dateGroup:"Yesterday",
      details:[
        ["Triggered By","System · Screenshot API"],["Session ID","SES-7E3B21"],
        ["Action Taken","Screenshot blocked, members notified"],
        ["IP Address","10.0.0.8"],["Device","MacBook Pro · macOS 14.3"]
      ]
    },
    {
      id:"vam5", category:"file", filterTag:"upload",
      actor:"Jane Smith", actorRole:"Partner A",
      action:"Uploaded Consultation_Recording.mp4 to Medical Records",
      when:"May 5, 2026 · 9:23 AM UTC", local:"5:23 AM EDT",
      badgeLabel:"FILE UPLOADED", vaultName:"Medical Records", dateGroup:"Yesterday",
      details:[
        ["File Name","Consultation_Recording.mp4"],["File Size","184 MB"],
        ["SHA-256","a3f2b9c1d4e7...e441d7fa"],["IP Address","192.168.1.42"],
        ["Device","iPhone 15 Pro · iOS 17.4"],["Session ID","SES-4F2A9B"]
      ]
    },
    {
      id:"vam6", category:"file", filterTag:"upload",
      actor:"John Doe", actorRole:"Owner",
      action:"Uploaded Allergy_Test.jpg to Medical Records",
      when:"May 4, 2026 · 11:02 AM UTC", local:"7:02 AM EDT",
      badgeLabel:"FILE UPLOADED", vaultName:"Medical Records", dateGroup:"May 4, 2026",
      details:[
        ["File Name","Allergy_Test.jpg"],["File Size","2.6 MB"],
        ["SHA-256","8c3a1f2e9b44...c72d19aa"],["IP Address","172.16.0.5"],
        ["Device","iPad Pro · iPadOS 17.3"],["Session ID","SES-2C9D44"]
      ]
    },
    {
      id:"vam7", category:"session", filterTag:"expiry",
      actor:"Jane Smith", actorRole:"Partner A",
      action:"Session expired — access window closed after 4 hours",
      when:"May 4, 2026 · 1:10 PM UTC", local:"9:10 AM EDT",
      badgeLabel:"SESSION EXPIRED", vaultName:"Medical Records", dateGroup:"May 4, 2026",
      details:[
        ["Session ID","SES-4F2A9B"],["Duration","4h 00m"],
        ["Expired","May 4, 2026 · 1:10 PM UTC"],
        ["Recipient","Jane Smith"],["IP Address","192.168.1.42"],
        ["Device","iPhone 15 Pro · iOS 17.4"]
      ]
    },
    {
      id:"vam8", category:"member", filterTag:"access",
      actor:"John Doe", actorRole:"Owner",
      action:"Invited Jane Smith as Partner A to Medical Records",
      when:"Mar 5, 2026 · 3:15 PM UTC", local:"11:15 AM EDT",
      badgeLabel:"MEMBER INVITED", vaultName:"Medical Records", dateGroup:"Mar 5, 2026",
      details:[
        ["Invited","Jane Smith"],["Email","jane.smith@example.com"],
        ["Role","Partner A"],["Invite Code","INV-9034"],
        ["IP Address","192.168.1.42"],["Device","iPhone 15 Pro · iOS 17.4"]
      ]
    },
    {
      id:"vam9", category:"vault", filterTag:"access",
      actor:"John Doe", actorRole:"Owner",
      action:"Created vault Medical Records",
      when:"Mar 1, 2026 · 10:00 AM UTC", local:"6:00 AM EDT",
      badgeLabel:"VAULT CREATED", vaultName:"Medical Records", dateGroup:"Mar 1, 2026",
      details:[
        ["Vault ID","VLT-MED-0031"],["Consent Level","100%"],
        ["Plan","Couple Free"],["Encryption","AES-256 end-to-end"],
        ["IP Address","192.168.1.42"],["Device","iPhone 15 Pro · iOS 17.4"]
      ]
    },
  ],
  family: [
    {
      id:"vaf1", category:"consent_request", filterTag:"consent",
      actor:"Jane Smith", actorRole:"Member",
      action:"Requested temporary access to Family Documents",
      when:"May 6, 2026 · 8:30 AM UTC", local:"4:30 AM EDT",
      badgeLabel:"REQUESTED", vaultName:"Family Documents", dateGroup:"Today",
      details:[
        ["Consent ID","CON-9201"],["Duration Requested","8 hours"],
        ["Reason","Need to review insurance documents for renewal"],
        ["Approvals Needed","3 of 3"],["IP Address","10.0.0.14"],
        ["Device","iPhone 14 · iOS 17.2"]
      ]
    },
    {
      id:"vaf2", category:"consent_declined", filterTag:"consent",
      actor:"Mia Brown", actorRole:"Member",
      action:"Declined access request from Jane Smith",
      when:"May 5, 2026 · 9:05 AM UTC", local:"5:05 AM EDT",
      badgeLabel:"DECLINED", vaultName:"Family Documents", dateGroup:"Yesterday",
      details:[
        ["Consent ID","CON-9201"],["Declined By","Mia Brown"],
        ["Reason","Not provided"],["IP Address","172.20.1.9"],
        ["Device","Samsung Galaxy S24 · Android 14"]
      ]
    },
    {
      id:"vaf3", category:"file", filterTag:"upload",
      actor:"Jane Smith", actorRole:"Member",
      action:"Uploaded Property_Deed.pdf to Family Documents",
      when:"Apr 2, 2026 · 7:14 PM UTC", local:"3:14 PM EDT",
      badgeLabel:"FILE UPLOADED", vaultName:"Family Documents", dateGroup:"Apr 2, 2026",
      details:[
        ["File Name","Property_Deed.pdf"],["File Size","2.4 MB"],
        ["SHA-256","f1c8a3b7e2d9...44ab7c12"],["IP Address","192.168.0.5"],
        ["Device","iPhone 15 Pro · iOS 17.4"],["Session ID","SES-A1C3F8"]
      ]
    },
    {
      id:"vaf4", category:"vault", filterTag:"access",
      actor:"John Doe", actorRole:"Owner",
      action:"Created vault Family Documents",
      when:"Feb 2, 2026 · 10:00 AM UTC", local:"6:00 AM EDT",
      badgeLabel:"VAULT CREATED", vaultName:"Family Documents", dateGroup:"Feb 2, 2026",
      details:[
        ["Vault ID","VLT-FAM-0012"],["Consent Level","100%"],
        ["Plan","Family Free"],["Encryption","AES-256 end-to-end"],
        ["IP Address","192.168.1.42"],["Device","iPhone 15 Pro · iOS 17.4"]
      ]
    },
  ],
  legal: [
    {
      id:"val1", category:"consent_approved", filterTag:"consent",
      actor:"Mike Johnson", actorRole:"Partner B",
      action:"Approved access request for opposing counsel review",
      when:"May 6, 2026 · 11:22 AM UTC", local:"7:22 AM EDT",
      badgeLabel:"APPROVED", vaultName:"Company Legal Files", dateGroup:"Today",
      details:[
        ["Consent ID","CON-7741"],["Approval #","2 of 3"],
        ["Reason","Opposing counsel document review — case #2024-881"],
        ["Duration","8 hours"],["IP Address","10.10.0.55"],
        ["Device","MacBook Air · macOS 14.2"]
      ]
    },
    {
      id:"val2", category:"consent_approved", filterTag:"consent",
      actor:"Tom Brown", actorRole:"Partner C",
      action:"Approved access request from Sarah Williams",
      when:"May 5, 2026 · 4:10 PM UTC", local:"12:10 PM EDT",
      badgeLabel:"APPROVED", vaultName:"Company Legal Files", dateGroup:"Yesterday",
      details:[
        ["Consent ID","CON-7741"],["Approval #","1 of 3"],
        ["Reason","Routine document access for case filing"],
        ["Duration","8 hours"],["IP Address","172.16.1.33"],
        ["Device","Windows 11 · Chrome 124"]
      ]
    },
    {
      id:"val3", category:"consent_request", filterTag:"consent",
      actor:"Sarah Williams", actorRole:"Associate",
      action:"Requested temporary access to Company Legal Files",
      when:"May 5, 2026 · 3:58 PM UTC", local:"11:58 AM EDT",
      badgeLabel:"REQUESTED", vaultName:"Company Legal Files", dateGroup:"Yesterday",
      details:[
        ["Consent ID","CON-7741"],["Duration Requested","8 hours"],
        ["Reason","Routine document access for case filing"],
        ["Approvals Needed","3 of 4 (75%)"],["IP Address","10.0.2.8"],
        ["Device","MacBook Pro · macOS 14.4"]
      ]
    },
    {
      id:"val4", category:"session", filterTag:"expiry",
      actor:"Sarah Williams", actorRole:"Associate",
      action:"Session expired — access window closed after 8 hours",
      when:"May 4, 2026 · 11:58 PM UTC", local:"7:58 PM EDT",
      badgeLabel:"SESSION EXPIRED", vaultName:"Company Legal Files", dateGroup:"May 4, 2026",
      details:[
        ["Session ID","SES-B9E4F2"],["Duration","8h 00m"],
        ["Expired","May 4, 2026 · 11:58 PM UTC"],
        ["Recipient","Sarah Williams"],["IP Address","10.0.2.8"],
        ["Device","MacBook Pro · macOS 14.4"]
      ]
    },
    {
      id:"val5", category:"security", filterTag:"security",
      actor:"Unknown", actorRole:"—",
      action:"Unauthorized access attempt — wrong PIN entered 3 times",
      when:"Apr 14, 2026 · 2:17 AM UTC", local:"10:17 PM EDT",
      badgeLabel:"FAILED LOGIN", vaultName:"Company Legal Files", dateGroup:"Apr 14, 2026",
      details:[
        ["Attempts","3 of 5 (threshold)"],["Action Taken","Drive auto-locked"],
        ["Members Notified","John Doe, Mike Johnson, Tom Brown"],
        ["IP Address","94.102.49.190"],["Device","Unknown · Chrome 122"],
        ["Geo","Frankfurt, DE"]
      ]
    },
  ],
  business: [
    {
      id:"vab1", category:"file", filterTag:"upload",
      actor:"Ana Vega", actorRole:"Finance Lead",
      action:"Uploaded Q1_Report_2026.xlsx to Financials",
      when:"May 6, 2026 · 10:15 AM UTC", local:"6:15 AM EDT",
      badgeLabel:"FILE UPLOADED", vaultName:"Nirvana Business", dateGroup:"Today",
      details:[
        ["File Name","Q1_Report_2026.xlsx"],["File Size","1.2 MB"],
        ["SHA-256","d7e1c3a9f4b2...88cd4102"],["IP Address","10.0.1.22"],
        ["Device","MacBook Pro · macOS 14.4"],["Session ID","SES-C5A811"]
      ]
    },
    {
      id:"vab2", category:"consent_approved", filterTag:"consent",
      actor:"Mike Johnson", actorRole:"Co-Owner",
      action:"Approved access request from Sarah Williams",
      when:"May 5, 2026 · 2:44 PM UTC", local:"10:44 AM EDT",
      badgeLabel:"APPROVED", vaultName:"Nirvana Business", dateGroup:"Yesterday",
      details:[
        ["Consent ID","CON-3301"],["Approval #","2 of 3"],
        ["Reason","Quarterly payroll reconciliation"],["Duration","8 hours"],
        ["IP Address","10.0.1.5"],["Device","MacBook Air · macOS 14.3"]
      ]
    },
    {
      id:"vab3", category:"session", filterTag:"expiry",
      actor:"Sarah Williams", actorRole:"HR Manager",
      action:"Session expired — access window closed after 8 hours",
      when:"May 5, 2026 · 10:44 PM UTC", local:"6:44 PM EDT",
      badgeLabel:"SESSION EXPIRED", vaultName:"Nirvana Business", dateGroup:"Yesterday",
      details:[
        ["Session ID","SES-E7D920"],["Duration","8h 00m"],
        ["Expired","May 5, 2026 · 10:44 PM UTC"],
        ["Recipient","Sarah Williams"],["IP Address","10.0.2.88"],
        ["Device","Windows 11 · Chrome 124"]
      ]
    },
    {
      id:"vab4", category:"vault", filterTag:"access",
      actor:"John Doe", actorRole:"Owner",
      action:"Created vault Nirvana Business",
      when:"Mar 10, 2026 · 9:00 AM UTC", local:"5:00 AM EDT",
      badgeLabel:"VAULT CREATED", vaultName:"Nirvana Business", dateGroup:"Mar 10, 2026",
      details:[
        ["Vault ID","VLT-BIZ-0007"],["Consent Level","75%"],
        ["Plan","Business Free"],["Encryption","AES-256 end-to-end"],
        ["IP Address","192.168.1.42"],["Device","iPhone 15 Pro · iOS 17.4"]
      ]
    },
  ],
  project: [
    {
      id:"vap1", category:"file", filterTag:"upload",
      actor:"Mike Johnson", actorRole:"Member",
      action:"Uploaded Handoff_Doc.pdf to Project Archive",
      when:"May 5, 2026 · 3:40 PM UTC", local:"11:40 AM EDT",
      badgeLabel:"FILE UPLOADED", vaultName:"Project Archive", dateGroup:"Yesterday",
      details:[
        ["File Name","Handoff_Doc.pdf"],["File Size","1.2 MB"],
        ["SHA-256","2b9c4f1a8e3d...77fe3b90"],["IP Address","10.0.0.31"],
        ["Device","MacBook Pro · macOS 14.1"],["Session ID","SES-D3F011"]
      ]
    },
    {
      id:"vap2", category:"vault", filterTag:"access",
      actor:"John Doe", actorRole:"Owner",
      action:"Created vault Project Archive",
      when:"Feb 1, 2026 · 9:00 AM UTC", local:"5:00 AM EDT",
      badgeLabel:"VAULT CREATED", vaultName:"Project Archive", dateGroup:"Feb 1, 2026",
      details:[
        ["Vault ID","VLT-PRJ-0044"],["Consent Level","75%"],
        ["Plan","Business Free"],["Encryption","AES-256 end-to-end"],
        ["IP Address","192.168.1.42"],["Device","iPhone 15 Pro · iOS 17.4"]
      ]
    },
  ]
};

const FILTERS = [
  {id:"all",      label:"All"},
  {id:"upload",   label:"Uploads"},
  {id:"consent",  label:"Consent"},
  {id:"access",   label:"Access"},
  {id:"views",    label:"Views"},
  {id:"expiry",   label:"Expiry"},
  {id:"security", label:"Security"},
];

// ── Event icon ─────────────────────────────────────────────────────

function EventIcon({category, size=36}) {
  const cfg = EVENT_CFG[category] || EVENT_CFG.vault;
  const icon = {
    vault:            <DatabaseIcon size={15} style={{color:cfg.color}}/>,
    member:           <UsersIcon    size={15} style={{color:cfg.color}}/>,
    file:             <FileIcon     size={15} style={{color:cfg.color}}/>,
    consent_request:  <KeyIcon      size={15} style={{color:cfg.color}}/>,
    consent_approved: <CheckIcon    size={15} stroke={2.5} style={{color:cfg.color}}/>,
    consent_declined: <XIcon        size={15} style={{color:cfg.color}}/>,
    session:          <LockIcon     size={15} style={{color:cfg.color}}/>,
    security:         <ShieldIcon   size={15} style={{color:cfg.color}}/>,
  }[category];

  return (
    <div style={{width:size, height:size, borderRadius:size/2,
      background:cfg.bg, display:"flex", alignItems:"center",
      justifyContent:"center", flexShrink:0}}>
      {icon}
    </div>
  );
}

// ── Single log entry row ───────────────────────────────────────────

function ActivityEntry({entry, onTap}) {
  const cfg = EVENT_CFG[entry.category] || EVENT_CFG.vault;
  const isSec = entry.category === "security";

  return (
    <div onClick={() => onTap(entry)}
      style={{
        display:"flex", alignItems:"flex-start", gap:12,
        padding:"12px 16px",
        background: isSec ? "rgba(139,26,26,0.035)" : "transparent",
        borderLeft:`3px solid ${cfg.border}`,
        cursor:"pointer"
      }}>
      <EventIcon category={entry.category}/>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:13, fontWeight:700, marginBottom:1,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
          {entry.actor}
          <span style={{fontWeight:400, color:"var(--text-muted)"}}>
            {" — "}{entry.actorRole}
          </span>
        </div>
        <div style={{fontSize:13, color:"var(--text)", lineHeight:1.35,
          marginBottom:4,
          display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden"}}>
          {entry.action}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:5, flexWrap:"wrap"}}>
          <span style={{fontSize:11, color:"var(--text-muted)"}}>{entry.when}</span>
          <span style={{fontSize:11, color:"var(--text-soft)"}}>·</span>
          <span style={{fontSize:10, fontWeight:700, letterSpacing:"0.3px",
            padding:"2px 6px", borderRadius:4,
            background:cfg.bg, color:cfg.color}}>
            {entry.badgeLabel}
          </span>
        </div>
      </div>
      <ChevronRightIcon size={14} style={{color:"var(--ios-gray3)",
        flexShrink:0, marginTop:3}}/>
    </div>
  );
}

// ── Detail bottom sheet ────────────────────────────────────────────

function ActivityDetail({entry, onClose}) {
  const cfg = EVENT_CFG[entry.category] || EVENT_CFG.vault;
  const [copied, setCopied] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const copyId = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet" style={{maxHeight:"88vh", overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>

        {/* Event header */}
        <div style={{padding:"8px 16px 14px", display:"flex", alignItems:"center", gap:12}}>
          <EventIcon category={entry.category} size={44}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11, fontWeight:700, letterSpacing:"0.8px",
              color:cfg.color, marginBottom:3}}>{entry.badgeLabel}</div>
            <div style={{fontSize:16, fontWeight:700, letterSpacing:"-0.3px",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {entry.actor}
            </div>
            <div style={{fontSize:13, color:"var(--text-muted)", marginTop:1}}>
              {entry.actorRole} · {entry.vaultName}
            </div>
          </div>
        </div>

        <div className="ios-section-hdr">Event Details</div>
        <div className="ios-card">
          {[["Timestamp (UTC)", entry.when], ["Local Time", entry.local], ["Vault", entry.vaultName],
            ...entry.details
          ].map(([k,v], i, arr) => (
            <div key={k+i} style={{display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", padding:"11px 16px",
              borderBottom: i<arr.length-1 ? "0.5px solid var(--sep-strong)" : "none", gap:12}}>
              <span style={{fontSize:14, color:"var(--text-muted)", flexShrink:0}}>{k}</span>
              <span style={{fontSize: k==="SHA-256"?11:14, fontWeight:500, textAlign:"right",
                wordBreak:"break-all", fontFamily: k==="SHA-256"?"monospace":"inherit",
                color:"var(--text)"}}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{padding:"16px 16px 8px", display:"flex", flexDirection:"column", gap:10}}>
          <button onClick={copyId}
            style={{width:"100%", padding:"13px", borderRadius:12,
              background: copied ? "rgba(52,199,89,0.12)" : "rgba(0,122,255,0.1)",
              color: copied ? "var(--ios-green)" : "var(--ios-blue)",
              fontSize:15, fontWeight:600, fontFamily:"inherit", minHeight:44,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
            {copied ? <CheckIcon size={16} stroke={2.5}/> : <KeyIcon size={16}/>}
            {copied ? "Event ID Copied" : "Copy Event ID"}
          </button>
          <button onClick={() => setFlagged(f=>!f)}
            style={{width:"100%", padding:"13px", borderRadius:12,
              background: flagged ? "rgba(255,59,48,0.1)" : "rgba(120,120,128,0.1)",
              color: flagged ? "var(--ios-red)" : "var(--text-muted)",
              fontSize:15, fontWeight:600, fontFamily:"inherit", minHeight:44,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
            <ShieldIcon size={16}/>
            {flagged ? "Entry Flagged" : "Flag This Entry"}
          </button>
        </div>
        <div style={{height:8}}/>
      </div>
    </div>
  );
}

// ── Vault Activity Log sheet ───────────────────────────────────────

function VaultActivityLog({vault, onClose}) {
  const [detail,  setDetail]  = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  const allEntries = VAULT_ACTIVITY[vault.id] || [];

  // Filter
  const filtered = allEntries.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      e.actor.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.badgeLabel.toLowerCase().includes(q);

    const matchFilter =
      filter === "all"      ? true :
      filter === "upload"   ? e.filterTag === "upload" :
      filter === "consent"  ? e.filterTag === "consent" :
      filter === "access"   ? e.filterTag === "access" :
      filter === "views"    ? e.filterTag === "views" :
      filter === "expiry"   ? e.filterTag === "expiry" :
      filter === "security" ? e.filterTag === "security" : true;

    return matchSearch && matchFilter;
  });

  // Group by dateGroup, preserving order (newest first)
  const grouped = [];
  const seen = {};
  filtered.forEach(e => {
    if (!seen[e.dateGroup]) {
      seen[e.dateGroup] = true;
      grouped.push({ dateGroup: e.dateGroup, entries: [] });
    }
    grouped[grouped.length - 1].entries.push(e);
  });
  // Ensure each group only contains its own date
  const groupMap = {};
  filtered.forEach(e => {
    if (!groupMap[e.dateGroup]) groupMap[e.dateGroup] = [];
    groupMap[e.dateGroup].push(e);
  });
  const dateOrder = [];
  filtered.forEach(e => {
    if (!dateOrder.includes(e.dateGroup)) dateOrder.push(e.dateGroup);
  });

  return (
    <>
      <div className="ios-overlay" style={{zIndex:300}}
        onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
        <div className="ios-sheet" style={{
          height:"93vh", display:"flex", flexDirection:"column"
        }}>

          {/* Pull handle */}
          <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0",flexShrink:0}}>
            <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
          </div>

          {/* ── Sticky header ── */}
          <div style={{flexShrink:0, paddingBottom:0}}>
            {/* Title row */}
            <div style={{display:"flex", alignItems:"center",
              justifyContent:"space-between", padding:"10px 16px 8px"}}>
              <div style={{fontSize:20, fontWeight:700, letterSpacing:"-0.4px"}}>
                Activity Log
              </div>
              <button onClick={onClose}
                style={{fontSize:16, fontWeight:600, color:"var(--ios-blue)",
                  minHeight:"auto", padding:"4px 0"}}>
                Done
              </button>
            </div>

            {/* Search bar */}
            <div style={{padding:"0 16px 10px"}}>
              <div style={{display:"flex", alignItems:"center", gap:8,
                background:"rgba(120,120,128,0.12)", borderRadius:10, padding:"8px 12px"}}>
                <ActivityIcon size={15} style={{color:"var(--ios-gray)",flexShrink:0}}/>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search events, actors…"
                  style={{flex:1, border:"none", background:"transparent",
                    fontSize:15, outline:"none", color:"var(--text)",
                    fontFamily:"inherit"}}
                />
                {search ? (
                  <button onClick={() => setSearch("")}
                    style={{color:"var(--ios-gray)",minHeight:"auto",padding:0}}>
                    <XIcon size={14}/>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Filter chips */}
            <div style={{
              display:"flex", gap:7, overflowX:"auto",
              padding:"0 16px 12px",
              WebkitOverflowScrolling:"touch",
              scrollbarWidth:"none"
            }}>
              {FILTERS.map(f => {
                const active = filter === f.id;
                return (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    style={{
                      flexShrink:0, padding:"6px 14px", borderRadius:99,
                      fontSize:13, fontWeight:active?600:500,
                      fontFamily:"inherit", minHeight:"auto",
                      background: active ? "var(--ios-blue)" : "rgba(120,120,128,0.12)",
                      color: active ? "white" : "var(--text)",
                      border:"none", whiteSpace:"nowrap",
                      transition:"background 140ms, color 140ms"
                    }}>
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{height:"0.5px", background:"var(--sep-strong)", margin:"0 0 0 0"}}/>
          </div>

          {/* ── Scrollable entry list ── */}
          <div style={{flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch"}}>
            {filtered.length === 0 ? (
              <div style={{padding:"48px 16px", textAlign:"center"}}>
                <div style={{fontSize:17, fontWeight:600, marginBottom:6,
                  color:"var(--text)"}}>No Results</div>
                <div style={{fontSize:14, color:"var(--text-muted)"}}>
                  Try a different filter or search term.
                </div>
              </div>
            ) : dateOrder.map(dg => (
              <div key={dg}>
                {/* Date section header */}
                <div style={{
                  padding:"10px 16px 6px",
                  fontSize:12, fontWeight:700,
                  letterSpacing:"0.3px",
                  color:"var(--text-muted)",
                  background:"var(--bg)",
                  textTransform:"uppercase"
                }}>
                  {dg}
                </div>

                {/* Entries for this date */}
                <div style={{background:"var(--card)", margin:"0 16px",
                  borderRadius:12, overflow:"hidden",
                  boxShadow:"0 1px 0 rgba(0,0,0,0.05)"}}>
                  {groupMap[dg].map((e, idx) => (
                    <div key={e.id}
                      style={{borderBottom: idx<groupMap[dg].length-1
                        ? "0.5px solid var(--sep-strong)" : "none"}}>
                      <ActivityEntry entry={e} onTap={setDetail}/>
                    </div>
                  ))}
                </div>
                <div style={{height:12}}/>
              </div>
            ))}
            <div style={{height:16}}/>
          </div>
        </div>
      </div>

      {detail && <ActivityDetail entry={detail} onClose={() => setDetail(null)}/>}
    </>
  );
}
