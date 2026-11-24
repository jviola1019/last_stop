"""Original vector locomotive silhouettes. Deliberately retain the hand-painted original as default."""
from pathlib import Path
from random import Random
root=Path(__file__).resolve().parents[1]/'assets'
styles=[('express','#55706a','#d3af71','M14 171 L14 91 Q16 55 65 55 H211 Q260 57 296 130 L305 171Z', 'M47 72H105V116H47Z M115 72H153V116H115Z',False),('diesel','#895b4d','#e2c287','M15 171V100H29V53H120V85H279L307 108V171Z','M43 65H73V98H43Z M81 65H109V98H81Z',False),('electric','#4a647c','#d9ca97','M12 171V81L45 51H263L304 87V171Z','M25 84L49 61H80V109H25Z M246 61H263L291 86V109H246Z',True),('mountain','#64724d','#d6b175','M12 171V75H86V58H119V85H223V65H247V87H289L307 125V171Z','M28 84H69V120H28Z M122 101H150V127H122Z',False),('artdeco','#814c57','#e6c88d','M12 171V115Q22 53 89 42H205Q266 43 308 151V171Z','M30 106Q47 69 78 65H128V106Z M137 65H190V106H137Z',False),('alpine','#526e79','#e0d3a2','M12 171V103L35 61H105L118 85H248L300 64V171Z','M29 102L49 73H91V112H29Z M263 90L289 74V111H263Z',True),('horizon','#647976','#e8dcaf','M12 171V111Q20 70 69 58H218Q265 60 309 133L307 171Z','M35 102Q52 76 80 72H211Q249 75 270 104Z',True)]
for name,body,trim,shape,windows,pantograph in styles:
    wheels=''.join(f'<circle cx="{x}" cy="196" r="22" fill="#191e22" stroke="#c8ae7f" stroke-width="3"/><circle cx="{x}" cy="196" r="12" fill="#62605b" stroke="#2e2927" stroke-width="2"/>' for x in (73,143,252))
    vents=''.join(f'<path d="M{x} 122v22" stroke="#292d31" opacity=".7" stroke-width="2"/>' for x in range(170,241,8))
    pant='<path d="M147 52l23 -35 28 35m-42-20h34m-30-15h24" fill="none" stroke="#b9b19a" stroke-width="4"/>' if pantograph else '<path d="M159 55v-12h33v12" fill="#3e3a36" stroke="#bfa879" stroke-width="2"/>'
    label={'express':'PACIFIC','diesel':'CONTINENTAL','electric':'LUMEN','horizon':'HORIZON','mountain':'MOUNTAINEER','artdeco':'SILVER ARROW','alpine':'ALPINE'}[name]
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="318" height="226" viewBox="0 0 318 226"><defs><linearGradient id="body" x2="0" y2="1"><stop stop-color="{trim}"/><stop offset=".18" stop-color="{body}"/><stop offset=".65" stop-color="{body}"/><stop offset="1" stop-color="#202b34"/></linearGradient><linearGradient id="glass" x2="0" y2="1"><stop stop-color="#d1e3dd"/><stop offset=".5" stop-color="#708f9e"/><stop offset="1" stop-color="#253d4b"/></linearGradient></defs><ellipse cx="160" cy="218" rx="150" ry="6" fill="#181e23" opacity=".4"/>{pant}<path d="{shape}" fill="url(#body)" stroke="#342c2c" stroke-width="3"/><path d="{windows}" fill="url(#glass)" stroke="{trim}" stroke-width="3"/><path d="M17 150h280M17 157h286" stroke="{trim}" stroke-width="3" fill="none"/>{vents}<rect x="17" y="169" width="284" height="16" rx="4" fill="#303034" stroke="#ad8d59" stroke-width="2"/><rect x="91" y="125" width="127" height="19" rx="3" fill="#282d31" stroke="{trim}"/><text x="154" y="138" font-family="Georgia,serif" font-size="10" letter-spacing="2" fill="#f8e5ba" text-anchor="middle">{label}</text><circle cx="294" cy="132" r="7" fill="#fff2b9" stroke="{trim}" stroke-width="3"/>{wheels}<path d="M9 180h-8m310 0h7" stroke="#554637" stroke-width="5"/></svg>'''
    # Distinct mechanical details and layered shading, drawn as authored rail-art rather than UI glyphs.
    rng=Random(name);detail=[]
    for i in range(75):
        xx=rng.randint(25,280);yy=rng.randint(148,167);detail.append(f'<path d="M{xx} {yy}h{rng.randint(2,8)}" stroke="{trim if i%3 else "#2d3036"}" opacity=".28" stroke-width="1"/>')
    for x in (73,143,252):
        for i in range(8):
            import math
            ang=i*math.pi/4;detail.append(f'<path d="M{x} 196L{x+math.cos(ang)*15:.1f} {196+math.sin(ang)*15:.1f}" stroke="#b3a18b" stroke-width="1.8"/>')
        detail.append(f'<circle cx="{x}" cy="196" r="5" fill="#cfb083" stroke="#2a282b" stroke-width="2"/>')
    detail.append('<path d="M44 191H171" stroke="#977f63" stroke-width="4"/><path d="M44 190H171" stroke="#e0c194" stroke-width="1.2"/>')
    detail.append(f'<path d="M20 173h280M31 180h260" stroke="{trim}" opacity=".55" stroke-width="1.4"/>')
    for x in range(24,296,18):detail.append(f'<circle cx="{x}" cy="165" r="1.2" fill="{trim}" opacity=".9"/>')
    for x in [23,281]:detail.append(f'<path d="M{x} 170v12m-5 0h10" stroke="#d1b389" stroke-width="2"/>')
    if name in ('diesel','mountain','alpine'):
        for x in [172,204,235]:detail.append(f'<rect x="{x}" y="94" width="26" height="25" rx="1" fill="#353c41" stroke="{trim}" stroke-width="1.2"/><path d="M{x+4} 101h18m-18 5h18m-18 5h18" stroke="#788589" stroke-width="1.3"/>')
    if name in ('express','artdeco','horizon'):
        detail.append(f'<path d="M157 70Q247 64 291 126" stroke="{trim}" stroke-width="2" opacity=".8" fill="none"/><path d="M160 77Q246 74 285 124" stroke="#e0d2aa" stroke-width="1" opacity=".55" fill="none"/>')
    if name=='electric':
        detail.append(f'<path d="M87 77h144M90 84h138" stroke="{trim}" opacity=".75" stroke-width="2"/>')
    svg=svg.replace('</svg>',''.join(detail)+'</svg>')
    (root/f'engine-{name}.svg').write_text(svg)
