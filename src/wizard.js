function StepIndicator({step, total}) {
  return (
    <div className="ios-progress">
      <div className="ios-progress-fill" style={{width:`${(step/total)*100}%`}}/>
    </div>
  );
}

function Step1Name({data, update, defaultName}) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:20,lineHeight:1.5}}>
        A default name has been assigned based on your plan. Keep it or choose a custom name.
      </div>

      {!editing ? (
        <div style={{background:"var(--ios-gray6)",borderRadius:14,padding:20}}>
          <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",
            textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Drive name</div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:50,height:50,borderRadius:14,background:"rgba(0,122,255,0.1)",
              color:"var(--ios-blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <DatabaseIcon size={24}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:19,fontWeight:700,letterSpacing:"-0.4px",
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{data.name}</div>
              <div style={{fontSize:13,color:"var(--text-muted)",marginTop:3}}>Default · visible to all members</div>
            </div>
          </div>
          <button onClick={() => setEditing(true)} className="ios-btn ios-btn-blue" style={{marginTop:16}}>
            <EditIcon size={16}/> Rename Drive
          </button>
        </div>
      ) : (
        <div style={{animation:"slideInLeft 100ms ease"}}>
          <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:8}}>Custom Drive Name</div>
          <div className="ios-input-section">
            <div className="ios-input-row">
              <input value={data.name} onChange={e => update("name", e.target.value)}
                placeholder="e.g., Our Family Vault" autoFocus/>
            </div>
          </div>
          <button onClick={() => { update("name", defaultName); setEditing(false); }}
            style={{marginTop:12,fontSize:14,color:"var(--ios-blue)",
              background:"none",padding:0,minHeight:"auto"}}>
            Use default name instead
          </button>
        </div>
      )}

      <div style={{marginTop:16,padding:14,background:"rgba(0,122,255,0.06)",
        borderRadius:12,fontSize:14,color:"var(--text-muted)",lineHeight:1.4}}>
        The drive name is visible to all members but does not affect security or access policies.
      </div>
    </div>
  );
}

function Step2Members({data, update, maxMembers, isCouple}) {
  const addMember = () => {
    const e = data.newMemberEmail.trim().toLowerCase();
    if (!e.includes("@") || data.members.includes(e) || data.members.length >= maxMembers) return;
    update("members", [...data.members, e]);
    update("newMemberEmail", "");
    update("inviteStatus", p => ({...p, [e]:"pending"}));
    const delay = 2200 + Math.random() * 2200;
    const will  = Math.random() > 0.15;
    setTimeout(() => { update("inviteStatus", p => p[e]==="pending" ? {...p,[e]:will?"accepted":"declined"} : p); }, delay);
  };
  const remove = email => {
    update("members", data.members.filter(m => m !== email));
    update("inviteStatus", p => { const {[email]:_, ...rest} = p; return rest; });
  };

  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16,lineHeight:1.5}}>
        {isCouple
          ? "Invite your partner. The vault requires both members to agree before it can be activated."
          : `Invite up to ${maxMembers} member${maxMembers!==1?"s":""}. The vault activates only after all invitees accept.`
        }
      </div>

      <div className="ios-input-section">
        <div className="ios-input-row">
          <MailIcon size={16} style={{color:"var(--text-muted)",marginRight:8,flexShrink:0}}/>
          <input value={data.newMemberEmail}
            onChange={e => update("newMemberEmail", e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"){e.preventDefault();addMember();} }}
            placeholder="name@example.com"
            disabled={data.members.length>=maxMembers}/>
        </div>
      </div>
      <button onClick={addMember} className="ios-btn ios-btn-blue" style={{marginTop:10}}>
        Send Invite
      </button>
      <div style={{fontSize:13,color:"var(--text-muted)",marginTop:8}}>
        {data.members.length} / {maxMembers} invite{maxMembers!==1?"s":""} sent
      </div>

      <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
        {data.members.map((m, i) => {
          const status = data.inviteStatus[m] || "pending";
          return (
            <div key={m} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              background:status==="accepted"?"rgba(52,199,89,0.08)":status==="declined"?"rgba(255,59,48,0.08)":"var(--ios-gray6)",
              borderRadius:12,
              border:`1px solid ${status==="accepted"?"rgba(52,199,89,0.2)":status==="declined"?"rgba(255,59,48,0.2)":"transparent"}`}}>
              <div style={{width:32,height:32,borderRadius:16,
                background:["var(--ios-purple)","var(--ios-orange)","var(--ios-green)","var(--ios-blue)","var(--ios-orange)"][i%5],
                color:"white",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:600,flexShrink:0}}>
                {m.slice(0,2).toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m}</div>
                <div style={{fontSize:12,color:"var(--text-muted)",marginTop:1}}>
                  {status==="pending"   && "Awaiting response…"}
                  {status==="accepted"  && "✓ Accepted"}
                  {status==="declined"  && "✗ Declined"}
                </div>
              </div>
              {status === "pending" && (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:8,height:8,borderRadius:4,
                    background:"var(--ios-orange)",animation:"pulseDot 1.1s infinite",display:"inline-block"}}/>
                  <button onClick={() => remove(m)} style={{color:"var(--text-muted)",padding:4,minHeight:"auto"}}>
                    <XIcon size={15}/>
                  </button>
                </div>
              )}
              {status !== "pending" && (
                <button onClick={() => remove(m)} style={{color:"var(--text-muted)",padding:4,minHeight:"auto"}}>
                  <XIcon size={15}/>
                </button>
              )}
            </div>
          );
        })}
        {data.members.length === 0 && (
          <div style={{padding:16,textAlign:"center",background:"var(--ios-gray6)",
            borderRadius:12,fontSize:14,color:"var(--text-muted)"}}>
            No invites yet — invite {isCouple?"your partner":"at least one member"}
          </div>
        )}
      </div>
    </div>
  );
}

function Step2Consent({data, update, isCouple}) {
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16}}>
        Define what fraction of members must consent for vault access.
      </div>
      {isCouple ? (
        <div style={{padding:18,background:"var(--ios-gray6)",borderRadius:14,
          display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:48,height:48,borderRadius:12,background:"#1C1C1E",
            color:"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <PercentIcon size={20}/>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:700}}>100% consent required</div>
            <div style={{fontSize:13,color:"var(--text-muted)",marginTop:3,lineHeight:1.4}}>
              Couple vaults use fixed unanimous consent. Both members must approve every session.
            </div>
          </div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {label:"Minimum consent",key:"minConsent",sublabel:"Floor for any access decision. Below this is auto-denied.",
              min:50,onChange:v=>{ update("minConsent",v); if(data.maxConsent<=v) update("maxConsent",Math.min(100,v+5)); }},
            {label:"Maximum consent",key:"maxConsent",sublabel:"Ceiling for sensitive operations (delete, export).",
              min:data.minConsent+5,onChange:v=>update("maxConsent",Math.min(100,Math.max(data.minConsent+5,v)))}
          ].map(item => (
            <div key={item.key} style={{background:"var(--ios-gray6)",borderRadius:14,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:15,fontWeight:600}}>{item.label}</span>
                <span style={{fontSize:22,fontWeight:700,letterSpacing:"-0.4px"}}>{data[item.key]}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value={data[item.key]}
                onChange={e => item.onChange(Math.max(item.min, parseInt(e.target.value)))}
                style={{width:"100%",accentColor:"var(--ios-blue)"}}/>
              <div style={{fontSize:13,color:"var(--text-muted)",marginTop:8,lineHeight:1.35}}>
                {item.sublabel}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step3Recovery({data, update, plan}) {
  const isFree = plan === "free";
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16}}>
        What happens if a member loses their device or access keys?
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        <SelectCard selected={data.recovery==="none"} onClick={() => update("recovery","none")}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <IconTile tone="danger"><LockIcon size={16}/></IconTile>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <div style={{fontSize:15,fontWeight:600}}>No Recovery</div>
                {isFree && <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(52,199,89,0.1)",color:"var(--ios-green)"}}>Default</span>}
              </div>
              <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.4}}>
                Zero-knowledge. Lost keys mean permanently lost access. Highest security posture.
              </div>
            </div>
          </div>
        </SelectCard>
        <SelectCard selected={data.recovery==="timelock"} onClick={isFree?undefined:()=>update("recovery","timelock")} locked={isFree}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <IconTile tone="neutral"><ClockIcon size={16}/></IconTile>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600,marginBottom:3}}>Time-Locked Recovery</div>
              <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.4}}>
                Recovery key released after a cooling-off delay. Other members can cancel.
              </div>
              {data.recovery==="timelock" && !isFree && (
                <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[7,14,30,60].map(d => (
                    <button key={d} onClick={e=>{e.stopPropagation();update("recoveryDays",d);}}
                      style={{padding:"7px 14px",borderRadius:10,fontSize:14,fontWeight:500,
                        background:data.recoveryDays===d?"var(--ios-blue)":"rgba(0,122,255,0.1)",
                        color:data.recoveryDays===d?"white":"var(--ios-blue)",
                        border:"none",fontFamily:"inherit",minHeight:"auto"}}>
                      {d} days
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SelectCard>
      </div>
      {isFree && (
        <div style={{marginTop:12,padding:12,background:"rgba(255,149,0,0.1)",
          borderRadius:12,fontSize:14,color:"var(--ios-orange)"}}>
          Time-Locked Recovery requires a Plus or Pro subscription.
        </div>
      )}
    </div>
  );
}

function Step4PostDeath({data, update, plan}) {
  const isFree = plan === "free";
  const opts = [
    {id:"permalock",  title:"Permanently Locked",  sub:"Vault sealed forever. Files preserved but inaccessible.", icon:<LockIcon size={16}/>,      tone:"neutral", freeOk:true},
    {id:"survivor",   title:"Survivor Ownership",  sub:"Remaining members inherit full access and ownership.",   icon:<UsersIcon size={16}/>,    tone:"success", freeOk:false},
    {id:"autodelete", title:"Auto-Delete",          sub:"Contents permanently wiped upon confirmed member death.", icon:<XIcon size={16}/>,        tone:"danger",  freeOk:false}
  ];
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16}}>
        Define what happens to vault contents if a member dies.
      </div>
      <div>
        {opts.map(o => {
          const locked = isFree && !o.freeOk;
          return (
            <SelectCard key={o.id} selected={data.postDeath===o.id}
              onClick={locked?undefined:()=>update("postDeath",o.id)} locked={locked}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <IconTile tone={o.tone}>{o.icon}</IconTile>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <div style={{fontSize:15,fontWeight:600}}>{o.title}</div>
                    {isFree&&o.freeOk&&<span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(52,199,89,0.1)",color:"var(--ios-green)"}}>Default</span>}
                  </div>
                  <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.4}}>{o.sub}</div>
                </div>
              </div>
            </SelectCard>
          );
        })}
      </div>
      {isFree && <div style={{marginTop:12,padding:12,background:"rgba(255,149,0,0.1)",borderRadius:12,fontSize:14,color:"var(--ios-orange)"}}>Survivor Ownership and Auto-Delete require a Plus or Pro subscription.</div>}
    </div>
  );
}

function Step5Exit({data, update, plan}) {
  const isFree = plan === "free";
  const opts = [
    {id:"lock",     title:"Permanently Locked",  sub:"Vault locks for all members. Policy can be re-proposed later.", icon:<LockIcon size={16}/>,      tone:"neutral", freeOk:true},
    {id:"transfer", title:"Ownership Transfer",  sub:"Departing member's share transfers to remaining members.",      icon:<ArrowRightIcon size={16}/>, tone:"success", freeOk:false},
    {id:"delete",   title:"Auto-Delete",          sub:"All contents wiped when a member exits. Unrecoverable.",       icon:<XIcon size={16}/>,          tone:"danger",  freeOk:false}
  ];
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16}}>
        What happens when a member chooses to leave the vault?
      </div>
      <div>
        {opts.map(o => {
          const locked = isFree && !o.freeOk;
          return (
            <SelectCard key={o.id} selected={data.accountExit===o.id}
              onClick={locked?undefined:()=>update("accountExit",o.id)} locked={locked}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <IconTile tone={o.tone}>{o.icon}</IconTile>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <div style={{fontSize:15,fontWeight:600}}>{o.title}</div>
                    {isFree&&o.freeOk&&<span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(52,199,89,0.1)",color:"var(--ios-green)"}}>Default</span>}
                  </div>
                  <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.4}}>{o.sub}</div>
                </div>
              </div>
            </SelectCard>
          );
        })}
      </div>
      {isFree && <div style={{marginTop:12,padding:12,background:"rgba(255,149,0,0.1)",borderRadius:12,fontSize:14,color:"var(--ios-orange)"}}>Ownership Transfer and Auto-Delete require a Plus or Pro subscription.</div>}
    </div>
  );
}

function MemberAgreeRow({name, email, color, status, isSelf}) {
  const bg     = status==="agreed"?"rgba(52,199,89,0.08)":status==="disagreed"?"rgba(255,59,48,0.08)":"var(--ios-gray6)";
  const border = status==="agreed"?"rgba(52,199,89,0.2)":status==="disagreed"?"rgba(255,59,48,0.2)":"transparent";
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
      background:bg,border:"1px solid "+border,borderRadius:12,marginBottom:8}}>
      <div style={{width:32,height:32,borderRadius:16,background:color,color:"white",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>
        {name.slice(0,2).toUpperCase()}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>{email}</div>
      </div>
      {status==="pending"   && <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:4,background:"var(--ios-orange)",animation:"pulseDot 1.1s infinite",display:"inline-block"}}/><span style={{fontSize:12,color:"var(--ios-orange)",fontWeight:600}}>Pending</span></div>}
      {status==="agreed"    && <span style={{fontSize:13,color:"var(--ios-green)",fontWeight:600}}>{isSelf?"✓ Agree":"Agreed"}</span>}
      {status==="disagreed" && <span style={{fontSize:13,color:"var(--ios-red)",fontWeight:600}}>Disagree</span>}
    </div>
  );
}

function Step6Proposal({data, update, acceptedInvitees, allAgreed, anyDisagreed, catLabel, isCouple}) {
  const policyLabel = {
    recovery:    {timelock:`Time-Locked (${data.recoveryDays}d)`,none:"No Recovery"}[data.recovery],
    postDeath:   {survivor:"Survivor Ownership",autodelete:"Auto-Delete",permalock:"Permanently Locked"}[data.postDeath],
    accountExit: {transfer:"Ownership Transfer",lock:"Permanently Locked",delete:"Auto-Delete"}[data.accountExit]
  };
  useEffect(() => {
    const timers = [];
    acceptedInvitees.forEach((m, i) => {
      if ((data.proposalStatus[m]||"pending") !== "pending") return;
      const delay = 2400 + i*900 + Math.random()*1600;
      const will  = Math.random() > 0.15;
      timers.push(setTimeout(() => { update("proposalStatus", p => (p[m]||"pending")==="pending"?{...p,[m]:will?"agreed":"disagreed"}:p); }, delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16,lineHeight:1.5}}>
        Each member reviews the policy. All must agree to proceed.
      </div>
      <div style={{background:"var(--ios-gray6)",borderRadius:14,overflow:"hidden",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",padding:"12px 16px 8px",
          textTransform:"uppercase",letterSpacing:"0.06em"}}>Policy Summary</div>
        {[
          ["Vault",      data.name],
          ["Type",       catLabel],
          ["Consent",    isCouple?"100%":`${data.minConsent}% – ${data.maxConsent}%`],
          ["Recovery",   policyLabel.recovery],
          ["Post-death", policyLabel.postDeath],
          ["Exit",       policyLabel.accountExit]
        ].map(([label,val],i,arr) => (
          <div key={label} style={{display:"flex",justifyContent:"space-between",
            fontSize:14,padding:"10px 16px",
            borderBottom:i<arr.length-1?"0.5px solid var(--sep-strong)":"none"}}>
            <span style={{color:"var(--text-muted)"}}>{label}</span>
            <span style={{fontWeight:500,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{val||"—"}</span>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,fontWeight:600,color:"var(--text-muted)",
        textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Member Responses</div>
      <MemberAgreeRow name="You (Proposer)" email="john.doe@example.com" color="#1C1C1E" status="agreed" isSelf/>
      {acceptedInvitees.map((m,i) => (
        <MemberAgreeRow key={m} name={m.split("@")[0]} email={m}
          color={["var(--ios-purple)","var(--ios-orange)","var(--ios-green)","var(--ios-blue)","var(--ios-orange)"][i%5]}
          status={data.proposalStatus[m]||"pending"}/>
      ))}
      {anyDisagreed && <div style={{marginTop:12,padding:13,background:"rgba(255,149,0,0.1)",borderRadius:12,fontSize:14,color:"var(--ios-orange)"}}>A member disagreed. You can go back to revise earlier steps.</div>}
      {allAgreed && acceptedInvitees.length>0 && <div style={{marginTop:12,padding:13,background:"rgba(52,199,89,0.1)",borderRadius:12,fontSize:14,color:"var(--ios-green)",display:"flex",alignItems:"center",gap:8}}><CheckIcon size={14}/>All members agreed. Proceed to final signature.</div>}
    </div>
  );
}

function SignatureRow({name, color, checked, onToggle}) {
  return (
    <label onClick={onToggle}
      style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",
        background:checked?"rgba(52,199,89,0.06)":"var(--card)",
        border:`1px solid ${checked?"rgba(52,199,89,0.2)":"var(--sep-strong)"}`,
        borderRadius:12,cursor:"pointer",transition:"all 140ms",marginBottom:8}}>
      <div style={{width:34,height:34,borderRadius:17,background:color,color:"white",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>
        {name.slice(0,2).toUpperCase()}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:500}}>{name}</div>
        <div style={{fontSize:12,color:"var(--text-muted)",marginTop:1}}>
          {checked ? "✓ Signed agreement" : "Awaiting signature"}
        </div>
      </div>
      <div style={{width:24,height:24,borderRadius:7,
        border:`2px solid ${checked?"var(--ios-green)":"var(--ios-gray4)"}`,
        background:checked?"var(--ios-green)":"white",
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {checked && <CheckIcon size={13} stroke={3} style={{color:"white"}}/>}
      </div>
    </label>
  );
}

function Step7Final({data, update, acceptedInvitees}) {
  const toggle = k => update("finalAgreed", {...data.finalAgreed, [k]:!data.finalAgreed[k]});
  return (
    <div style={{animation:"slideInLeft 160ms ease"}}>
      <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:16,lineHeight:1.5}}>
        Each member reviews the final version and confirms via signed checkbox.
      </div>
      <div style={{background:"var(--ios-gray6)",borderRadius:14,padding:16,marginBottom:20}}>
        <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>{data.name}</div>
        <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.6}}>
          By confirming, you agree to the mutual consent policy, recovery rules, post-death handling,
          and exit protocol negotiated in the previous steps.
        </div>
      </div>
      <SignatureRow name="You (Proposer)" color="#1C1C1E" checked={!!data.finalAgreed["self"]} onToggle={() => toggle("self")}/>
      {acceptedInvitees.map((m, i) => (
        <SignatureRow key={m} name={m.split("@")[0]} color={["var(--ios-purple)","var(--ios-orange)","var(--ios-green)","var(--ios-blue)","var(--ios-orange)"][i%5]} checked={!!data.finalAgreed[m]} onToggle={() => toggle(m)}/>
      ))}
    </div>
  );
}

function Step8Activation({data}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(()=>setPhase(1), 700);
    const t2 = setTimeout(()=>setPhase(2), 1600);
    const t3 = setTimeout(()=>setPhase(3), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const rows = [
    {label:"Generating encryption keys",         icon:<KeyIcon size={14}/>},
    {label:"Distributing key shares to members", icon:<UsersIcon size={14}/>},
    {label:"Removing activation blur",           icon:<UnlockIcon size={14}/>}
  ];
  return (
    <div style={{animation:"slideInLeft 160ms ease",textAlign:"center",padding:"12px 0"}}>
      <div style={{width:72,height:72,borderRadius:36,
        background:phase>=3?"rgba(52,199,89,0.12)":"rgba(0,122,255,0.1)",
        color:phase>=3?"var(--ios-green)":"var(--ios-blue)",
        display:"flex",alignItems:"center",justifyContent:"center",
        margin:"0 auto 18px",transition:"all 400ms"}}>
        {phase>=3 ? <CheckIcon size={34} stroke={2.4}/> : <ShieldIcon size={32}/>}
      </div>
      <div style={{fontSize:20,fontWeight:700,letterSpacing:"-0.4px"}}>
        {phase>=3 ? "Vault activated" : "Activating vault…"}
      </div>
      <div style={{fontSize:14,color:"var(--text-muted)",marginTop:8,maxWidth:300,margin:"8px auto 0",lineHeight:1.5}}>
        {phase>=3
          ? `"${data.name}" is now fully active per your consent policy.`
          : "Generating keys and distributing shares. Do not close."}
      </div>
      <div style={{margin:"24px 0 0",background:"var(--ios-gray6)",borderRadius:14,padding:16,textAlign:"left"}}>
        {rows.map((r, i) => {
          const done = phase > i;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,
              fontSize:14,marginBottom:i<rows.length-1?12:0}}>
              <div style={{width:24,height:24,borderRadius:12,
                background:done?"rgba(52,199,89,0.12)":"rgba(120,120,128,0.1)",
                color:done?"var(--ios-green)":"var(--text-muted)",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {done ? <CheckIcon size={12} stroke={2.8}/> : r.icon}
              </div>
              <span style={{color:done?"var(--text)":"var(--text-muted)",fontWeight:done?500:400}}>
                {r.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreateVaultWizard({onClose, onCreate, vault}) {
  const category   = vault?.category || "family";
  const plan       = vault?.plan     || "free";
  const defaultName= vault?.name     || "My Drive";
  const isCouple   = category === "couples";
  const maxMembers = (() => {
    if (isCouple) return 1;
    const lim = {family:{free:3,plus:5,pro:9},business:{free:2,plus:9,pro:20},creators:{free:0,plus:2,pro:4}};
    return (lim[category]||{})[plan] ?? 5;
  })();
  const catLabel = {couples:"Couples",family:"Family",business:"Business",creators:"Creators"}[category]||"Drive";
  const STORAGE_KEY = vault?.id ? `nirvana_wizard_${vault.id}` : null;

  const initialData = {
    name:defaultName, members:[], newMemberEmail:"", inviteStatus:{},
    minConsent:isCouple?100:60, maxConsent:100,
    recovery:"none", recoveryDays:30,
    postDeath:"permalock", accountExit:"lock",
    proposalStatus:{}, finalAgreed:{}, activated:false
  };

  const [step, setStep] = useState(() => {
    if (STORAGE_KEY) { try { const s=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(s?.step) return s.step; } catch {} }
    return 1;
  });
  const [data, setData] = useState(() => {
    if (STORAGE_KEY) { try { const s=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(s?.data) return {...initialData,...s.data}; } catch {} }
    return initialData;
  });
  const update = (k, v) => setData(d => ({...d, [k]: typeof v==="function"?v(d[k]):v}));

  useEffect(() => {
    if (STORAGE_KEY) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({step,data})); } catch {} }
  }, [step, data]);

  const TOTAL            = 9;
  const acceptedInvitees = data.members.filter(m => data.inviteStatus[m]==="accepted");
  const allAgreed        = acceptedInvitees.length>0 && acceptedInvitees.every(m=>data.proposalStatus[m]==="agreed");
  const anyDisagreed     = acceptedInvitees.some(m=>data.proposalStatus[m]==="disagreed");
  const allFinalAgreed   = acceptedInvitees.every(m=>data.finalAgreed[m]) && data.finalAgreed["self"];

  const canNext = () => {
    if(step===1) return data.name.trim().length>0;
    if(step===2) return data.members.length>=1;
    if(step===3) { if(isCouple) return true; return data.minConsent>=50&&data.minConsent<=100&&data.maxConsent>data.minConsent&&data.maxConsent<=100; }
    if(step===4) return !!data.recovery;
    if(step===5) return !!data.postDeath;
    if(step===6) return !!data.accountExit;
    if(step===7) return true;
    if(step===8) return allFinalAgreed;
    return true;
  };

  const next     = () => { if(canNext()&&step<TOTAL) setStep(step+1); };
  const back     = () => { if(step>1) setStep(step-1); else onClose(); };
  const finalize = () => {
    if(STORAGE_KEY) { try { localStorage.removeItem(STORAGE_KEY); } catch {} }
    onCreate({
      name: data.name,
      description: {couples:"Shared couple vault",family:"Shared family vault",business:"Business team vault",creators:"Creator workspace"}[category]||"Shared vault",
      consent: isCouple?100:data.minConsent,
      members: [
        {id:"jd",name:"John Doe",email:"john.doe@example.com",initials:"JD",color:"#1C1C1E"},
        ...acceptedInvitees.map((m,i)=>({
          id:`m${i}`,name:m.split("@")[0].replace(/\./g," ").replace(/\b\w/g,c=>c.toUpperCase()),
          email:m,initials:m.slice(0,2).toUpperCase(),
          color:["var(--ios-purple)","var(--ios-orange)","var(--ios-green)","var(--ios-blue)","var(--ios-orange)"][i%5]
        }))
      ]
    });
  };

  const stepTitles = {
    1:"Drive Name",2:"Invite Members",3:"Consent Policy",
    4:"Recovery Policy",5:"Post-Death Policy",6:"Exit Protocol",
    7:"Proposal Review",8:"Final Agreement",9:"Vault Activation"
  };

  return (
    <ModalShell onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",maxHeight:"88vh"}}>
        {/* Header */}
        <div className="wizard-header" style={{padding:"4px 16px 12px",borderBottom:"0.5px solid var(--sep-strong)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",
                textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>
                Phase 2 · Vault Creation
              </div>
              <div style={{fontSize:13,color:"var(--text-muted)"}}>
                Step {step} of {TOTAL} · {stepTitles[step]}
              </div>
            </div>
            <button onClick={onClose} style={{color:"var(--ios-blue)",fontSize:17,minHeight:"auto",padding:"4px 0"}}>Done</button>
          </div>
          <StepIndicator step={step} total={TOTAL}/>
        </div>

        {/* Body */}
        <div className="wizard-body">
          {step===1 && <Step1Name      data={data} update={update} defaultName={defaultName}/>}
          {step===2 && <Step2Members   data={data} update={update} maxMembers={maxMembers} isCouple={isCouple}/>}
          {step===3 && <Step2Consent   data={data} update={update} isCouple={isCouple}/>}
          {step===4 && <Step3Recovery  data={data} update={update} plan={plan}/>}
          {step===5 && <Step4PostDeath data={data} update={update} plan={plan}/>}
          {step===6 && <Step5Exit      data={data} update={update} plan={plan}/>}
          {step===7 && <Step6Proposal  data={data} update={update} acceptedInvitees={acceptedInvitees} allAgreed={allAgreed} anyDisagreed={anyDisagreed} catLabel={catLabel} isCouple={isCouple}/>}
          {step===8 && <Step7Final     data={data} update={update} acceptedInvitees={acceptedInvitees}/>}
          {step===9 && <Step8Activation data={data}/>}
        </div>

        {/* Footer */}
        <div className="wizard-footer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <button onClick={back}
            style={{color:"var(--ios-blue)",fontSize:17,minHeight:44,padding:"0 4px"}}>
            {step===1?"Cancel":"Back"}
          </button>
          <div style={{fontSize:13,color:"var(--text-muted)"}}>Step {step} of {TOTAL}</div>
          {step < TOTAL ? (
            <button onClick={next} disabled={!canNext()}
              style={{color:canNext()?"var(--ios-blue)":"var(--ios-gray3)",
                fontSize:17,fontWeight:600,minHeight:44,padding:"0 4px"}}>
              Next
            </button>
          ) : (
            <button onClick={finalize}
              style={{color:"var(--ios-green)",fontSize:17,fontWeight:600,
                minHeight:44,padding:"0 4px"}}>
              Activate
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
