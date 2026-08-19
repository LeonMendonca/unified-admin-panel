import { useEffect, useMemo, useState } from 'react';
import { emailTemplates, campaignLogs, suppressions } from '../../data/emailTemplates';
import { students, getJobApplications } from '../../data/students';
import { tpos } from '../../data/tpos';
import type { EmailTemplate } from '../../data/types';
import { Badge, Card, SectionTitle, Table, Button, EmptyState, Toggle } from '../../components/ui';
import Accordion from '../../components/Accordion';

function PageHeader() {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Email Templates</h1>
      <p className="text-sm text-gray-500">
        Hiring's candidate/job trigger templates, Talent's bulk-send tools for Students and TPOs, and Campus's shared template model — all in one place.
      </p>
    </div>
  );
}

export default function TemplatesPage() {
  const [editing, setEditing] = useState<EmailTemplate | null | 'new'>(null);

  return (
    <div>
      <PageHeader />
      {editing ? <TemplateEditor template={editing === 'new' ? null : editing} onBack={() => setEditing(null)} /> : <TemplatesList onEdit={setEditing} />}
    </div>
  );
}

export function SendToCandidatesPage() {
  return (
    <div>
      <PageHeader />
      <BulkSendWizard audience="Candidate" />
    </div>
  );
}

export function SendToTposPage() {
  return (
    <div>
      <PageHeader />
      <SendToTposWizard />
    </div>
  );
}

export function CampaignLogsPage() {
  return (
    <div>
      <PageHeader />
      <CampaignLogsTable />
    </div>
  );
}

export function SuppressionsPage() {
  return (
    <div>
      <PageHeader />
      <SuppressionsPanel />
    </div>
  );
}

export function TestTemplatesPage() {
  return (
    <div>
      <PageHeader />
      <TestTemplates />
    </div>
  );
}

export function AutomationSettings() {
  const [autoRejection, setAutoRejection] = useState(true);
  const [autoApplicationReceived, setAutoApplicationReceived] = useState(true);
  return (
    <div className="space-y-3 mb-5">
      <Card className="p-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Auto-send rejection emails</p>
          <p className="text-xs text-gray-500 mt-1">
            When ON, candidates automatically receive your "Candidate Rejection Notification" template (with the optional reason) whenever you reject them. When OFF, rejections stay silent.
          </p>
        </div>
        <Toggle checked={autoRejection} onChange={setAutoRejection} />
      </Card>
      <Card className="p-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Auto-send application-received emails</p>
          <p className="text-xs text-gray-500 mt-1">
            When ON, candidates who apply via talent.zigme.in automatically receive your "Application Received (Talent Portal)" template — with hiring steps, JD summary, and a ZigMe Talent CTA. When OFF, they receive nothing.
          </p>
        </div>
        <Toggle checked={autoApplicationReceived} onChange={setAutoApplicationReceived} />
      </Card>
    </div>
  );
}

function TemplatesList({ onEdit }: { onEdit: (t: EmailTemplate | 'new') => void }) {
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('Audience');
  const [statusFilter, setStatusFilter] = useState('All Templates');

  const nonHiringTemplates = emailTemplates.filter((t) => t.source !== 'Hiring');

  const rows = nonHiringTemplates
    .filter((t) => (t.name + t.key + t.subject).toLowerCase().includes(search.toLowerCase()))
    .filter((t) => audienceFilter === 'Audience' || t.audience.includes(audienceFilter as EmailTemplate['audience'][number]))
    .filter((t) => statusFilter === 'All Templates' || t.status === statusFilter);

  const readyCount = nonHiringTemplates.filter((t) => t.status === 'Active').length;
  const attentionCount = nonHiringTemplates.filter((t) => t.status === 'Inactive').length;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-4">Hiring's candidate/job system templates now live under HR Templates in the sidebar.</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <p className="text-2xl font-bold text-emerald-700">{readyCount}</p>
          <p className="text-xs text-emerald-700">Ready to use</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-2xl font-bold text-amber-700">{attentionCount}</p>
          <p className="text-xs text-amber-700">Needs attention</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{nonHiringTemplates.length}</p>
          <p className="text-xs text-blue-700">All templates</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="flex-1 min-w-[220px] text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
        />
        <select value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>Audience</option>
          <option>Student</option><option>Candidate</option><option>TPO</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>All Templates</option>
          <option>Active</option><option>Inactive</option>
        </select>
        <Button className="ml-auto" onClick={() => onEdit('new')}>+ Create Template</Button>
      </div>

      <p className="text-xs text-gray-400 mb-2">{rows.length} templates found</p>
      <div className="grid grid-cols-3 gap-4">
        {rows.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-start justify-between mb-1">
              <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
              <Badge tone={t.status === 'Active' ? 'green' : 'gray'}>{t.status}</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{t.subject}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {t.audience.map((a) => <Badge key={a}>{a}</Badge>)}
            </div>
            <p className="text-xs text-gray-400 mb-3">{t.variables.length} variables · v{t.version} · Updated {t.lastEdited}</p>
            <div className="flex gap-2 text-xs">
              <button onClick={() => onEdit(t)} className="text-purple-600 font-medium">Edit</button>
              <button className="text-gray-500">Preview</button>
              <button className="text-amber-600">Deactivate</button>
              <button className="text-rose-600">Delete</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface EditableVariable {
  id: string;
  key: string;
  label: string;
  type: 'Text' | 'Number' | 'Date' | 'URL' | 'Boolean';
  defaultValue: string;
  required: boolean;
}

const TOOLBAR_GROUPS = ['↶ ↷', 'B I', 'A ▾', '≡ ≡ ≡ ≡', '• 1.', '⇤ ⇥', '🔗 🖼'];

function TemplateEditor({ template, onBack }: { template: EmailTemplate | null; onBack: () => void }) {
  const isNew = !template;
  const [key, setKey] = useState(template?.key ?? '');
  const [name, setName] = useState(template?.name ?? '');
  const [description, setDescription] = useState(template ? `${template.name} — ${template.trigger}` : '');
  const [audience, setAudience] = useState<EmailTemplate['audience']>(template?.audience ?? ['Student']);
  const [active, setActive] = useState(template?.status !== 'Inactive');
  const [mainTab, setMainTab] = useState<'Content' | 'Variables' | 'Sample Data'>('Content');
  const [subject, setSubject] = useState(template?.subject ?? '');
  const [html, setHtml] = useState(template?.body ?? '');
  const [plainText, setPlainText] = useState('');
  const [variables, setVariables] = useState<EditableVariable[]>(
    template ? template.variables.map((v, i) => ({ id: `v${i}`, key: v, label: v, type: 'Text', defaultValue: '', required: false })) : []
  );
  const [sampleData, setSampleData] = useState<Record<string, string>>({});

  function addVariable() {
    setVariables([...variables, { id: `v${Date.now()}`, key: '', label: '', type: 'Text', defaultValue: '', required: false }]);
  }
  function updateVariable(id: string, patch: Partial<EditableVariable>) {
    setVariables(variables.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }
  function removeVariable(id: string) {
    setVariables(variables.filter((v) => v.id !== id));
  }

  const namedVariables = variables.filter((v) => v.key);
  const [previewOpen, setPreviewOpen] = useState(false);

  function resolve(text: string) {
    return namedVariables.reduce((acc, v) => {
      const value = sampleData[v.id] || v.defaultValue || `{{${v.key}}}`;
      return acc.split(`{{${v.key}}}`).join(value);
    }, text);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 mt-1 text-lg leading-none">←</button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isNew ? 'Create Template' : 'Edit Template'}</h2>
            <p className="text-sm text-gray-500">{isNew ? 'Create a new email template' : `Editing ${template!.name}`}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" onClick={() => setPreviewOpen(true)}>👁 Preview</Button>
          <Button onClick={onBack}>💾 Save Template</Button>
        </div>
      </div>

      <Card className="p-5 mb-4">
        <SectionTitle>Template Configuration</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-xs text-gray-500">Key*</label>
            <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="welcome_email" className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Name*</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome Email" className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
          </div>
        </div>
        <label className="text-xs text-gray-500">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Describe what this template is used for..." className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />

        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1.5">Audience</p>
          <div className="flex gap-2">
            {(['Student', 'Candidate', 'TPO'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAudience(audience.includes(a) ? audience.filter((x) => x !== a) : [...audience, a])}
                className={`px-4 py-2 rounded-md text-sm font-medium ${audience.includes(a) ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
              >
                {a}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Determines which bulk emailer can use this template.</p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Toggle checked={active} onChange={setActive} />
          <span className="text-sm text-gray-700">Active</span>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex bg-blue-50">
          {(['Content', 'Variables', 'Sample Data'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`flex-1 py-3 text-sm font-semibold ${mainTab === t ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {mainTab === 'Content' && (
            <div>
              <SectionTitle>Email Content</SectionTitle>
              <label className="text-xs text-gray-500">Subject Template*</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Welcome to {{companyName}}, {{userName}}!"
                className="w-full mt-1 mb-4 border border-gray-200 rounded-md px-3 py-2 text-sm"
              />

              <label className="text-xs text-gray-500">HTML Template*</label>
              <div className="mt-1 border border-gray-200 rounded-md overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-3 py-2 bg-gray-50 text-gray-400 text-sm select-none">
                  {TOOLBAR_GROUPS.map((g, i) => (
                    <span key={i} className="tracking-widest">{g}</span>
                  ))}
                </div>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  rows={9}
                  placeholder="Write your email HTML here..."
                  className="w-full px-3 py-2 text-sm outline-none resize-y"
                />
                <div className="flex justify-end px-3 py-1.5 border-t border-gray-100 text-xs text-gray-400">
                  {html.trim() ? html.trim().split(/\s+/).length : 0} words
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Use {'{{variableName}}'} for dynamic content</p>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1.5">Available Variables</p>
                <p className="text-xs text-gray-400 mb-2">Click on a variable to insert it at the cursor position</p>
                {namedVariables.length === 0 ? (
                  <p className="text-xs text-gray-400">Add variables in the Variables tab to insert them here.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {namedVariables.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setHtml(html + `{{${v.key}}}`)}
                        className="text-xs font-mono bg-white border border-gray-200 rounded-md px-2.5 py-1.5 hover:bg-gray-50 text-gray-700"
                      >
                        {'{{' + v.key + '}}'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Plain Text Template</label>
                <textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  rows={4}
                  placeholder="Plain text version of your email..."
                  className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {mainTab === 'Variables' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <SectionTitle>Template Variables</SectionTitle>
                <Button size="sm" onClick={addVariable}>+ Add Variable</Button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Define the dynamic fields that can be used in your template</p>
              {variables.length === 0 ? <EmptyState label="No variables yet" /> : (
                <div className="space-y-3">
                  {variables.map((v, i) => (
                    <Card key={v.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-purple-700">Variable {i + 1}</p>
                        <button onClick={() => removeVariable(v.id)} className="text-rose-500 text-sm">🗑</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-gray-500">Key</label>
                          <input value={v.key} onChange={(e) => updateVariable(v.id, { key: e.target.value })} placeholder="e.g. loginUrl" className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Label</label>
                          <input value={v.label} onChange={(e) => updateVariable(v.id, { label: e.target.value })} placeholder="Login" className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Type</label>
                          <select value={v.type} onChange={(e) => updateVariable(v.id, { type: e.target.value as EditableVariable['type'] })} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                            <option>Text</option><option>Number</option><option>Date</option><option>URL</option><option>Boolean</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Default Value</label>
                          <input value={v.defaultValue} onChange={(e) => updateVariable(v.id, { defaultValue: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Toggle checked={v.required} onChange={(val) => updateVariable(v.id, { required: val })} />
                        <span className="text-sm text-gray-700">Required</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {mainTab === 'Sample Data' && (
            <div>
              <SectionTitle>Sample Data</SectionTitle>
              <p className="text-xs text-gray-500 mb-4">Set sample values for variables to preview your template</p>
              {namedVariables.length === 0 ? <EmptyState label="Add variables first" /> : (
                <div className="space-y-3 max-w-md">
                  {namedVariables.map((v) => (
                    <div key={v.id}>
                      <label className="text-sm font-medium text-gray-700">{v.label || v.key}</label>
                      <input
                        value={sampleData[v.id] ?? ''}
                        onChange={(e) => setSampleData({ ...sampleData, [v.id]: e.target.value })}
                        placeholder={`Sample value for ${v.key}`}
                        className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {previewOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setPreviewOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-800">Email Preview</p>
              <button onClick={() => setPreviewOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-1">Subject</p>
              <p className="text-base font-semibold text-gray-900 mb-4">{resolve(subject) || 'No subject yet'}</p>
              <p className="text-xs text-gray-500 mb-1">Body</p>
              <div className="border border-gray-100 rounded-md p-4 bg-gray-50 text-sm whitespace-pre-line text-gray-700">
                {resolve(html) || 'Nothing to preview yet.'}
              </div>
              {namedVariables.some((v) => !sampleData[v.id] && !v.defaultValue) && (
                <p className="text-xs text-amber-600 mt-3">Some variables have no sample or default value yet, so their placeholders are shown as-is.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BulkSendWizard({ audience }: { audience: 'Candidate' }) {
  const [step, setStep] = useState(1);
  const candidateTemplates = emailTemplates.filter((t) => t.audience.includes(audience));
  const [templateId, setTemplateId] = useState(candidateTemplates[0]?.id ?? '');
  const [sent, setSent] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);

  const steps = ['Select Template', 'Select Recipients', 'Confirm & Send'];

  return (
    <Card className={`p-5 ${step === 2 ? 'max-w-4xl' : 'max-w-2xl'}`}>
      <SectionTitle>Send Email — bulk emails to selected candidates</SectionTitle>
      <div className="flex items-center gap-2 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</div>
            <span className={`text-sm ${step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <span className="text-gray-300 mx-2">—</span>}
          </div>
        ))}
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
          <p className="mt-3 font-medium text-gray-800">Campaign sent</p>
          <p className="text-sm text-gray-500 mt-1">Check Campaign Logs for delivery status.</p>
          <Button onClick={() => { setSent(false); setStep(1); }}>Send another</Button>
        </div>
      ) : (
        <>
          {step === 1 && (
            <div className="space-y-2">
              {candidateTemplates.map((t) => (
                <label key={t.id} className={`flex items-start gap-3 border rounded-md p-3 cursor-pointer ${templateId === t.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}>
                  <input type="radio" name="tmpl" checked={templateId === t.id} onChange={() => setTemplateId(t.id)} className="mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.subject}</p>
                    <div className="flex gap-1.5 mt-1">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">Key: {t.key}</code>
                      <Badge>{t.variables.length} variables</Badge>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {step === 2 && <SelectRecipients onCountChange={setRecipientCount} />}
          {step === 3 && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>Template: <span className="font-medium text-gray-800">{candidateTemplates.find((t) => t.id === templateId)?.name}</span></p>
              <p>Recipients selected: <span className="font-medium text-gray-800">{recipientCount.toLocaleString()}</span></p>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-5">
            {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
            {step < 3 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
            {step === 3 && <Button onClick={() => setSent(true)}>Confirm & Send</Button>}
          </div>
        </>
      )}
    </Card>
  );
}

const EDUCATION_LEVELS = ['Graduate', 'Post Graduate', 'Pursuing Graduation', 'Pursuing Post Graduation', '12th'];

function SelectRecipients({ onCountChange }: { onCountChange: (n: number) => void }) {
  const [affiliation, setAffiliation] = useState('All Students');
  const [accountStatus, setAccountStatus] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [blockedStatus, setBlockedStatus] = useState('All');
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [regFrom, setRegFrom] = useState('');
  const [regTo, setRegTo] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [locationTags, setLocationTags] = useState<string[]>([]);

  const [notPlayedDays, setNotPlayedDays] = useState(0);
  const [neverPlayedRoom, setNeverPlayedRoom] = useState(false);
  const [notLoggedInDays, setNotLoggedInDays] = useState(0);
  const [neverLoggedIn, setNeverLoggedIn] = useState(false);
  const [emailRecency, setEmailRecency] = useState('Off');
  const [resumeFlags, setResumeFlags] = useState<string[]>([]);
  const [notAppliedDays, setNotAppliedDays] = useState(0);
  const [neverApplied, setNeverApplied] = useState(false);
  const [incompleteAssessments, setIncompleteAssessments] = useState(false);
  const [noWriScore, setNoWriScore] = useState(false);
  const [wriScoreBelow, setWriScoreBelow] = useState(0);

  const anyFilterApplied =
    affiliation !== 'All Students' ||
    accountStatus !== 'All' ||
    activeStatus !== 'All' ||
    blockedStatus !== 'All' ||
    educationLevels.length > 0 ||
    !!regFrom || !!regTo ||
    locationTags.length > 0 ||
    notPlayedDays > 0 || neverPlayedRoom ||
    notLoggedInDays > 0 || neverLoggedIn ||
    emailRecency !== 'Off' ||
    resumeFlags.length > 0 ||
    notAppliedDays > 0 || neverApplied ||
    incompleteAssessments || noWriScore || wriScoreBelow > 0;

  const matches = useMemo(() => {
    if (!anyFilterApplied) return [];
    return students.filter((s) => {
      if (affiliation === 'Has College' && !s.collegeId) return false;
      if (affiliation === 'No College' && s.collegeId) return false;
      if (accountStatus !== 'All' && s.status !== accountStatus) return false;
      if (activeStatus === 'Active' && s.status !== 'Registered') return false;
      if (activeStatus === 'Inactive' && s.status === 'Registered') return false;
      if (blockedStatus === 'Blocked' && !s.blocked) return false;
      if (blockedStatus === 'Not Blocked' && s.blocked) return false;
      if (regFrom && s.registeredOn < regFrom) return false;
      if (regTo && s.registeredOn > regTo) return false;
      if (locationTags.length > 0) {
        const haystack = [s.city, s.state, ...s.preferredLocations].join(' ').toLowerCase();
        if (!locationTags.some((tag) => haystack.includes(tag.toLowerCase()))) return false;
      }
      if (neverApplied && getJobApplications(s.id).length > 0) return false;
      if (notAppliedDays > 0 && getJobApplications(s.id).length === 0) return false;
      if (noWriScore && s.hasTestAttempt) return false;
      if (wriScoreBelow > 0 && s.placementReadinessScore >= wriScoreBelow) return false;
      if (incompleteAssessments && s.hasCompletedTest) return false;
      return true;
    });
  }, [affiliation, accountStatus, activeStatus, blockedStatus, regFrom, regTo, locationTags, neverApplied, notAppliedDays, noWriScore, wriScoreBelow, incompleteAssessments, anyFilterApplied]);

  useEffect(() => onCountChange(matches.length), [matches, onCountChange]);

  function toggleInArray(arr: string[], setArr: (v: string[]) => void, value: string) {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  }

  function addLocationTag() {
    const v = locationInput.trim();
    if (v && !locationTags.includes(v)) setLocationTags([...locationTags, v]);
    setLocationInput('');
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <SectionTitle>Select Recipients</SectionTitle>
          <p className="text-xs text-gray-500 -mt-2">Filter candidates to receive the email</p>
        </div>
        <div className="text-right">
          <Badge tone={anyFilterApplied ? 'green' : 'gray'}>{matches.length} recipients</Badge>
          {!anyFilterApplied && <p className="text-xs text-gray-400 mt-1">Apply at least one filter to select recipients</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500">Affiliation</label>
          <select value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
            <option>All Students</option>
            <option>Has College</option>
            <option>No College</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Account Status</label>
          <select value={accountStatus} onChange={(e) => setAccountStatus(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
            <option>All</option>
            <option>Registered</option>
            <option>Pending</option>
            <option>Disabled</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Active Status</label>
          <select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Blocked Status</label>
          <select value={blockedStatus} onChange={(e) => setBlockedStatus(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
            <option>All</option>
            <option>Blocked</option>
            <option>Not Blocked</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Education Level</label>
          <div className="mt-1 border border-gray-200 rounded-md p-2.5 space-y-1.5">
            {EDUCATION_LEVELS.map((level) => (
              <label key={level} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={educationLevels.includes(level)} onChange={() => toggleInArray(educationLevels, setEducationLevels, level)} />
                {level}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">Registration Date</label>
          <div className="flex gap-2 mt-1">
            <div className="flex-1">
              <p className="text-xs text-gray-400">From</p>
              <input type="date" value={regFrom} onChange={(e) => setRegFrom(e.target.value)} className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">To</p>
              <input type="date" value={regTo} onChange={(e) => setRegTo(e.target.value)} className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500">Current Location</label>
        <input
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocationTag(); } }}
          placeholder="Type a city and press Enter (e.g. pune)"
          className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">Type a city and press Enter to add. Matches if a student's current or preferred location contains ANY of the added terms (OR).</p>
        {locationTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {locationTags.map((tag) => (
              <Badge key={tag}>
                {tag} <button className="ml-1" onClick={() => setLocationTags(locationTags.filter((t) => t !== tag))}>×</button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs font-semibold text-gray-400 tracking-wide mb-2">ENGAGEMENT FILTERS</p>
      <div className="space-y-3">
        <Accordion title="Activity & Engagement">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Game Room Activity</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Not played in <input type="number" min={0} value={notPlayedDays} onChange={(e) => setNotPlayedDays(Number(e.target.value))} className="w-16 border border-gray-200 rounded-md px-2 py-1" /> days
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
                <input type="checkbox" checked={neverPlayedRoom} onChange={(e) => setNeverPlayedRoom(e.target.checked)} /> Never played any room
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Login Activity</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Not logged in for <input type="number" min={0} value={notLoggedInDays} onChange={(e) => setNotLoggedInDays(Number(e.target.value))} className="w-16 border border-gray-200 rounded-md px-2 py-1" /> days
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
                <input type="checkbox" checked={neverLoggedIn} onChange={(e) => setNeverLoggedIn(e.target.checked)} /> Never logged in (no account)
              </label>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-1">Email Recency</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Not sent any email in
              <select value={emailRecency} onChange={(e) => setEmailRecency(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1 bg-white">
                <option>Off</option>
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-1">Excludes students who already received an email from us in the chosen window. Use this to avoid re-sending to people you already contacted (including yesterday's hard bounces).</p>
          </div>
        </Accordion>

        <Accordion title="Resume Status" defaultOpen={false}>
          <div className="space-y-1.5">
            {['No completed resume (not published)', 'Never started a Zigme resume', 'No resume at all (no Zigme resume & no job-application upload)'].map((flag) => (
              <label key={flag} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={resumeFlags.includes(flag)} onChange={() => toggleInArray(resumeFlags, setResumeFlags, flag)} />
                {flag}
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Job Applications" defaultOpen={false}>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Not applied in <input type="number" min={0} value={notAppliedDays} onChange={(e) => setNotAppliedDays(Number(e.target.value))} className="w-16 border border-gray-200 rounded-md px-2 py-1" /> days
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
            <input type="checkbox" checked={neverApplied} onChange={(e) => setNeverApplied(e.target.checked)} /> Never applied to any job
          </label>
        </Accordion>

        <Accordion title="Assessment Status" defaultOpen={false}>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={incompleteAssessments} onChange={(e) => setIncompleteAssessments(e.target.checked)} /> Haven't completed all assessments
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1.5">
            <input type="checkbox" checked={noWriScore} onChange={(e) => setNoWriScore(e.target.checked)} /> No WRI score
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
            WRI score below <input type="number" min={0} max={100} value={wriScoreBelow} onChange={(e) => setWriScoreBelow(Number(e.target.value))} className="w-16 border border-gray-200 rounded-md px-2 py-1" /> %
          </div>
        </Accordion>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <SectionTitle>Preview Recipients (First 10)</SectionTitle>
          <button className="text-xs text-purple-600 flex items-center gap-1">⟳ Refresh</button>
        </div>
        <Card className="p-4">
          {matches.length === 0 ? (
            <EmptyState label={anyFilterApplied ? 'No students match the current filters' : 'Apply at least one filter to preview recipients'} />
          ) : (
            <Table headers={['Name', 'Email', 'College', 'Status']}>
              {matches.slice(0, 10).map((s) => (
                <tr key={s.id}>
                  <td className="py-2 px-3 text-gray-800">{s.name}</td>
                  <td className="py-2 px-3 text-gray-600">{s.email}</td>
                  <td className="py-2 px-3 text-gray-600">{s.collegeName ?? '—'}</td>
                  <td className="py-2 px-3"><Badge tone={s.status === 'Registered' ? 'green' : 'yellow'}>{s.status}</Badge></td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}

function SelectTposRecipients({ onCountChange }: { onCountChange: (n: number) => void }) {
  const [audienceOption, setAudienceOption] = useState<'All TPOs' | 'Active only' | 'Blocked only'>('All TPOs');

  const matches = useMemo(() => {
    return tpos.filter((t) => {
      if (audienceOption === 'Active only') return t.status === 'Registered';
      if (audienceOption === 'Blocked only') return t.status === 'Disabled';
      return true;
    });
  }, [audienceOption]);

  useEffect(() => onCountChange(matches.length), [matches, onCountChange]);

  const pageSize = 25;
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));

  return (
    <div>
      <SectionTitle>Select TPO Recipients</SectionTitle>
      <p className="text-xs text-gray-500 -mt-2 mb-4">Choose which TPOs receive this email</p>

      <p className="text-xs text-gray-500 mb-2">Audience</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {([
          ['All TPOs', 'Every TPO with an email on file'],
          ['Active only', 'Accounts currently enabled'],
          ['Blocked only', 'Accounts currently disabled'],
        ] as const).map(([label, desc]) => (
          <label
            key={label}
            className={`border rounded-md p-3 cursor-pointer ${audienceOption === label ? 'border-gray-800 bg-gray-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center gap-2">
              <input type="radio" name="tpoAudience" checked={audienceOption === label} onChange={() => setAudienceOption(label)} />
              <span className="text-sm font-medium text-gray-800">{label}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-5">{desc}</p>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-md p-4 mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
          <p className="text-xs text-gray-500">recipients selected</p>
        </div>
        <button className="text-xs text-purple-600 flex items-center gap-1">⟳ Refresh</button>
      </div>

      <SectionTitle>Preview</SectionTitle>
      <p className="text-xs text-gray-500 mb-2">Page 1 of {pageCount} · {matches.length} matching TPOs</p>
      {matches.length === 0 ? (
        <EmptyState label="No TPOs match this audience" />
      ) : (
        <Table headers={['Name', 'Email', 'College', 'Phone', 'Status']}>
          {matches.slice(0, pageSize).map((t) => (
            <tr key={t.id}>
              <td className="py-2 px-3 text-gray-800">{t.name}</td>
              <td className="py-2 px-3 text-gray-600">{t.email}</td>
              <td className="py-2 px-3 text-gray-600">{t.collegeName}</td>
              <td className="py-2 px-3 text-gray-600">{t.contact}</td>
              <td className="py-2 px-3"><Badge tone={t.status === 'Registered' ? 'green' : t.status === 'Pending' ? 'yellow' : 'red'}>{t.status === 'Registered' ? 'Active' : t.status}</Badge></td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}

function SendToTposWizard() {
  const [step, setStep] = useState(1);
  const tpoTemplates = emailTemplates.filter((t) => t.audience.includes('TPO'));
  const [templateId, setTemplateId] = useState(tpoTemplates[0]?.id ?? '');
  const [sent, setSent] = useState(false);
  const [tpoRecipientCount, setTpoRecipientCount] = useState(0);

  const steps = ['Select Template', 'Select TPOs', 'Confirm & Send'];

  return (
    <Card className={`p-5 ${step === 2 ? 'max-w-4xl' : 'max-w-2xl'}`}>
      <SectionTitle>Send Email to TPOs — bulk emails to Training & Placement Officers</SectionTitle>

      <div className="flex items-center gap-2 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</div>
            <span className={`text-sm ${step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <span className="text-gray-300 mx-2">—</span>}
          </div>
        ))}
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
          <p className="mt-3 font-medium text-gray-800">Sent to TPOs</p>
          <Button onClick={() => { setSent(false); setStep(1); }}>Send another</Button>
        </div>
      ) : (
        <>
          {step === 1 && (
            <div className="space-y-2">
              {tpoTemplates.length === 0 ? <EmptyState label="No TPO templates" /> : tpoTemplates.map((t) => (
                <label key={t.id} className={`flex items-start gap-3 border rounded-md p-3 cursor-pointer ${templateId === t.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}>
                  <input type="radio" name="tpotmpl" checked={templateId === t.id} onChange={() => setTemplateId(t.id)} className="mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.subject}</p>
                    <div className="flex gap-1.5 mt-1">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">Key: {t.key}</code>
                      <Badge>{t.variables.length} variables</Badge>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {step === 2 && <SelectTposRecipients onCountChange={setTpoRecipientCount} />}
          {step === 3 && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>Template: <span className="font-medium text-gray-800">{tpoTemplates.find((t) => t.id === templateId)?.name}</span></p>
              <p>Recipients selected: <span className="font-medium text-gray-800">{tpoRecipientCount.toLocaleString()} TPOs</span></p>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-5">
            {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
            {step < 3 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
            {step === 3 && <Button onClick={() => setSent(true)}>Confirm & Send</Button>}
          </div>
        </>
      )}
    </Card>
  );
}

function CampaignLogsTable() {
  return (
    <Card className="p-4">
      <SectionTitle>Email Campaigns ({campaignLogs.length} found)</SectionTitle>
      <Table headers={['Date & Time', 'Template', 'Audience', 'Recipients', 'Sent', 'Failed', 'Status', 'Duration', '']}>
        {campaignLogs.map((c) => (
          <tr key={c.id}>
            <td className="py-2 px-3 text-gray-600">{c.sentDate}</td>
            <td className="py-2 px-3 font-medium text-gray-800">{c.templateName}</td>
            <td className="py-2 px-3"><Badge tone={c.audience === 'TPO' ? 'purple' : 'blue'}>{c.audience}</Badge></td>
            <td className="py-2 px-3 text-gray-600">{c.recipients.toLocaleString()}</td>
            <td className="py-2 px-3 text-emerald-600 font-medium">{c.sent.toLocaleString()}</td>
            <td className="py-2 px-3 text-rose-600 font-medium">{c.failed}</td>
            <td className="py-2 px-3"><Badge tone={c.status === 'Completed' ? 'green' : c.status === 'Partial' ? 'yellow' : 'blue'}>{c.status}</Badge></td>
            <td className="py-2 px-3 text-gray-600">{c.durationSeconds >= 60 ? `${Math.round(c.durationSeconds / 60)}m` : `${c.durationSeconds}s`}</td>
            <td className="py-2 px-3">{c.status === 'Partial' && <Button size="sm" variant="secondary">▷ Resume</Button>}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

function SuppressionsPanel() {
  const [blockEmail, setBlockEmail] = useState('');
  const active = suppressions.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-2xl font-bold text-gray-900">{active}</p><p className="text-xs text-gray-500">Active suppressions</p></Card>
        <Card className="p-4"><p className="text-2xl font-bold text-gray-900">0</p><p className="text-xs text-gray-500">Previously unblocked</p></Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-2">Manually block an address</p>
          <div className="flex gap-2">
            <input value={blockEmail} onChange={(e) => setBlockEmail(e.target.value)} placeholder="bad@example.com" className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
            <Button size="sm">Block</Button>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <SectionTitle>Suppression List</SectionTitle>
        {suppressions.length === 0 ? <EmptyState label="No suppressed emails" /> : (
          <Table headers={['Email', 'Reason', 'Source', 'When', 'Detail', '']}>
            {suppressions.map((s) => (
              <tr key={s.id}>
                <td className="py-2 px-3 text-gray-800">{s.email}</td>
                <td className="py-2 px-3"><Badge tone="red">{s.reason}</Badge></td>
                <td className="py-2 px-3 text-gray-500 font-mono text-xs">{s.source}</td>
                <td className="py-2 px-3 text-gray-600">{s.when}</td>
                <td className="py-2 px-3 text-gray-400 text-xs max-w-xs truncate">{s.detail}</td>
                <td className="py-2 px-3"><Button size="sm" variant="secondary">Unblock</Button></td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

function TestTemplates() {
  const [templateId, setTemplateId] = useState(emailTemplates[0].id);
  const [testEmail, setTestEmail] = useState('manish@zigme.in');
  const [sent, setSent] = useState(false);

  const template = emailTemplates.find((t) => t.id === templateId)!;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-5">
        <SectionTitle>Test Configuration</SectionTitle>
        <p className="text-xs text-gray-500 mb-4">Configure the test email parameters</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Template</label>
            <select value={templateId} onChange={(e) => { setTemplateId(e.target.value); setSent(false); }} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
              {emailTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Recipient Email*</label>
            <input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="your-email@example.com" className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
          </div>
        </div>
        <Button className="w-full text-center block mt-4" onClick={() => setSent(true)}>Send Test Email</Button>
        {sent && <p className="text-xs text-emerald-600 mt-2">Test email sent to {testEmail}.</p>}
      </Card>

      <Card className="p-5">
        <SectionTitle>Template Variables</SectionTitle>
        <p className="text-xs text-gray-500 mb-4">Customize the variables for the selected template</p>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {template.variables.map((v) => (
            <div key={v}>
              <label className="text-xs text-gray-500">{v}</label>
              <input defaultValue="" placeholder={`Sample value for ${v}`} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
