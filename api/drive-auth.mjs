import crypto from 'node:crypto';

function b64url(input){return Buffer.from(input).toString('base64url')}
function normalisePrivateKey(raw){
  let key=String(raw||'').trim();
  if(!key)throw new Error('GOOGLE_PRIVATE_KEY is empty');

  // Accept either the PEM itself, a JSON-stringified PEM, or the complete
  // service-account JSON copied into the Vercel variable by mistake.
  try{
    const parsed=JSON.parse(key);
    if(parsed&&typeof parsed==='object'&&parsed.private_key) key=String(parsed.private_key);
    else if(typeof parsed==='string') key=parsed;
  }catch{}

  // Also recover a private_key property from pasted JSON-ish text.
  if(!key.includes('-----BEGIN')){
    const prop=key.match(/["']?private_key["']?\s*:\s*["']([\s\S]*?)["']\s*(?:,|})/);
    if(prop) key=prop[1];
  }

  key=String(key)
    .replace(/^['"]|['"]$/g,'')
    .replace(/\\r\\n/g,'\n')
    .replace(/\\n/g,'\n')
    .replace(/\r\n/g,'\n')
    .trim();

  const pem=key.match(/-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA )?PRIVATE KEY-----/);
  if(pem) key=pem[0];
  if(!key.includes('-----BEGIN')||!key.includes('PRIVATE KEY-----')){
    throw new Error('GOOGLE_PRIVATE_KEY is not a valid PEM private key');
  }
  try{
    // Parse once here so Vercel returns a useful configuration error instead
    // of the opaque OpenSSL DECODER routines::unsupported message.
    return crypto.createPrivateKey({key,format:'pem'});
  }catch{
    throw new Error('GOOGLE_PRIVATE_KEY could not be parsed. In Vercel, paste only the private_key value from the downloaded service-account JSON, including BEGIN/END lines.');
  }
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
