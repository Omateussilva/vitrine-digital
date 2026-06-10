import { useState } from "react";

const TIPOS = [
  { id: "promocao", label: "🔥 Promoção do Dia", desc: "Oferta especial para atrair clientes" },
  { id: "produto", label: "🍔 Destaque de Produto", desc: "Apresentar um item do cardápio" },
  { id: "historia", label: "📖 Historia do Negócio", desc: "Contar sobre sua trajetória" },
  { id: "dica", label: "💡 Dica para Clientes", desc: "Conteúdo educativo e útil" },
  { id: "engajamento", label: "💬 Post de Engajamento", desc: "Pergunta ou enquete para interagir" },
];

const REDES = ["Instagram", "Facebook", "WhatsApp", "TikTok"];
const TONS = ["Descontraído", "Profissional", "Animado", "Direto ao ponto"];

export default function GeradorConteudo() {
  const [tipo, setTipo] = useState("");
  const [rede, setRede] = useState("Instagram");
  const [tom, setTom] = useState("Descontraído");
  const [negocio, setNegocio] = useState("");
  const [detalhe, setDetalhe] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const tipoSelecionado = TIPOS.find(t => t.id === tipo);

  async function gerar() {
    if (!tipo || !negocio.trim()) return;
    setLoading(true);
    setResultado("");
    setCopiado(false);

    const prompt = `Você é especialista em marketing digital para pequenos negócios do setor alimentício e varejo no Brasil.\n\nCrie um post para ${rede} com tom ${tom.toLowerCase()} para o seguinte negócio:\n- Negócio: ${negocio}\n- Tipo de post: ${tipoSelecionado?.label}\n- Detalhe adicional: ${detalhe || "nenhum"}\n\nRegras:\n- Escreva em português brasileiro natural\n- Use emojis com moderação\n- Inclua uma chamada para ação (CTA) clara\n- Para Instagram, inclua de 5 a 8 hashtags relevantes no final\n- Seja específico e convincente\n- Máximo de 3 parágrafos curtos\n\nRetorne APENAS o texto do post, sem explicações.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const texto = data.content?.map(b => b.text || "").join("\n").trim();
      setResultado(texto || "Erro ao gerar. Tente novamente.");
    } catch {
      setResultado("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  }

  function copiar() {
    navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 50%,#16213e 100%)",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#f0f0f0",padding:"24px 16px"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-block",background:"linear-gradient(90deg,#ff6b35,#f7c59f)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:36,fontWeight:800,letterSpacing:-1,lineHeight:1.1}}>Vitrine Digital</div>
          <p style={{color:"#888",fontSize:14,marginTop:8}}>Gerador de posts para o seu negócio</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:24}}>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,color:"#aaa",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Seu negócio</label>
            <input value={negocio} onChange={e=>setNegocio(e.target.value)} placeholder="Ex: Lancheria do Zé, padaria, açougue..." style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f0f0f0",fontSize:15,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,color:"#aaa",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Tipo de post</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {TIPOS.map(t=>(
                <button key={t.id} onClick={()=>setTipo(t.id)} style={{background:tipo===t.id?"linear-gradient(90deg,rgba(255,107,53,0.3),rgba(247,197,159,0.15))":"rgba(255,255,255,0.04)",border:tipo===t.id?"1px solid rgba(255,107,53,0.6)":"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"12px 14px",color:"#f0f0f0",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                  <div style={{fontSize:14,fontWeight:600}}>{t.label}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:2}}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            <div>
              <label style={{display:"block",fontSize:13,color:"#aaa",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Rede social</label>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {REDES.map(r=>(<button key={r} onClick={()=>setRede(r)} style={{background:rede===r?"rgba(255,107,53,0.2)":"rgba(255,255,255,0.04)",border:rede===r?"1px solid rgba(255,107,53,0.5)":"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 10px",color:rede===r?"#ff6b35":"#ccc",cursor:"pointer",fontSize:13,fontWeight:rede===r?600:400}}>{r}</button>))}
              </div>
            </div>
            <div>
              <label style={{display:"block",fontSize:13,color:"#aaa",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Tom de voz</label>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {TONS.map(t=>(<button key={t} onClick={()=>setTom(t)} style={{background:tom===t?"rgba(255,107,53,0.2)":"rgba(255,255,255,0.04)",border:tom===t?"1px solid rgba(255,107,53,0.5)":"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 10px",color:tom===t?"#ff6b35":"#ccc",cursor:"pointer",fontSize:13,fontWeight:tom===t?600:400}}>{t}</button>))}
              </div>
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:13,color:"#aaa",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Detalhe adicional <span style={{color:"#555",fontWeight:400}}>(opcional)</span></label>
            <textarea value={detalhe} onChange={e=>setDetalhe(e.target.value)} placeholder="Ex: X-burguer por R$15, promoção válida hoje..." rows={2} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f0f0f0",fontSize:14,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
          </div>
          <button onClick={gerar} disabled={loading||!tipo||!negocio.trim()} style={{width:"100%",background:(!tipo||!negocio.trim())?"rgba(255,255,255,0.08)":"linear-gradient(90deg,#ff6b35,#f7931e)",border:"none",borderRadius:12,padding:"16px",color:(!tipo||!negocio.trim())?"#555":"#fff",fontSize:16,fontWeight:700,cursor:(!tipo||!negocio.trim())?"not-allowed":"pointer"}}>
            {loading?"✨ Gerando...":"✨ Gerar Post"}
          </button>
        </div>
        {(loading||resultado)&&(
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,107,53,0.2)",borderRadius:20,padding:24,marginTop:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:13,color:"#ff6b35",fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Post gerado</span>
              {resultado&&!loading&&(<button onClick={copiar} style={{background:copiado?"rgba(100,200,100,0.2)":"rgba(255,107,53,0.15)",border:copiado?"1px solid rgba(100,200,100,0.4)":"1px solid rgba(255,107,53,0.3)",borderRadius:8,padding:"6px 14px",color:copiado?"#6fc96f":"#ff6b35",fontSize:13,cursor:"pointer",fontWeight:600}}>{copiado?"✓ Copiado!":"Copiar"}</button>)}
            </div>
            {loading?(<div style={{color:"#888",fontSize:14,textAlign:"center",padding:"20px 0"}}><div style={{fontSize:28,marginBottom:8}}>✨</div>Criando seu post...</div>):(<div style={{color:"#e0e0e0",fontSize:15,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{resultado}</div>)}
          </div>
        )}
      </div>
    </div>
  );
      }
