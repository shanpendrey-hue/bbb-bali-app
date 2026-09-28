import crypto from 'node:crypto';

function b64url(input){return Buffer.from(input).toString('base64url')}
function normalisePrivateKey(raw){
  let key=String(raw||'').trim();
  if(!key)throw new Error('GOOGLE_PRIVATE_KEY is empty');
  // Vercel values are sometimes pasted as a JSON string, including the outer quotes.
  if((key.startsWith('"')&&key.endsWith('"'))||(key.startsWith("'")&&key.endsWith("'"))){
    try{key=JSON.parse(key)}catch{key=key.slice(1,-1)}
  }
  key=String(key).replace(/\\r\\n/g,'\n').replace(/\\n/g,'\n').replace(/\r\n/g,'\n').trim();
  // If the value was copied as the complete JSON property, keep only the PEM payload.
  const pem=key.match(/-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA )?PRIVATE KEY-----/);
  if(pem)key=pem[0].replace(/\\n/g,'\n');
  if(!key.includes('-----BEGIN')||!key.includes('PRIVATE KEY-----'))throw new Error('GOOGLE_PRIVATE_KEY is not a valid PEM private key');
  return key;
}
export async function googleAccessToken(){
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey=process.env.GOOGLE_PRIVATE_KEY;
  if(!email||!rawKey)throw new Error('Google Drive credentials are not configured');
  const key=normalisePrivateKey(rawKey);
  const now=Math.floor(Date.now()/1000);
  const header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const claim=b64url(JSON.stringify({iss:email,scope:'https://www.googleapis.com/auth/drive',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const unsigned=`${header}.${claim}`;
  let signature;
  try{signature=crypto.sign('RSA-SHA256',Buffer.from(unsigned),key).toString('base64url')}
  catch(err){throw new Error(`Google private key could not be read: ${err?.code||err?.message||'invalid key'}`)}
  const assertion=`${unsigned}.${signature}`;
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});
  let data={};try{data=await r.json()}catch{}
  if(!r.ok||!data.access_token)throw new Error(data.error_description||data.error||'Could not authenticate with Google Drive');
  return data.access_token;
}
