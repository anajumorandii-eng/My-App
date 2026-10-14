import { useEffect, useState } from 'react';
import { subscribeStudyData, type StudyDataDomain } from '../lib/studyDataEvents';
export function useStudyDataRevision(uid: string | null | undefined, domain: StudyDataDomain) {
  const [revision,setRevision]=useState(0);
  useEffect(()=>subscribeStudyData((owner,changed)=>{
    if (uid===owner && domain===changed) setRevision(value=>value+1);
  }),[uid,domain]);
  return revision;
}
