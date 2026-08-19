import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentsList from './StudentsList';
import TPOsList from './TPOsList';
import HRsList from './HRsList';
import AddStudentModal from './AddStudentModal';
import AddTpoModal from './AddTpoModal';
import { Tabs } from '../../components/ui';
import type { Student, TPO } from '../../data/types';

const VALID_TABS = ['Students', 'TPOs', 'HRs'] as const;

export default function UsersPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = (VALID_TABS as readonly string[]).includes(tabParam ?? '') ? (tabParam as typeof VALID_TABS[number]) : 'Students';
  const [tab, setTab] = useState<'Students' | 'TPOs' | 'HRs'>(initialTab);
  const [studentModal, setStudentModal] = useState<{ open: boolean; student?: Student }>({ open: false });
  const [tpoModal, setTpoModal] = useState<{ open: boolean; tpo?: TPO }>({ open: false });

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Users</h1>
      <p className="text-sm text-gray-500 mb-4">Students, TPOs, and HRs across the platform.</p>
      <Tabs tabs={['Students', 'TPOs', 'HRs']} active={tab} onChange={(t) => setTab(t as typeof tab)} />
      <div className="mt-4">
        {tab === 'Students' && (
          <StudentsList
            onAddStudent={() => setStudentModal({ open: true })}
            onEditStudent={(s) => setStudentModal({ open: true, student: s })}
          />
        )}
        {tab === 'TPOs' && (
          <TPOsList
            onAddTpo={() => setTpoModal({ open: true })}
            onEditTpo={(t) => setTpoModal({ open: true, tpo: t })}
          />
        )}
        {tab === 'HRs' && <HRsList />}
      </div>
      {studentModal.open && <AddStudentModal student={studentModal.student} onClose={() => setStudentModal({ open: false })} />}
      {tpoModal.open && <AddTpoModal tpo={tpoModal.tpo} onClose={() => setTpoModal({ open: false })} />}
    </div>
  );
}
