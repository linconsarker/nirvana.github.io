// iOS Navigation Bar + Tab Bar

function IOSNavBar({tab, view, vault, onBack, onNewDrive, onDriveMenu}) {
  const isVaultDetail = tab === "drives" && view && view.name === "vault";
  const centerTitle = {
    requests: "Requests",
    activity: "Activity Log",
    profile:  "Profile"
  }[tab] || (isVaultDetail ? (vault ? vault.name : "") : "");

  return (
    <div className="ios-navbar">
      <div className="ios-navbar-inner">
        {/* Left */}
        <div style={{minWidth:90,display:"flex",alignItems:"center"}}>
          {isVaultDetail ? (
            <button className="ios-nav-btn" onClick={onBack}>
              <ChevronRightIcon size={20} style={{transform:"rotate(180deg)",flexShrink:0}}/>
              <span>Drives</span>
            </button>
          ) : tab === "drives" ? (
            <div style={{display:"flex",alignItems:"center",gap:8,paddingLeft:8}}>
              <div style={{width:30,height:30,borderRadius:8,background:"#0a0a0a",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <LockIcon size={16} style={{color:"white"}}/>
              </div>
              <span style={{fontSize:20,fontWeight:700,letterSpacing:"-0.5px",color:"var(--text)"}}>Nirvana</span>
            </div>
          ) : null}
        </div>

        {/* Center title (vault detail, requests, profile) */}
        {centerTitle ? (
          <div className="ios-navbar-title">{centerTitle}</div>
        ) : null}

        {/* Right */}
        <div style={{minWidth:90,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:2}}>
          {tab === "drives" && !isVaultDetail && (
            <button className="ios-nav-btn" onClick={onNewDrive}>
              <PlusIcon size={24}/>
            </button>
          )}
          {isVaultDetail && (
            <button className="ios-nav-btn-icon" onClick={onDriveMenu}
              style={{color:"var(--ios-blue)"}}>
              <EllipsisCircleIcon size={24}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function IOSTabBar({tab, setTab, notifications, hidden}) {
  if (hidden) return null;
  const tabs = [
    {id:"drives",   label:"Drives",   Icon:DatabaseIcon},
    {id:"requests", label:"Requests", Icon:BellIcon,     badge:notifications},
    {id:"activity", label:"Activity", Icon:ClockIcon},
    {id:"profile",  label:"Profile",  Icon:PersonIcon}
  ];
  return (
    <div className="ios-tabbar">
      {tabs.map(t => {
        const active = tab === t.id;
        const color = active ? "var(--ios-blue)" : "var(--ios-gray2)";
        return (
          <button key={t.id} className="ios-tab" onClick={() => setTab(t.id)}>
            <div style={{position:"relative"}}>
              <t.Icon size={24} stroke={active ? 2.2 : 1.8} style={{color}}/>
              {t.badge > 0 && (
                <div className="ios-tab-badge">{t.badge}</div>
              )}
            </div>
            <span className="ios-tab-label" style={{color}}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Requests tab view ─────────────────────────────────────────────

function ConsentPage({consentRequests, onConsentAction}) {
  return (
    <div style={{paddingBottom:8}}>
      <div className="ios-section">
        <div className="ios-card">
          {consentRequests.length === 0 ? (
            <div style={{padding:"48px 16px",textAlign:"center"}}>
              <div style={{width:56,height:56,borderRadius:28,
                background:"rgba(120,120,128,0.1)",display:"flex",
                alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <BellIcon size={26} style={{color:"var(--ios-gray3)"}}/>
              </div>
              <div style={{fontSize:17,fontWeight:600,marginBottom:6}}>No Pending Requests</div>
              <div style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.4}}>
                When someone requests access to a shared drive, it'll appear here.
              </div>
            </div>
          ) : consentRequests.map((r, idx) => (
            <div key={r.id}
              style={{padding:"10px 16px",
                borderBottom: idx < consentRequests.length-1 ? "0.5px solid var(--sep-strong)" : "none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:1}}>
                <div style={{fontSize:15,fontWeight:600}}>{r.vaultName}</div>
                <span style={{fontSize:12,color:"var(--text-muted)"}}>{r.approvals}/{r.total} approved</span>
              </div>
              <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:8}}>
                {r.requester} · {r.when}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={() => onConsentAction(r.id,"reject")}
                  style={{flex:1,padding:"7px",borderRadius:8,
                    background:"rgba(255,59,48,0.1)",color:"var(--ios-red)",
                    fontSize:14,fontWeight:600,fontFamily:"inherit",minHeight:34}}>
                  Decline
                </button>
                <button onClick={() => onConsentAction(r.id,"approve")}
                  style={{flex:1,padding:"7px",borderRadius:8,
                    background:"var(--ios-blue)",color:"white",
                    fontSize:14,fontWeight:600,fontFamily:"inherit",minHeight:34}}>
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityPage({activity}) {
  const dotColor = t =>
    t==="approve" ? "var(--ios-green)" :
    t==="request" ? "var(--ios-orange)" :
    t==="upload"  ? "var(--ios-blue)" : "var(--ios-gray)";

  const typeLabel = t =>
    t==="approve" ? "Approved" :
    t==="request" ? "Requested" :
    t==="upload"  ? "Uploaded" : "Action";

  return (
    <div style={{paddingBottom:8}}>
      <div className="ios-section">
        <div className="ios-card">
          {activity.length === 0 ? (
            <div style={{padding:"48px 16px",textAlign:"center",color:"var(--text-muted)",fontSize:15}}>
              No activity yet
            </div>
          ) : activity.map((item, idx) => (
            <div key={item.id}
              style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",
                borderBottom: idx < activity.length-1 ? "0.5px solid var(--sep-strong)" : "none"}}>
              <div style={{width:36,height:36,borderRadius:18,flexShrink:0,
                background: item.type==="approve" ? "rgba(52,199,89,0.12)" :
                            item.type==="request" ? "rgba(255,149,0,0.12)" :
                            item.type==="upload"  ? "rgba(0,122,255,0.12)" : "rgba(120,120,128,0.12)",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:10,height:10,borderRadius:5,background:dotColor(item.type)}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,lineHeight:1.35}}>
                  <span style={{fontWeight:600}}>{item.who}</span>
                  <span style={{color:"var(--text-muted)"}}> {item.action}</span>
                </div>
                <div style={{fontSize:13,color:"var(--text-muted)",marginTop:3}}>
                  {item.vault} · {item.when}
                </div>
              </div>
              <span style={{fontSize:12,fontWeight:600,padding:"3px 8px",borderRadius:6,flexShrink:0,
                background: item.type==="approve" ? "rgba(52,199,89,0.12)" :
                            item.type==="request" ? "rgba(255,149,0,0.12)" :
                            item.type==="upload"  ? "rgba(0,122,255,0.12)" : "rgba(120,120,128,0.1)",
                color:dotColor(item.type)}}>
                {typeLabel(item.type)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestsView({consentRequests, onConsentAction}) {
  return (
    <div style={{paddingBottom:8}}>
      <ConsentPage consentRequests={consentRequests} onConsentAction={onConsentAction}/>
    </div>
  );
}

function ActivityView({activity}) {
  return (
    <div style={{paddingBottom:8}}>
      <ActivityPage activity={activity}/>
    </div>
  );
}

// ── Profile tab view ──────────────────────────────────────────────

function ProfileView() {
  return (
    <div style={{paddingBottom:8}}>

      {/* Avatar + name */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px 16px"}}>
        <div style={{width:80,height:80,borderRadius:40,background:"var(--ios-blue)",
          color:"white",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:30,fontWeight:700,marginBottom:12}}>
          JD
        </div>
        <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.4px"}}>John Doe</div>
        <div style={{fontSize:15,color:"var(--text-muted)",marginTop:4}}>john.doe@example.com</div>
      </div>

      <div className="ios-section">
        <div className="ios-section-hdr">Account</div>
        <div className="ios-card">
          {[
            ["Plan",        "Free tier"],
            ["Member since","Feb 2025"],
            ["2FA",         "Enabled"]
          ].map(([label, val], i, arr) => (
            <div key={label} className="ios-row"
              style={{borderBottom: i < arr.length-1 ? undefined : "none"}}>
              <span className="ios-row-label">{label}</span>
              <span className="ios-row-value">{val}</span>
              <ChevronRightIcon size={16} style={{color:"var(--ios-gray3)",marginLeft:6}}/>
            </div>
          ))}
        </div>
      </div>

      <div className="ios-section">
        <div className="ios-section-hdr">Security</div>
        <div className="ios-card">
          {["Change Password","Recovery Key","Trusted Devices"].map((label, i, arr) => (
            <div key={label} className="ios-row"
              style={{borderBottom: i < arr.length-1 ? undefined : "none"}}>
              <span className="ios-row-label">{label}</span>
              <ChevronRightIcon size={16} style={{color:"var(--ios-gray3)"}}/>
            </div>
          ))}
        </div>
      </div>

      <div className="ios-section" style={{marginBottom:8}}>
        <div className="ios-card">
          <div className="ios-row" style={{borderBottom:"none"}}>
            <span className="ios-row-label" style={{color:"var(--ios-red)"}}>Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
