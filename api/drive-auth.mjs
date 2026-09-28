import crypto from 'node:crypto';

function b64url(input){return Buffer.from(input).toString('base64url')}
export async function googleAccessToken(){
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey=process.env.GOOGLE_PRIVATE_KEY;
  if(!email||!rawKey) throw new Error('Google Drive credentials are not configured');
  const key=rawKey.replace(/\\n/g,'\n');
  const now=Math.floor(Date.now()/1000);
  const header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const claim=b64url(JSON.stringify({iss:email,scope:'https://www.googleapis.com/auth/drive',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const unsigned=`${header}.${claim}`;
  const sig=crypto.createSign('RSA-SHA256').update(unsigned).end().sign(key).toString('base64url');
  const assertion=`${unsigned}.${sig}`;
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});
  const data=await r.json();
  if(!r.ok||!data.access_token) throw new Error(data.error_description||data.error||'Could not authenticate with Google Drive');
  return data.access_token;
}
