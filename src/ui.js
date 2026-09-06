// iOS-style shared UI primitives

function ModalShell({children, onClose, width=480}) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="ios-overlay" onClick={onClose}>
      <div className="ios-sheet" onClick={e => e.stopPropagation()}>
        <div className="ios-sheet-handle"/>
        {children}
      </div>
    </div>
  );
}

function Toast({toast}) {
  if (!toast) return null;
  const icon = toast.kind === "success"
    ? <CheckIcon size={18} style={{color:"var(--ios-green)"}}/>
    : toast.kind === "danger"
    ? <XIcon size={18} style={{color:"var(--ios-red)"}}/>
    : <ShieldIcon size={18} style={{color:"var(--ios-blue)"}}/>;
  return (
    <div className="ios-toast">
      {icon}
      <span style={{flex:1}}>{toast.msg}</span>
    </div>
  );
}

function HelpFab() { return null; }

function PrimaryButton({children, onClick, full, disabled}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`ios-btn ios-btn-blue${disabled?" ios-btn-muted":""}`}
      style={{width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1}}>
      {children}
    </button>
  );
}

function MutedButton({children}) {
  return (
    <button disabled className="ios-btn ios-btn-muted">
      {children}
    </button>
  );
}

function SecondaryButton({children, onClick}) {
  return (
    <button onClick={onClick}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
        gap:6,padding:"10px 18px",borderRadius:10,
        background:"rgba(120,120,128,0.12)",color:"var(--text)",
        fontSize:15,fontWeight:500,minHeight:44,fontFamily:"inherit"}}>
      {children}
    </button>
  );
}

function StatusBadge({unlocked, status}) {
  if (status === "pending_setup")
    return <span className="ios-badge" style={{background:"var(--ios-orange)"}}>Setup</span>;
  return (
    <span className="ios-badge" style={{background: unlocked ? "var(--ios-green)" : "var(--ios-red)"}}>
      {unlocked ? "Open" : "Locked"}
    </span>
  );
}

function InlineMeta({icon, children}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,color:"var(--text-muted)",fontSize:13}}>
      {icon}{children}
    </div>
  );
}

function FieldLabel({children, required, style}) {
  return (
    <div style={{fontSize:13,fontWeight:400,color:"var(--text-muted)",padding:"0 0 6px 4px",...(style||{})}}>
      {children}{required && <span style={{color:"var(--ios-red)",marginLeft:3}}>*</span>}
    </div>
  );
}

function SectionTitle({children, style}) {
  return (
    <div style={{fontSize:17,fontWeight:600,marginBottom:12,...(style||{})}}>
      {children}
    </div>
  );
}

function SelectCard({selected, onClick, children, locked}) {
  if (locked) {
    return (
      <div style={{position:"relative",padding:"14px 16px",borderRadius:12,
        background:"var(--card)",opacity:0.5,userSelect:"none",cursor:"not-allowed",marginBottom:8}}>
        <div style={{position:"absolute",top:10,right:12,background:"var(--ios-gray6)",
          borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,color:"var(--text-muted)"}}>
          Plus+
        </div>
        {children}
      </div>
    );
  }
  return (
    <button onClick={onClick}
      style={{display:"block",width:"100%",textAlign:"left",padding:"14px 16px",
        borderRadius:12,border:`2px solid ${selected?"var(--ios-blue)":"rgba(0,0,0,0)"}`,
        background:selected?"rgba(0,122,255,0.06)":"var(--card)",
        marginBottom:8,fontFamily:"inherit",transition:"all 140ms"}}>
      {children}
    </button>
  );
}

function IconTile({children, tone}) {
  const t = {
    neutral: {bg:"rgba(120,120,128,0.12)", fg:"var(--ios-gray)"},
    success: {bg:"rgba(52,199,89,0.15)",   fg:"var(--ios-green)"},
    danger:  {bg:"rgba(255,59,48,0.12)",   fg:"var(--ios-red)"}
  }[tone||"neutral"];
  return (
    <div style={{width:38,height:38,borderRadius:10,background:t.bg,color:t.fg,
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      {children}
    </div>
  );
}

function ReviewRow({label, value}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",fontSize:15,
      padding:"11px 16px",borderBottom:"0.5px solid var(--sep-strong)"}}>
      <span style={{color:"var(--text-muted)"}}>{label}</span>
      <span style={{fontWeight:500,textAlign:"right",color:"var(--text)",maxWidth:"55%"}}>{value||"—"}</span>
    </div>
  );
}

function Panel({children}) {
  return (
    <div className="ios-panel">{children}</div>
  );
}

function PanelHeader({icon, children}) {
  return (
    <div className="ios-panel-hdr">{icon}{children}</div>
  );
}

function IconButton({children, onClick, active}) {
  return (
    <button onClick={onClick}
      style={{width:34,height:34,borderRadius:17,
        background:active?"rgba(0,122,255,0.12)":"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",
        color:"var(--ios-blue)",minHeight:"auto"}}>
      {children}
    </button>
  );
}

function IOSToggle({value, onChange}) {
  return (
    <button onClick={onChange} className="ios-toggle"
      style={{background: value ? "var(--ios-green)" : "var(--ios-gray4)"}}>
      <div className="ios-toggle-thumb" style={{left: value ? 22 : 2}}/>
    </button>
  );
}

function IOSSection({header, footer, children}) {
  return (
    <div className="ios-section">
      {header && <div className="ios-section-hdr">{header}</div>}
      <div className="ios-card">{children}</div>
      {footer && <div className="ios-section-ftr">{footer}</div>}
    </div>
  );
}
