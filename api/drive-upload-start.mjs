import {googleAccessToken} from './drive-auth.mjs';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const {fileName,mimeType,fileSize}=req.body||{};
    const size=Number(fileSize||0);
    if(!fileName||!mimeType||!size) return res.status(400).json({error:'Missing file information'});
    if(size>100*1024*1024) return res.status(413).json({error:'Videos must be 100 MB or smaller'});
    if(!String(mimeType).startsWith('video/')) return res.status(400).json({error:'This upload route is for video files'});
    const folder=process.env.GOOGLE_DRIVE_FOLDER_ID;
    if(!folder) throw new Error('Google Drive folder is not configured');
    const token=await googleAccessToken();
    const safe=String(fileName).replace(/[\\/:*?"<>|]/g,'-').slice(0,180);
    const r=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType,size',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':mimeType,'X-Upload-Content-Length':String(size)},body:JSON.stringify({name:safe,mimeType,parents:[folder]})});
    if(!r.ok) throw new Error(`Google Drive could not start upload (${r.status})`);
    const uploadUrl=r.headers.get('location');
    if(!uploadUrl) throw new Error('Google Drive did not return an upload URL');
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({uploadUrl});
  }catch(e){console.error(e);return res.status(500).json({error:e.message||'Could not start upload'})}
}
