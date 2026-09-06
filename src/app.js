function App() {
  const [tab,            setTab]            = useState("drives");
  const [vaults,         setVaults]         = useState(INITIAL_VAULTS);
  const [consentRequests,setConsentRequests]= useState(CONSENT_REQUESTS);
  const [activity,       setActivity]       = useState(RECENT_ACTIVITY);
  const [view,           setView]           = useState({name:"dashboard"});
  const [subscribeOpen,  setSubscribeOpen]  = useState(false);
  const [createOpen,     setCreateOpen]     = useState(false);
  const [setupVaultId,   setSetupVaultId]   = useState(null);
  const [accessReqVault, setAccessReqVault] = useState(null);
  const [sessionVault,   setSessionVault]   = useState(null);
  const [toast,          setToast]          = useState(null);
  const [bizDriveVault,  setBizDriveVault]  = useState(null);
  const [driveMenuOpen,  setDriveMenuOpen]  = useState(false);

  const showToast = (msg, kind="default") => {
    setToast({msg, kind, id:Date.now()});
    setTimeout(() => setToast(null), 2800);
  };

  const handleConsentAction = (id, kind) => {
    const req = consentRequests.find(r => r.id === id);
    setConsentRequests(rs => rs.filter(r => r.id !== id));
    showToast(
      kind==="approve" ? `Approved: ${req.vaultName}` : `Declined: ${req.vaultName}`,
      kind==="approve" ? "success" : "danger"
    );
  };

  const handleRequestAccess = vaultId => {
    const vault = vaults.find(v => v.id === vaultId);
    setAccessReqVault(vault);
  };

  const handleAccessRequestSubmit = vaultId => {
    setVaults(vs => updateVaultById(vs, vaultId, v => ({...v, requestState:"pending"})));
    setAccessReqVault(null);
    showToast("Access request sent — awaiting member consent");
  };

  const handleOpenVault = vaultId => {
    const vault = vaults.find(v => v.id === vaultId);
    setSessionVault(vault);
  };

  const handleEnterVault = vaultId => {
    setView({name:"vault", id:vaultId});
    setSessionVault(null);
  };

  const handleNavigateToVault = vaultId => {
    setView({name:"vault", id:vaultId});
  };

  const handleSubscribeComplete = ({category, plan, billing}) => {
    const newVault = createSubscribedVault({category, plan, billing});
    setVaults(vs => [newVault, ...vs]);
    setSubscribeOpen(false);
    setSetupVaultId(newVault.id);
    setCreateOpen(true);
    showToast(`${getVaultCategoryMeta(category).label} Drive created`, "success");
  };

  const handleCreateVault = newVaultData => {
    if (setupVaultId) {
      setVaults(vs => updateVaultById(vs, setupVaultId, v => ({
        ...v,
        ...newVaultData,
        status:"locked",
        id:setupVaultId
      })));
      setSetupVaultId(null);
      showToast(`"${newVaultData.name}" is set up — awaiting member activation`, "success");
    } else {
      setVaults(vs => [createManualVault(newVaultData), ...vs]);
      showToast(`Drive "${newVaultData.name}" created`, "success");
    }
    setCreateOpen(false);
  };

  const handleSetupVault = vaultId => {
    setSetupVaultId(vaultId);
    setCreateOpen(true);
  };

  const currentVault = view.name === "vault" ? vaults.find(v => v.id === view.id) : null;

  return (
    <div>
      <IOSNavBar
        tab={tab}
        view={view}
        vault={currentVault}
        onBack={() => setView({name:"dashboard"})}
        onNewDrive={() => setSubscribeOpen(true)}
        onDriveMenu={() => setDriveMenuOpen(true)}
      />

      <div className="ios-page"
        style={tab==="drives" && view.name==="vault"
          ? {paddingBottom:"calc(var(--safe-bottom) + 16px)"} : undefined}>
        {tab === "drives" && view.name === "dashboard" && (
          <Dashboard
            vaults={vaults}
            onCreate={() => setSubscribeOpen(true)}
            onOpen={handleOpenVault}
            onRequestAccess={handleRequestAccess}
            onSetup={handleSetupVault}
          />
        )}
        {tab === "drives" && view.name === "vault" && currentVault && (
          <VaultDetail
            vault={currentVault}
            onBack={() => setView({name:"dashboard"})}
            onUpload={(vaultId, file) => {
              setVaults(vs => updateVaultById(vs, vaultId, v => ({...v, files:[file,...v.files]})));
              showToast(`Uploaded ${file.name}`, "success");
            }}
            onRename={(vaultId, newName) => {
              setVaults(vs => updateVaultById(vs, vaultId, v => ({...v, name:newName})));
              showToast(`Renamed to "${newName}"`, "success");
            }}
          />
        )}
        {tab === "requests" && (
          <RequestsView
            consentRequests={consentRequests}
            onConsentAction={handleConsentAction}
          />
        )}
        {tab === "activity" && <ActivityView activity={activity}/>}
        {tab === "profile" && <ProfileView/>}
      </div>

      <IOSTabBar
        tab={tab}
        setTab={t => {
          setTab(t);
          if (t === "drives") setView({name:"dashboard"});
        }}
        notifications={consentRequests.length}
        hidden={tab==="drives" && view.name==="vault"}
      />

      {subscribeOpen &&
        <SubscribeWizard onClose={() => setSubscribeOpen(false)} onComplete={handleSubscribeComplete}/>}

      {createOpen &&
        <CreateVaultWizard
          onClose={() => { setCreateOpen(false); setSetupVaultId(null); }}
          onCreate={handleCreateVault}
          vault={setupVaultId ? vaults.find(v => v.id===setupVaultId) : null}
        />}

      {accessReqVault &&
        <AccessRequestModal vault={accessReqVault} onClose={() => setAccessReqVault(null)} onSubmit={handleAccessRequestSubmit}/>}

      {sessionVault &&
        <SessionConfirmModal vault={sessionVault} onClose={() => setSessionVault(null)} onEnter={() => handleEnterVault(sessionVault.id)}/>}

      {bizDriveVault &&
        <BusinessDrivePage
          vault={bizDriveVault}
          onClose={() => setBizDriveVault(null)}
          onEnter={() => { handleEnterVault(bizDriveVault.id); setBizDriveVault(null); }}
        />}

      {driveMenuOpen && currentVault &&
        <DriveNavMenu vault={currentVault} onClose={() => setDriveMenuOpen(false)}/>}

      <Toast toast={toast}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
