import {googleAccessToken} from './drive-auth.mjs';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const {fileId}=req.body||{};
    if(!fileId||!/^[A-Za-z0-9_-]+$/.test(fileId)) return res.status(400).json({error:'Invalid file ID'});
    const token=await googleAccessToken();
    const pr=await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({type:'anyone',role:'reader',allowFileDiscovery:false})});
    if(!pr.ok){const t=await pr.text();throw new Error(`Uploaded, but sharing could not be enabled (${pr.status}) ${t.slice(0,120)}`)}
    const mr=await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,webViewLink,webContentLink`,{headers:{Authorization:`Bearer ${token}`}});
    const meta=await mr.json();
    if(!mr.ok) throw new Error('Could not read uploaded file');
    return res.status(200).json({success:true,fileId,name:meta.name,mimeType:meta.mimeType,size:meta.size,viewUrl:meta.webViewLink,downloadUrl:meta.webContentLink||`https://drive.google.com/uc?export=download&id=${fileId}`,streamUrl:`https://drive.google.com/uc?export=download&id=${fileId}`});
  }catch(e){console.error(e);return res.status(500).json({error:e.message||'Could not finish upload'})}
}
