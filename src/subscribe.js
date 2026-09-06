// Phase 1 — Drive Subscription

const CATEGORY_META = [
  { id:"couples",  label:"For Couples",  Icon:KeyIcon,     color:"#FF3B30", bg:"rgba(255,59,48,0.1)",   desc:"Shared vault for two. Manage finances, documents, and memories together." },
  { id:"family",   label:"For Family",   Icon:UsersIcon,   color:"#AF52DE", bg:"rgba(175,82,222,0.1)",  desc:"Multi-member vault for the whole family. Share, organize, and protect together." },
  { id:"business", label:"For Business", Icon:ShieldIcon,  color:"#1C1C1E", bg:"rgba(120,120,128,0.1)", desc:"Professional vault for teams. Audit trails, compliance, and enterprise security." },
  { id:"creators", label:"For Creators", Icon:SparkleIcon, color:"#FF9500", bg:"rgba(255,149,0,0.1)",   desc:"Creator workspace. Protect your IP, collaborate, and monetize your work." }
];

const PLANS_BY_CATEGORY = {
  couples: [
    { id:"free", name:"Free",  monthly:0,     annual:0,      badge:null,
      features:["2 members","1 GB storage","AES encryption","Up to 10 files","Basic consent policy","Email support"],
      locked:["Custom consent rules","Activity logs","Time-locked recovery","Priority support","API access"] },
    { id:"plus", name:"Plus",  monthly:5.99,  annual:59.99,  badge:"Most Popular",
      features:["2 members","20 GB storage","AES-256 encryption","Unlimited files","Custom consent policy","Activity logs","Time-locked recovery","Priority support"],
      locked:["API access","Biometric lock"] },
    { id:"pro",  name:"Pro",   monthly:12.99, annual:129.99, badge:"Best Value",
      features:["2 members","Unlimited storage","Military-grade encryption","Unlimited files","Custom policies + alerts","Full audit trail","Advanced recovery","24/7 support","API access","Biometric lock"],
      locked:[] }
  ],
  family: [
    { id:"free", name:"Free",  monthly:0,     annual:0,      badge:null,
      features:["Up to 4 members","2 GB shared storage","AES encryption","Up to 20 files","Basic consent policy","Email support"],
      locked:["More members","Custom consent","Activity logs","Guest access","Priority support"] },
    { id:"plus", name:"Plus",  monthly:9.99,  annual:99.99,  badge:"Most Popular",
      features:["Up to 6 members","50 GB shared storage","AES-256 encryption","Unlimited files","Custom consent policy","Activity logs","Time-locked recovery","Priority support"],
      locked:["Guest access","API access"] },
    { id:"pro",  name:"Pro",   monthly:19.99, annual:199.99, badge:"Best Value",
      features:["Up to 10 members","Unlimited storage","Military-grade encryption","Unlimited files","Custom policies","Full audit trail","Guest access","Advanced recovery","24/7 support","API access"],
      locked:[] }
  ],
  business: [
    { id:"free", name:"Free",  monthly:0,     annual:0,      badge:null,
      features:["Up to 3 members","5 GB storage","AES encryption","Up to 50 files","Basic access controls","Email support"],
      locked:["Audit logs","Custom roles","Compliance reports","SSO integration","API access"] },
    { id:"plus", name:"Plus",  monthly:14.99, annual:149.99, badge:"Most Popular",
      features:["Up to 10 members","100 GB storage","AES-256 encryption","Unlimited files","Audit logs","Custom roles","Compliance reports","Priority support"],
      locked:["SSO integration","API access","Custom SLA"] },
    { id:"pro",  name:"Pro",   monthly:29.99, annual:299.99, badge:"Best Value",
      features:["Unlimited members","Unlimited storage","Military-grade encryption","Unlimited files","Full audit trail","SSO integration","Compliance reports","Custom roles","API access","Custom SLA","Dedicated account manager"],
      locked:[] }
  ],
  creators: [
    { id:"free", name:"Free",  monthly:0,    annual:0,     badge:null,
      features:["1 member","5 GB storage","AES encryption","Up to 50 files","Basic watermarking","Email support"],
      locked:["Collaborators","Advanced watermarking","Analytics dashboard","AI-powered tools","Monetization"] },
    { id:"plus", name:"Plus",  monthly:7.99,  annual:79.99, badge:"Most Popular",
      features:["Up to 3 collaborators","100 GB storage","AES-256 encryption","Unlimited files","Advanced watermarking","Analytics dashboard","Time-locked recovery","Priority support"],
      locked:["AI-powered tools","Monetization","API access"] },
    { id:"pro",  name:"Pro",   monthly:14.99, annual:149.99, badge:"Best Value",
      features:["Up to 5 collaborators","Unlimited storage","Military-grade encryption","Unlimited files","AI watermarking","Advanced analytics","Monetization tools","Advanced recovery","24/7 support","API access"],
      locked:[] }
  ]
};

function CategoryStep({selected, onSelect}) {
  return (
    <div style={{animation:"slideInLeft 160ms ease",padding:"0 0 8px"}}>
      <div style={{padding:"12px 0 16px"}}>
        <div style={{fontSize:17,fontWeight:700,marginBottom:6}}>What best describes you?</div>
        <div style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.5}}>
          Choose the drive type that fits your needs.
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {CATEGORY_META.map(cat => {
          const isSel = selected === cat.id;
          return (
            <button key={cat.id} onClick={() => onSelect(cat.id)}
              style={{display:"flex",flexDirection:"column",alignItems:"flex-start",padding:16,
                borderRadius:14,textAlign:"left",cursor:"pointer",transition:"all 140ms",
                background:isSel ? cat.bg : "var(--card)",border:"none",fontFamily:"inherit",
                outline:isSel ? `2px solid ${cat.color}` : "2px solid transparent"}}>
              <div style={{width:44,height:44,borderRadius:12,marginBottom:12,
                background:isSel ? cat.color : "rgba(120,120,128,0.1)",
                color:isSel ? "white" : "var(--ios-gray)",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <cat.Icon size={20}/>
              </div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4,
                color:isSel ? cat.color : "var(--text)"}}>{cat.label}</div>
              <div style={{fontSize:12,lineHeight:1.45,color:"var(--text-muted)"}}>{cat.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlanColumn({plan, billing, selected, onSelect, accent}) {
  const price = billing === "monthly" ? plan.monthly : plan.annual;
  const isRec = plan.badge === "Most Popular";
  return (
    <div style={{flex:"0 0 220px",borderRadius:14,overflow:"hidden",
      display:"flex",flexDirection:"column",transition:"all 140ms",
      border:`2px solid ${selected ? accent : isRec ? "#1C1C1E" : "var(--sep-strong)"}`,
      boxShadow:selected ? `0 0 0 3px ${accent}30` : isRec ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
      background:"var(--card)"}}>
      {/* Header */}
      <div style={{padding:"18px 16px",background:isRec?"#1C1C1E":selected?`${accent}10`:"var(--ios-gray6)"}}>
        {plan.badge && (
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",
            marginBottom:6,color:isRec?"rgba(255,255,255,0.5)":accent}}>{plan.badge}</div>
        )}
        <div style={{fontSize:17,fontWeight:700,color:isRec?"white":"var(--text)"}}>{plan.name}</div>
        <div style={{marginTop:10,display:"flex",alignItems:"baseline",gap:2}}>
          {price === 0
            ? <span style={{fontSize:30,fontWeight:800,color:isRec?"white":"var(--text)"}}>Free</span>
            : <>
                <span style={{fontSize:14,fontWeight:600,alignSelf:"flex-start",marginTop:6,
                  color:isRec?"rgba(255,255,255,0.6)":"var(--text-muted)"}}>$</span>
                <span style={{fontSize:30,fontWeight:800,color:isRec?"white":"var(--text)"}}>{price}</span>
                <span style={{fontSize:13,color:isRec?"rgba(255,255,255,0.5)":"var(--text-muted)"}}>
                  /{billing==="monthly"?"mo":"yr"}
                </span>
              </>
          }
        </div>
      </div>
      {/* Features */}
      <div style={{padding:"14px 16px",flex:1}}>
        {plan.features.map(f => (
          <div key={f} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:9,fontSize:13}}>
            <div style={{width:18,height:18,borderRadius:9,
              background:"rgba(52,199,89,0.12)",color:"var(--ios-green)",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <CheckIcon size={10} stroke={2.8}/>
            </div>
            <span style={{lineHeight:1.35,color:"var(--text)"}}>{f}</span>
          </div>
        ))}
        {plan.locked.map(f => (
          <div key={f} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:9,
            fontSize:13,opacity:0.3}}>
            <div style={{width:18,height:18,borderRadius:9,background:"rgba(120,120,128,0.1)",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <XIcon size={10} stroke={2}/>
            </div>
            <span style={{textDecoration:"line-through",lineHeight:1.35}}>{f}</span>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div style={{padding:"0 16px 18px"}}>
        <button onClick={onSelect}
          style={{width:"100%",padding:"12px",borderRadius:10,fontSize:14,fontWeight:600,
            cursor:"pointer",transition:"all 140ms",fontFamily:"inherit",
            background:selected?accent:isRec?"#1C1C1E":"rgba(120,120,128,0.1)",
            color:selected||isRec?"white":"var(--text)",border:"none",minHeight:44}}>
          {selected ? "Selected ✓" : plan.id==="free" ? "Get Started" : "Choose Plan"}
        </button>
      </div>
    </div>
  );
}

function PlanStep({category, billing, onBillingChange, selectedPlan, onSelectPlan}) {
  const plans   = PLANS_BY_CATEGORY[category];
  const catMeta = CATEGORY_META.find(c => c.id === category);
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      {/* Billing toggle */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
        <div className="ios-seg" style={{flexShrink:0}}>
          {[["monthly","Monthly"],["annual","Annual"]].map(([b,label]) => (
            <button key={b} onClick={() => onBillingChange(b)}
              className={`ios-seg-btn${billing===b?" active":""}`}
              style={{padding:"8px 20px",display:"flex",alignItems:"center",gap:6}}>
              {label}
              {b==="annual" && (
                <span style={{fontSize:10,fontWeight:700,background:"var(--ios-green)",
                  color:"white",padding:"2px 6px",borderRadius:4}}>-17%</span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Plans — horizontal scroll */}
      <div style={{display:"flex",gap:12,overflowX:"auto",
        WebkitOverflowScrolling:"touch",paddingBottom:4}}>
        {plans.map(plan => (
          <PlanColumn key={plan.id} plan={plan} billing={billing}
            selected={selectedPlan===plan.id}
            onSelect={() => onSelectPlan(plan.id)}
            accent={catMeta.color}/>
        ))}
      </div>
    </div>
  );
}

function FreeConfirmStep({category, onComplete}) {
  const catMeta = CATEGORY_META.find(c => c.id === category);
  const nextSteps = [
    ["Drive created on your profile",           CheckIcon,   "var(--ios-green)",  "rgba(52,199,89,0.1)"],
    ["Invite members in Phase 2",               UsersIcon,   "var(--ios-purple)", "rgba(175,82,222,0.1)"],
    ["Set mutual consent policies in Phase 2",  ShieldIcon,  "#1C1C1E",           "rgba(120,120,128,0.1)"],
    ["All members agree to activate vault",     KeyIcon,     "var(--ios-orange)", "rgba(255,149,0,0.1)"]
  ];
  return (
    <div style={{animation:"slideInLeft 160ms ease",textAlign:"center",padding:"8px 0"}}>
      <div style={{width:72,height:72,borderRadius:20,background:catMeta.bg,color:catMeta.color,
        display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
        <catMeta.Icon size={32}/>
      </div>
      <div style={{fontSize:20,fontWeight:700,letterSpacing:"-0.4px"}}>Free Plan Selected</div>
      <div style={{fontSize:14,color:"var(--text-muted)",marginTop:8,lineHeight:1.5,
        maxWidth:300,margin:"8px auto 0"}}>
        Your {catMeta.label} drive will be created. Complete Phase 2 to invite members and activate it.
      </div>
      <div style={{margin:"24px 0 0",background:"var(--ios-gray6)",borderRadius:14,padding:16,textAlign:"left"}}>
        <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",
          textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14}}>What happens next</div>
        {nextSteps.map(([label,Ic,color,bg],i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,
            marginBottom:i<nextSteps.length-1?12:0}}>
            <div style={{width:36,height:36,borderRadius:10,background:bg,color,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ic size={16}/>
            </div>
            <span style={{color:"var(--text)"}}>{label}</span>
          </div>
        ))}
      </div>
      <button onClick={onComplete} className="ios-btn ios-btn-blue" style={{marginTop:24}}>
        Create Drive & Continue to Phase 2
      </button>
    </div>
  );
}

function PaymentStep({category, planId, billing, onBillingChange, onComplete}) {
  const [method,   setMethod]   = useState("visa");
  const [cardNum,  setCardNum]  = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry,   setExpiry]   = useState("");
  const [cvv,      setCvv]      = useState("");
  const [voucher,  setVoucher]  = useState("");
  const [paying,   setPaying]   = useState(false);
  const [paid,     setPaid]     = useState(false);

  const catMeta = CATEGORY_META.find(c => c.id === category);
  const plan    = PLANS_BY_CATEGORY[category].find(p => p.id === planId);
  const price   = billing === "monthly" ? plan.monthly : plan.annual;

  const canPay = method === "voucher"
    ? voucher.length >= 8
    : cardNum.replace(/\s/g,"").length === 16 && cardName.trim() && expiry.length === 5 && cvv.length >= 3;

  const handlePay = () => {
    if (!canPay) return;
    setPaying(true);
    setTimeout(() => { setPaid(true); setTimeout(onComplete, 1400); }, 2400);
  };

  const fmtCard   = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = v => { const d=v.replace(/\D/g,""); return d.length>=2?d.slice(0,2)+"/"+d.slice(2,4):d; };

  if (paid) return (
    <div style={{textAlign:"center",padding:"48px 0",animation:"scaleIn 180ms ease"}}>
      <div style={{width:72,height:72,borderRadius:36,
        background:"rgba(52,199,89,0.12)",color:"var(--ios-green)",
        display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
        <CheckIcon size={36} stroke={2.4}/>
      </div>
      <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.4px"}}>Payment Successful!</div>
      <div style={{fontSize:15,color:"var(--text-muted)",marginTop:8}}>Setting up your drive…</div>
    </div>
  );

  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      {/* Order summary */}
      <div style={{background:"var(--ios-gray6)",borderRadius:14,padding:16,marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",
          textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Order Summary</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:catMeta.bg,color:catMeta.color,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <catMeta.Icon size={18}/>
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:600}}>{catMeta.label} — {plan.name}</div>
              <div style={{fontSize:13,color:"var(--text-muted)",textTransform:"capitalize",marginTop:2}}>
                {billing} billing
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:24,fontWeight:800,letterSpacing:"-0.5px"}}>${price}</div>
            <div style={{fontSize:12,color:"var(--text-muted)"}}>/{billing==="monthly"?"mo":"yr"}</div>
          </div>
        </div>
      </div>

      {/* Billing toggle */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["monthly","Monthly"],["annual","Annual · save 17%"]].map(([b,label]) => (
          <button key={b} onClick={() => onBillingChange(b)}
            style={{flex:1,padding:"11px",borderRadius:10,fontSize:14,fontWeight:500,
              background:b===billing?"var(--ios-blue)":"rgba(120,120,128,0.12)",
              color:b===billing?"white":"var(--text)",border:"none",fontFamily:"inherit",minHeight:44}}>
            {label}
          </button>
        ))}
      </div>

      {/* Payment method */}
      <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",
        textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Payment Method</div>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[["visa","Visa"],["mastercard","Mastercard"],["voucher","Voucher"]].map(([m,label]) => (
          <button key={m} onClick={() => setMethod(m)}
            style={{flex:1,padding:"10px 8px",borderRadius:10,fontSize:14,fontWeight:500,
              background:method===m?"var(--ios-blue)":"rgba(120,120,128,0.12)",
              color:method===m?"white":"var(--text)",border:"none",fontFamily:"inherit",minHeight:44}}>
            {label}
          </button>
        ))}
      </div>

      {/* Card form */}
      {method !== "voucher" ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="ios-input-section">
            <div className="ios-input-row"><input value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} placeholder="Card Number" maxLength={19}/></div>
            <div className="ios-input-row"><input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Cardholder Name"/></div>
            <div style={{display:"flex"}}>
              <div className="ios-input-row" style={{flex:1,borderRight:"0.5px solid var(--sep-strong)"}}>
                <input value={expiry} onChange={e => setExpiry(fmtExpiry(e.target.value))} placeholder="MM/YY" maxLength={5}/>
              </div>
              <div className="ios-input-row" style={{flex:1}}>
                <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="CVV" maxLength={4} type="password"/>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="ios-input-section">
            <div className="ios-input-row">
              <input value={voucher}
                onChange={e => setVoucher(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,19))}
                placeholder="NIRVANA-XXXX-XXXX"/>
            </div>
          </div>
          <div style={{fontSize:13,color:"var(--text-muted)",marginTop:8,paddingLeft:4}}>
            Enter a valid voucher code to redeem your subscription.
          </div>
        </div>
      )}

      <button onClick={handlePay} disabled={paying||!canPay}
        className={`ios-btn ${canPay?"ios-btn-blue":"ios-btn-muted"}`}
        style={{marginTop:20,opacity:canPay?1:0.5}}>
        {paying ? "Processing…" : `Pay $${price} & Create Drive`}
      </button>

      <div style={{textAlign:"center",marginTop:12,fontSize:13,color:"var(--text-muted)",
        display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
        <ShieldIcon size={12}/> 256-bit SSL encryption
      </div>
    </div>
  );
}

function SubscribeWizard({onClose, onComplete}) {
  const [step,     setStep]     = useState(1);
  const [category, setCategory] = useState(null);
  const [plan,     setPlan]     = useState(null);
  const [billing,  setBilling]  = useState("monthly");

  const isFree     = plan === "free";
  const stepTitles = {1:"Drive Type", 2:"Select Plan", 3:isFree?"Confirm":"Payment"};
  const canNext    = step===1 ? !!category : step===2 ? !!plan : false;
  const modalW     = step===2 ? 800 : 560;

  const handleBack     = () => step > 1 ? setStep(step-1) : onClose();
  const handleNext     = () => { if(step===1&&category) setStep(2); else if(step===2&&plan) setStep(3); };
  const handleComplete = () => onComplete({category, plan, billing});

  return (
    <ModalShell onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",maxHeight:"88vh"}}>
        {/* Header */}
        <div className="wizard-header" style={{padding:"4px 16px 12px",borderBottom:"0.5px solid var(--sep-strong)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:20,fontWeight:700,letterSpacing:"-0.4px",marginBottom:4}}>New Drive</div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",
                textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>
                Phase 1 · Subscription
              </div>
              <div style={{fontSize:13,color:"var(--text-muted)",marginTop:2}}>
                Step {step} of 3 · {stepTitles[step]}
              </div>
            </div>
            <button onClick={onClose} style={{color:"var(--ios-blue)",fontSize:17,padding:"4px 0",minHeight:"auto"}}>Done</button>
          </div>
          {/* Progress bar */}
          <div className="ios-progress">
            <div className="ios-progress-fill" style={{width:`${(step/3)*100}%`}}/>
          </div>
        </div>

        {/* Body */}
        <div className="wizard-body">
          {step===1 && <CategoryStep selected={category} onSelect={c => {setCategory(c);setPlan(null);}}/>}
          {step===2 && <PlanStep category={category} billing={billing} onBillingChange={setBilling} selectedPlan={plan} onSelectPlan={setPlan}/>}
          {step===3 && isFree  && <FreeConfirmStep category={category} onComplete={handleComplete}/>}
          {step===3 && !isFree && <PaymentStep category={category} planId={plan} billing={billing} onBillingChange={setBilling} onComplete={handleComplete}/>}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div className="wizard-footer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <button onClick={handleBack}
              style={{color:"var(--ios-blue)",fontSize:17,minHeight:44,padding:"0 4px"}}>
              {step===1 ? "Cancel" : "Back"}
            </button>
            <div style={{fontSize:13,color:"var(--text-muted)"}}>Step {step} of 3</div>
            <button onClick={handleNext} disabled={!canNext}
              style={{color:canNext?"var(--ios-blue)":"var(--ios-gray3)",
                fontSize:17,fontWeight:600,minHeight:44,padding:"0 4px"}}>
              Next
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
