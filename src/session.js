function AccessRequestModal({vault, onClose, onSubmit}) {
  const [duration, setDuration] = useState("4h");
  const [reason,   setReason]   = useState("");
  const [sent,     setSent]     = useState(false);

  const others = vault.members.filter(m => m.id !== "jd");
  const needed = Math.ceil(vault.members.length * vault.consent / 100);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onSubmit(vault.id); onClose(); }, 1800);
  };

  if (sent) return (
    <ModalShell onClose={onClose}>
      <div style={{padding:"48px 24px",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:36,background:"rgba(52,199,89,0.12)",
          color:"var(--ios-green)",display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 20px"}}>
          <CheckIcon size={36} stroke={2.4}/>
        </div>
        <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.4px"}}>Request Sent</div>
        <div style={{fontSize:15,color:"var(--text-muted)",marginTop:10,lineHeight:1.5,
          maxWidth:280,margin:"10px auto 0"}}>
          Your request has been sent to {others.length} member{others.length!==1?"s":""}.
          You'll be notified when they respond.
        </div>
      </div>
    </ModalShell>
  );

  const DURATIONS = [["1h","1 hr"],["4h","4 hrs"],["8h","8 hrs"],["24h","24 hrs"]];

  return (
    <ModalShell onClose={onClose}>
      <div className="ios-sheet-nav">
        <button className="ios-sheet-nav-btn" onClick={onClose}>Cancel</button>
        <span className="ios-sheet-nav-title">Request Access</span>
        <div style={{width:60}}/>
      </div>

      <div style={{padding:"4px 0 0"}}>
        {/* Vault info */}
        <div style={{padding:"0 16px 16px"}}>
          <div style={{fontSize:20,fontWeight:700,letterSpacing:"-0.4px"}}>{vault.name}</div>
          <div style={{fontSize:14,color:"var(--text-muted)",marginTop:4}}>
            Requires <strong>{vault.consent}%</strong> consent — {needed} of {vault.members.length} members must approve
          </div>
        </div>

        {/* Members being notified */}
        <div className="ios-section-hdr">Notifying</div>
        <div className="ios-card">
          {others.map((m, idx) => (
            <div key={m.id} className="ios-row"
              style={{borderBottom:idx<others.length-1?undefined:"none"}}>
              <div className="member-avatar" style={{background:m.color,marginRight:12,
                width:34,height:34,borderRadius:17,fontSize:12}}>
                {m.initials}
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:500}}>{m.name}</div>
                <div style={{fontSize:13,color:"var(--text-muted)"}}>{m.email}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Duration */}
        <div style={{padding:"20px 16px 0"}}>
          <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:8}}>Session Duration</div>
          <div style={{display:"flex",gap:8}}>
            {DURATIONS.map(([id,label]) => (
              <button key={id} onClick={() => setDuration(id)}
                style={{flex:1,padding:"10px 4px",borderRadius:10,fontSize:14,
                  fontWeight:500,fontFamily:"inherit",minHeight:44,
                  background:duration===id?"var(--ios-blue)":"rgba(120,120,128,0.12)",
                  color:duration===id?"white":"var(--text)",border:"none"}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div style={{padding:"16px 16px 0"}}>
          <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:8}}>
            Purpose <span style={{color:"var(--text-soft)"}}>· optional</span>
          </div>
          <div className="ios-input-section">
            <div className="ios-input-row">
              <textarea value={reason} onChange={e => setReason(e.target.value)}
                placeholder="e.g., Need to review insurance documents for renewal..."
                style={{height:80,resize:"none",lineHeight:1.5}}/>
            </div>
          </div>
        </div>

        <div style={{padding:"20px 16px 0"}}>
          <button onClick={handleSend} className="ios-btn ios-btn-blue" style={{gap:8}}>
            <KeyIcon size={17}/> Send Access Request
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function SessionConfirmModal({vault, onClose, onEnter}) {
  const sessionId = React.useMemo(() =>
    "SES-" + Math.random().toString(36).slice(2,8).toUpperCase(), []);
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    setEntering(true);
    setTimeout(onEnter, 600);
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="ios-sheet-nav">
        <button className="ios-sheet-nav-btn" onClick={onClose}>Not now</button>
        <span className="ios-sheet-nav-title">{vault.name}</span>
        <div style={{width:70}}/>
      </div>

      <div style={{padding:"4px 0 0"}}>
        {/* Approval banner */}
        <div style={{margin:"0 16px 16px",padding:16,
          background:"rgba(52,199,89,0.1)",borderRadius:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,
            fontSize:15,fontWeight:600,color:"var(--ios-green)",marginBottom:5}}>
            <CheckIcon size={16}/> Access Approved
          </div>
          <div style={{fontSize:14,color:"rgba(52,199,89,0.9)",lineHeight:1.4}}>
            All required members have consented. All activity is logged and encrypted.
          </div>
        </div>

        {/* Session details */}
        <div className="ios-section-hdr">Session Details</div>
        <div className="ios-card">
          {[
            ["Session ID",     sessionId],
            ["Duration",       "4 hours"],
            ["Consent level",  `${vault.consent}% achieved`],
            ["Encryption",     "AES-256 end-to-end"],
            ["Active members", vault.members.length.toString()]
          ].map(([label, val], i, arr) => (
            <div key={label} style={{
              display:"flex",justifyContent:"space-between",fontSize:15,
              padding:"12px 16px",
              borderBottom:i<arr.length-1?"0.5px solid var(--sep-strong)":"none"}}>
              <span style={{color:"var(--text-muted)"}}>{label}</span>
              <span style={{fontWeight:500,color:"var(--text)"}}>{val}</span>
            </div>
          ))}
        </div>

        {/* Active members avatars */}
        <div style={{display:"flex",gap:6,padding:"16px 16px 0",flexWrap:"wrap",alignItems:"center"}}>
          {vault.members.map(m => (
            <div key={m.id} style={{position:"relative"}}>
              <div className="member-avatar"
                style={{background:m.color,border:"2px solid var(--card)",
                  boxShadow:`0 0 0 2px var(--ios-green)`}}>
                {m.initials}
              </div>
              <div style={{position:"absolute",bottom:0,right:0,width:10,height:10,
                borderRadius:5,background:"var(--ios-green)",
                border:"1.5px solid var(--card)"}}/>
            </div>
          ))}
          <span style={{fontSize:13,color:"var(--text-muted)",marginLeft:4}}>All online</span>
        </div>

        <div style={{padding:"20px 16px 0"}}>
          <button onClick={handleEnter} disabled={entering}
            className={`ios-btn ${entering?"ios-btn-gray":"ios-btn-green"}`}
            style={{gap:8}}>
            <UnlockIcon size={17}/> {entering ? "Opening vault…" : "Enter Vault"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
