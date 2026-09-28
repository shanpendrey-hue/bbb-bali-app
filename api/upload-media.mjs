import crypto from 'node:crypto';

const TOKEN_URL='https://oauth2.googleapis.com/token';
const DRIVE_SCOPE='https://www.googleapis.com/auth/drive';

function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
function b64url(value){return Buffer.from(value).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}
function privateKey(){return (process.env.GOOGLE_PRIVATE_KEY||'').replace(/\\n/g,'\n')}
async function accessToken(){
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=privateKey();
  if(!email||!key)throw new Error('Google Drive credentials are not configured');
  const now=Math.floor(Date.now()/1000);
  const header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const claim=b64url(JSON.stringify({iss:email,scope:DRIVE_SCOPE,aud:TOKEN_URL,iat:now,exp:now+3600}));
  const unsigned=`${header}.${claim}`;
  const sig=crypto.sign('RSA-SHA256',Buffer.from(unsigned),key).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:`${unsigned}.${sig}`});
  const r=await fetch(TOKEN_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  const d=await r.json(); if(!r.ok||!d.access_token)throw new Error(d.error_description||d.error||'Could not authenticate with Google Drive');
  return d.access_token;
}

export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{success:false,error:'Method not allowed'});
  try{
    const token=await accessToken();
    if(req.query?.action==='publish'){
      const id=String(req.body?.fileId||'').trim(); if(!id)return json(res,400,{success:false,error:'Missing fileId'});
      const p=await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/permissions?supportsAllDrives=true`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({role:'reader',type:'anyone'})});
      if(!p.ok){const t=await p.text();throw new Error(`Drive permission failed: ${t.slice(0,300)}`)}
      return json(res,200,{success:true,fileId:id,viewUrl:`https://drive.google.com/file/d/${id}/view`,contentUrl:`https://drive.google.com/uc?export=download&id=${id}`});
    }
    const folder=process.env.GOOGLE_DRIVE_FOLDER_ID;
    const fileName=String(req.body?.fileName||`bbb-media-${Date.now()}`).replace(/[\r\n]/g,' ').slice(0,180);
    const mimeType=String(req.body?.mimeType||'application/octet-stream');
    const size=Number(req.body?.size||0);
    if(!folder)throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
    if(!size||size<1)return json(res,400,{success:false,error:'Missing file size'});
    const meta={name:fileName,parents:[folder]};
    const r=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,size,webViewLink',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':mimeType,'X-Upload-Content-Length':String(size)},body:JSON.stringify(meta)});
    if(!r.ok){const t=await r.text();throw new Error(`Drive session failed: ${t.slice(0,300)}`)}
    const uploadUrl=r.headers.get('location'); if(!uploadUrl)throw new Error('Google Drive did not return an upload URL');
    return json(res,200,{success:true,uploadUrl});
  }catch(err){console.error('upload-media',err);return json(res,500,{success:false,error:err?.message||'Upload setup failed'})}
}
