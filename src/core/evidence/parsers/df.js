import {buildEvidenceResult,unsupported} from '../result.js';
const percent=value=>/^\d{1,3}%$/.test(value);
export function parseDf(text){
  const lines=text.split('\n').map(line=>line.trim()).filter(Boolean);
  const header=lines[0]||'';
  const recognizedHeader=/\bFilesystem\b/i.test(header)&&/(?:Use%|IUse%|Capacity)/i.test(header)&&/(?:Mounted on|Mounted|Target)/i.test(header);
  if(lines.length<2||!recognizedHeader)return unsupported('This does not contain a recognized GNU/POSIX df header and data row.',{source:'df'});
  const inode=/(?:Inodes|IUsed|IFree|IUse%)/i.test(header);
  const rows=[];
  for(const line of lines.slice(1,101)){
    const parts=line.split(/\s+/);const pIndex=parts.findIndex(percent);
    if(pIndex<3||pIndex>=parts.length-1)continue;
    rows.push({filesystem:parts[0],total:parts[pIndex-3],used:parts[pIndex-2],available:parts[pIndex-1],percent:parts[pIndex],mount:parts.slice(pIndex+1).join(' ')});
  }
  if(!rows.length)return unsupported('A df-like header was found, but no rows could be separated safely.',{source:'df',status:'partial'});
  const observations=rows.flatMap(row=>[
    {label:`${row.mount} reported usage`,value:row.percent},
    {label:`${row.mount} reported available`,value:row.available},
    {label:`${row.mount} filesystem`,value:row.filesystem}
  ]);
  const high=rows.filter(row=>Number.parseInt(row.percent,10)>=90);
  const interpretations=high.length?[`${high.map(row=>row.mount).join(', ')} ${high.length===1?'reports':'report'} high ${inode?'inode':'block'} usage. Review filesystem-specific operating thresholds and absolute free capacity.`]:['The parsed rows do not report usage at or above the interpreter attention threshold.'];
  return buildEvidenceResult({
    parserId:'df-usage',title:`${inode?'Filesystem inode':'Filesystem space'} evidence recognized`,summary:`Parsed ${rows.length} df row(s) from human-readable output.`,
    recognition:{status:'recognized-human-readable',format:inode?'df-inodes':/Capacity/i.test(header)?'df-posix':'df-blocks'},observations,interpretations,
    unknowns:[`This output does not identify the files, process, or service responsible for ${inode?'inode':'space'} use.`,'Formatting and semantics may vary by operating system, locale, filesystem, and terminal wrapping.'],
    nextChecks:inode?['Confirm the affected filesystem, then identify which directory tree contains unusually many entries before deleting anything.']:['Run df -i for the affected path and use findmnt -T <affected-path> if the target filesystem is unclear.'],
    relatedJourneyId:'journey-linux-disk-full',formatted:rows.map(r=>`${r.mount}: ${r.percent} used, ${r.available} available`).join('\n')
  });
}
