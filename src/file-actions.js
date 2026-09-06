// ── File & Folder Actions ──────────────────────────────────────────
// Flow: "···" tap → FileMenuSheet → action chosen →
//   Rename / Delete → ConsentSheet
//   Share → ShareConfigSheet → ConsentSheet

// ── Helpers ───────────────────────────────────────────────────────

function ActionRow({icon, label, color, onClick, border=true}) {
  return (
    <button onClick={onClick}
      style={{width:"100%", display:"flex", alignItems:"center", gap:12,
        padding:"10px 16px", background:"var(--card)", textAlign:"left",
        border:"none", fontFamily:"inherit", cursor:"pointer",
        borderBottom: border ? "0.5px solid var(--sep-strong)" : "none",
        minHeight:44}}>
      <div style={{width:28, height:28, borderRadius:8,
        background: color==="red"   ? "rgba(255,59,48,0.12)" :
                    color==="blue"  ? "rgba(0,122,255,0.12)" :
                    color==="green" ? "rgba(52,199,89,0.12)" :
                                      "rgba(120,120,128,0.1)",
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
        <span style={{
          color: color==="red"   ? "var(--ios-red)"   :
                 color==="blue"  ? "var(--ios-blue)"  :
                 color==="green" ? "var(--ios-green)"  : "var(--ios-gray)"}}>
          {icon}
        </span>
      </div>
      <span style={{fontSize:15,
        color: color==="red" ? "var(--ios-red)" : "var(--text)"}}>
        {label}
      </span>
    </button>
  );
}

function ConsentMemberRow({member, idx, total}) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
      borderBottom: idx < total-1 ? "0.5px solid var(--sep-strong)" : "none"}}>
      <div className="member-avatar"
        style={{background:member.color, width:32, height:32,
          borderRadius:16, fontSize:12}}>
        {member.initials}
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:15}}>{member.name}</div>
        <div style={{fontSize:12, color:"var(--text-muted)",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
          {member.email}
        </div>
      </div>
      <span style={{fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:99,
        background:"rgba(255,149,0,0.12)", color:"var(--ios-orange)"}}>
        Pending
      </span>
    </div>
  );
}

// ── 1. File / Folder context menu ─────────────────────────────────

function FileMenuSheet({target, vault, onClose, onRename, onDelete, onShare}) {
  const isFolder  = target.kind === "folder";
  const canShare  = vault.category !== "couples";
  return (
    <div className="ios-overlay" style={{zIndex:310}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet">
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>

        {/* Target info */}
        <div style={{padding:"8px 16px 10px", display:"flex",
          alignItems:"center", gap:10}}>
          <div style={{width:34, height:34, borderRadius:9,
            background: isFolder ? "rgba(0,122,255,0.1)" : "rgba(120,120,128,0.1)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            {isFolder
              ? <FolderIcon size={20} style={{color:"var(--ios-blue)"}}/>
              : <FileIcon   size={20} style={{color:"var(--ios-gray)"}}/>}
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:16, fontWeight:600, overflow:"hidden",
              textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{target.name}</div>
            <div style={{fontSize:13, color:"var(--text-muted)", marginTop:2}}>
              Requires {vault.consent}% member consent
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{margin:"0 16px", borderRadius:14, overflow:"hidden"}}>
          <ActionRow icon={<EditIcon size={16}/>}   label="Rename"               color="blue"  onClick={onRename} border={canShare || true}/>
          {canShare && (
            <ActionRow icon={<UploadIcon size={16}/>} label="Share with 3rd Party" color="green" onClick={onShare}/>
          )}
          <ActionRow icon={<XIcon size={16}/>}      label="Delete"               color="red"   onClick={onDelete} border={false}/>
        </div>

        {/* Cancel */}
        <div style={{margin:"8px 16px 12px"}}>
          <button onClick={onClose}
            style={{width:"100%", padding:"11px", borderRadius:14,
              background:"var(--card)", fontSize:15, fontWeight:600,
              color:"var(--text)", fontFamily:"inherit", minHeight:44}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 2. Rename with consent ─────────────────────────────────────────

function RenameConsentSheet({target, vault, onClose, onSent}) {
  const [name, setName]   = useState(target.name);
  const [sent, setSent]   = useState(false);
  const needed = Math.ceil(vault.members.length * vault.consent / 100);
  const others = vault.members.filter(m => m.id !== "jd");

  const handleSend = () => {
    if (!name.trim() || name.trim() === target.name) return;
    setSent(true);
    setTimeout(() => { onSent(); onClose(); }, 1800);
  };

  if (sent) return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet" style={{padding:"48px 24px", textAlign:"center"}}>
        <div style={{width:68, height:68, borderRadius:34,
          background:"rgba(52,199,89,0.12)", color:"var(--ios-green)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 18px"}}>
          <CheckIcon size={32} stroke={2.5}/>
        </div>
        <div style={{fontSize:20, fontWeight:700, marginBottom:8}}>Request Sent</div>
        <div style={{fontSize:15, color:"var(--text-muted)", lineHeight:1.5}}>
          Members have been notified to approve renaming to "{name.trim()}".
        </div>
      </div>
    </div>
  );

  return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet">
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>
        <div className="ios-sheet-nav">
          <button className="ios-sheet-nav-btn" onClick={onClose}>Cancel</button>
          <span className="ios-sheet-nav-title">Rename</span>
          <div style={{width:60}}/>
        </div>

        <div style={{padding:"4px 16px 0"}}>
          <div className="ios-section-hdr">New Name</div>
          <div className="ios-card">
            <div className="ios-input-row">
              <input value={name} autoFocus
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleSend()}
                style={{fontSize:16}}/>
            </div>
          </div>

          <div className="ios-section-hdr" style={{marginTop:16}}>Consent Required</div>
          <div style={{fontSize:13, color:"var(--text-muted)", padding:"0 0 8px",
            lineHeight:1.4}}>
            Renaming requires <strong>{vault.consent}%</strong> approval —{" "}
            {needed} of {vault.members.length} members must agree.
          </div>
          <div className="ios-card">
            {others.map((m, i) => (
              <ConsentMemberRow key={m.id} member={m} idx={i} total={others.length}/>
            ))}
          </div>

          <div style={{padding:"16px 0 0"}}>
            <button onClick={handleSend}
              disabled={!name.trim() || name.trim() === target.name}
              className={`ios-btn ${(!name.trim() || name.trim()===target.name) ? "ios-btn-muted" : "ios-btn-blue"}`}
              style={{gap:8}}>
              <BellIcon size={16}/> Send Consent Request
            </button>
          </div>
        </div>
        <div style={{height:16}}/>
      </div>
    </div>
  );
}

// ── 3. Delete with consent ─────────────────────────────────────────

function DeleteConsentSheet({target, vault, onClose, onSent}) {
  const [sent, setSent]     = useState(false);
  const [confirm, setConfirm] = useState(false);
  const needed  = Math.ceil(vault.members.length * vault.consent / 100);
  const others  = vault.members.filter(m => m.id !== "jd");

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onSent(); onClose(); }, 1800);
  };

  if (sent) return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet" style={{padding:"48px 24px", textAlign:"center"}}>
        <div style={{width:68, height:68, borderRadius:34,
          background:"rgba(52,199,89,0.12)", color:"var(--ios-green)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 18px"}}>
          <CheckIcon size={32} stroke={2.5}/>
        </div>
        <div style={{fontSize:20, fontWeight:700, marginBottom:8}}>Request Sent</div>
        <div style={{fontSize:15, color:"var(--text-muted)", lineHeight:1.5}}>
          Members will be asked to approve deleting "{target.name}".
        </div>
      </div>
    </div>
  );

  return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet">
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>
        <div className="ios-sheet-nav">
          <button className="ios-sheet-nav-btn" onClick={onClose}>Cancel</button>
          <span className="ios-sheet-nav-title">Delete</span>
          <div style={{width:60}}/>
        </div>

        <div style={{padding:"4px 16px 0"}}>
          {/* Warning */}
          <div style={{padding:16, borderRadius:12, margin:"0 0 16px",
            background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.18)"}}>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6,
              fontSize:15, fontWeight:600, color:"var(--ios-red)"}}>
              <XIcon size={16}/> Permanent Deletion
            </div>
            <div style={{fontSize:14, color:"rgba(200,40,30,0.9)", lineHeight:1.4}}>
              Deleting <strong>"{target.name}"</strong> is irreversible once all members approve.
            </div>
          </div>

          <div className="ios-section-hdr">Consent Required</div>
          <div style={{fontSize:13, color:"var(--text-muted)", padding:"0 0 8px", lineHeight:1.4}}>
            Deletion requires <strong>{vault.consent}%</strong> approval —{" "}
            {needed} of {vault.members.length} members must agree.
          </div>
          <div className="ios-card">
            {others.map((m, i) => (
              <ConsentMemberRow key={m.id} member={m} idx={i} total={others.length}/>
            ))}
          </div>

          {/* Confirm toggle */}
          <div style={{display:"flex", alignItems:"center", gap:12,
            padding:"14px 0 0"}}>
            <button onClick={() => setConfirm(c => !c)}
              style={{width:22, height:22, borderRadius:5, flexShrink:0, minHeight:"auto",
                border:`2px solid ${confirm ? "var(--ios-red)" : "var(--ios-gray4)"}`,
                background: confirm ? "var(--ios-red)" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center"}}>
              {confirm && <CheckIcon size={13} stroke={3} style={{color:"white"}}/>}
            </button>
            <span style={{fontSize:13, color:"var(--text-muted)", lineHeight:1.4}}>
              I understand this action is permanent and requires member approval
            </span>
          </div>

          <div style={{padding:"14px 0 0"}}>
            <button onClick={handleSend} disabled={!confirm}
              className={`ios-btn ${confirm ? "ios-btn-red" : "ios-btn-muted"}`}
              style={{gap:8}}>
              <BellIcon size={16}/> Send Delete Request
            </button>
          </div>
        </div>
        <div style={{height:16}}/>
      </div>
    </div>
  );
}

// ── 4. Share session config → consent ─────────────────────────────

function ShareConfigSheet({target, vault, onClose, onSent}) {
  const [step,        setStep]        = useState("config"); // "config" | "consent"
  const [email,       setEmail]       = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [duration,    setDuration]    = useState("4h");
  const [permission,  setPermission]  = useState("view");
  const [sent,        setSent]        = useState(false);

  const needed = Math.ceil(vault.members.length * vault.consent / 100);
  const others = vault.members.filter(m => m.id !== "jd");

  const DURATIONS = [
    ["1h","1 hr"],["4h","4 hrs"],["8h","8 hrs"],["24h","24 hrs"],["7d","7 days"]
  ];
  const PERMS = [
    {id:"view",     label:"View Only",       sub:"Recipient can only preview"},
    {id:"download", label:"View & Download", sub:"Recipient can save a copy"},
    {id:"copy",     label:"View & Copy",     sub:"Recipient can copy content"},
  ];

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onSent(); onClose(); }, 1800);
  };

  if (sent) return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet" style={{padding:"48px 24px", textAlign:"center"}}>
        <div style={{width:68, height:68, borderRadius:34,
          background:"rgba(52,199,89,0.12)", color:"var(--ios-green)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 18px"}}>
          <CheckIcon size={32} stroke={2.5}/>
        </div>
        <div style={{fontSize:20, fontWeight:700, marginBottom:8}}>Consent Requested</div>
        <div style={{fontSize:15, color:"var(--text-muted)", lineHeight:1.5}}>
          Members will review sharing "{target.name}" with{" "}
          {recipientName || email || "the recipient"}.
        </div>
      </div>
    </div>
  );

  // ── Step 1: configure session ──────────────────────────────────
  if (step === "config") return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet" style={{maxHeight:"92vh", overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>
        <div className="ios-sheet-nav">
          <button className="ios-sheet-nav-btn" onClick={onClose}>Cancel</button>
          <span className="ios-sheet-nav-title">Share Access</span>
          <div style={{width:60}}/>
        </div>

        <div style={{padding:"0 16px"}}>
          {/* Item info */}
          <div style={{display:"flex", alignItems:"center", gap:10,
            padding:"8px 14px", borderRadius:12, background:"rgba(0,122,255,0.07)",
            marginBottom:16}}>
            <FileIcon size={16} style={{color:"var(--ios-blue)", flexShrink:0}}/>
            <span style={{fontSize:14, color:"var(--ios-blue)", fontWeight:500,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
              {target.name}
            </span>
          </div>

          {/* Recipient */}
          <div className="ios-section-hdr">Recipient</div>
          <div className="ios-card" style={{marginBottom:16}}>
            <div className="ios-input-row" style={{borderBottom:"0.5px solid var(--sep-strong)"}}>
              <input value={recipientName} onChange={e => setRecipientName(e.target.value)}
                placeholder="Full name (optional)" style={{fontSize:15}}/>
            </div>
            <div className="ios-input-row">
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" type="email" style={{fontSize:15}}/>
            </div>
          </div>

          {/* Duration */}
          <div className="ios-section-hdr">Session Duration</div>
          <div style={{display:"flex", gap:7, marginBottom:16}}>
            {DURATIONS.map(([id, label]) => (
              <button key={id} onClick={() => setDuration(id)}
                style={{flex:1, padding:"10px 4px", borderRadius:10, fontSize:13,
                  fontWeight:500, fontFamily:"inherit", minHeight:42,
                  background: duration===id ? "var(--ios-blue)" : "rgba(120,120,128,0.12)",
                  color: duration===id ? "white" : "var(--text)", border:"none"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Permissions */}
          <div className="ios-section-hdr">Permissions</div>
          <div className="ios-card" style={{marginBottom:16}}>
            {PERMS.map((p, i) => (
              <button key={p.id} onClick={() => setPermission(p.id)}
                style={{display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"13px 16px", background:"var(--card)",
                  border:"none", fontFamily:"inherit", textAlign:"left",
                  borderBottom: i<PERMS.length-1 ? "0.5px solid var(--sep-strong)" : "none",
                  minHeight:54}}>
                <div>
                  <div style={{fontSize:15, fontWeight:500}}>{p.label}</div>
                  <div style={{fontSize:12, color:"var(--text-muted)", marginTop:2}}>{p.sub}</div>
                </div>
                <div style={{width:22, height:22, borderRadius:11, flexShrink:0,
                  border:`2px solid ${permission===p.id ? "var(--ios-blue)" : "var(--ios-gray4)"}`,
                  background: permission===p.id ? "var(--ios-blue)" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center"}}>
                  {permission===p.id && <CheckIcon size={12} stroke={3} style={{color:"white"}}/>}
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => email.trim() && setStep("consent")}
            className={`ios-btn ${email.trim() ? "ios-btn-blue" : "ios-btn-muted"}`}
            style={{gap:8, marginBottom:16}}>
            <UsersIcon size={16}/> Request Member Consent
          </button>
        </div>
      </div>
    </div>
  );

  // ── Step 2: member consent ─────────────────────────────────────
  return (
    <div className="ios-overlay" style={{zIndex:320}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet" style={{maxHeight:"92vh", overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>
        <div className="ios-sheet-nav">
          <button className="ios-sheet-nav-btn" onClick={() => setStep("config")}>Back</button>
          <span className="ios-sheet-nav-title">Member Consent</span>
          <div style={{width:60}}/>
        </div>

        <div style={{padding:"0 16px"}}>
          {/* Session summary */}
          <div className="ios-section-hdr">Session Summary</div>
          <div className="ios-card" style={{marginBottom:16}}>
            {[
              ["File",        target.name],
              ["Recipient",   recipientName ? `${recipientName} (${email})` : email],
              ["Duration",    DURATIONS.find(d => d[0]===duration)?.[1] || duration],
              ["Permissions", PERMS.find(p => p.id===permission)?.label || permission],
              ["Vault",       vault.name],
            ].map(([k,v], i, arr) => (
              <div key={k} style={{display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", padding:"11px 16px",
                borderBottom: i<arr.length-1 ? "0.5px solid var(--sep-strong)" : "none",
                gap:12}}>
                <span style={{fontSize:14, color:"var(--text-muted)", flexShrink:0}}>{k}</span>
                <span style={{fontSize:14, fontWeight:500, textAlign:"right",
                  wordBreak:"break-all"}}>{v}</span>
              </div>
            ))}
          </div>

          <div className="ios-section-hdr">Awaiting Approval</div>
          <div style={{fontSize:13, color:"var(--text-muted)", padding:"0 0 8px", lineHeight:1.4}}>
            Sharing requires <strong>{vault.consent}%</strong> consent —{" "}
            {needed} of {vault.members.length} members must approve.
          </div>
          <div className="ios-card" style={{marginBottom:16}}>
            {others.map((m, i) => (
              <ConsentMemberRow key={m.id} member={m} idx={i} total={others.length}/>
            ))}
          </div>

          <button onClick={handleSend}
            className="ios-btn ios-btn-green"
            style={{gap:8, marginBottom:16}}>
            <BellIcon size={16}/> Send Consent Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 5. Orchestrator: manages which sheet is open ───────────────────

function FileActions({target, vault, onClose, onActionSent}) {
  const [mode, setMode] = useState("menu"); // "menu"|"rename"|"delete"|"share"

  const handleSent = (label) => {
    onActionSent(label);
    onClose();
  };

  if (mode === "rename") return (
    <RenameConsentSheet target={target} vault={vault}
      onClose={onClose} onSent={() => handleSent(`Rename request sent for "${target.name}"`)}/>
  );
  if (mode === "delete") return (
    <DeleteConsentSheet target={target} vault={vault}
      onClose={onClose} onSent={() => handleSent(`Delete request sent for "${target.name}"`)}/>
  );
  if (mode === "share") return (
    <ShareConfigSheet target={target} vault={vault}
      onClose={onClose} onSent={() => handleSent(`Share request sent for "${target.name}"`)}/>
  );

  return (
    <FileMenuSheet
      target={target} vault={vault}
      onClose={onClose}
      onRename={() => setMode("rename")}
      onDelete={() => setMode("delete")}
      onShare={()  => setMode("share")}
    />
  );
}
