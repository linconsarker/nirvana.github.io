function FileRow({file, onAction}) {
  const tc = {
    pdf:      {bg:"rgba(255,59,48,0.1)",   fg:"var(--ios-red)"},
    image:    {bg:"rgba(52,199,89,0.1)",   fg:"var(--ios-green)"},
    video:    {bg:"rgba(0,122,255,0.1)",   fg:"var(--ios-blue)"},
    audio:    {bg:"rgba(255,149,0,0.1)",   fg:"var(--ios-orange)"},
    document: {bg:"rgba(0,122,255,0.1)",   fg:"var(--ios-blue)"},
    other:    {bg:"rgba(175,82,222,0.1)",  fg:"var(--ios-purple)"}
  }[file.type] || {bg:"rgba(120,120,128,0.12)", fg:"var(--ios-gray)"};

  return (
    <div className="file-row" style={{paddingRight:0}}>
      <div style={{width:40,height:40,borderRadius:10,background:tc.bg,color:tc.fg,
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <FileIcon size={18}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:500,overflow:"hidden",
          textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file.name}</div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginTop:1}}>
          {file.size} · {file.uploadedAt}
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onAction && onAction({...file, kind:"file"}); }}
        style={{alignSelf:"stretch",width:44,minHeight:"auto",padding:0,flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"var(--ios-gray2)"}}>
        <MoreIcon size={20}/>
      </button>
    </div>
  );
}

function FolderBrowser({folderView, currentFolder, setCurrentFolder, onAction}) {
  const {node, crumbs} = folderView;
  const folders = node.folders || [];
  const files   = node.files   || [];
  const goTo    = idx => setCurrentFolder(currentFolder.slice(0, idx));
  const openFolder = id => setCurrentFolder([...currentFolder, id]);
  const isEmpty = folders.length === 0 && files.length === 0;

  return (
    <div>
      {/* Breadcrumb */}
      {crumbs.length > 1 && (
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"8px 16px",
          flexWrap:"wrap",fontSize:14}}>
          {crumbs.map((c, i) => (
            <React.Fragment key={c.id + i}>
              {i > 0 && <ChevronRightIcon size={12} style={{color:"var(--ios-gray3)"}}/>}
              <button onClick={() => goTo(i)}
                style={{color:i===crumbs.length-1?"var(--text)":"var(--ios-blue)",
                  fontWeight:i===crumbs.length-1?600:400,
                  fontSize:14,minHeight:"auto",padding:"2px 4px"}}>
                {c.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {isEmpty ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",
          padding:"48px 0",color:"var(--text-soft)"}}>
          <div style={{width:60,height:60,borderRadius:14,
            background:"rgba(120,120,128,0.1)",
            display:"flex",alignItems:"center",justifyContent:"center",
            marginBottom:12,color:"var(--ios-gray3)"}}>
            <FolderIcon size={28} stroke={1.5}/>
          </div>
          <div style={{fontSize:15,color:"var(--text-muted)"}}>Empty folder</div>
        </div>
      ) : (
        <div className="ios-card" style={{margin:"0 16px"}}>
          {folders.map((f, idx) => (
            <div key={f.id} style={{display:"flex",alignItems:"center",
              borderBottom: idx < folders.length-1 || files.length > 0
                ? "0.5px solid var(--sep-strong)" : "none",
              background:"var(--card)"}}>
              <button onClick={() => openFolder(f.id)}
                style={{display:"flex",alignItems:"center",gap:12,
                  padding:"12px 16px",background:"transparent",
                  flex:1,textAlign:"left",border:"none",fontFamily:"inherit",
                  minHeight:54,minWidth:0}}>
                <div style={{width:40,height:40,borderRadius:10,
                  background:"rgba(0,122,255,0.1)",color:"var(--ios-blue)",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <FolderIcon size={18} stroke={2}/>
                </div>
                <div style={{minWidth:0,flex:1}}>
                  <div style={{fontSize:15,fontWeight:500,overflow:"hidden",
                    textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                  <div style={{fontSize:13,color:"var(--text-muted)",marginTop:1}}>
                    {(f.folders||[]).length + (f.files||[]).length} items
                  </div>
                </div>
              </button>
              <button onClick={e => { e.stopPropagation(); onAction && onAction({...f, kind:"folder"}); }}
                style={{alignSelf:"stretch",width:44,minHeight:"auto",padding:0,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"var(--ios-gray2)"}}>
                <MoreIcon size={20}/>
              </button>
            </div>
          ))}
          {files.map((f, idx) => (
            <div key={f.id} style={{
              borderBottom: idx < files.length-1 ? "0.5px solid var(--sep-strong)" : "none"
            }}>
              <FileRow file={f} onAction={onAction}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadModal({onClose, onUpload}) {
  const [name, setName] = useState("");
  const submit = () => {
    if (!name.trim()) return;
    const ext  = name.split(".").pop().toLowerCase();
    const type = ["jpg","jpeg","png","gif","webp"].includes(ext) ? "image"
               : ["mp4","mov","avi"].includes(ext) ? "video" : "pdf";
    const sizes = ["780 KB","1.2 MB","2.4 MB","3.1 MB","640 KB"];
    onUpload({id:`new${Date.now()}`, name:name.trim(), type, size:sizes[Math.floor(Math.random()*sizes.length)], uploadedBy:"John Doe", uploadedAt:"just now"});
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="ios-sheet-nav">
        <button className="ios-sheet-nav-btn" onClick={onClose}>Cancel</button>
        <span className="ios-sheet-nav-title">Upload File</span>
        <button className="ios-sheet-nav-btn" onClick={submit}
          style={{fontWeight:600,color:name.trim()?"var(--ios-blue)":"var(--ios-gray3)"}}>
          Upload
        </button>
      </div>

      <div style={{padding:"8px 16px 0"}}>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:16}}>
          Files are encrypted before upload
        </div>

        <div className="ios-input-section">
          <div className="ios-input-row">
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Filename (e.g. Contract_2025.pdf)" autoFocus/>
          </div>
        </div>

        <div style={{marginTop:16,border:"2px dashed var(--sep-strong)",
          borderRadius:14,padding:"32px 0",textAlign:"center",
          color:"var(--text-muted)",fontSize:15,background:"rgba(120,120,128,0.06)"}}>
          <UploadIcon size={28} style={{marginBottom:8,display:"block",margin:"0 auto 10px"}}/>
          <div>Drop files here or tap to browse</div>
        </div>
      </div>
    </ModalShell>
  );
}

function VaultDetail({vault, onBack, onUpload, onRename}) {
  const [tab,           setTab]           = useState("All");
  const [uploadOpen,    setUploadOpen]    = useState(false);
  const [viewMode,      setViewMode]      = useState("folders");
  const [currentFolder, setCurrentFolder] = useState([]);
  const [actionTarget,  setActionTarget]  = useState(null);
  const [actionToast,   setActionToast]   = useState(null);

  const showActionToast = msg => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 2800);
  };

  const tabs = ["All","Images","Videos","Audios","Documents","PDFs","Others"];
  const filtered = useMemo(() => {
    const f = vault.files || [];
    if (tab === "All")       return f;
    if (tab === "PDFs")      return f.filter(x => x.type === "pdf");
    if (tab === "Images")    return f.filter(x => x.type === "image");
    if (tab === "Videos")    return f.filter(x => x.type === "video");
    if (tab === "Audios")    return f.filter(x => x.type === "audio");
    if (tab === "Documents") return f.filter(x => x.type === "document");
    if (tab === "Others")    return f.filter(x => !["pdf","image","video","audio","document"].includes(x.type));
    return f;
  }, [tab, vault.files]);

  const folderView = useMemo(() => {
    const root = {id:"root", name:vault.name, folders:vault.folders||[], files:(vault.files||[]).filter(f => !f.folderId)};
    let node = root;
    const crumbs = [{id:"root", name:vault.name}];
    for (const id of currentFolder) {
      const next = (node.folders||[]).find(f => f.id === id);
      if (!next) break;
      crumbs.push({id:next.id, name:next.name});
      node = next;
    }
    return {node, crumbs};
  }, [vault, currentFolder]);

  return (
    <div style={{animation:"fadeIn 200ms ease",paddingBottom:16}}>

      {/* Vault header */}
      <div style={{padding:"12px 16px 12px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div className="vault-meta-row" style={{margin:0}}>
            <InlineMeta icon={<UsersIcon size={13}/>}>{vault.members.length} members</InlineMeta>
            <InlineMeta icon={<FileIcon size={13}/>}>{vault.files.length} files</InlineMeta>
            <InlineMeta icon={<ShieldIcon size={13}/>}>{vault.consent}% consent</InlineMeta>
          </div>
          <StatusBadge unlocked={vault.status==="unlocked"}/>
        </div>
      </div>

      {/* File browser */}
      <div style={{margin:"0 16px"}}>
        {/* Toolbar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          marginBottom:12,gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,fontSize:15,fontWeight:600}}>
            <span>{viewMode==="categories" ? `Files (${filtered.length})` : "My Files"}</span>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,
              color:"var(--text-muted)",background:"rgba(120,120,128,0.1)",
              padding:"3px 8px",borderRadius:6}}>
              <ShieldIcon size={11}/> Encrypted
            </div>
          </div>
          <div className="ios-seg" style={{flexShrink:0}}>
            <button className={`ios-seg-btn${viewMode==="folders"?" active":""}`}
              onClick={() => setViewMode("folders")}>
              <FolderIcon size={13} style={{marginRight:4}}/>Folders
            </button>
            <button className={`ios-seg-btn${viewMode==="categories"?" active":""}`}
              onClick={() => setViewMode("categories")}>
              <GridIcon size={13} style={{marginRight:4}}/>List
            </button>
          </div>
        </div>
      </div>

      {/* Files content */}
      {viewMode === "categories" ? (
        <div>
          <div style={{padding:"0 16px 12px",display:"flex",gap:5,flexWrap:"wrap"}}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{flexShrink:0,padding:"6px 12px",borderRadius:99,
                  background:tab===t?"var(--ios-blue)":"rgba(120,120,128,0.12)",
                  color:tab===t?"white":"var(--text)",
                  fontSize:13,fontWeight:tab===t?600:400,
                  border:"none",fontFamily:"inherit",minHeight:"auto"}}>
                {t}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",
              padding:"48px 0",color:"var(--text-muted)"}}>
              <FileIcon size={36} stroke={1.3} style={{color:"var(--ios-gray4)",marginBottom:10}}/>
              <div style={{fontSize:15}}>No files in this category</div>
            </div>
          ) : (
            <div className="ios-card" style={{margin:"0 16px"}}>
              {filtered.map((f, idx) => (
                <div key={f.id}
                  style={{borderBottom:idx<filtered.length-1?"0.5px solid var(--sep-strong)":"none"}}>
                  <FileRow file={f} onAction={setActionTarget}/>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <FolderBrowser folderView={folderView}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          onAction={setActionTarget}/>
      )}

      {/* Upload FAB */}
      <button onClick={() => setUploadOpen(true)}
        style={{position:"fixed",
          bottom:"calc(var(--safe-bottom) + 20px)",
          right:"calc(20px + var(--safe-right))",
          width:56,height:56,borderRadius:28,
          background:"var(--ios-blue)",color:"white",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 24px rgba(0,122,255,0.4)",zIndex:50,minHeight:"auto",
          transition:"transform 120ms"}}
        onTouchStart={e => e.currentTarget.style.transform="scale(0.92)"}
        onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}>
        <UploadIcon size={22}/>
      </button>

      {uploadOpen   && <UploadModal onClose={() => setUploadOpen(false)}
        onUpload={file => { onUpload(vault.id, file); setUploadOpen(false); }}/>}

      {actionTarget &&
        <FileActions
          target={actionTarget}
          vault={vault}
          onClose={() => setActionTarget(null)}
          onActionSent={msg => { setActionTarget(null); showActionToast(msg); }}
        />}

      {actionToast && (
        <div className="ios-toast" style={{zIndex:500}}>
          <CheckIcon size={18} style={{color:"var(--ios-green)",flexShrink:0}}/>
          {actionToast}
        </div>
      )}
    </div>
  );
}
