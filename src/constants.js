const {useState, useEffect, useRef, useMemo} = React;

const inputStyle = {
  width: "100%", padding: "12px 16px",
  border: "none", borderRadius: 10, fontSize: 17,
  outline: "none", background: "rgba(120,120,128,0.12)",
  color: "var(--text)", fontFamily: "inherit",
  WebkitAppearance: "none"
};

const INITIAL_VAULTS = [
  // ── Couple Drive ───────────────────────────────────────────────────
  {
    id: "couple", name: "Our Shared Vault", description: "Shared documents for couples",
    status: "unlocked", consent: 100, category: "couples",
    members: [
      {id: "jd", name: "John Doe",   email: "john.doe@example.com",  initials: "JD", color: "#0a0a0a"},
      {id: "js", name: "Jane Smith", email: "jane.smith@example.com", initials: "JS", color: "#7a5af8"}
    ],
    folders: [
      {id: "cp-health", name: "Health & Medical", folders: [
        {id: "cp-bloodwork", name: "Bloodwork", folders: [], files: [
          {id: "cp-bw1", name: "CBC_Panel_Mar.pdf",    type: "pdf",   size: "320 KB", uploadedBy: "Jane Smith", uploadedAt: "5 days ago"},
          {id: "cp-bw2", name: "Lipid_Report_Feb.pdf", type: "pdf",   size: "280 KB", uploadedBy: "Jane Smith", uploadedAt: "1 month ago"}
        ]},
        {id: "cp-imaging", name: "Imaging", folders: [], files: [
          {id: "cp-mri",  name: "MRI_L_Knee.jpg",  type: "image", size: "8.2 MB", uploadedBy: "John Doe", uploadedAt: "3 weeks ago"},
          {id: "cp-xray", name: "Chest_X-Ray.jpg",  type: "image", size: "4.1 MB", uploadedBy: "John Doe", uploadedAt: "3 weeks ago"}
        ]}
      ], files: [
        {id: "cp-vax", name: "Vaccination_Record.pdf", type: "pdf", size: "480 KB", uploadedBy: "John Doe", uploadedAt: "2 weeks ago"}
      ]},
      {id: "cp-finance", name: "Finances", folders: [], files: [
        {id: "cp-tax",  name: "Tax_Return_2025.pdf",   type: "pdf",      size: "1.1 MB", uploadedBy: "John Doe",   uploadedAt: "3 weeks ago"},
        {id: "cp-bank", name: "Joint_Statement_Apr.pdf",type: "pdf",      size: "640 KB", uploadedBy: "Jane Smith", uploadedAt: "1 week ago"},
        {id: "cp-bud",  name: "Budget_2026.xlsx",      type: "document", size: "320 KB", uploadedBy: "Jane Smith", uploadedAt: "4 days ago"}
      ]},
      {id: "cp-legal", name: "Legal & Property", folders: [], files: [
        {id: "cp-deed",  name: "Property_Deed.pdf",   type: "pdf",   size: "2.4 MB", uploadedBy: "Jane Smith", uploadedAt: "1 month ago"},
        {id: "cp-marr",  name: "Marriage_Cert.pdf",   type: "pdf",   size: "890 KB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
        {id: "cp-will",  name: "Joint_Will_2025.pdf", type: "pdf",   size: "540 KB", uploadedBy: "John Doe",   uploadedAt: "3 months ago"}
      ]}
    ],
    files: [
      {id: "cp1", name: "Vaccination_Record.pdf",     type: "pdf",      size: "480 KB",  uploadedBy: "John Doe",   uploadedAt: "2 weeks ago"},
      {id: "cp2", name: "Tax_Return_2025.pdf",        type: "pdf",      size: "1.1 MB",  uploadedBy: "John Doe",   uploadedAt: "3 weeks ago"},
      {id: "cp3", name: "Marriage_Cert.pdf",          type: "pdf",      size: "890 KB",  uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
      {id: "cp4", name: "Property_Deed.pdf",          type: "pdf",      size: "2.4 MB",  uploadedBy: "Jane Smith", uploadedAt: "1 month ago"},
      {id: "cp5", name: "Passport_Scan_John.jpg",     type: "image",    size: "3.2 MB",  uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
      {id: "cp6", name: "Passport_Scan_Jane.jpg",     type: "image",    size: "3.1 MB",  uploadedBy: "Jane Smith", uploadedAt: "2 months ago"},
      {id: "cp7", name: "Budget_2026.xlsx",           type: "document", size: "320 KB",  uploadedBy: "Jane Smith", uploadedAt: "4 days ago"},
      {id: "cp8", name: "Home_Walkthrough.mp4",       type: "video",    size: "220 MB",  uploadedBy: "John Doe",   uploadedAt: "1 month ago"}
    ],
    created: "2 months ago", accessed: "2 days ago", requestState: null, plan: "couples"
  },

  // ── Family Drive ───────────────────────────────────────────────────
  {
    id: "family", name: "Family Documents", description: "Important family records and certificates",
    status: "unlocked", consent: 100, category: "family",
    members: [
      {id: "jd", name: "John Doe",   email: "john.doe@example.com",  initials: "JD", color: "#0a0a0a"},
      {id: "js", name: "Jane Smith", email: "jane.smith@example.com", initials: "JS", color: "#7a5af8"},
      {id: "mb", name: "Mia Brown",  email: "mia.brown@example.com",  initials: "MB", color: "#d97757"},
      {id: "rb", name: "Ryan Brown", email: "ryan.brown@example.com", initials: "RB", color: "#10b981"}
    ],
    folders: [
      {id: "fam-certs", name: "Certificates", folders: [], files: [
        {id: "fam-bc1",  name: "Birth_Cert_John.pdf",  type: "pdf",   size: "1.1 MB", uploadedBy: "John Doe",   uploadedAt: "1 month ago"},
        {id: "fam-bc2",  name: "Birth_Cert_Mia.pdf",   type: "pdf",   size: "980 KB", uploadedBy: "Jane Smith", uploadedAt: "1 month ago"},
        {id: "fam-marr", name: "Marriage_Cert.pdf",    type: "pdf",   size: "890 KB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"}
      ]},
      {id: "fam-property", name: "Property & Estate", folders: [], files: [
        {id: "fam-deed", name: "Property_Deed.pdf",    type: "pdf",   size: "2.4 MB", uploadedBy: "Jane Smith", uploadedAt: "1 month ago"},
        {id: "fam-will", name: "Family_Will.pdf",      type: "pdf",   size: "540 KB", uploadedBy: "John Doe",   uploadedAt: "3 months ago"},
        {id: "fam-ins",  name: "Home_Insurance.pdf",   type: "pdf",   size: "760 KB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"}
      ]},
      {id: "fam-passports", name: "Passports & IDs", folders: [], files: [
        {id: "fam-pp1", name: "Passport_John.jpg",    type: "image", size: "3.2 MB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
        {id: "fam-pp2", name: "Passport_Jane.jpg",    type: "image", size: "3.1 MB", uploadedBy: "Jane Smith", uploadedAt: "2 months ago"},
        {id: "fam-pp3", name: "Passport_Mia.jpg",     type: "image", size: "2.8 MB", uploadedBy: "Mia Brown",  uploadedAt: "2 months ago"}
      ]},
      {id: "fam-taxes", name: "Tax Records", folders: [], files: [
        {id: "fam-tx1", name: "Tax_Return_2025.pdf",  type: "pdf",      size: "1.4 MB", uploadedBy: "John Doe", uploadedAt: "3 weeks ago"},
        {id: "fam-tx2", name: "Tax_Return_2024.pdf",  type: "pdf",      size: "1.3 MB", uploadedBy: "John Doe", uploadedAt: "1 year ago"},
        {id: "fam-tx3", name: "Finance_Notes.m4a",    type: "audio",    size: "6.2 MB", uploadedBy: "Jane Smith",uploadedAt: "2 weeks ago"}
      ]}
    ],
    files: [
      {id: "fam1", name: "Birth_Cert_John.pdf",   type: "pdf",      size: "1.1 MB", uploadedBy: "John Doe",   uploadedAt: "1 month ago"},
      {id: "fam2", name: "Marriage_Cert.pdf",     type: "pdf",      size: "890 KB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
      {id: "fam3", name: "Property_Deed.pdf",     type: "pdf",      size: "2.4 MB", uploadedBy: "Jane Smith", uploadedAt: "1 month ago"},
      {id: "fam4", name: "Family_Will.pdf",       type: "pdf",      size: "540 KB", uploadedBy: "John Doe",   uploadedAt: "3 months ago"},
      {id: "fam5", name: "Passport_John.jpg",     type: "image",    size: "3.2 MB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
      {id: "fam6", name: "Passport_Jane.jpg",     type: "image",    size: "3.1 MB", uploadedBy: "Jane Smith", uploadedAt: "2 months ago"},
      {id: "fam7", name: "Tax_Return_2025.pdf",   type: "pdf",      size: "1.4 MB", uploadedBy: "John Doe",   uploadedAt: "3 weeks ago"},
      {id: "fam8", name: "Home_Insurance.pdf",    type: "pdf",      size: "760 KB", uploadedBy: "John Doe",   uploadedAt: "2 months ago"},
      {id: "fam9", name: "Family_Video_2025.mp4", type: "video",    size: "540 MB", uploadedBy: "Mia Brown",  uploadedAt: "1 month ago"}
    ],
    created: "3 months ago", accessed: "5 days ago", requestState: null, plan: "family"
  },

  // ── Business Drive ─────────────────────────────────────────────────
  {
    id: "business", name: "Nirvana Business", description: "Company contracts, financials & HR",
    status: "unlocked", consent: 100, category: "business",
    members: [
      {id: "jd", name: "John Doe",       email: "john.doe@example.com",  initials: "JD", color: "#0a0a0a"},
      {id: "mj", name: "Mike Johnson",   email: "mike.j@example.com",    initials: "MJ", color: "#10b981"},
      {id: "sw", name: "Sarah Williams", email: "sarah.w@example.com",   initials: "SW", color: "#ef4056"},
      {id: "av", name: "Ana Vega",       email: "ana.v@example.com",     initials: "AV", color: "#f59e0b"}
    ],
    folders: [
      {id: "biz-contracts", name: "Contracts", folders: [
        {id: "biz-nda", name: "NDAs", folders: [], files: [
          {id: "b-nda1", name: "NDA_ClientA_2026.pdf",  type: "pdf", size: "210 KB", uploadedBy: "John Doe",       uploadedAt: "3 days ago"},
          {id: "b-nda2", name: "NDA_VendorB_2026.pdf",  type: "pdf", size: "198 KB", uploadedBy: "Sarah Williams", uploadedAt: "1 week ago"}
        ]},
        {id: "biz-msa", name: "Service Agreements", folders: [], files: [
          {id: "b-msa1", name: "MSA_2026.pdf",          type: "pdf", size: "340 KB", uploadedBy: "John Doe",       uploadedAt: "1 week ago"},
          {id: "b-msa2", name: "Vendor_Agreement.pdf",  type: "pdf", size: "510 KB", uploadedBy: "Sarah Williams", uploadedAt: "2 weeks ago"}
        ]}
      ], files: [
        {id: "b-cov", name: "Contract_Overview.pdf", type: "pdf", size: "620 KB", uploadedBy: "John Doe", uploadedAt: "2 days ago"}
      ]},
      {id: "biz-finance", name: "Financials", folders: [], files: [
        {id: "b-q1",  name: "Q1_Report_2026.xlsx", type: "document", size: "1.2 MB", uploadedBy: "Ana Vega",     uploadedAt: "3 days ago"},
        {id: "b-bud", name: "Budget_FY26.xlsx",    type: "document", size: "880 KB", uploadedBy: "Ana Vega",     uploadedAt: "1 week ago"},
        {id: "b-rec", name: "Board_Recording.mp4", type: "video",    size: "210 MB", uploadedBy: "Mike Johnson", uploadedAt: "2 weeks ago"}
      ]},
      {id: "biz-hr", name: "HR & Payroll", folders: [], files: [
        {id: "b-pay", name: "Payroll_Apr2026.pdf",   type: "pdf",      size: "420 KB", uploadedBy: "Mike Johnson",  uploadedAt: "5 days ago"},
        {id: "b-pol", name: "HR_Policy_2026.docx",   type: "document", size: "88 KB",  uploadedBy: "Sarah Williams",uploadedAt: "3 weeks ago"},
        {id: "b-onb", name: "Onboarding_Notes.m4a",  type: "audio",    size: "9.4 MB", uploadedBy: "Mike Johnson",  uploadedAt: "1 month ago"}
      ]}
    ],
    files: [
      {id: "b1", name: "MSA_2026.pdf",          type: "pdf",      size: "340 KB", uploadedBy: "John Doe",       uploadedAt: "1 week ago"},
      {id: "b2", name: "Vendor_Agreement.pdf",  type: "pdf",      size: "510 KB", uploadedBy: "Sarah Williams", uploadedAt: "2 weeks ago"},
      {id: "b3", name: "Q1_Report_2026.xlsx",   type: "document", size: "1.2 MB", uploadedBy: "Ana Vega",       uploadedAt: "3 days ago"},
      {id: "b4", name: "Budget_FY26.xlsx",      type: "document", size: "880 KB", uploadedBy: "Ana Vega",       uploadedAt: "1 week ago"},
      {id: "b5", name: "Payroll_Apr2026.pdf",   type: "pdf",      size: "420 KB", uploadedBy: "Mike Johnson",   uploadedAt: "5 days ago"},
      {id: "b6", name: "Board_Recording.mp4",   type: "video",    size: "210 MB", uploadedBy: "Mike Johnson",   uploadedAt: "2 weeks ago"},
      {id: "b7", name: "Onboarding_Notes.m4a",  type: "audio",    size: "9.4 MB", uploadedBy: "Mike Johnson",   uploadedAt: "1 month ago"},
      {id: "b8", name: "HR_Policy_2026.docx",   type: "document", size: "88 KB",  uploadedBy: "Sarah Williams", uploadedAt: "3 weeks ago"}
    ],
    created: "2 months ago", accessed: "3 days ago", requestState: null, plan: "business"
  },

  // ── Pending Activation Drive ──────────────────────────────────────
  {
    id: "pending-setup", name: "Home & Property", description: "Shared property documents & insurance",
    status: "pending_setup", consent: 100, category: "family",
    members: [
      {id: "jd", name: "John Doe",   email: "john.doe@example.com",  initials: "JD", color: "#0a0a0a"},
      {id: "js", name: "Jane Smith", email: "jane.smith@example.com", initials: "JS", color: "#7a5af8"},
      {id: "mb", name: "Mia Brown",  email: "mia.brown@example.com",  initials: "MB", color: "#d97757"}
    ],
    folders: [], files: [],
    created: "just now", accessed: null, requestState: null, plan: "family"
  },

  // ── Pending Approval Drive ─────────────────────────────────────────
  {
    id: "pending-approval", name: "Legal & Estate", description: "Confidential legal and estate files",
    status: "locked", consent: 75, category: "family",
    members: [
      {id: "jd", name: "John Doe",       email: "john.doe@example.com",  initials: "JD", color: "#0a0a0a"},
      {id: "sw", name: "Sarah Williams", email: "sarah.w@example.com",   initials: "SW", color: "#ef4056"},
      {id: "tb", name: "Tom Brown",      email: "tom.b@example.com",     initials: "TB", color: "#3b82f6"},
      {id: "av", name: "Ana Vega",       email: "ana.v@example.com",     initials: "AV", color: "#f59e0b"}
    ],
    folders: [], files: [
      {id: "la1", name: "Estate_Plan.pdf",     type: "pdf", size: "1.1 MB", uploadedBy: "Sarah Williams", uploadedAt: "1 week ago"},
      {id: "la2", name: "Power_of_Attorney.pdf",type: "pdf", size: "640 KB", uploadedBy: "Tom Brown",      uploadedAt: "2 weeks ago"},
      {id: "la3", name: "Trust_Agreement.pdf", type: "pdf", size: "880 KB", uploadedBy: "Ana Vega",       uploadedAt: "3 weeks ago"}
    ],
    created: "3 weeks ago", accessed: null, requestState: "pending", plan: "family"
  },

  // ── Request Access Drive ──────────────────────────────────────────
  {
    id: "request-access", name: "Investment Portfolio", description: "Shared investment & asset records",
    status: "locked", consent: 75, category: "business",
    members: [
      {id: "mj", name: "Mike Johnson",   email: "mike.j@example.com",  initials: "MJ", color: "#10b981"},
      {id: "sw", name: "Sarah Williams", email: "sarah.w@example.com", initials: "SW", color: "#ef4056"},
      {id: "tb", name: "Tom Brown",      email: "tom.b@example.com",   initials: "TB", color: "#3b82f6"}
    ],
    folders: [], files: [
      {id: "inv1", name: "Portfolio_Q1_2026.pdf",  type: "pdf",      size: "1.4 MB", uploadedBy: "Mike Johnson",   uploadedAt: "1 week ago"},
      {id: "inv2", name: "Asset_Allocation.xlsx",  type: "document", size: "820 KB", uploadedBy: "Sarah Williams", uploadedAt: "2 weeks ago"},
      {id: "inv3", name: "Dividend_Report.pdf",    type: "pdf",      size: "560 KB", uploadedBy: "Tom Brown",      uploadedAt: "3 weeks ago"},
      {id: "inv4", name: "Meeting_Notes.m4a",      type: "audio",    size: "18 MB",  uploadedBy: "Mike Johnson",   uploadedAt: "1 month ago"}
    ],
    created: "1 month ago", accessed: null, requestState: null, plan: "business"
  },

  // ── Creator Drive ──────────────────────────────────────────────────
  {
    id: "creator", name: "Creator Studio", description: "Creative projects, media & brand assets",
    status: "unlocked", consent: 100, category: "creators",
    members: [
      {id: "jd", name: "John Doe",   email: "john.doe@example.com",  initials: "JD", color: "#0a0a0a"},
      {id: "lk", name: "Lisa Kim",   email: "lisa.kim@example.com",  initials: "LK", color: "#7c3aed"},
      {id: "rc", name: "Ray Chen",   email: "ray.chen@example.com",  initials: "RC", color: "#0ea5e9"}
    ],
    folders: [
      {id: "cr-brand", name: "Brand Assets", folders: [
        {id: "cr-logos", name: "Logos", folders: [], files: [
          {id: "cr-lg1", name: "Logo_Primary.png",   type: "image", size: "420 KB", uploadedBy: "Lisa Kim", uploadedAt: "2 weeks ago"},
          {id: "cr-lg2", name: "Logo_Dark.png",      type: "image", size: "380 KB", uploadedBy: "Lisa Kim", uploadedAt: "2 weeks ago"},
          {id: "cr-lg3", name: "Logo_White.png",     type: "image", size: "360 KB", uploadedBy: "Lisa Kim", uploadedAt: "2 weeks ago"}
        ]},
        {id: "cr-banners", name: "Banners", folders: [], files: [
          {id: "cr-bn1", name: "YouTube_Banner.jpg",  type: "image", size: "1.8 MB", uploadedBy: "Ray Chen", uploadedAt: "1 week ago"},
          {id: "cr-bn2", name: "Twitter_Header.jpg",  type: "image", size: "980 KB", uploadedBy: "Ray Chen", uploadedAt: "1 week ago"}
        ]}
      ], files: [
        {id: "cr-style", name: "Brand_Guidelines.pdf", type: "pdf", size: "4.2 MB", uploadedBy: "Lisa Kim", uploadedAt: "1 month ago"}
      ]},
      {id: "cr-videos", name: "Video Projects", folders: [], files: [
        {id: "cr-v1", name: "Ep12_Final_Cut.mp4",    type: "video", size: "1.4 GB", uploadedBy: "John Doe", uploadedAt: "3 days ago"},
        {id: "cr-v2", name: "Ep11_Export.mp4",       type: "video", size: "1.2 GB", uploadedBy: "John Doe", uploadedAt: "2 weeks ago"},
        {id: "cr-v3", name: "Intro_Reel_2026.mp4",   type: "video", size: "380 MB", uploadedBy: "Ray Chen", uploadedAt: "1 month ago"}
      ]},
      {id: "cr-audio", name: "Audio & Podcasts", folders: [], files: [
        {id: "cr-a1", name: "Podcast_Ep8_Raw.m4a",   type: "audio", size: "88 MB",  uploadedBy: "John Doe", uploadedAt: "5 days ago"},
        {id: "cr-a2", name: "Podcast_Ep8_Edit.m4a",  type: "audio", size: "74 MB",  uploadedBy: "Lisa Kim", uploadedAt: "4 days ago"},
        {id: "cr-a3", name: "Jingle_Final.m4a",      type: "audio", size: "8.6 MB", uploadedBy: "Ray Chen", uploadedAt: "3 weeks ago"}
      ]},
      {id: "cr-contracts", name: "Contracts & Legal", folders: [], files: [
        {id: "cr-c1", name: "Sponsorship_Deal_Apr.pdf", type: "pdf",      size: "340 KB", uploadedBy: "John Doe", uploadedAt: "1 week ago"},
        {id: "cr-c2", name: "Collab_Agreement_LK.pdf",  type: "pdf",      size: "280 KB", uploadedBy: "John Doe", uploadedAt: "2 weeks ago"},
        {id: "cr-c3", name: "Revenue_Share_Q1.xlsx",    type: "document", size: "540 KB", uploadedBy: "Lisa Kim", uploadedAt: "3 weeks ago"}
      ]}
    ],
    files: [
      {id: "cr1", name: "Ep12_Final_Cut.mp4",       type: "video",    size: "1.4 GB", uploadedBy: "John Doe", uploadedAt: "3 days ago"},
      {id: "cr2", name: "Podcast_Ep8_Edit.m4a",     type: "audio",    size: "74 MB",  uploadedBy: "Lisa Kim", uploadedAt: "4 days ago"},
      {id: "cr3", name: "Logo_Primary.png",          type: "image",    size: "420 KB", uploadedBy: "Lisa Kim", uploadedAt: "2 weeks ago"},
      {id: "cr4", name: "Brand_Guidelines.pdf",      type: "pdf",      size: "4.2 MB", uploadedBy: "Lisa Kim", uploadedAt: "1 month ago"},
      {id: "cr5", name: "Sponsorship_Deal_Apr.pdf",  type: "pdf",      size: "340 KB", uploadedBy: "John Doe", uploadedAt: "1 week ago"},
      {id: "cr6", name: "Revenue_Share_Q1.xlsx",     type: "document", size: "540 KB", uploadedBy: "Lisa Kim", uploadedAt: "3 weeks ago"},
      {id: "cr7", name: "YouTube_Banner.jpg",        type: "image",    size: "1.8 MB", uploadedBy: "Ray Chen", uploadedAt: "1 week ago"},
      {id: "cr8", name: "Jingle_Final.m4a",          type: "audio",    size: "8.6 MB", uploadedBy: "Ray Chen", uploadedAt: "3 weeks ago"}
    ],
    created: "1 month ago", accessed: "1 day ago", requestState: null, plan: "creators"
  }
];

const CONSENT_REQUESTS = [
  {id: "cr1", vaultName: "Family Documents",    requester: "Jane Smith",     when: "17 days ago", approvals: 1, total: 3},
  {id: "cr2", vaultName: "Company Legal Files", requester: "Sarah Williams", when: "17 days ago", approvals: 2, total: 4}
];

const RECENT_ACTIVITY = [
  {id: "a1", who: "Mike Johnson",   action: "approved access",            vault: "Company Legal Files", when: "17 days ago",        type: "approve"},
  {id: "a2", who: "Tom Brown",      action: "approved access",            vault: "Company Legal Files", when: "17 days ago",        type: "approve"},
  {id: "a3", who: "Sarah Williams", action: "requested access",           vault: "Company Legal Files", when: "17 days ago",        type: "request"},
  {id: "a4", who: "Jane Smith",     action: "uploaded Property_Deed.pdf", vault: "Family Documents",    when: "about 1 month ago",  type: "upload"},
  {id: "a5", who: "John Doe",       action: "uploaded Birth_Certificate.pdf", vault: "Family Documents", when: "about 1 month ago", type: "upload"}
];
