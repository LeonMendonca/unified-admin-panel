export type IntakeKind = 'resume' | 'jd' | 'unknown';
export type IntakeStatus = 'Synced' | 'Draft job created' | 'Needs review' | 'Duplicate' | 'Error' | 'Received' | 'Ignored' | 'failed';

export interface WhatsAppIntakeEvent {
  id: string;
  when: string;
  senderName: string;
  senderWaId: string;
  documentName: string;
  documentType?: string;
  kind: IntakeKind;
  kindScore?: number;
  status: IntakeStatus;
  statusSubtext?: string;
}

export const whatsappIntakeEvents: WhatsAppIntakeEvent[] = [
  {
    id: 'wi-1',
    when: '34 minutes ago',
    senderName: 'Leon',
    senderWaId: '919137004109',
    documentName: 'resume (2).pdf',
    documentType: 'application/pdf',
    kind: 'resume',
    kindScore: 100,
    status: 'Synced',
    statusSubtext: 'Synced to talent.zigme'
  },
  {
    id: 'wi-2',
    when: 'about 1 hour ago',
    senderName: 'vivek prasad',
    senderWaId: '918638700318',
    documentName: 'resume (2).pdf',
    documentType: 'application/pdf',
    kind: 'resume',
    kindScore: 100,
    status: 'Synced',
    statusSubtext: 'Synced to talent.zigme'
  },
  {
    id: 'wi-3',
    when: 'about 1 hour ago',
    senderName: 'vivek prasad',
    senderWaId: '918638700318',
    documentName: 'whatsapp-document',
    kind: 'unknown',
    status: 'Ignored',
    statusSubtext: 'no_attachment'
  },
  {
    id: 'wi-4',
    when: 'about 2 hours ago',
    senderName: 'Ishani Dutt Sarkar',
    senderWaId: '919920069222',
    documentName: 'Bhajarang (3).pdf',
    documentType: 'application/pdf',
    kind: 'unknown',
    status: 'failed',
    statusSubtext: 'parse 504'
  },
  {
    id: 'wi-5',
    when: 'about 14 hours ago',
    senderName: 'Divyaa..!',
    senderWaId: '916354715064',
    documentName: 'whatsapp-document',
    kind: 'unknown',
    status: 'Ignored',
    statusSubtext: 'no_attachment'
  },
  {
    id: 'wi-6',
    when: '1 day ago',
    senderName: 'Zoya Kha',
    senderWaId: '918750075776',
    documentName: 'acc9db9b-c061-4522-9fd2-954240da3b0...jpeg',
    documentType: 'image/jpeg',
    kind: 'jd',
    kindScore: 90,
    status: 'Draft job created',
    statusSubtext: 'View draft job →'
  },
  {
    id: 'wi-7',
    when: '1 day ago',
    senderName: 'انس خان 🖤',
    senderWaId: '916362082051',
    documentName: 'UZAIF JATTI RESUME.docx',
    documentType: 'application/vnd.openxmlformats-officedocumen...',
    kind: 'resume',
    kindScore: 100,
    status: 'Synced',
    statusSubtext: 'Synced to talent.zigme'
  },
  {
    id: 'wi-8',
    when: '1 day ago',
    senderName: 'utkarshakhambe',
    senderWaId: '919987578125',
    documentName: 'whatsapp-document',
    kind: 'unknown',
    status: 'Ignored',
    statusSubtext: 'no_attachment'
  }
];
