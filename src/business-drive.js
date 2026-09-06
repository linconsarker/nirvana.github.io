// ── Business Drive Overview Page ──────────────────────────────────

function BDSection({children, style}) {
  return <div style={{padding:"0 20px", ...style}}>{children}</div>;
}

function BDLabel({color, children}) {
  return (
    <div style={{fontSize:11, fontWeight:700, letterSpacing:"1px",
      color, textTransform:"uppercase", marginBottom:8}}>
      {children}
    </div>
  );
}

function BDHeading({children}) {
  return (
    <div style={{fontSize:22, fontWeight:800, letterSpacing:"-0.5px",
      lineHeight:1.2, marginBottom:10, color:"var(--text)"}}>
      {children}
    </div>
  );
}

function BDBody({children}) {
  return (
    <div style={{fontSize:15, color:"var(--text-muted)", lineHeight:1.6}}>
      {children}
    </div>
  );
}

// ── Vault state pill indicator ─────────────────────────────────────

function StateFlow() {
  const states = [
    { label:"Locked",  color:"#8E8E93", bg:"rgba(142,142,147,0.12)", icon:<LockIcon size={13}/> },
    { label:"Pending", color:"#FF9500", bg:"rgba(255,149,0,0.12)",   icon:<ClockIcon size={13}/> },
    { label:"Session", color:"#34C759", bg:"rgba(52,199,89,0.12)",   icon:<UnlockIcon size={13}/> },
    { label:"Expired", color:"#FF3B30", bg:"rgba(255,59,48,0.12)",   icon:<XIcon size={13}/> },
  ];
  return (
    <div style={{display:"flex", alignItems:"center", gap:4, flexWrap:"nowrap",
      overflowX:"auto", WebkitOverflowScrolling:"touch", padding:"2px 0"}}>
      {states.map((s, i) => (
        <React.Fragment key={s.label}>
          <div style={{display:"flex", alignItems:"center", gap:5,
            padding:"7px 12px", borderRadius:99, flexShrink:0,
            background:s.bg, color:s.color, fontSize:12, fontWeight:600}}>
            {s.icon}{s.label}
          </div>
          {i < states.length - 1 && (
            <ChevronRightIcon size={12} style={{color:"var(--ios-gray3)", flexShrink:0}}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Workflow step ──────────────────────────────────────────────────

function WorkflowStep({n, icon, title, body, color}) {
  return (
    <div style={{display:"flex", gap:14, padding:"14px 0",
      borderBottom:"0.5px solid var(--sep-strong)"}}>
      <div style={{width:36, height:36, borderRadius:10,
        background:`${color}18`, color, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center"}}>
        {icon}
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:3}}>
          <span style={{fontSize:10, fontWeight:700, letterSpacing:"0.5px",
            color:"var(--text-muted)"}}>STEP {n}</span>
        </div>
        <div style={{fontSize:15, fontWeight:700, marginBottom:3}}>{title}</div>
        <div style={{fontSize:13, color:"var(--text-muted)", lineHeight:1.45}}>{body}</div>
      </div>
    </div>
  );
}

// ── Use-case row ───────────────────────────────────────────────────

function UseCase({icon, industry, example}) {
  return (
    <div style={{display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0",
      borderBottom:"0.5px solid var(--sep-strong)"}}>
      <div style={{width:36, height:36, borderRadius:10,
        background:"rgba(88,86,214,0.1)", color:"#5856D6", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center"}}>
        {icon}
      </div>
      <div>
        <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>{industry}</div>
        <div style={{fontSize:13, color:"var(--text-muted)", lineHeight:1.4}}>{example}</div>
      </div>
    </div>
  );
}

// ── Audit log sample row ───────────────────────────────────────────

function AuditSample({dot, label, actor, time}) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:10,
      padding:"10px 0", borderBottom:"0.5px solid var(--sep-strong)"}}>
      <div style={{width:8, height:8, borderRadius:4, background:dot, flexShrink:0}}/>
      <div style={{flex:1, minWidth:0}}>
        <span style={{fontSize:13, fontWeight:600}}>{actor}</span>
        <span style={{fontSize:13, color:"var(--text-muted)"}}> {label}</span>
      </div>
      <span style={{fontSize:11, color:"var(--text-muted)", flexShrink:0}}>{time}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

function BusinessDrivePage({vault, onEnter, onClose}) {
  return (
    <div className="ios-overlay" style={{zIndex:200, alignItems:"stretch"}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{
        width:"100%", height:"100%",
        background:"var(--bg)", overflowY:"auto",
        WebkitOverflowScrolling:"touch",
        display:"flex", flexDirection:"column"
      }}>

        {/* Nav bar */}
        <div style={{
          position:"sticky", top:0, zIndex:10,
          background:"rgba(242,242,247,0.88)",
          backdropFilter:"saturate(180%) blur(20px)",
          WebkitBackdropFilter:"saturate(180%) blur(20px)",
          borderBottom:"0.5px solid var(--sep-strong)",
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          padding:"0 16px", height:44
        }}>
          <button onClick={onClose}
            style={{fontSize:16, color:"var(--ios-blue)", fontWeight:400,
              minHeight:"auto", padding:"4px 0"}}>
            Cancel
          </button>
          <span style={{fontSize:16, fontWeight:600, letterSpacing:"-0.3px"}}>
            Business Drive
          </span>
          <div style={{width:60}}/>
        </div>

        {/* ── Hero ── */}
        <div style={{
          background:"linear-gradient(160deg,#0a0a0a 0%,#1a1a2e 60%,#16213e 100%)",
          padding:"40px 20px 36px"
        }}>
          <div style={{width:56, height:56, borderRadius:14,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.18)",
            display:"flex", alignItems:"center", justifyContent:"center",
            marginBottom:20}}>
            <DatabaseIcon size={26} style={{color:"white"}}/>
          </div>
          <div style={{fontSize:28, fontWeight:800, letterSpacing:"-0.8px",
            color:"white", lineHeight:1.15, marginBottom:12}}>
            Shared encrypted workspace. Every document protected by consent.
          </div>
          <div style={{fontSize:15, color:"rgba(255,255,255,0.6)", lineHeight:1.6}}>
            No file can be shared, accessed externally, or acted upon without the
            explicit approval of everyone who owns the vault.
          </div>

          {/* Vault state strip */}
          <div style={{marginTop:24}}>
            <StateFlow/>
          </div>
        </div>

        {/* ── How it works ── */}
        <div style={{background:"var(--card)", margin:"16px 16px 0",
          borderRadius:14, padding:"4px 16px 0", overflow:"hidden"}}>
          <div style={{padding:"14px 0 10px"}}>
            <BDLabel color="var(--ios-blue)">How it works</BDLabel>
            <div style={{fontSize:17, fontWeight:700, letterSpacing:"-0.3px"}}>
              The core loop
            </div>
          </div>
          {[
            {
              n:1, color:"#5856D6", icon:<UploadIcon size={16}/>,
              title:"Upload & Encrypt",
              body:"A member uploads a document. The vault encrypts it instantly — nothing outside the vault membership can see it."
            },
            {
              n:2, color:"#FF9500", icon:<KeyIcon size={16}/>,
              title:"Submit Access Request",
              body:"When a file needs to be shared externally — with a bank, lawyer, or regulator — a member submits a request specifying the recipient, files, and duration."
            },
            {
              n:3, color:"#007AFF", icon:<UsersIcon size={16}/>,
              title:"Owners Review & Decide",
              body:"Every vault owner receives a notification. They review who is asking, which files, who the recipient is, and for how long. They approve or decline."
            },
            {
              n:4, color:"#34C759", icon:<UnlockIcon size={16}/>,
              title:"Session Opens",
              body:"Once the required approvals are met, a time-limited session is created. The recipient receives a secure link scoped to the approved files only."
            },
            {
              n:5, color:"#FF3B30", icon:<XIcon size={16}/>,
              title:"Session Expires",
              body:"When the window closes — automatically or manually — the link dies. Access is permanently gone. The document never left the vault."
            },
          ].map((s, i, arr) => (
            <div key={s.n} style={{borderBottom: i<arr.length-1 ? undefined : "none"}}>
              <WorkflowStep {...s}/>
            </div>
          ))}
        </div>

        {/* ── What makes it different ── */}
        <div style={{margin:"16px 16px 0", padding:"16px",
          background:"rgba(88,86,214,0.07)",
          border:"1px solid rgba(88,86,214,0.18)",
          borderRadius:14}}>
          <BDLabel color="#5856D6">vs. a shared drive</BDLabel>
          <BDHeading>Sharing a file is a governed event.</BDHeading>
          <BDBody>
            In a regular shared drive, sharing means losing control permanently.
            Anyone with the link can access it, forward it, and keep it forever.
            Here, every share requires consent, carries an expiry, is scoped to a
            specific recipient and specific files — and leaves a permanent record.
          </BDBody>
        </div>

        {/* ── Who it's for ── */}
        <div style={{background:"var(--card)", margin:"16px 16px 0",
          borderRadius:14, padding:"4px 16px 0", overflow:"hidden"}}>
          <div style={{padding:"14px 0 10px"}}>
            <BDLabel color="#5856D6">Built for</BDLabel>
            <div style={{fontSize:17, fontWeight:700, letterSpacing:"-0.3px"}}>
              Any business with sensitive shared documents
            </div>
          </div>
          {[
            { icon:<UsersIcon size={16}/>,  industry:"Law Firms",
              example:"Both partners must authorize sharing a client file with opposing counsel." },
            { icon:<FileIcon size={16}/>,   industry:"Medical Clinics",
              example:"Patient records require documented consent before leaving the system." },
            { icon:<DatabaseIcon size={16}/>, industry:"Startups",
              example:"All co-founders must agree before an investor sees the cap table." },
            { icon:<SettingsIcon size={16}/>, industry:"Engineering Firms",
              example:"Drawings released to contractors for a fixed bidding window only." },
            { icon:<ShieldIcon size={16}/>, industry:"HR Consultancies",
              example:"Employee data shared only with the employee's explicit approval." },
          ].map((u, i, arr) => (
            <div key={u.industry}
              style={{borderBottom: i<arr.length-1 ? undefined : "none"}}>
              <UseCase {...u}/>
            </div>
          ))}
        </div>

        {/* ── Audit log ── */}
        <div style={{margin:"16px 16px 0"}}>
          <div style={{background:"#0a0a0a", borderRadius:14,
            padding:"18px 16px 4px", overflow:"hidden"}}>
            <BDLabel color="#AF52DE">The audit log is the product</BDLabel>
            <div style={{fontSize:17, fontWeight:700, letterSpacing:"-0.3px",
              color:"white", marginBottom:8, lineHeight:1.3}}>
              Every action is a tamper-proof, timestamped record.
            </div>
            <div style={{fontSize:13, color:"rgba(255,255,255,0.5)",
              lineHeight:1.5, marginBottom:16}}>
              Exportable as a PDF compliance report — usable as a malpractice
              defense, a GDPR record, due diligence disclosure, or legal evidence.
            </div>
            {[
              {dot:"#AF52DE", label:"uploaded Q1_Report_2026.xlsx", actor:"Ana Vega", time:"9 min ago"},
              {dot:"#FF9500", label:"requested access — 8h session", actor:"Sarah Williams", time:"2h ago"},
              {dot:"#007AFF", label:"approved access request", actor:"Mike Johnson", time:"2h ago"},
              {dot:"#34C759", label:"session opened — 3 files, 8h", actor:"System", time:"2h ago"},
              {dot:"#FF3B30", label:"session expired", actor:"System", time:"Yesterday"},
            ].map((a, i, arr) => (
              <div key={a.label+i}
                style={{borderBottom: i<arr.length-1
                  ? "0.5px solid rgba(255,255,255,0.08)" : "none"}}>
                <div style={{display:"flex", alignItems:"center", gap:10,
                  padding:"10px 0"}}>
                  <div style={{width:8, height:8, borderRadius:4,
                    background:a.dot, flexShrink:0}}/>
                  <div style={{flex:1, minWidth:0}}>
                    <span style={{fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.9)"}}>
                      {a.actor}
                    </span>
                    <span style={{fontSize:12, color:"rgba(255,255,255,0.45)"}}>
                      {" "}{a.label}
                    </span>
                  </div>
                  <span style={{fontSize:11, color:"rgba(255,255,255,0.35)",
                    flexShrink:0}}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{padding:"20px 16px 40px", display:"flex",
          flexDirection:"column", gap:10}}>
          <button onClick={onEnter}
            className="ios-btn ios-btn-blue"
            style={{gap:8}}>
            <UnlockIcon size={17}/> Open Business Drive
          </button>
          <div style={{fontSize:12, color:"var(--text-muted)", textAlign:"center",
            lineHeight:1.5}}>
            Consent threshold: {vault.consent}% · {vault.members.length} members ·
            AES-256 encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
