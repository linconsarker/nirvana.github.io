function VaultCard({vault, onOpen, onRequestAccess, onSetup}) {
  const status = getVaultStatus(vault);

  const handlePress = () => {
    if (status.isUnlocked) return onOpen(vault.id);
    if (status.isPendingSetup) return onSetup && onSetup(vault.id);
    if (status.isRequestPending) return;
    return onRequestAccess(vault.id);
  };

  return (
    <div style={{
      background:"var(--card)", borderRadius:16, overflow:"hidden",
      display:"flex", flexDirection:"column",
      boxShadow:"0 1px 0 rgba(0,0,0,0.06)"
    }}
      onTouchStart={e => e.currentTarget.style.opacity="0.82"}
      onTouchEnd={e => e.currentTarget.style.opacity="1"}>

      {/* Top area */}
      <div style={{padding:"16px 14px 12px"}}>
        {/* Icon + status badge row */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div style={{width:44,height:44,borderRadius:12,background:status.iconBg,
            color:status.iconColor,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <DatabaseIcon size={20}/>
          </div>
          <StatusBadge unlocked={status.isUnlocked} status={vault.status}/>
        </div>

        {/* Name */}
        <div style={{fontSize:15,fontWeight:700,letterSpacing:"-0.3px",
          lineHeight:1.25,marginBottom:3,
          display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
          {vault.name}
        </div>
        <div style={{fontSize:12,color:"var(--text-muted)",
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {vault.description}
        </div>
      </div>

      {/* Meta row */}
      <div style={{padding:"0 14px 10px",display:"flex",gap:10}}>
        <InlineMeta icon={<UsersIcon size={11}/>} style={{fontSize:11}}>
          {vault.members.length}
        </InlineMeta>
        <InlineMeta icon={<FileIcon size={11}/>} style={{fontSize:11}}>
          {vault.files.length} files
        </InlineMeta>
      </div>

      {/* Action button */}
      <div style={{borderTop:"0.5px solid var(--sep-strong)",padding:"10px 14px"}}>
        <button onClick={handlePress}
          disabled={status.actionDisabled}
          style={{width:"100%",padding:"8px",borderRadius:9,
            background:status.actionBg, color:status.actionTextColor,
            fontSize:13,fontWeight:600,fontFamily:"inherit",minHeight:"auto"}}>
          {status.actionLabel}
        </button>
      </div>
    </div>
  );
}

function Dashboard({vaults, onCreate, onOpen, onRequestAccess, onSetup}) {
  return (
    <div style={{paddingBottom:16}}>
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(2,1fr)",
        gap:12, padding:"12px 16px 0"
      }}>
        {vaults.map(v =>
          <VaultCard key={v.id} vault={v}
            onOpen={onOpen}
            onRequestAccess={onRequestAccess}
            onSetup={onSetup}/>
        )}
      </div>
    </div>
  );
}
