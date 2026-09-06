function DSTitle({children}) {
  return <div style={{fontSize:17,fontWeight:700,padding:"20px 16px 8px"}}>{children}</div>;
}
function DSSub({children}) {
  return <div style={{fontSize:14,color:"var(--text-muted)",padding:"0 16px 16px",lineHeight:1.4}}>{children}</div>;
}

function MembersSection({vault}) {
  const [email,   setEmail]   = useState("");
  const [invites, setInvites] = useState([]);
  const add = () => {
    const e = email.trim().toLowerCase();
    if (!e.includes("@") || invites.includes(e)) return;
    setInvites([...invites, e]);
    setEmail("");
  };
  return (
    <div>
      <DSTitle>Members</DSTitle>
      <DSSub>New members must be approved by existing members before gaining access.</DSSub>

      <div className="ios-card">
        {vault.members.map((m, idx) => (
          <div key={m.id} className="ios-row"
            style={{borderBottom:idx<vault.members.length-1?undefined:"none"}}>
            <div className="member-avatar" style={{background:m.color,marginRight:12,
              width:34,height:34,borderRadius:17,fontSize:12}}>
              {m.initials}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15}}>{m.name}</div>
              <div style={{fontSize:13,color:"var(--text-muted)",
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.email}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:"16px 16px 0"}}>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:8}}>Invite New Member</div>
        <div className="ios-input-section">
          <div className="ios-input-row">
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              onKeyDown={e => { if(e.key==="Enter"){e.preventDefault();add();} }}/>
          </div>
        </div>
        <button onClick={add} className="ios-btn ios-btn-blue"
          style={{marginTop:10}}>
          Send Invite
        </button>
        {invites.length > 0 && (
          <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
            {invites.map(e => (
              <div key={e} style={{fontSize:14,padding:"10px 14px",
                background:"rgba(255,149,0,0.1)",border:"1px solid rgba(255,149,0,0.2)",
                borderRadius:10,color:"var(--ios-orange)"}}>
                {e} · Pending approval
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PolicySection({vault, isCouple}) {
  const [open, setOpen] = useState(null);
  const rows = [
    {id:"consent",   label:"Mutual Consent Policy",  val:isCouple?"100% (Couple, fixed)":`${vault.consent}% minimum`},
    {id:"recovery",  label:"Drive Recovery Policy",   val:"Time-Locked (30d)"},
    {id:"postdeath", label:"Post-Death Policy",        val:"Survivor Ownership"},
    {id:"exit",      label:"Account Exit Protocol",    val:"Ownership Transfer"}
  ];
  return (
    <div>
      <DSTitle>Policy & Protocols</DSTitle>
      <DSSub>Any change requires unanimous agreement from all drive members.</DSSub>
      <div className="ios-card">
        {rows.map((r, idx) => (
          <div key={r.id}>
            <button onClick={() => setOpen(open===r.id ? null : r.id)}
              style={{width:"100%",display:"flex",alignItems:"center",
                justifyContent:"space-between",padding:"14px 16px",
                background:"var(--card)",textAlign:"left",border:"none",fontFamily:"inherit",
                borderBottom:"0.5px solid var(--sep-strong)",minHeight:54}}>
              <div>
                <div style={{fontSize:15,fontWeight:500}}>{r.label}</div>
                <div style={{fontSize:13,color:"var(--text-muted)",marginTop:2}}>Current: {r.val}</div>
              </div>
              <ChevronRightIcon size={16}
                style={{color:"var(--ios-gray3)",
                  transform:open===r.id?"rotate(90deg)":"none",
                  transition:"transform 160ms",flexShrink:0}}/>
            </button>
            {open === r.id && (
              <div style={{padding:"14px 16px",background:"var(--ios-gray6)",
                borderBottom:"0.5px solid var(--sep-strong)",fontSize:14,
                color:"var(--text-muted)",lineHeight:1.5}}>
                Proposing a change opens a review flow where every member must Agree. If anyone
                Disagrees, the current policy stays in effect.
                <button style={{display:"block",marginTop:12,padding:"9px 16px",
                  borderRadius:10,background:"var(--ios-blue)",color:"white",
                  fontSize:15,fontWeight:600,fontFamily:"inherit",minHeight:"auto"}}>
                  Propose Change
                </button>
              </div>
            )}
          </div>
        ))}
        <div style={{height:1}}/>
      </div>
    </div>
  );
}

function SecuritySection({security, toggle}) {
  const items = [
    {id:"faceId",          label:"Face ID / Touch ID",           sub:"Use your device's facial or fingerprint unlock"},
    {id:"biometric",       label:"Biometric authentication",      sub:"Required before opening the drive"},
    {id:"pin",             label:"PIN / Password login",          sub:"Fallback when biometrics are unavailable"},
    {id:"screenshotBlock", label:"Screenshot blocking",           sub:"Prevents OS-level screenshots inside the drive"},
    {id:"recordingBlock",  label:"Screen recording protection",   sub:"Blocks drive content when recording is detected"},
    {id:"captureAlerts",   label:"Real-time capture alerts",      sub:"Notify all members instantly on capture attempts"},
    {id:"faceMonitor",     label:"Continuous face monitoring",    sub:"Keep verifying the authorized face during sessions"},
    {id:"autoLockMismatch",label:"Auto-lock on face mismatch",    sub:"Immediately lock drive if another face is detected"}
  ];
  return (
    <div>
      <DSTitle>Security</DSTitle>
      <DSSub>Configure how this drive protects content while it's open.</DSSub>
      <div className="ios-card">
        {items.map((it, idx) => (
          <div key={it.id} className="ios-row"
            style={{borderBottom:idx<items.length-1?undefined:"none",paddingTop:8,paddingBottom:8}}>
            <div style={{flex:1,minWidth:0,paddingRight:12}}>
              <div style={{fontSize:14,fontWeight:500}}>{it.label}</div>
              <div style={{fontSize:12,color:"var(--text-muted)",marginTop:1,lineHeight:1.3}}>
                {it.sub}
              </div>
            </div>
            <IOSToggle value={security[it.id]} onChange={() => toggle(it.id)}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorageSection({vault}) {
  const used=47, total=200, pct=(used/total)*100;
  const packs = [
    {size:"5 GB",   price:"$1/mo"}, {size:"20 GB",  price:"$2/mo"},
    {size:"50 GB",  price:"$3/mo"}, {size:"100 GB", price:"$5/mo"},
    {size:"250 GB", price:"$9/mo"}, {size:"1 TB",   price:"$19/mo"},
    {size:"2 TB",   price:"$29/mo"}
  ];
  return (
    <div>
      <DSTitle>Storage</DSTitle>
      <DSSub>Free tier includes 200 MB. Buy more to expand this drive.</DSSub>
      <div className="ios-card" style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:15}}>
          <span style={{fontWeight:600}}>{used} MB used</span>
          <span style={{color:"var(--text-muted)"}}>of {total} MB</span>
        </div>
        <div className="ios-progress">
          <div className="ios-progress-fill" style={{width:`${pct}%`}}/>
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:10}}>Add Storage</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
          {packs.map(p => (
            <button key={p.size}
              style={{padding:"14px 12px",borderRadius:12,
                background:"var(--card)",textAlign:"left",
                border:"none",fontFamily:"inherit",transition:"opacity 120ms"}}
              onTouchStart={e => e.currentTarget.style.opacity="0.7"}
              onTouchEnd={e => e.currentTarget.style.opacity="1"}>
              <div style={{fontSize:16,fontWeight:700,letterSpacing:"-0.3px"}}>{p.size}</div>
              <div style={{fontSize:13,color:"var(--ios-blue)",marginTop:3,fontWeight:500}}>
                {p.price}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpgradeSection({isCouple}) {
  const plans = isCouple
    ? [
        {id:"free", name:"Free",        price:"$0",    features:["1 Couple Drive","200 MB storage","Basic security"], current:true},
        {id:"plus", name:"Couple Plus", price:"$3/mo", features:["50 GB storage","Advanced access controls","Longer sessions","Detailed access logs"]},
        {id:"pro",  name:"Couple Pro",  price:"$5/mo", features:["200 GB storage","Panic Mode","Geo-lock access","Device-restricted access","Encrypted backup"], best:true}
      ]
    : [
        {id:"free", name:"Free",        price:"$0",     features:["1 Family Drive (2 users)","200 MB storage","Basic security"], current:true},
        {id:"plus", name:"Family Plus", price:"$6/mo",  features:["Up to 6 members","100 GB storage","Per-member access logs","Priority requests"]},
        {id:"pro",  name:"Family Pro",  price:"$10/mo", features:["500 GB storage","Panic Mode","Geo + device-locked access","Role-based permissions","Encrypted backup"], best:true}
      ];
  return (
    <div>
      <DSTitle>Upgrade Drive</DSTitle>
      <DSSub>Upgrades apply to this drive and are shared between all members.</DSSub>
      <div style={{display:"flex",flexDirection:"column",gap:12,padding:"0 0 8px"}}>
        {plans.map(p => (
          <div key={p.id}
            style={{padding:16,borderRadius:12,
              border:`2px solid ${p.best?"var(--ios-blue)":p.current?"var(--sep-strong)":"var(--sep-strong)"}`,
              background:p.current?"var(--ios-gray6)":"var(--card)",position:"relative",
              margin:"0 16px"}}>
            {p.best && (
              <span style={{position:"absolute",top:-11,left:16,
                background:"var(--ios-blue)",color:"white",
                fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99}}>
                RECOMMENDED
              </span>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16,fontWeight:700}}>{p.name}</span>
                {p.current && (
                  <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,
                    background:"var(--ios-gray5)",color:"var(--text-muted)"}}>CURRENT</span>
                )}
              </div>
              <span style={{fontSize:19,fontWeight:700,letterSpacing:"-0.4px"}}>{p.price}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {p.features.map((f, i) => (
                <div key={i} style={{fontSize:14,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <CheckIcon size={14} stroke={2.5}
                    style={{color:"var(--ios-green)",flexShrink:0,marginTop:2}}/>
                  {f}
                </div>
              ))}
            </div>
            {!p.current && (
              <button style={{marginTop:14,width:"100%",padding:"12px 0",
                borderRadius:10,background:p.best?"var(--ios-blue)":"rgba(0,122,255,0.1)",
                color:p.best?"white":"var(--ios-blue)",
                fontSize:15,fontWeight:600,fontFamily:"inherit",minHeight:44}}>
                Upgrade to {p.name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Rename Drive section ──────────────────────────────────────────

function RenameSection({vault, onDone}) {
  const [name, setName] = useState(vault.name);
  const [sent, setSent] = useState(false);
  const needed = Math.ceil(vault.members.length * vault.consent / 100);
  const others = vault.members.filter(m => m.id !== "jd");

  const handleSend = () => {
    if (!name.trim() || name.trim() === vault.name) return;
    setSent(true);
    setTimeout(onDone, 1800);
  };

  if (sent) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",
      padding:"64px 24px",textAlign:"center"}}>
      <div style={{width:68,height:68,borderRadius:34,
        background:"rgba(52,199,89,0.12)",color:"var(--ios-green)",
        display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
        <CheckIcon size={32} stroke={2.5}/>
      </div>
      <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>Request Sent</div>
      <div style={{fontSize:15,color:"var(--text-muted)",lineHeight:1.5}}>
        Members have been notified to approve renaming to "{name.trim()}".
      </div>
    </div>
  );

  return (
    <div style={{padding:"0 16px"}}>
      <DSTitle>Rename Drive</DSTitle>
      <DSSub>Requires {vault.consent}% member approval before the name changes.</DSSub>
      <div className="ios-card" style={{marginBottom:16}}>
        <div className="ios-input-row">
          <input value={name} autoFocus onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleSend()}
            style={{fontSize:16}}/>
        </div>
      </div>
      <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:8}}>
        {needed} of {vault.members.length} members must approve.
      </div>
      <div className="ios-card" style={{marginBottom:16}}>
        {others.map((m,i) => (
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,
            padding:"11px 16px",
            borderBottom:i<others.length-1?"0.5px solid var(--sep-strong)":"none"}}>
            <div className="member-avatar"
              style={{background:m.color,width:32,height:32,borderRadius:16,fontSize:12}}>
              {m.initials}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15}}>{m.name}</div>
              <div style={{fontSize:12,color:"var(--text-muted)",
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.email}</div>
            </div>
            <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:99,
              background:"rgba(255,149,0,0.12)",color:"var(--ios-orange)"}}>Pending</span>
          </div>
        ))}
      </div>
      <button onClick={handleSend}
        disabled={!name.trim() || name.trim()===vault.name}
        className={`ios-btn ${(!name.trim()||name.trim()===vault.name)?"ios-btn-muted":"ios-btn-blue"}`}
        style={{gap:8}}>
        <BellIcon size={16}/> Send Consent Request
      </button>
    </div>
  );
}

// ── Full-page shell ────────────────────────────────────────────────

function DriveSettingPageShell({title, onBack, children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"var(--bg)",zIndex:250,
      overflowY:"auto",WebkitOverflowScrolling:"touch",
      paddingTop:"calc(var(--navbar-h) + var(--safe-top))",
      paddingBottom:"calc(var(--safe-bottom) + 16px)",
      animation:"fadeIn 180ms ease"}}>
      {/* Inline navbar */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:251,
        height:"calc(var(--navbar-h) + var(--safe-top))",
        paddingTop:"var(--safe-top)",
        background:"rgba(242,242,247,0.92)",
        backdropFilter:"saturate(180%) blur(20px)",
        WebkitBackdropFilter:"saturate(180%) blur(20px)",
        borderBottom:"0.5px solid var(--sep-strong)"}}>
        <div style={{height:"var(--navbar-h)",display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 4px",position:"relative"}}>
          <button className="ios-nav-btn" onClick={onBack}
            style={{color:"var(--ios-blue)"}}>
            <ChevronRightIcon size={20} style={{transform:"rotate(180deg)",flexShrink:0}}/>
            <span>Back</span>
          </button>
          <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",
            fontSize:17,fontWeight:600,letterSpacing:"-0.4px",
            whiteSpace:"nowrap",pointerEvents:"none"}}>
            {title}
          </div>
          <div style={{width:90}}/>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Configure Drive menu sheet ─────────────────────────────────────

function DriveConfigMenu({vault, onClose, onSelect}) {
  const options = [
    {id:"rename",   icon:<EditIcon size={18}/>,     label:"Rename Drive"},
    {id:"policy",   icon:<ShieldIcon size={18}/>,   label:"Configure Policy"},
    {id:"security", icon:<LockIcon size={18}/>,     label:"Configure Security"},
    {id:"storage",  icon:<DatabaseIcon size={18}/>, label:"Storage"},
    {id:"upgrade",  icon:<SparkleIcon size={18}/>,  label:"Upgrade"},
  ];
  return (
    <div className="ios-overlay" style={{zIndex:210}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet">
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>
        <div style={{padding:"8px 16px 10px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,
            background:"rgba(0,122,255,0.1)",color:"var(--ios-blue)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <SettingsIcon size={17}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>{vault.name}</div>
            <div style={{fontSize:12,color:"var(--text-muted)",marginTop:1}}>Drive Settings</div>
          </div>
        </div>
        <div style={{margin:"0 16px",borderRadius:14,overflow:"hidden"}}>
          {options.map((opt, i) => (
            <button key={opt.id} onClick={() => onSelect(opt.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:12,
                padding:"10px 14px",background:"var(--card)",textAlign:"left",
                border:"none",fontFamily:"inherit",cursor:"pointer",
                borderBottom:i<options.length-1?"0.5px solid var(--sep-strong)":"none",
                minHeight:44}}>
              <div style={{width:28,height:28,borderRadius:8,
                background:"rgba(0,122,255,0.1)",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                color:"var(--ios-blue)"}}>
                {opt.icon}
              </div>
              <span style={{fontSize:15,flex:1}}>{opt.label}</span>
              <ChevronRightIcon size={15} style={{color:"var(--ios-gray3)",flexShrink:0}}/>
            </button>
          ))}
        </div>
        <div style={{margin:"8px 16px 12px"}}>
          <button onClick={onClose}
            style={{width:"100%",padding:"11px",borderRadius:14,
              background:"var(--card)",fontSize:15,fontWeight:600,
              color:"var(--text)",fontFamily:"inherit",minHeight:44}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DriveInfoPage ─────────────────────────────────────────────────

function DriveInfoPage({vault, onBack}) {
  const CAT_LABEL = {couples:"Couple",family:"Family",business:"Business",creators:"Creator"};
  const rows = [
    ["Drive Name",        vault.name],
    ["Description",       vault.description || "—"],
    ["Category",          CAT_LABEL[vault.category] || "Personal"],
    ["Status",            vault.status === "unlocked" ? "Unlocked" : vault.status === "pending_setup" ? "Pending Setup" : "Locked"],
    ["Consent Threshold", `${vault.consent}%`],
    ["Encryption",        "AES-256 end-to-end"],
    ["Plan",              vault.plan ? vault.plan.charAt(0).toUpperCase()+vault.plan.slice(1) : "Free"],
    ["Members",           `${(vault.members||[]).length} member${(vault.members||[]).length===1?"":"s"}`],
    ["Files",             `${(vault.files||[]).length} file${(vault.files||[]).length===1?"":"s"}`],
    ["Created",           vault.created || "—"],
    ["Last Accessed",     vault.accessed || "—"],
  ];
  return (
    <DriveSettingPageShell title="Drive Information" onBack={onBack}>
      <div className="ios-card" style={{margin:"16px 16px 0"}}>
        {rows.map(([k,v], i) => (
          <div key={k} className="ios-row"
            style={{borderBottom:i<rows.length-1?undefined:"none",paddingTop:11,paddingBottom:11}}>
            <span className="ios-row-label" style={{fontSize:14}}>{k}</span>
            <span className="ios-row-value" style={{fontSize:14,maxWidth:"55%",textAlign:"right",
              wordBreak:"break-word",lineHeight:1.35}}>{v}</span>
          </div>
        ))}
      </div>
    </DriveSettingPageShell>
  );
}

// ── DriveMembersPage ──────────────────────────────────────────────

function DriveMembersPage({vault, onBack}) {
  const [email,   setEmail]   = useState("");
  const [invites, setInvites] = useState([]);
  const [sent,    setSent]    = useState(false);

  const canInvite = email.trim().includes("@");

  const handleInvite = () => {
    if (!canInvite) return;
    setInvites(prev => [...prev, email.trim().toLowerCase()]);
    setEmail("");
    setSent(true);
    setTimeout(() => setSent(false), 2400);
  };

  return (
    <DriveSettingPageShell title="Drive Members" onBack={onBack}>
      <div style={{padding:"16px 16px 0"}}>

        {/* Invite new member */}
        <div className="ios-section-hdr" style={{paddingLeft:0,marginBottom:8}}>
          Invite New Member
        </div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:10,lineHeight:1.4}}>
          New members must be approved by existing members before gaining access.
        </div>

        {/* Email + button in one row */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{flex:1,background:"var(--card)",borderRadius:10,
            display:"flex",alignItems:"center",padding:"0 12px",
            border:"0.5px solid var(--sep-strong)"}}>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" type="email"
              style={{flex:1,border:"none",background:"transparent",fontSize:15,
                outline:"none",color:"var(--text)",fontFamily:"inherit",
                padding:"12px 0"}}
              onKeyDown={e => e.key==="Enter" && handleInvite()}/>
          </div>
          <button onClick={handleInvite} disabled={!canInvite}
            style={{flexShrink:0,padding:"0 16px",borderRadius:10,
              background: canInvite ? "var(--ios-blue)" : "rgba(120,120,128,0.18)",
              color: canInvite ? "white" : "var(--ios-gray3)",
              fontSize:14,fontWeight:600,fontFamily:"inherit",
              minHeight:46,whiteSpace:"nowrap",border:"none"}}>
            Send Invite
          </button>
        </div>

        {/* Pending invites */}
        {invites.length > 0 && (
          <div style={{marginBottom:12,display:"flex",flexDirection:"column",gap:6}}>
            {invites.map((inv, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                padding:"9px 14px",borderRadius:12,
                background:"rgba(255,149,0,0.08)",
                border:"1px solid rgba(255,149,0,0.18)"}}>
                <div style={{width:28,height:28,borderRadius:14,
                  background:"rgba(255,149,0,0.15)",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <MailIcon size={13} style={{color:"var(--ios-orange)"}}/>
                </div>
                <span style={{flex:1,fontSize:13,color:"var(--ios-orange)",overflow:"hidden",
                  textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv}</span>
                <span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:99,
                  background:"rgba(255,149,0,0.15)",color:"var(--ios-orange)",flexShrink:0}}>
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}

        {sent && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",
            borderRadius:12,background:"rgba(52,199,89,0.1)",marginBottom:12}}>
            <CheckIcon size={15} stroke={2.5} style={{color:"var(--ios-green)",flexShrink:0}}/>
            <span style={{fontSize:13,color:"var(--ios-green)",fontWeight:500}}>
              Invite sent — awaiting member approval
            </span>
          </div>
        )}

        {/* Current members */}
        <div className="ios-section-hdr" style={{paddingLeft:0,marginBottom:8,marginTop:8}}>
          Current Members
        </div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:10,lineHeight:1.4}}>
          {(vault.members||[]).length} member{(vault.members||[]).length===1?"":"s"} ·{" "}
          {vault.consent}% consent required for changes
        </div>
        <div className="ios-card" style={{marginBottom:24}}>
          {(vault.members||[]).map((m, i, arr) => (
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,
              padding:"12px 16px",
              borderBottom:i<arr.length-1?"0.5px solid var(--sep-strong)":"none"}}>
              <div className="member-avatar"
                style={{background:m.color,width:38,height:38,borderRadius:19,fontSize:13,flexShrink:0}}>
                {m.initials}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:600,overflow:"hidden",
                  textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
                <div style={{fontSize:12,color:"var(--text-muted)",overflow:"hidden",
                  textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{m.email}</div>
              </div>
              <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:99,
                flexShrink:0,
                background: i===0 ? "rgba(0,122,255,0.1)" : "rgba(120,120,128,0.1)",
                color: i===0 ? "var(--ios-blue)" : "var(--text-muted)"}}>
                {i===0 ? "Owner" : "Member"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DriveSettingPageShell>
  );
}

// ── DriveNavMenu: unified nav sheet ──────────────────────────────

function DriveNavMenu({vault, onClose}) {
  const [page, setPage] = useState(null);

  if (page === "info")     return <DriveInfoPage    vault={vault} onBack={() => setPage(null)}/>;
  if (page === "members")  return <DriveMembersPage vault={vault} onBack={() => setPage(null)}/>;
  if (page === "activity") return <VaultActivityLog vault={vault} onClose={() => setPage(null)}/>;
  if (page === "settings") return <DriveConfigPage  vault={vault} onClose={() => setPage(null)}/>;

  const options = [
    {id:"info",     icon:<ActivityIcon size={17}/>,  label:"Drive Information",  color:"var(--ios-blue)",   bg:"rgba(0,122,255,0.1)"},
    {id:"members",  icon:<UsersIcon size={17}/>,     label:"Drive Members",      color:"var(--ios-purple)", bg:"rgba(175,82,222,0.1)"},
    {id:"activity", icon:<ClockIcon size={17}/>,     label:"Drive Activity Log", color:"var(--ios-orange)", bg:"rgba(255,149,0,0.1)"},
    {id:"settings", icon:<SettingsIcon size={17}/>,  label:"Drive Settings",     color:"var(--ios-gray)",   bg:"rgba(120,120,128,0.1)"},
  ];

  return (
    <div className="ios-overlay" style={{zIndex:210}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="ios-sheet">
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--ios-gray4)"}}/>
        </div>

        {/* Drive identity */}
        <div style={{padding:"8px 16px 12px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,
            background:"rgba(0,122,255,0.1)",color:"var(--ios-blue)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <DatabaseIcon size={17}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>{vault.name}</div>
            <div style={{fontSize:12,color:"var(--text-muted)",marginTop:1}}>
              {(vault.members||[]).length} members · {vault.consent}% consent
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{margin:"0 16px",borderRadius:14,overflow:"hidden"}}>
          {options.map((opt, i) => (
            <button key={opt.id} onClick={() => setPage(opt.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:12,
                padding:"11px 14px",background:"var(--card)",textAlign:"left",
                border:"none",fontFamily:"inherit",cursor:"pointer",
                borderBottom:i<options.length-1?"0.5px solid var(--sep-strong)":"none",
                minHeight:46}}>
              <div style={{width:30,height:30,borderRadius:8,
                background:opt.bg,display:"flex",alignItems:"center",
                justifyContent:"center",flexShrink:0,color:opt.color}}>
                {opt.icon}
              </div>
              <span style={{fontSize:15,flex:1}}>{opt.label}</span>
              <ChevronRightIcon size={15} style={{color:"var(--ios-gray3)",flexShrink:0}}/>
            </button>
          ))}
        </div>

        <div style={{margin:"8px 16px 12px"}}>
          <button onClick={onClose}
            style={{width:"100%",padding:"11px",borderRadius:14,
              background:"var(--card)",fontSize:15,fontWeight:600,
              color:"var(--text)",fontFamily:"inherit",minHeight:44}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DriveConfigPage: menu + sub-pages ─────────────────────────────

function DriveConfigPage({vault, onClose}) {
  const [page, setPage] = useState(null);
  const [security, setSecurity] = useState({
    faceId:true, biometric:true, pin:true,
    screenshotBlock:true, recordingBlock:true, captureAlerts:true,
    faceMonitor:false, autoLockMismatch:false
  });
  const toggle   = k => setSecurity(s => ({...s,[k]:!s[k]}));
  const isCouple = (vault.members?.length || 2) <= 2;

  const titles = {
    rename:"Rename Drive",
    policy:"Configure Policy", security:"Configure Security",
    storage:"Storage", upgrade:"Upgrade"
  };

  if (!page) return (
    <DriveConfigMenu vault={vault} onClose={onClose} onSelect={setPage}/>
  );

  return (
    <DriveSettingPageShell title={titles[page]} onBack={() => setPage(null)}>
      {page === "rename"   && <RenameSection    vault={vault} onDone={() => setPage(null)}/>}
      {page === "policy"   && <PolicySection    vault={vault} isCouple={isCouple}/>}
      {page === "security" && <SecuritySection  security={security} toggle={toggle}/>}
      {page === "storage"  && <StorageSection   vault={vault}/>}
      {page === "upgrade"  && <UpgradeSection   isCouple={isCouple}/>}
    </DriveSettingPageShell>
  );
}
