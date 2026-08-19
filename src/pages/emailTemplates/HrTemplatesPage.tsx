import { useState } from 'react';
import { emailTemplates } from '../../data/emailTemplates';
import type { EmailTemplate } from '../../data/types';
import { Badge, Card, Button } from '../../components/ui';
import { AutomationSettings } from './EmailTemplatesPage';

const hiringSystemTemplates = emailTemplates.filter((t) => t.source === 'Hiring' && t.isSystem);
const categories = Array.from(new Set(hiringSystemTemplates.map((t) => t.category!)));

let customIdCounter = 1;

export default function HrTemplatesPage() {
  const [customVariants, setCustomVariants] = useState<EmailTemplate[]>([]);
  const [activeVariantId, setActiveVariantId] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string>(hiringSystemTemplates[0]?.id ?? '');

  const allTemplates = [...hiringSystemTemplates, ...customVariants];
  const selected = allTemplates.find((t) => t.id === selectedId) ?? null;

  function duplicate(system: EmailTemplate) {
    const id = `tmpl-hr-custom-${customIdCounter++}`;
    const copy: EmailTemplate = {
      ...system,
      id,
      name: `My ${system.name.replace(/^Default /, '')}`,
      isSystem: false,
      status: 'Active',
      version: 1,
      lastEdited: new Date().toISOString().slice(0, 10),
    };
    setCustomVariants((prev) => [...prev, copy]);
    setSelectedId(id);
  }

  function deleteVariant(id: string) {
    setCustomVariants((prev) => prev.filter((v) => v.id !== id));
    setActiveVariantId((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((cat) => {
        if (next[cat] === id) delete next[cat];
      });
      return next;
    });
    if (selectedId === id) setSelectedId(hiringSystemTemplates[0]?.id ?? '');
  }

  function setActive(template: EmailTemplate) {
    setActiveVariantId((prev) => ({ ...prev, [template.category!]: template.id }));
  }

  function isActive(template: EmailTemplate) {
    const activeId = activeVariantId[template.category!];
    if (activeId) return activeId === template.id;
    return template.isSystem === true;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">HR Templates</h1>
        <p className="text-sm text-gray-500">
          Hiring's locked system templates for the candidate/job pipeline. Duplicate one to create an editable custom version, then set it active for that category.
        </p>
      </div>

      <AutomationSettings />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-5">
          {categories.map((category) => {
            const system = hiringSystemTemplates.find((t) => t.category === category)!;
            const variants = customVariants.filter((v) => v.category === category);
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">{category}</p>
                  <button onClick={() => duplicate(system)} className="text-xs text-purple-600 font-medium">+ Duplicate</button>
                </div>
                <button
                  onClick={() => setSelectedId(system.id)}
                  className={`w-full text-left border rounded-md p-3 mb-2 transition-colors ${
                    selectedId === system.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800">{system.name}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge>Default</Badge>
                    <Badge tone="gray">System Template</Badge>
                    {isActive(system) && <Badge tone="green">★ Active</Badge>}
                  </div>
                </button>
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className={`w-full border rounded-md p-3 mb-2 flex items-start justify-between transition-colors ${
                      selectedId === v.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <button onClick={() => setSelectedId(v.id)} className="text-left flex-1">
                      <p className="text-sm font-medium text-gray-800">{v.name}</p>
                      <div className="flex gap-1.5 mt-1.5 items-center">
                        {isActive(v) && <Badge tone="green">★ Active</Badge>}
                        <Badge tone="blue">Custom</Badge>
                        <span className="text-xs text-gray-400">{v.lastEdited}</span>
                      </div>
                    </button>
                    <button onClick={() => deleteVariant(v.id)} className="text-rose-500 text-sm ml-2 shrink-0">🗑</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div>
          {selected && (
            selected.isSystem ? (
              <SystemTemplateDetails template={selected} onDuplicate={() => duplicate(selected)} />
            ) : (
              <CustomTemplateEditor
                template={selected}
                isActive={isActive(selected)}
                onSetActive={() => setActive(selected)}
                onSave={(updated) => setCustomVariants((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))}
                onCancel={() => setSelectedId(hiringSystemTemplates.find((t) => t.category === selected.category)!.id)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SystemTemplateDetails({ template, onDuplicate }: { template: EmailTemplate; onDuplicate: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-base font-semibold text-gray-900">Template Details</p>
          <p className="text-xs text-gray-500">View template details and content</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm">👁 Preview</Button>
          <Button variant="secondary" size="sm" onClick={onDuplicate}>⧉ Duplicate</Button>
          <Button size="sm" onClick={onDuplicate}>✎ Edit</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="text-xs text-gray-500">Template Name</label>
          <input disabled value={template.name} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Template Type</label>
          <input disabled value={template.category} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400" />
        </div>
      </div>
      <label className="text-xs text-gray-500">Email Subject</label>
      <input disabled value={template.subject} className="w-full mt-1 mb-4 border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400" />
      <label className="text-xs text-gray-500">Email Content</label>
      <div className="mt-1 border border-gray-200 rounded-md p-4 bg-gray-50 text-sm whitespace-pre-line text-gray-500">{template.body}</div>
      <p className="text-xs text-gray-400 mt-3">This is a locked system template. Duplicate it to create an editable custom version.</p>
    </Card>
  );
}

function CustomTemplateEditor({
  template,
  isActive,
  onSetActive,
  onSave,
  onCancel,
}: {
  template: EmailTemplate;
  isActive: boolean;
  onSetActive: () => void;
  onSave: (updated: EmailTemplate) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);

  function save(setActiveToo: boolean) {
    onSave({ ...template, name, subject, body, lastEdited: new Date().toISOString().slice(0, 10) });
    if (setActiveToo) onSetActive();
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-base font-semibold text-gray-900">Customize Template</p>
          <p className="text-xs text-gray-500">Create your custom version of this template</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={() => save(true)}>💾 Save & Set Active</Button>
          <Button variant="secondary" size="sm" onClick={() => save(false)}>💾 Save</Button>
        </div>
      </div>
      {isActive && <Badge tone="green">★ Currently active for {template.category}</Badge>}

      <div className="grid grid-cols-2 gap-4 mb-3 mt-3">
        <div>
          <label className="text-xs text-gray-500">Template Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Template Type</label>
          <input disabled value={template.category} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400" />
        </div>
      </div>
      <label className="text-xs text-gray-500">Email Subject</label>
      <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full mt-1 mb-4 border border-gray-200 rounded-md px-3 py-2 text-sm" />
      <label className="text-xs text-gray-500">Email Content</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm font-mono" />
    </Card>
  );
}
