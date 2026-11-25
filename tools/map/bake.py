import json,math,os,sys
import numpy as np
from PIL import Image,ImageDraw,ImageFilter
# python3 bake.py <folder with dem/, city.json, county.json, roads1.json, tryon8.json> <assets/map folder that holds southeast.json>
G=sys.argv[1].rstrip('/')+'/'; OUT=sys.argv[2].rstrip('/')+'/'
CX,CY=585,445
r=math.radians;s0=math.sin(r(29.5));n=(s0+math.sin(r(45.5)))/2;c=1+s0*(2*n-s0);r0=math.sqrt(c)/n
def raw(l,p):
    q=math.sqrt(max(0,c-2*n*math.sin(p)))/n; return q*math.sin(l*n), r0-q*math.cos(l*n)
cx,cy=raw(r(-0.6),r(38.7))
def proj(lon,lat):
    x,y=raw(r(lon+96),r(lat)); return 487.5+1300*(x-cx)-CX, 305-1300*(y-cy)-CY
# ---- check against the existing data
D=json.load(open(OUT+'southeast.json'));print('check',proj(-80.843,35.227),[x['p'] for x in D['cities'] if x['n']=='Charlotte'])
# ---- elevation mosaic z6
Z=64;X0,X1,Y0,Y1=12,19,23,28
M=np.zeros(((Y1-Y0+1)*256,(X1-X0+1)*256),np.float32)
for x in range(X0,X1+1):
    for y in range(Y0,Y1+1):
        a=np.asarray(Image.open(f'{G}dem/{x}-{y}.png').convert('RGB')).astype(np.float32)
        M[(y-Y0)*256:(y-Y0+1)*256,(x-X0)*256:(x-X0+1)*256]=a[...,0]*256+a[...,1]+a[...,2]/256-32768
BX=(-460,460);BZ=(-260,300);W=2048;H=int(round(W*(BZ[1]-BZ[0])/(BX[1]-BX[0])))
xs=BX[0]+(np.arange(W)+.5)/W*(BX[1]-BX[0]); zs=BZ[0]+(np.arange(H)+.5)/H*(BZ[1]-BZ[0])
X,Zz=np.meshgrid(xs,zs)
rx=(X+CX-487.5)/1300+cx; ry=(305-(Zz+CY))/1300+cy
rho=np.sqrt(rx**2+(r0-ry)**2); th=np.arctan2(rx,r0-ry)
lon=np.degrees(th/n)-96; lat=np.arcsin(np.clip((c-(rho*n)**2)/(2*n),-1,1))
px=((lon+180)/360*Z-X0)*256-.5; py=((1-np.arcsinh(np.tan(lat))/math.pi)/2*Z-Y0)*256-.5
px=np.clip(px,0,M.shape[1]-2);py=np.clip(py,0,M.shape[0]-2)
i=px.astype(int);j=py.astype(int);fx=px-i;fy=py-j
E=M[j,i]*(1-fx)*(1-fy)+M[j,i+1]*fx*(1-fy)+M[j+1,i]*(1-fx)*fy+M[j+1,i+1]*fx*fy
E=np.maximum(E,0)
def blur(a,s):
    k=int(s*3);g=np.exp(-.5*(np.arange(-k,k+1)/s)**2);g/=g.sum()
    p=np.pad(a,((0,0),(k,k)),'edge');a=np.apply_along_axis(lambda m:np.convolve(m,g,'valid'),1,p)
    p=np.pad(a,((k,k),(0,0)),'edge');return np.apply_along_axis(lambda m:np.convolve(m,g,'valid'),0,p)
def shade(h,ex):
    cell=(BX[1]-BX[0])/W*4900  # metres per texel
    gz,gx=np.gradient(h*ex,cell)
    az,al=r(34),r(34) # the light stands 34 deg north of west, 34 deg high
    L=np.array([-math.cos(al)*math.cos(az),math.sin(al),-math.cos(al)*math.sin(az)])
    nl=(-gx*L[0]+L[1]-gz*L[2])/np.sqrt(gx**2+gz**2+1)
    return nl/L[1]
S=.6*shade(blur(E,1.1),7)+.4*shade(blur(E,5),13)
S=np.clip(S,0,2.2)
v=np.clip(128+ (S-1)*118,0,255)
# neighbours fade to flat at the border of the sheet
Image.fromarray(v.astype(np.uint8)).save(OUT+'relief.webp',quality=84,method=6)
# ---- soft mask of the five states (clouds are thinner over them)
mw=460;mh=280;im=Image.new('L',(mw*2,mh*2),0);dr=ImageDraw.Draw(im)
for st in D['states'].values():
    for p in st['polys']: dr.polygon([((p[k]-BX[0])/(BX[1]-BX[0])*mw*2,(p[k+1]-BZ[0])/(BZ[1]-BZ[0])*mh*2) for k in range(0,len(p),2)],fill=255)
im.filter(ImageFilter.GaussianBlur(14)).resize((mw,mh)).save(OUT+'mask.webp',quality=80)
# ---- Charlotte
def dp(pts,e):
    if len(pts)<3: return pts
    a,b=pts[0],pts[-1];dx,dy=b[0]-a[0],b[1]-a[1];L=math.hypot(dx,dy)
    best,bi=0,0
    for k in range(1,len(pts)-1):
        q=pts[k];d=abs(dx*(q[1]-a[1])-dy*(q[0]-a[0]))/L if L>1e-9 else math.hypot(q[0]-a[0],q[1]-a[1])
        if d>best: best,bi=d,k
    return [a,b] if best<=e else dp(pts[:bi+1],e)[:-1]+dp(pts[bi:],e)
def rings(g):
    if g['type']=='Polygon': return [g['coordinates'][0]]
    if g['type']=='MultiPolygon': return [p[0] for p in g['coordinates']]
    if g['type']=='LineString': return [g['coordinates']]
    return g['coordinates']
def lines(f,e,cond=lambda p:True,closed=False):
    o=[]
    for ft in json.load(open(G+f))['features']:
        if not cond(ft['properties']): continue
        for rg in rings(ft['geometry']):
            pts=[proj(*q[:2]) for q in rg]
            if closed:
                xs=[q[0] for q in pts];ys=[q[1] for q in pts]
                if max(xs)-min(xs)<.8: continue
                m=len(pts)//2; s=dp(pts[:m+1],e)[:-1]+dp(pts[m:],e)
            else: s=dp(pts,e)
            if len(s)>1:o.append([round(t,3) for q in s for t in q])
    return o
K=proj(-80.886793,35.157546);T=proj(-80.854135,35.218174)
out={'bounds':[*BX,*BZ],'city':lines('city.json',.03,closed=True),'county':lines('county.json',.012,closed=True),'roads':lines('roads1.json',.008),'tryon':lines('tryon8.json',.005),
 'rooms':[{'id':'kenley','p':[round(t,3) for t in K]},{'id':'tryon','p':[round(t,3) for t in T]}]}
json.dump(out,open(OUT+'charlotte.json','w'),separators=(',',':'))
print(K,T,math.hypot(K[0]-T[0],K[1]-T[1]),{k:(len(x),sum(map(len,x))) for k,x in out.items() if isinstance(x,list) and k in('city','county','roads','tryon')})
for f in os.listdir(OUT): print(f,os.path.getsize(OUT+f))
