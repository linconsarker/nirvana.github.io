const VAULT_CATEGORY_META = {
  couples: {
    label: "Couple",
    pluralLabel: "Couples",
    description: "Shared couple vault"
  },
  family: {
    label: "Family",
    pluralLabel: "Family",
    description: "Shared family vault"
  },
  business: {
    label: "Business",
    pluralLabel: "Business",
    description: "Business team vault"
  },
  creators: {
    label: "Creator",
    pluralLabel: "Creators",
    description: "Creator workspace"
  }
};

const CURRENT_USER_MEMBER = {
  id: "jd",
  name: "John Doe",
  email: "john.doe@example.com",
  initials: "JD",
  color: "#0a0a0a"
};

function getVaultCategoryMeta(category) {
  return VAULT_CATEGORY_META[category] || {
    label: "Drive",
    pluralLabel: "Drive",
    description: "Shared vault"
  };
}

function getVaultStatus(vault) {
  const isUnlocked = vault.status === "unlocked";
  const isPendingSetup = vault.status === "pending_setup";
  const isRequestPending = vault.requestState === "pending";

  return {
    isUnlocked,
    isPendingSetup,
    isRequestPending,
    actionDisabled: isRequestPending && !isUnlocked && !isPendingSetup,
    actionLabel: isUnlocked ? "Open" : isPendingSetup ? "Setup" : isRequestPending ? "Pending" : "Request",
    iconColor: isUnlocked ? "var(--ios-green)" : isPendingSetup ? "var(--ios-orange)" : "var(--ios-red)",
    iconBg: isUnlocked ? "rgba(52,199,89,0.12)" : isPendingSetup ? "rgba(255,149,0,0.12)" : "rgba(255,59,48,0.12)",
    actionBg: isRequestPending && !isUnlocked && !isPendingSetup ? "rgba(120,120,128,0.12)"
      : isPendingSetup ? "rgba(255,149,0,0.12)"
      : isUnlocked ? "rgba(0,122,255,0.1)"
      : "var(--ios-blue)",
    actionTextColor: isRequestPending && !isUnlocked && !isPendingSetup ? "var(--text-muted)"
      : isPendingSetup ? "var(--ios-orange)"
      : isUnlocked ? "var(--ios-blue)"
      : "white"
  };
}

function createSubscribedVault({category, plan, billing}) {
  const meta = getVaultCategoryMeta(category);
  return {
    id: `v${Date.now()}`,
    name: `My ${meta.label} Drive`,
    description: meta.description,
    status: "pending_setup",
    consent: 100,
    members: [CURRENT_USER_MEMBER],
    files: [],
    folders: [],
    created: "just now",
    requestState: null,
    plan,
    billing,
    category
  };
}

function createManualVault(newVaultData) {
  return {
    ...newVaultData,
    id: `v${Date.now()}`,
    status: "locked",
    files: [],
    created: "just now",
    requestState: null
  };
}

function updateVaultById(vaults, vaultId, updater) {
  return vaults.map(vault => vault.id === vaultId ? updater(vault) : vault);
}
